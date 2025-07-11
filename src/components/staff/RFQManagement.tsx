import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Eye } from 'lucide-react';
import { mockRFQs, RFQ, mockInventoryCategories } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { approvalService } from '@/services/approvalService';

export const RFQManagement = () => {
  const [rfqs, setRfqs] = useState(mockRFQs);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    deadline: '',
    budget: '',
    category: '',
    customWorkflowId: ''
  });
  const { toast } = useToast();

  // Load workflows when dialog opens
  const handleDialogOpen = async (open: boolean) => {
    setIsAddDialogOpen(open);
    if (open) {
      try {
        const rfqWorkflows = await approvalService.getWorkflows('rfq_approval');
        setWorkflows(rfqWorkflows);
      } catch (error) {
        console.error('Error loading workflows:', error);
      }
    }
  };

  const handleAddRFQ = async () => {
    try {
      const newRFQ: RFQ = {
        id: `rfq-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(r => r.trim()),
        deadline: formData.deadline,
        budget: parseFloat(formData.budget),
        status: 'draft',
        createdBy: '4', // Current staff user
        createdAt: new Date().toISOString().split('T')[0],
        category: formData.category
      };

      setRfqs([...rfqs, newRFQ]);
      
      // Create approval workflow instance
      await approvalService.createWorkflowInstance(
        'rfq', 
        newRFQ.id, 
        formData.customWorkflowId || undefined
      );

      setIsAddDialogOpen(false);
      setFormData({ 
        title: '', 
        description: '', 
        requirements: '', 
        deadline: '', 
        budget: '', 
        category: '',
        customWorkflowId: ''
      });
      
      toast({
        title: "RFQ Created",
        description: "New RFQ has been created and approval workflow started.",
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

  const handlePublishRFQ = (rfqId: string) => {
    setRfqs(rfqs.map(rfq =>
      rfq.id === rfqId ? { ...rfq, status: 'published' } : rfq
    ));
    toast({
      title: "RFQ Published",
      description: "RFQ is now live and contractors can submit bids.",
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>RFQ Management</CardTitle>
              <CardDescription>Create and manage Request for Quotations with approval workflows</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={handleDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create RFQ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New RFQ</DialogTitle>
                  <DialogDescription>Create a new Request for Quotation with automatic approval workflow</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">RFQ Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Electric Wheelchairs - Bulk Purchase"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockInventoryCategories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="workflow">Approval Workflow (Optional)</Label>
                    <Select value={formData.customWorkflowId} onValueChange={(value) => setFormData({ ...formData, customWorkflowId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Use default workflow" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Use Default Workflow</SelectItem>
                        {workflows.map((workflow) => (
                          <SelectItem key={workflow.id} value={workflow.id}>
                            {workflow.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="requirements">Requirements (one per line)</Label>
                    <Textarea
                      id="requirements"
                      value={formData.requirements}
                      onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                      rows={4}
                      placeholder="FDA approved&#10;Minimum 2-year warranty&#10;Training included"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget">Budget ($)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="deadline">Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddRFQ}>Create RFQ</Button>
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
                  <TableCell className="font-medium">{rfq.title}</TableCell>
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
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {rfq.status === 'draft' && (
                        <Button size="sm" onClick={() => handlePublishRFQ(rfq.id)}>
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
    </div>
  );
};
