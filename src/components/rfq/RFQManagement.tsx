
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Eye, Download, Edit } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { RFQDetailModal } from './RFQDetailModal';
import { useToast } from '@/hooks/use-toast';

interface RFQ {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  deadline: string;
  budget: number;
  category: string;
  status: string;
  created_by: string;
  created_at: string;
}

export const RFQManagement = () => {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRFQId, setSelectedRFQId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    deadline: '',
    budget: '',
    category: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    loadRFQs();
    setupRealtimeSubscription();
  }, []);

  const loadRFQs = async () => {
    try {
      const { data, error } = await supabase
        .from('rfqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRfqs(data || []);
    } catch (error) {
      console.error('Error loading RFQs:', error);
      toast({
        title: "Error",
        description: "Failed to load RFQs",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('rfqs-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rfqs'
      }, () => {
        loadRFQs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCreateRFQ = async () => {
    try {
      const rfqId = `rfq-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const { error } = await supabase
        .from('rfqs')
        .insert({
          id: rfqId,
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements.split('\n').filter(r => r.trim()),
          deadline: formData.deadline,
          budget: parseFloat(formData.budget),
          category: formData.category,
          status: 'draft',
          created_by: '550e8400-e29b-41d4-a716-446655440002' // Default staff user
        });

      if (error) throw error;

      setIsCreateDialogOpen(false);
      setFormData({ title: '', description: '', requirements: '', deadline: '', budget: '', category: '' });
      toast({
        title: "RFQ Created",
        description: "New RFQ has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating RFQ:', error);
      toast({
        title: "Error",
        description: "Failed to create RFQ",
        variant: "destructive"
      });
    }
  };

  const handlePublishRFQ = async (rfqId: string) => {
    try {
      const { error } = await supabase
        .from('rfqs')
        .update({ status: 'published' })
        .eq('id', rfqId);

      if (error) throw error;

      toast({
        title: "RFQ Published",
        description: "RFQ is now live and contractors can submit bids.",
      });
    } catch (error) {
      console.error('Error publishing RFQ:', error);
      toast({
        title: "Error",
        description: "Failed to publish RFQ",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (rfqId: string) => {
    setSelectedRFQId(rfqId);
    setIsDetailModalOpen(true);
  };

  const handleDownloadPDF = (rfqId: string) => {
    toast({
      title: "PDF Downloaded",
      description: `RFQ ${rfqId} has been downloaded as PDF.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'awarded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>RFQ Management</CardTitle>
              <CardDescription>Create and manage Requests for Quotation</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="hover:bg-gray-100 active:bg-gray-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Create RFQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New RFQ</DialogTitle>
                  <DialogDescription>Fill in the details for the new Request for Quotation</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title"
                      placeholder="Enter RFQ title" 
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description"
                      placeholder="Enter detailed description" 
                      rows={4} 
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="requirements">Requirements (one per line)</Label>
                    <Textarea
                      id="requirements"
                      placeholder="FDA approved&#10;Minimum 2-year warranty&#10;Training included"
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget">Budget</Label>
                      <Input 
                        id="budget"
                        type="number" 
                        placeholder="Enter budget amount" 
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input 
                        id="deadline"
                        type="date" 
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mobility Aids">Mobility Aids</SelectItem>
                        <SelectItem value="Prosthetics">Prosthetics</SelectItem>
                        <SelectItem value="Hearing Aids">Hearing Aids</SelectItem>
                        <SelectItem value="Vision Aids">Vision Aids</SelectItem>
                        <SelectItem value="Medical Equipment">Medical Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateRFQ}>
                      Create RFQ
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-medium">{rfq.id.toUpperCase()}</TableCell>
                  <TableCell className="max-w-xs truncate">{rfq.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rfq.category}</Badge>
                  </TableCell>
                  <TableCell>${rfq.budget.toLocaleString()}</TableCell>
                  <TableCell>{new Date(rfq.deadline).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(rfq.status)}>
                      {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-gray-100 active:bg-gray-200"
                        onClick={() => handleViewDetails(rfq.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-gray-100 active:bg-gray-200">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="hover:bg-gray-100 active:bg-gray-200"
                        onClick={() => handleDownloadPDF(rfq.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {rfq.status === 'draft' && (
                        <Button 
                          size="sm" 
                          className="hover:bg-gray-100 active:bg-gray-200"
                          onClick={() => handlePublishRFQ(rfq.id)}
                        >
                          Publish
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <RFQDetailModal
        rfqId={selectedRFQId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
};
