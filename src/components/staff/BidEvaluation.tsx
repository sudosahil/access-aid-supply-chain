import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Check, X, Eye } from 'lucide-react';
import { mockBids, mockRFQs, mockUsers, Bid } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
export const BidEvaluation = () => {
  const [bids, setBids] = useState(mockBids);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [evaluationNotes, setEvaluationNotes] = useState('');
  const {
    toast
  } = useToast();
  const handleAcceptBid = (bidId: string) => {
    setBids(bids.map(bid => bid.id === bidId ? {
      ...bid,
      status: 'accepted'
    } : bid));
    toast({
      title: "Bid Accepted",
      description: "Bid has been accepted and contractor will be notified."
    });
  };
  const handleRejectBid = (bidId: string) => {
    setBids(bids.map(bid => bid.id === bidId ? {
      ...bid,
      status: 'rejected'
    } : bid));
    toast({
      title: "Bid Rejected",
      description: "Bid has been rejected and contractor will be notified.",
      variant: "destructive"
    });
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
  const getRFQTitle = (rfqId: string) => {
    const rfq = mockRFQs.find(r => r.id === rfqId);
    return rfq ? rfq.title : 'Unknown RFQ';
  };
  const getContractorName = (contractorId: string) => {
    const contractor = mockUsers.find(u => u.id === contractorId);
    return contractor ? contractor.name : 'Unknown Contractor';
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-300">
          <CardTitle>Bid Evaluation</CardTitle>
          <CardDescription className="text-slate-950">Review and evaluate submitted bids</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-slate-950">RFQ</TableHead>
                <TableHead className="bg-slate-950">Contractor</TableHead>
                <TableHead className="bg-slate-950">Amount</TableHead>
                <TableHead className="bg-slate-950">Submitted</TableHead>
                <TableHead className="bg-slate-950">Status</TableHead>
                <TableHead className="bg-slate-950">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bids.map(bid => <TableRow key={bid.id}>
                  <TableCell className="font-medium">{getRFQTitle(bid.rfqId)}</TableCell>
                  <TableCell>{getContractorName(bid.contractorId)}</TableCell>
                  <TableCell>${bid.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(bid.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(bid.status)}>
                      {bid.status.replace('_', ' ').charAt(0).toUpperCase() + bid.status.replace('_', ' ').slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedBid(bid)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Bid Details</DialogTitle>
                            <DialogDescription>Review bid proposal and documents</DialogDescription>
                          </DialogHeader>
                          {selectedBid && <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium">RFQ</h4>
                                  <p className="text-sm text-gray-600">{getRFQTitle(selectedBid.rfqId)}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Contractor</h4>
                                  <p className="text-sm text-gray-600">{getContractorName(selectedBid.contractorId)}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Bid Amount</h4>
                                  <p className="text-sm text-gray-600">${selectedBid.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Status</h4>
                                  <Badge className={getStatusColor(selectedBid.status)}>
                                    {selectedBid.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium">Proposal</h4>
                                <p className="text-sm text-gray-600 mt-1">{selectedBid.proposal}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Documents</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {selectedBid.documents.map((doc, index) => <Badge key={index} variant="outline" className="text-xs">
                                      {doc}
                                    </Badge>)}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="notes">Evaluation Notes</Label>
                                <Textarea id="notes" value={evaluationNotes} onChange={e => setEvaluationNotes(e.target.value)} placeholder="Add evaluation notes..." rows={3} />
                              </div>
                              {selectedBid.status === 'submitted' || selectedBid.status === 'under_review' ? <div className="flex justify-end space-x-2 pt-4">
                                  <Button variant="outline" onClick={() => handleRejectBid(selectedBid.id)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                  <Button onClick={() => handleAcceptBid(selectedBid.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Accept
                                  </Button>
                                </div> : null}
                            </div>}
                        </DialogContent>
                      </Dialog>
                      {(bid.status === 'submitted' || bid.status === 'under_review') && <>
                          <Button variant="outline" size="sm" onClick={() => handleAcceptBid(bid.id)} className="text-green-600 hover:text-green-700">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRejectBid(bid.id)} className="text-red-600 hover:text-red-700">
                            <X className="h-4 w-4" />
                          </Button>
                        </>}
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
};