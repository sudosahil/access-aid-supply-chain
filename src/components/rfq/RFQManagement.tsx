
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, Download, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RFQ {
  id: string;
  title: string;
  description: string;
  visibility: 'public' | 'restricted';
  deadline: string;
  status: 'draft' | 'published' | 'closed';
  createdBy: string;
  createdAt: string;
  budget: number;
}

const mockRFQs: RFQ[] = [
  {
    id: 'rfq-001',
    title: 'Electric Wheelchairs Procurement',
    description: 'Procurement of 50 electric wheelchairs with specifications...',
    visibility: 'public',
    deadline: '2024-02-15',
    status: 'published',
    createdBy: 'John Smith',
    createdAt: '2024-01-15',
    budget: 500000
  },
  {
    id: 'rfq-002',
    title: 'Prosthetic Limbs Supply',
    description: 'Supply of various prosthetic limbs for rehabilitation center...',
    visibility: 'restricted',
    deadline: '2024-02-20',
    status: 'published',
    createdBy: 'Jane Doe',
    createdAt: '2024-01-18',
    budget: 750000
  }
];

export const RFQManagement = () => {
  const [rfqs, setRfqs] = useState(mockRFQs);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadPDF = (rfqId: string) => {
    toast({
      title: "PDF Downloaded",
      description: `RFQ ${rfqId} has been downloaded as PDF.`,
    });
  };

  const handleCreateRFQ = () => {
    setIsCreateDialogOpen(false);
    toast({
      title: "RFQ Created",
      description: "New RFQ has been created successfully.",
    });
  };

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
                <Button>
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
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="Enter RFQ title" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Enter detailed description" rows={4} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Budget</label>
                      <Input type="number" placeholder="Enter budget amount" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Deadline</label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Visibility</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
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
                <TableHead>Visibility</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rfqs.map((rfq) => (
                <TableRow key={rfq.id}>
                  <TableCell className="font-medium">{rfq.id.toUpperCase()}</TableCell>
                  <TableCell className="max-w-xs truncate">{rfq.title}</TableCell>
                  <TableCell>
                    <Badge variant={rfq.visibility === 'public' ? 'default' : 'secondary'}>
                      {rfq.visibility}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(rfq.deadline).toLocaleDateString()}</TableCell>
                  <TableCell>₹{rfq.budget.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(rfq.status)}>
                      {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>{rfq.createdBy}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(rfq.id)}>
                        <Download className="h-4 w-4" />
                      </Button>
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
