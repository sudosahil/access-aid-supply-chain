import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle } from 'lucide-react';
import { mockNotifications } from '@/data/mockData';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
interface ContractorNotificationsProps {
  contractorId: string;
}
export const ContractorNotifications = ({
  contractorId
}: ContractorNotificationsProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const {
    toast
  } = useToast();
  const myNotifications = notifications.filter(notification => notification.userId === contractorId);
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => notification.id === notificationId ? {
      ...notification,
      isRead: true
    } : notification));
    toast({
      title: "Notification Marked as Read",
      description: "Notification has been marked as read."
    });
  };
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-300">
          <CardTitle>Notifications</CardTitle>
          <CardDescription className="text-base text-gray-950">Stay updated with important alerts and messages</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-300">
          <div className="space-y-4">
            {myNotifications.map(notification => <div key={notification.id} className={`p-4 border rounded-lg ${!notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Bell className={`h-5 w-5 mt-0.5 ${!notification.isRead ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{notification.title}</h4>
                        <Badge className={getTypeColor(notification.type)}>
                          {notification.type}
                        </Badge>
                        {!notification.isRead && <Badge variant="secondary">New</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!notification.isRead && <Button variant="outline" size="sm" onClick={() => handleMarkAsRead(notification.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Read
                    </Button>}
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>
    </div>;
};