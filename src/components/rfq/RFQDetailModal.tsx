
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Download, FileText, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RFQDetailModalProps {
  rfqId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

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

interface Bid {
  id: string;
  supplier_name: string;
  amount: number;
  status: string;
  documents: number;
  submitted_date: string;
}

export const RFQDetailModal = ({ rfqId, isOpen, onClose }: RFQDetailModalProps) => {
  const [rfq, setRfq] = useState<RFQ | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (rfqId && isOpen) {
      loadRFQDetails();
      loadBids();
    }
  }, [rfqId, isOpen]);

  const loadRFQDetails = async () => {
    if (!rfqId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rfqs')
        .select('*')
        .eq('id', rfqId)
        .single();

      if (error) throw error;
      setRfq(data);
    } catch (error) {
      console.error('Error loading RFQ details:', error);
      toast({
        title: "Error",
        description: "Failed to load RFQ details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBids = async () => {
    if (!rfqId) return;

    try {
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('rfq_id', rfqId)
        .order('submitted_date', { ascending: false });

      if (error) throw error;
      setBids(data || []);
    } catch (error) {
      console.error('Error loading bids:', error);
    }
  };

  const handleDownloadRFQ = () => {
    toast({
      title: "Download Started",
      description: "RFQ document is being generated..."
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

  const getBidStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!rfq && !loading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>RFQ Details</span>
            <Button variant="outline" size="sm" onClick={handleDownloadRFQ}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : rfq ? (
          <div className="space-y-6">
            {/* RFQ Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{rfq.title}</span>
                  <Badge className={getStatusColor(rfq.status)}>
                    {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Budget: ${rfq.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Deadline: {new Date(rfq.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700">{rfq.description}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {rfq.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Bids Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submitted Bids ({bids.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bids.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Documents</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bids.map((bid) => (
                        <TableRow key={bid.id}>
                          <TableCell className="font-medium">{bid.supplier_name}</TableCell>
                          <TableCell>${bid.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getBidStatusColor(bid.status)}>
                              {bid.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{bid.documents} files</TableCell>
                          <TableCell>{new Date(bid.submitted_date).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-gray-500 text-center py-4">No bids submitted yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
