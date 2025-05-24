
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { mockBids, mockRFQs } from '@/data/mockData';

interface MyBidsProps {
  contractorId: string;
}

export const MyBids = ({ contractorId }: MyBidsProps) => {
  const myBids = mockBids.filter(bid => bid.contractorId === contractorId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRFQTitle = (rfqId: string) => {
    const rfq = mockRFQs.find(r => r.id === rfqId);
    return rfq ? rfq.title : 'Unknown RFQ';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Bids</CardTitle>
          <CardDescription>Track your submitted bids and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>RFQ</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myBids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell className="font-medium">{getRFQTitle(bid.rfqId)}</TableCell>
                  <TableCell>${bid.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(bid.submittedAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(bid.status)}>
                      {bid.status.replace('_', ' ').charAt(0).toUpperCase() + bid.status.replace('_', ' ').slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Bid Details</DialogTitle>
                          <DialogDescription>Review your submitted bid</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium">RFQ</h4>
                              <p className="text-sm text-gray-600">{getRFQTitle(bid.rfqId)}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Bid Amount</h4>
                              <p className="text-sm text-gray-600">${bid.amount.toLocaleString()}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Submitted</h4>
                              <p className="text-sm text-gray-600">{new Date(bid.submittedAt).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <h4 className="font-medium">Status</h4>
                              <Badge className={getStatusColor(bid.status)}>
                                {bid.status.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium">Proposal</h4>
                            <p className="text-sm text-gray-600 mt-1">{bid.proposal}</p>
                          </div>
                          <div>
                            <h4 className="font-medium">Documents</h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {bid.documents.map((doc, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
