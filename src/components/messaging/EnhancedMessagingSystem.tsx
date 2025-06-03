
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RealtimeMessaging } from './RealtimeMessaging';

interface EnhancedMessagingSystemProps {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
}

export const EnhancedMessagingSystem = ({ currentUserId, currentUserName, currentUserRole }: EnhancedMessagingSystemProps) => {
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadUnreadCount();
    setupRealtimeSubscriptions();
  }, [currentUserId]);

  const loadUnreadCount = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('id')
        .eq('recipient_id', currentUserId)
        .eq('is_read', false);

      if (error) {
        console.log('Supabase error loading unread count:', error);
        // Use mock data for demo
        setUnreadCount(3);
        setIsSupabaseConnected(false);
      } else {
        setUnreadCount(data?.length || 0);
        setIsSupabaseConnected(true);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
      // Fallback to demo data
      setUnreadCount(3);
      setIsSupabaseConnected(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    if (!isSupabaseConnected) {
      // Simulate active users for demo
      setActiveUsers(4);
      return;
    }

    const channel = supabase
      .channel('messaging-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, () => {
        loadUnreadCount();
      })
      .subscribe();

    // Simulate active users
    setActiveUsers(4);

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Enhanced Messaging System
                {!isSupabaseConnected && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    Demo Mode
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Real-time communication with team members and external parties
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {activeUsers} online
              </Badge>
              {unreadCount > 0 && (
                <Badge variant="destructive">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RealtimeMessaging
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserRole={currentUserRole}
          />
        </CardContent>
      </Card>
    </div>
  );
};
