
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'approval' | 'budget' | 'request' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
  relatedId?: string;
  priority: 'low' | 'medium' | 'high';
}

export const useRealtimeNotifications = (userId: string) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    // Set up real-time listeners for approval workflow changes
    const workflowChannel = supabase
      .channel('workflow_notifications')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'approval_steps'
        },
        (payload) => {
          console.log('Approval step updated:', payload);
          handleApprovalStepChange(payload);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'workflow_instances'
        },
        (payload) => {
          console.log('Workflow instance updated:', payload);
          handleWorkflowInstanceChange(payload);
        }
      )
      .subscribe();

    // Set up budget update listeners
    const budgetChannel = supabase
      .channel('budget_notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budgets'
        },
        (payload) => {
          console.log('Budget updated:', payload);
          handleBudgetChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(workflowChannel);
      supabase.removeChannel(budgetChannel);
    };
  }, [userId]);

  const handleApprovalStepChange = (payload: any) => {
    const { new: newRecord, old: oldRecord } = payload;
    
    if (newRecord.status !== oldRecord.status && newRecord.status !== 'pending') {
      const notification: Notification = {
        id: `approval-${newRecord.id}-${Date.now()}`,
        type: 'approval',
        title: newRecord.status === 'approved' ? 'Request Approved' : 'Request Rejected',
        message: `Your request has been ${newRecord.status} by ${newRecord.approver_name || 'an approver'}`,
        timestamp: new Date().toISOString(),
        read: false,
        userId,
        relatedId: newRecord.workflow_instance_id,
        priority: 'high'
      };

      addNotification(notification);
      
      // Show toast notification
      toast({
        title: notification.title,
        description: notification.message,
        variant: newRecord.status === 'approved' ? 'default' : 'destructive'
      });
    }
  };

  const handleWorkflowInstanceChange = (payload: any) => {
    const { new: newRecord, old: oldRecord } = payload;
    
    if (newRecord.status !== oldRecord.status && newRecord.status !== 'pending') {
      const notification: Notification = {
        id: `workflow-${newRecord.id}-${Date.now()}`,
        type: 'approval',
        title: 'Workflow Completed',
        message: `Your ${newRecord.document_type} has been ${newRecord.status}`,
        timestamp: new Date().toISOString(),
        read: false,
        userId,
        relatedId: newRecord.id,
        priority: 'high'
      };

      addNotification(notification);
      
      toast({
        title: notification.title,
        description: notification.message,
        variant: newRecord.status === 'approved' ? 'default' : 'destructive'
      });
    }
  };

  const handleBudgetChange = (payload: any) => {
    const { new: newRecord, eventType } = payload;
    
    let notification: Notification | null = null;
    
    if (eventType === 'UPDATE') {
      notification = {
        id: `budget-${newRecord.id}-${Date.now()}`,
        type: 'budget',
        title: 'Budget Updated',
        message: `Budget "${newRecord.title}" has been updated`,
        timestamp: new Date().toISOString(),
        read: false,
        userId,
        relatedId: newRecord.id,
        priority: 'medium'
      };
    } else if (eventType === 'INSERT') {
      notification = {
        id: `budget-${newRecord.id}-${Date.now()}`,
        type: 'budget',
        title: 'New Budget Created',
        message: `New budget "${newRecord.title}" has been created`,
        timestamp: new Date().toISOString(),
        read: false,
        userId,
        relatedId: newRecord.id,
        priority: 'medium'
      };
    }

    if (notification) {
      addNotification(notification);
      
      toast({
        title: notification.title,
        description: notification.message,
      });
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50 notifications
    updateUnreadCount();
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    updateUnreadCount();
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const updateUnreadCount = () => {
    setUnreadCount(notifications.filter(n => !n.read).length);
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    updateUnreadCount();
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification
  };
};
