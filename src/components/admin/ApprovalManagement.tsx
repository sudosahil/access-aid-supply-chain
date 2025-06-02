
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Clock, FileText, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ApprovalManagementProps {
  currentUserId: string;
  currentUserName: string;
}

// Use simplified interfaces that match the database schema
interface PendingRfq {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  deadline: string;
  status: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  requirements: string[];
}

interface PendingBid {
  id: string;
  supplier_name: string;
  rfq_id: string;
  amount: number;
  submitted_date: string;
  documents: number;
  status: string;
  contractor_id: string;
  created_at: string;
  updated_at: string;
}

export const ApprovalManagement = ({ currentUserId, currentUserName }: ApprovalManagementProps) => {
  const [pendingRfqs, setPendingRfqs] = useState<PendingRfq[]>([]);
  const [pendingBids, setPendingBids] = useState<PendingBid[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPendingApprovals();
    setupRealtimeSubscriptions();
  }, []);

  const loadPendingApprovals = async () => {
    try {
      // Load pending RFQs - using status = 'pending'
      const { data: rfqData, error: rfqError } = await supabase
        .from('rfqs')
        .select('*')
        .eq('status', 'pending');

      if (rfqError) throw rfqError;

      // Load pending bids - using status = 'pending'  
      const { data: bidData, error: bidError } = await supabase
        .from('bids')
        .select('*')
        .eq('status', 'pending');

      if (bidError) throw bidError;

      setPendingRfqs(rfqData || []);
      setPendingBids(bidData || []);
    } catch (error) {
      console.error('Error loading pending approvals:', error);
      toast({
        title: "Error",
        description: "Failed to load pending approvals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase
      .channel('approval-updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rfqs'
      }, () => {
        loadPendingApprovals();
      })
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bids'
      }, () => {
        loadPendingApprovals();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleApproveRfq = async (rfqId: string) => {
    try {
      const { error } = await supabase
        .from('rfqs')
        .update({
          status: 'published'
        })
        .eq('id', rfqId);

      if (error) throw error;

      toast({
        title: "RFQ Approved",
        description: "RFQ has been approved and published"
      });

      loadPendingApprovals();
    } catch (error) {
      console.error('Error approving RFQ:', error);
      toast({
        title: "Error",
        description: "Failed to approve RFQ",
        variant: "destructive"
      });
    }
  };

  const handleApproveBid = async (bidId: string) => {
    try {
      const { error } = await supabase
        .from('bids')
        .update({
          status: 'approved'
        })
        .eq('id', bidId);

      if (error) throw error;

      toast({
        title: "Bid Approved",
        description: "Bid has been approved"
      });

      loadPendingApprovals();
    } catch (error) {
      console.error('Error approving bid:', error);
      toast({
        title: "Error",
        description: "Failed to approve bid",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (type: 'rfq' | 'bid', id: string) => {
    try {
      const table = type === 'rfq' ? 'rfqs' : 'bids';
      const { error } = await supabase
        .from(table)
        .update({
          status: 'rejected'
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `${type.toUpperCase()} Rejected`,
        description: `${type.toUpperCase()} has been rejected`
      });

      loadPendingApprovals();
    } catch (error) {
      console.error(`Error rejecting ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to reject ${type}`,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading approvals...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Approval Management</CardTitle>
          <CardDescription>
            Review and approve RFQs and bids before they are published or accepted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rfqs">
            <TabsList>
              <TabsTrigger value="rfqs" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                RFQs
                {pendingRfqs.length > 0 && (
                  <Badge variant="destructive">{pendingRfqs.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="bids" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Bids
                {pendingBids.length > 0 && (
                  <Badge variant="destructive">{pendingBids.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="rfqs" className="space-y-4">
              {pendingRfqs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending RFQs for approval
                </div>
              ) : (
                pendingRfqs.map((rfq) => (
                  <Card key={rfq.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{rfq.title}</h3>
                          <p className="text-sm text-gray-600">{rfq.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Budget: ₹{rfq.budget?.toLocaleString()}</span>
                            <span>Category: {rfq.category}</span>
                            <span>Deadline: {new Date(rfq.deadline).toLocaleDateString()}</span>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <Clock className="h-3 w-3" />
                            {rfq.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject('rfq', rfq.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveRfq(rfq.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve & Publish
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="bids" className="space-y-4">
              {pendingBids.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending bids for approval
                </div>
              ) : (
                pendingBids.map((bid) => (
                  <Card key={bid.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{bid.supplier_name}</h3>
                          <p className="text-sm text-gray-600">RFQ ID: {bid.rfq_id}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span>Amount: ₹{bid.amount?.toLocaleString()}</span>
                            <span>Submitted: {new Date(bid.submitted_date).toLocaleDateString()}</span>
                            <span>Documents: {bid.documents || 0}</span>
                          </div>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <Clock className="h-3 w-3" />
                            {bid.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleReject('bid', bid.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveBid(bid.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
