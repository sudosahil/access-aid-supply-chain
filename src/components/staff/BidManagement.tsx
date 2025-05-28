import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Eye, CheckCircle, XCircle, Download } from 'lucide-react';
import { BidDetailModal } from './BidDetailModal';
import { useToast } from '@/hooks/use-toast';

export const BidManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const [mockBids, setMockBids] = useState([
    {
      id: 'BID-001',
      rfqId: 'RFQ-001',
      rfqTitle: 'Electric Wheelchairs Procurement',
      supplierName: 'MedTech Solutions Ltd',
      submittedDate: '2024-01-15',
      amount: '₹4,50,000',
      status: 'under_review',
      documents: 3
    },
    {
      id: 'BID-002',
      rfqId: 'RFQ-002',
      rfqTitle: 'Prosthetic Limbs Supply',
      supplierName: 'Healthcare Innovations',
      submittedDate: '2024-01-14',
      amount: '₹7,25,000',
      status: 'approved',
      documents: 5
    },
    {
      id: 'BID-003',
      rfqId: 'RFQ-003',
      rfqTitle: 'Medical Equipment Maintenance',
      supplierName: 'TechCare Services',
      submittedDate: '2024-01-13',
      amount: '₹2,80,000',
      status: 'rejected',
      documents: 2
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'under_review':
        return <Badge variant="secondary">Under Review</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleViewDetails = (bid: any) => {
    setSelectedBid(bid);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (bidId: string, status: string, notes: string) => {
    setMockBids(prev => prev.map(bid => 
      bid.id === bidId ? { ...bid, status } : bid
    ));
    console.log('Status update:', { bidId, status, notes });
  };

  const handleDownload = () => {
    toast({
      title: "Export Started",
      description: "Bid report is being generated..."
    });
  };

  const handleQuickApprove = (bidId: string) => {
    setMockBids(prev => prev.map(bid => 
      bid.id === bidId ? { ...bid, status: 'approved' } : bid
    ));
    toast({
      title: "Bid Approved",
      description: "Bid has been approved successfully."
    });
  };

  const handleQuickReject = (bidId: string) => {
    setMockBids(prev => prev.map(bid => 
      bid.id === bidId ? { ...bid, status: 'rejected' } : bid
    ));
    toast({
      title: "Bid Rejected",
      description: "Bid has been rejected."
    });
  };

  const filteredBids = mockBids.filter(bid => {
    const matchesSearch = bid.rfqTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bid.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bid.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bid Management</h2>
        <Button onClick={handleDownload}>
          <FileText className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Bids</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by RFQ title or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredBids.map((bid) => (
          <Card key={bid.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{bid.rfqTitle}</h3>
                    {getStatusBadge(bid.status)}
                  </div>
                  <p className="text-sm text-gray-600">Bid ID: {bid.id} • RFQ ID: {bid.rfqId}</p>
                  <p className="text-sm">Supplier: {bid.supplierName}</p>
                  <p className="text-sm">Submitted: {bid.submittedDate}</p>
                  <p className="text-lg font-semibold text-green-600">{bid.amount}</p>
                  <p className="text-sm text-gray-600">{bid.documents} documents attached</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(bid)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  {bid.status === 'under_review' && (
                    <>
                      <Button variant="default" size="sm" className="bg-green-600" onClick={() => handleQuickApprove(bid.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleQuickReject(bid.id)}>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BidDetailModal
        bid={selectedBid}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};
