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
import { Plus, Upload } from 'lucide-react';
import { mockInvoices, mockContracts, Invoice } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
interface InvoiceManagementProps {
  contractorId: string;
}
export const InvoiceManagement = ({
  contractorId
}: InvoiceManagementProps) => {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    contractId: '',
    amount: '',
    description: '',
    documents: ''
  });
  const {
    toast
  } = useToast();
  const myInvoices = invoices.filter(invoice => invoice.contractorId === contractorId);
  const myContracts = mockContracts.filter(contract => contract.contractorId === contractorId);
  const handleSubmitInvoice = () => {
    const newInvoice: Invoice = {
      id: `inv${invoices.length + 1}`,
      contractId: formData.contractId,
      contractorId: contractorId,
      amount: parseFloat(formData.amount),
      description: formData.description,
      documents: formData.documents.split(',').map(d => d.trim()).filter(d => d),
      status: 'pending',
      submittedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    };
    setInvoices([...invoices, newInvoice]);
    setIsAddDialogOpen(false);
    setFormData({
      contractId: '',
      amount: '',
      description: '',
      documents: ''
    });
    toast({
      title: "Invoice Submitted",
      description: "Your invoice has been submitted successfully."
    });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getContractTitle = (contractId: string) => {
    const contract = mockContracts.find(c => c.id === contractId);
    return contract ? contract.title : 'Unknown Contract';
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-300">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription className="text-gray-950">Submit and track your invoices</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-zinc-950">
                  <Plus className="h-4 w-4 mr-2" />
                  Submit Invoice
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Invoice</DialogTitle>
                  <DialogDescription>Submit a new invoice for your contract work</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="contract">Select Contract</Label>
                    <Select value={formData.contractId} onValueChange={value => setFormData({
                    ...formData,
                    contractId: value
                  })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract" />
                      </SelectTrigger>
                      <SelectContent>
                        {myContracts.map(contract => <SelectItem key={contract.id} value={contract.id}>
                            {contract.title}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Invoice Amount ($)</Label>
                    <Input id="amount" type="number" step="0.01" value={formData.amount} onChange={e => setFormData({
                    ...formData,
                    amount: e.target.value
                  })} required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" value={formData.description} onChange={e => setFormData({
                    ...formData,
                    description: e.target.value
                  })} placeholder="Describe the work performed..." rows={3} required />
                  </div>
                  <div>
                    <Label htmlFor="documents">Supporting Documents (comma-separated filenames)</Label>
                    <Input id="documents" value={formData.documents} onChange={e => setFormData({
                    ...formData,
                    documents: e.target.value
                  })} placeholder="e.g., receipt.pdf, work_report.pdf" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmitInvoice}>Submit Invoice</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="bg-slate-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-gray-950">Invoice ID</TableHead>
                <TableHead className="bg-gray-950">Contract</TableHead>
                <TableHead className="bg-zinc-950">Amount</TableHead>
                <TableHead className="bg-zinc-950">Submitted</TableHead>
                <TableHead className="bg-zinc-950">Due Date</TableHead>
                <TableHead className="bg-zinc-950">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myInvoices.map(invoice => <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id.toUpperCase()}</TableCell>
                  <TableCell>{getContractTitle(invoice.contractId)}</TableCell>
                  <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(invoice.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
};