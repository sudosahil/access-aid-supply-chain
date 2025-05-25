
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, Download, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  content: string;
  timestamp: string;
  rfqId?: string;
  bidId?: string;
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

const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    title: 'Electric Wheelchairs RFQ Discussion',
    participants: ['John Smith', 'ABC Medical Supplies'],
    lastMessage: 'Thank you for the clarification on specifications.',
    lastActivity: '2024-01-20 14:30',
    unreadCount: 2,
    relatedTo: 'RFQ-001'
  },
  {
    id: 'conv-002',
    title: 'Prosthetic Limbs Bid Inquiry',
    participants: ['Jane Doe', 'MedTech Solutions'],
    lastMessage: 'We need additional documentation for compliance.',
    lastActivity: '2024-01-20 13:15',
    unreadCount: 0,
    relatedTo: 'BID-002'
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg-001',
    sender: 'John Smith',
    senderRole: 'Staff',
    content: 'Thank you for submitting your bid for the electric wheelchairs. We have a few questions about the specifications.',
    timestamp: '2024-01-20 10:30',
    rfqId: 'RFQ-001'
  },
  {
    id: 'msg-002',
    sender: 'ABC Medical Supplies',
    senderRole: 'Contractor',
    content: 'We\'d be happy to clarify any specifications. What specific aspects would you like us to address?',
    timestamp: '2024-01-20 11:15',
    rfqId: 'RFQ-001'
  }
];

export const MessagingSystem = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
      setNewMessage('');
    }
  };

  const handleDownloadChat = (conversationId: string) => {
    toast({
      title: "Chat Downloaded",
      description: "Chat history has been downloaded as PDF.",
    });
  };

  const filteredConversations = mockConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
                    {mockConversations.find(c => c.id === selectedConversation)?.title}
                  </CardTitle>
                  <CardDescription>
                    {mockConversations.find(c => c.id === selectedConversation)?.participants.join(', ')}
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadChat(selectedConversation)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col h-[400px]">
              <ScrollArea className="flex-1 pr-4">
                {mockMessages.map((message) => (
                  <div key={message.id} className="mb-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {message.sender.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium">{message.sender}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {message.senderRole}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleString()}
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
                <Button onClick={handleSendMessage}>
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
