
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { approvalService, WorkflowInstance } from '@/services/approvalService';

export const useRealtimeApprovals = () => {
  const [workflowInstances, setWorkflowInstances] = useState<WorkflowInstance[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWorkflowInstances = async () => {
    try {
      const instances = await approvalService.getWorkflowInstances();
      setWorkflowInstances(instances);
    } catch (error) {
      console.error('Error loading workflow instances:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflowInstances();

    // Set up real-time subscriptions
    const workflowInstancesChannel = supabase
      .channel('workflow_instances_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workflow_instances'
        },
        () => {
          console.log('Workflow instances changed, reloading...');
          loadWorkflowInstances();
        }
      )
      .subscribe();

    const approvalStepsChannel = supabase
      .channel('approval_steps_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'approval_steps'
        },
        () => {
          console.log('Approval steps changed, reloading...');
          loadWorkflowInstances();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(workflowInstancesChannel);
      supabase.removeChannel(approvalStepsChannel);
    };
  }, []);

  return {
    workflowInstances,
    loading,
    refetch: loadWorkflowInstances
  };
};
