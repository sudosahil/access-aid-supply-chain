
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Search, User, Clock } from 'lucide-react';
import { sampleMessages } from '@/data/sampleData';

interface MessagingSystemProps {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
}

export const MessagingSystem = ({ currentUserId, currentUserName, currentUserRole }: MessagingSystemProps) => {
  const [messages] = useState(sampleMessages);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMessages = messages.filter(msg =>
    msg.sender_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case 'rfq_inquiry': return 'bg-blue-100 text-blue-800';
      case 'rfq_response': return 'bg-green-100 text-green-800';
      case 'inventory_alert': return 'bg-yellow-100 text-yellow-800';
      case 'budget_approval': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messaging System
          </CardTitle>
          <CardDescription>
            Communicate with team members and external parties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedConversation === message.id ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedConversation(message.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span className="text-sm font-medium">{message.sender_name}</span>
                      </div>
                      {!message.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <Badge className={getMessageTypeColor(message.message_type)}>
                      {message.message_type.replace('_', ' ')}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {message.content}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(message.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Details & Compose */}
            <div className="lg:col-span-2 space-y-4">
              {selectedConversation ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Message Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(() => {
                      const message = messages.find(m => m.id === selectedConversation);
                      if (!message) return null;
                      
                      return (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">{message.sender_name}</h4>
                              <p className="text-sm text-gray-600">
                                To: {message.recipient_name}
                              </p>
                            </div>
                            <Badge className={getMessageTypeColor(message.message_type)}>
                              {message.message_type.replace('_', ' ')}
                            </Badge>
                          </div>
                          <div className="border-t pt-4">
                            <p className="text-gray-800">{message.content}</p>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleString()}
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Compose New Message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">To:</label>
                      <Input placeholder="Select recipient..." className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subject:</label>
                      <Input placeholder="Message subject..." className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Message:</label>
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="mt-1 min-h-32"
                      />
                    </div>
                    <Button className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
