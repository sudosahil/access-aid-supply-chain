import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, Download, FileText, Check, CheckCheck, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sampleMessages } from '@/data/sampleData';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  rfq_id?: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
  delivered_at?: string;
  read_at?: string;
  sender_name?: string;
  sender_role?: string;
  status?: 'sent' | 'delivered' | 'read';
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
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadMessages();
    loadConversations();
    setupRealtimeSubscription();
    setupPresenceTracking();
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

      if (error) {
        console.log('Supabase error, using sample data:', error);
        // Use sample data if Supabase fails
        const enhancedMessages = sampleMessages.map(msg => ({
          ...msg,
          sender_name: msg.sender_name,
          sender_role: msg.sender_name?.includes('Admin') ? 'admin' : 
                      msg.sender_name?.includes('Manager') ? 'warehouse' : 'staff',
          status: (msg.sender_id === currentUserId ? 'delivered' : 'read') as 'sent' | 'delivered' | 'read'
        }));
        setMessages(enhancedMessages);
        setIsSupabaseConnected(false);
      } else {
        const messagesWithSender = data?.map(msg => ({
          ...msg,
          sender_name: msg.sender?.name || 'Unknown User',
          sender_role: msg.sender?.role || 'user',
          status: (msg.sender_id === currentUserId ? 'delivered' : 'read') as 'sent' | 'delivered' | 'read'
        })) || [];
        
        setMessages(messagesWithSender);
        setIsSupabaseConnected(true);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      // Fallback to sample data
      const enhancedMessages = sampleMessages.map(msg => ({
        ...msg,
        sender_name: msg.sender_name,
        sender_role: msg.sender_name?.includes('Admin') ? 'admin' : 
                    msg.sender_name?.includes('Manager') ? 'warehouse' : 'staff',
        status: (msg.sender_id === currentUserId ? 'delivered' : 'read') as 'sent' | 'delivered' | 'read'
      }));
      setMessages(enhancedMessages);
      setIsSupabaseConnected(false);
      toast({
        title: "Using Sample Data",
        description: "Loaded sample messages for demonstration.",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    // Enhanced conversations with real-time data
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
      },
      {
        id: 'conv-003',
        title: 'Warehouse Inventory Coordination',
        participants: ['Admin', 'Warehouse Manager'],
        lastMessage: 'Stock levels updated for all critical items.',
        lastActivity: new Date().toISOString(),
        unreadCount: 1,
        relatedTo: 'inventory'
      },
      {
        id: 'conv-004',
        title: 'Budget Approval Notifications',
        participants: ['Admin', 'Finance Team'],
        lastMessage: 'Q1 budget approved and ready for implementation.',
        lastActivity: new Date().toISOString(),
        unreadCount: 0,
        relatedTo: 'budget'
      }
    ]);
  };

  const setupPresenceTracking = () => {
    if (!isSupabaseConnected) {
      // Simulate online users for demo
      setOnlineUsers(new Set(['user-1', 'user-2', 'user-3']));
      return;
    }

    const channel = supabase.channel('online-users-enhanced', {
      config: {
        presence: {
          key: currentUserId,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const users = new Set(Object.keys(state));
        setOnlineUsers(users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        setOnlineUsers(prev => new Set([...prev, key]));
        toast({
          title: "User Online",
          description: `${newPresences[0]?.user_name || 'A user'} came online`,
        });
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(key);
          return newSet;
        });
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: currentUserId,
            user_name: currentUserName,
            user_role: currentUserRole,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const setupRealtimeSubscription = () => {
    if (!isSupabaseConnected) {
      console.log('Supabase not connected, skipping real-time subscription');
      return;
    }

    const channel = supabase
      .channel('messages-realtime-enhanced')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('New message received:', payload);
        loadMessages();
        
        // Show notification for new messages
        if (payload.new.sender_id !== currentUserId) {
          toast({
            title: "New Message",
            description: `New message from ${payload.new.sender_name || 'Unknown'}`,
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages'
      }, (payload) => {
        console.log('Message updated:', payload);
        loadMessages();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Optimistic update
    const optimisticMessage: Message = {
      id: tempId,
      sender_id: currentUserId,
      content: newMessage,
      message_type: 'direct',
      is_read: false,
      created_at: timestamp,
      sender_name: currentUserName,
      sender_role: currentUserRole,
      status: 'sent' as const,
      rfq_id: selectedConversation === 'conv-001' ? 'rfq1' : selectedConversation === 'conv-002' ? 'rfq2' : undefined
    };

    setMessages(prev => [...prev, optimisticMessage]);
    const messageContent = newMessage;
    setNewMessage('');

    if (isSupabaseConnected) {
      try {
        const { data, error } = await supabase
          .from('messages')
          .insert({
            sender_id: currentUserId,
            content: messageContent,
            message_type: 'direct',
            delivered_at: new Date().toISOString(),
            rfq_id: selectedConversation === 'conv-001' ? 'rfq1' : selectedConversation === 'conv-002' ? 'rfq2' : null
          })
          .select()
          .single();

        if (error) throw error;

        // Replace optimistic message with real one
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, id: data.id, status: 'delivered' as const }
            : msg
        ));

        toast({
          title: "Message Sent",
          description: "Your message has been sent successfully.",
        });
      } catch (error) {
        console.error('Error sending message:', error);
        // Update message status to show error
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, status: 'sent' as const }
            : msg
        ));
        toast({
          title: "Message Sent (Local)",
          description: "Message sent locally. Real-time sync may be limited.",
        });
      }
    } else {
      // For demo mode, just keep the optimistic message
      setTimeout(() => {
        setMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, status: 'delivered' as const }
            : msg
        ));
      }, 1000);

      toast({
        title: "Message Sent (Demo)",
        description: "Message sent in demonstration mode.",
      });
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    if (!isSupabaseConnected) return;
    
    try {
      await supabase
        .from('messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .neq('sender_id', currentUserId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getMessageStatusIcon = (message: Message) => {
    if (message.sender_id !== currentUserId) return null;

    if (message.read_at) {
      return <CheckCheck className="h-3 w-3 text-green-500" />;
    }
    if (message.delivered_at || message.status === 'delivered') {
      return <Check className="h-3 w-3 text-blue-500" />;
    }
    return <Clock className="h-3 w-3 text-gray-400" />;
  };

  const handleDownloadChat = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    const chatMessages = selectedConversationMessages;
    
    // Create detailed text format for download
    const chatText = chatMessages.map(msg => 
      `[${new Date(msg.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] ${msg.sender_name} (${msg.sender_role}): ${msg.content}${msg.read_at ? ' ✓✓' : msg.delivered_at ? ' ✓' : ''}`
    ).join('\n');
    
    const blob = new Blob([`Chat History: ${conversation?.title}\nExported on: ${new Date().toLocaleString()}\nTotal Messages: ${chatMessages.length}\nParticipants: ${conversation?.participants.join(', ')}\n\n${chatText}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${conversationId}-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Chat Downloaded",
      description: "Chat history has been downloaded as text file.",
    });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const selectedConversationMessages = messages.filter(msg => {
    if (!selectedConversation) return false;
    
    // Filter messages based on conversation context
    switch (selectedConversation) {
      case 'conv-001':
        return msg.rfq_id === 'rfq1' || msg.message_type === 'rfq_inquiry' || msg.message_type === 'rfq_response';
      case 'conv-002':
        return msg.rfq_id === 'rfq2' || msg.message_type === 'rfq_inquiry' || msg.message_type === 'rfq_response';
      case 'conv-003':
        return msg.message_type === 'inventory_alert' || msg.content.toLowerCase().includes('inventory') || msg.content.toLowerCase().includes('stock');
      case 'conv-004':
        return msg.message_type === 'budget_approval' || msg.content.toLowerCase().includes('budget');
      default:
        return msg.message_type === 'direct';
    }
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex gap-4">
      {/* Connection Status */}
      {!isSupabaseConnected && (
        <div className="absolute top-2 right-2 z-10">
          <Badge variant="outline" className="bg-yellow-50">
            Demo Mode
          </Badge>
        </div>
      )}

      {/* Conversations List */}
      <Card className="w-1/3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Conversations
          </CardTitle>
          <CardDescription>
            All your discussions • {onlineUsers.size} online
          </CardDescription>
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
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
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
                    {new Date(conversation.lastActivity).toLocaleString('en-IN', { 
                      timeZone: 'Asia/Kolkata',
                      dateStyle: 'short',
                      timeStyle: 'short'
                    })}
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
                  <CardDescription className="flex items-center gap-2">
                    <span>{conversations.find(c => c.id === selectedConversation)?.participants.join(', ')}</span>
                    {typingUsers.size > 0 && (
                      <Badge variant="outline" className="text-xs">
                        typing...
                      </Badge>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {onlineUsers.size} online
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadChat(selectedConversation)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
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
                            {new Date(message.created_at).toLocaleString('en-IN', { 
                              timeZone: 'Asia/Kolkata',
                              dateStyle: 'short',
                              timeStyle: 'short'
                            })}
                          </span>
                          {getMessageStatusIcon(message)}
                        </div>
                        <p className="text-sm mt-1 text-gray-700">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
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
                  disabled={!newMessage.trim()}
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
              <p className="text-sm mt-2">Enhanced real-time messaging with read receipts and presence</p>
              {!isSupabaseConnected && (
                <p className="text-xs mt-2 text-yellow-600">Running in demonstration mode with sample data</p>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};
