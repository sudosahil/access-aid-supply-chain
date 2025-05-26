
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, Download, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  rfq_id?: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
  sender_role?: string;
}

interface Conversation {
  id: string;
  title: string;
  participants: string[];
  lastMessage: string;
  lastActivity: string;
  unreadCount: number;
  relatedTo: string;
}

interface RealtimeMessagingProps {
  currentUserId: string;
  currentUserName: string;
  currentUserRole: string;
}

export const RealtimeMessaging = ({ currentUserId, currentUserName, currentUserRole }: RealtimeMessagingProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMessages();
    loadConversations();
    setupRealtimeSubscription();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!messages_sender_id_fkey(name, role)
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      const messagesWithSender = data?.map(msg => ({
        ...msg,
        sender_name: msg.sender?.name,
        sender_role: msg.sender?.role
      })) || [];
      
      setMessages(messagesWithSender);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    // Mock conversations for demo - in real app, this would be computed from messages
    setConversations([
      {
        id: 'conv-001',
        title: 'Electric Wheelchairs RFQ Discussion',
        participants: ['Staff User', 'Contractor User'],
        lastMessage: 'Thank you for the clarification on specifications.',
        lastActivity: new Date().toISOString(),
        unreadCount: 2,
        relatedTo: 'rfq1'
      },
      {
        id: 'conv-002',
        title: 'Prosthetic Limbs Bid Inquiry',
        participants: ['Staff User', 'MedTech Solutions'],
        lastMessage: 'We need additional documentation for compliance.',
        lastActivity: new Date().toISOString(),
        unreadCount: 0,
        relatedTo: 'rfq2'
      }
    ]);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('New message received:', payload);
        loadMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: currentUserId,
          content: newMessage,
          message_type: 'direct',
          rfq_id: selectedConversation === 'conv-001' ? 'rfq1' : null
        });

      if (error) throw error;

      setNewMessage('');
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      });
    }
  };

  const handleDownloadChat = (conversationId: string) => {
    toast({
      title: "Chat Downloaded",
      description: "Chat history has been downloaded as PDF.",
    });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedConversationMessages = messages.filter(msg => 
    selectedConversation === 'conv-001' ? msg.rfq_id === 'rfq1' : 
    selectedConversation === 'conv-002' ? msg.rfq_id === 'rfq2' : 
    false
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex gap-4">
      {/* Conversations List */}
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle>Conversations</CardTitle>
          <CardDescription>All your RFQ and bid related discussions</CardDescription>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[400px]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{conversation.title}</h4>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {conversation.participants.join(', ')}
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {conversation.lastMessage}
                </p>
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className="text-xs">
                    {conversation.relatedTo}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {new Date(conversation.lastActivity).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="flex-1">
        {selectedConversation ? (
          <>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">
                    {conversations.find(c => c.id === selectedConversation)?.title}
                  </CardTitle>
                  <CardDescription>
                    {conversations.find(c => c.id === selectedConversation)?.participants.join(', ')}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="hover:bg-gray-100 active:bg-gray-200"
                  onClick={() => handleDownloadChat(selectedConversation)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[400px]">
              <ScrollArea className="flex-1 pr-4">
                {selectedConversationMessages.map((message) => (
                  <div key={message.id} className="mb-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.sender_name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium">{message.sender_name || 'Unknown'}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {message.sender_role || 'User'}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm mt-1 text-gray-700">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="flex space-x-2 mt-4">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="hover:bg-gray-100 active:bg-gray-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a conversation to start messaging</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
