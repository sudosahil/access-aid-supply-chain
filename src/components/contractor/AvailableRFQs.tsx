import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Upload } from 'lucide-react';
import { mockRFQs, mockBids, Bid } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
interface AvailableRFQsProps {
  contractorId: string;
}
export const AvailableRFQs = ({
  contractorId
}: AvailableRFQsProps) => {
  const [bids, setBids] = useState(mockBids);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<any>(null);
  const [bidData, setBidData] = useState({
    amount: '',
    proposal: '',
    documents: ''
  });
  const {
    toast
  } = useToast();
  const openRFQs = mockRFQs.filter(rfq => rfq.status === 'published');
  const myBids = bids.filter(bid => bid.contractorId === contractorId);
  const handleSubmitBid = () => {
    const newBid: Bid = {
      id: `bid${bids.length + 1}`,
      rfqId: selectedRFQ.id,
      contractorId: contractorId,
      amount: parseFloat(bidData.amount),
      proposal: bidData.proposal,
      documents: bidData.documents.split(',').map(d => d.trim()).filter(d => d),
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };
    setBids([...bids, newBid]);
    setIsSubmitDialogOpen(false);
    setBidData({
      amount: '',
      proposal: '',
      documents: ''
    });
    toast({
      title: "Bid Submitted",
      description: "Your bid has been submitted successfully and is under review."
    });
  };
  const hasBidForRFQ = (rfqId: string) => {
    return myBids.some(bid => bid.rfqId === rfqId);
  };
  const getBidStatus = (rfqId: string) => {
    const bid = myBids.find(bid => bid.rfqId === rfqId);
    return bid ? bid.status : null;
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-300">
          <CardTitle>Available RFQs</CardTitle>
          <CardDescription className="text-slate-950">View and submit bids for open RFQs</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-slate-950">Title</TableHead>
                <TableHead className="bg-slate-950">Category</TableHead>
                <TableHead className="bg-slate-950">Budget</TableHead>
                <TableHead className="bg-slate-950">Deadline</TableHead>
                <TableHead className="bg-slate-950">My Bid Status</TableHead>
                <TableHead className="bg-slate-950">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openRFQs.map(rfq => <TableRow key={rfq.id}>
                  <TableCell className="font-medium">{rfq.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{rfq.category}</Badge>
                  </TableCell>
                  <TableCell>${rfq.budget.toLocaleString()}</TableCell>
                  <TableCell>{new Date(rfq.deadline).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {getBidStatus(rfq.id) ? <Badge className={getStatusColor(getBidStatus(rfq.id)!)}>
                        {getBidStatus(rfq.id)!.replace('_', ' ')}
                      </Badge> : <span className="text-gray-500">No bid</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="bg-slate-50 text-slate-950">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>RFQ Details</DialogTitle>
                            <DialogDescription>Review RFQ requirements and details</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium">Title</h4>
                              <p className="text-sm text-gray-600">{rfq.title}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Description</h4>
                              <p className="text-sm text-gray-600">{rfq.description}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Requirements</h4>
                              <ul className="text-sm text-gray-600 list-disc list-inside">
                                {rfq.requirements.map((req, index) => <li key={index}>{req}</li>)}
                              </ul>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium">Budget</h4>
                                <p className="text-sm text-gray-600">${rfq.budget.toLocaleString()}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Deadline</h4>
                                <p className="text-sm text-gray-600">{new Date(rfq.deadline).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {!hasBidForRFQ(rfq.id) && <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" onClick={() => setSelectedRFQ(rfq)} className="text-slate-950 bg-slate-300 hover:bg-slate-200">
                              <Upload className="h-4 w-4 mr-2" />
                              Submit Bid
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Submit Bid</DialogTitle>
                              <DialogDescription>Submit your bid for this RFQ</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="amount">Bid Amount ($)</Label>
                                <Input id="amount" type="number" value={bidData.amount} onChange={e => setBidData({
                            ...bidData,
                            amount: e.target.value
                          })} placeholder="Enter your bid amount" required />
                              </div>
                              <div>
                                <Label htmlFor="proposal">Proposal</Label>
                                <Textarea id="proposal" value={bidData.proposal} onChange={e => setBidData({
                            ...bidData,
                            proposal: e.target.value
                          })} placeholder="Describe your proposal and approach..." rows={4} required />
                              </div>
                              <div>
                                <Label htmlFor="documents">Supporting Documents (comma-separated filenames)</Label>
                                <Input id="documents" value={bidData.documents} onChange={e => setBidData({
                            ...bidData,
                            documents: e.target.value
                          })} placeholder="e.g., technical_specs.pdf, certifications.pdf" />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmitBid}>Submit Bid</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>}
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
};