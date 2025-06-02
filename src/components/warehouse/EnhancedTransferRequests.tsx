
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, X, Truck, Clock, Plus, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedTransferRequestsProps {
  warehouseId: string;
  currentUserId: string;
  currentUserName: string;
}

export const EnhancedTransferRequests = ({ warehouseId, currentUserId, currentUserName }: EnhancedTransferRequestsProps) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newRequest, setNewRequest] = useState({
    itemName: '',
    fromWarehouse: '',
    toWarehouse: '',
    quantity: 1,
    priority: 'medium'
  });
  const [confirmationNotes, setConfirmationNotes] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadRequests();
    setupRealtimeSubscriptions();
  }, [warehouseId]);

  const loadRequests = async () => {
    try {
      // Load outgoing requests from this warehouse
      const { data: outgoingData, error: outgoingError } = await supabase
        .from('transfer_requests')
        .select('*')
        .eq('from_warehouse', warehouseId)
        .order('created_at', { ascending: false });

      if (outgoingError) throw outgoingError;

      // Load incoming requests to this warehouse
      const { data: incomingData, error: incomingError } = await supabase
        .from('transfer_requests')
        .select('*')
        .eq('to_warehouse', warehouseId)
        .in('status', ['pending', 'approved'])
        .order('created_at', { ascending: false });

      if (incomingError) throw incomingError;

      setRequests(outgoingData || []);
      setIncomingRequests(incomingData || []);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast({
        title: "Error",
        description: "Failed to load transfer requests",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    const channel = supabase
      .channel('transfer-requests-enhanced')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transfer_requests'
      }, () => {
        loadRequests();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleCreateRequest = async () => {
    if (!newRequest.itemName || !newRequest.fromWarehouse || !newRequest.toWarehouse) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('transfer_requests')
        .insert({
          item_name: newRequest.itemName,
          from_warehouse: newRequest.fromWarehouse,
          to_warehouse: newRequest.toWarehouse,
          quantity: newRequest.quantity,
          priority: newRequest.priority,
          requested_by: currentUserName,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Transfer Request Created",
        description: "Transfer request has been submitted successfully"
      });

      setNewRequest({
        itemName: '',
        fromWarehouse: '',
        toWarehouse: '',
        quantity: 1,
        priority: 'medium'
      });

      loadRequests();
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: "Failed to create transfer request",
        variant: "destructive"
      });
    }
  };

  const handleApproveTransfer = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('transfer_requests')
        .update({
          status: 'approved',
          approved_by: currentUserName,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Log the approval
      await supabase
        .from('transfer_tracking')
        .insert({
          transfer_id: requestId,
          status: 'approved',
          updated_by: currentUserName,
          notes: 'Transfer approved by warehouse'
        });

      toast({
        title: "Transfer Approved",
        description: "Transfer request has been approved"
      });

      loadRequests();
    } catch (error) {
      console.error('Error approving transfer:', error);
      toast({
        title: "Error",
        description: "Failed to approve transfer",
        variant: "destructive"
      });
    }
  };

  const handleConfirmReceipt = async () => {
    if (!selectedRequest) return;

    try {
      const { error } = await supabase
        .from('transfer_requests')
        .update({
          status: 'completed',
          received_by: currentUserName,
          received_at: new Date().toISOString(),
          confirmation_notes: confirmationNotes
        })
        .eq('id', selectedRequest.id);

      if (error) throw error;

      // Log the confirmation
      await supabase
        .from('transfer_tracking')
        .insert({
          transfer_id: selectedRequest.id,
          status: 'completed',
          updated_by: currentUserName,
          notes: `Transfer confirmed. ${confirmationNotes}`
        });

      toast({
        title: "Receipt Confirmed",
        description: "Transfer has been marked as completed"
      });

      setSelectedRequest(null);
      setConfirmationNotes('');
      loadRequests();
    } catch (error) {
      console.error('Error confirming receipt:', error);
      toast({
        title: "Error",
        description: "Failed to confirm receipt",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (request: any) => {
    if (request.received_at) {
      return <Badge variant="default" className="bg-green-600">Completed</Badge>;
    }
    if (request.approved_at) {
      return <Badge variant="default" className="bg-blue-600">In Transit</Badge>;
    }
    if (request.status === 'approved') {
      return <Badge variant="default" className="bg-blue-600">Approved</Badge>;
    }
    if (request.status === 'rejected') {
      return <Badge variant="destructive">Rejected</Badge>;
    }
    return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
  };

  if (loading) {
    return <div className="p-6">Loading transfer requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Enhanced Transfer Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate Transfer Request
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Transfer Request</DialogTitle>
              <DialogDescription>
                Generate a new transfer request for items between warehouses
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Item Name</label>
                <Input
                  value={newRequest.itemName}
                  onChange={(e) => setNewRequest({...newRequest, itemName: e.target.value})}
                  placeholder="Enter item name"
                />
              </div>
              <div>
                <label className="text-sm font-medium">From Warehouse</label>
                <Input
                  value={newRequest.fromWarehouse}
                  onChange={(e) => setNewRequest({...newRequest, fromWarehouse: e.target.value})}
                  placeholder="Source warehouse"
                />
              </div>
              <div>
                <label className="text-sm font-medium">To Warehouse</label>
                <Input
                  value={newRequest.toWarehouse}
                  onChange={(e) => setNewRequest({...newRequest, toWarehouse: e.target.value})}
                  placeholder="Destination warehouse"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  type="number"
                  value={newRequest.quantity}
                  onChange={(e) => setNewRequest({...newRequest, quantity: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <Button onClick={handleCreateRequest} className="w-full">
                Create Transfer Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Incoming Transfers for Approval */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Incoming Transfers ({incomingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {incomingRequests.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No incoming transfers pending
            </div>
          ) : (
            <div className="space-y-4">
              {incomingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{request.item_name}</h3>
                          {getStatusBadge(request)}
                        </div>
                        <p className="text-sm text-gray-600">
                          From: {request.from_warehouse} | Quantity: {request.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Requested by: {request.requested_by} on {new Date(request.request_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <Button size="sm" onClick={() => handleApproveTransfer(request.id)}>
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        )}
                        {request.status === 'approved' && !request.received_at && (
                          <Button 
                            size="sm" 
                            className="bg-green-600"
                            onClick={() => setSelectedRequest(request)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Confirm Receipt
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Outgoing Transfer Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Outgoing Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No outgoing transfer requests
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{request.item_name}</h3>
                          {getStatusBadge(request)}
                        </div>
                        <p className="text-sm text-gray-600">
                          To: {request.to_warehouse} | Quantity: {request.quantity}
                        </p>
                        <p className="text-sm text-gray-600">
                          Requested: {new Date(request.request_date).toLocaleDateString()}
                        </p>
                        {request.confirmation_notes && (
                          <p className="text-sm text-green-600">
                            Notes: {request.confirmation_notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Receipt Confirmation Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Receipt</DialogTitle>
              <DialogDescription>
                Confirm that you have received the transferred items
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{selectedRequest.item_name}</h4>
                <p className="text-sm text-gray-600">
                  Quantity: {selectedRequest.quantity} from {selectedRequest.from_warehouse}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Confirmation Notes</label>
                <Textarea
                  value={confirmationNotes}
                  onChange={(e) => setConfirmationNotes(e.target.value)}
                  placeholder="Add any notes about the received items (condition, quality, etc.)"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmReceipt} className="bg-green-600">
                  Confirm Receipt
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
