
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Truck, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TransferRequestsProps {
  warehouseId: string;
}

export const TransferRequests = ({ warehouseId }: TransferRequestsProps) => {
  const { toast } = useToast();

  const [requests, setRequests] = useState([
    {
      id: 'TR-001',
      itemName: 'Electric Wheelchair Model A',
      fromWarehouse: 'Warehouse A',
      toWarehouse: 'Warehouse B',
      quantity: 5,
      requestDate: '2024-01-20',
      requestedBy: 'John Doe',
      status: 'pending',
      priority: 'high'
    },
    {
      id: 'TR-002',
      itemName: 'Prosthetic Leg - Adult',
      fromWarehouse: 'Warehouse A',
      toWarehouse: 'Warehouse C',
      quantity: 2,
      requestDate: '2024-01-19',
      requestedBy: 'Jane Smith',
      status: 'approved',
      priority: 'medium'
    },
    {
      id: 'TR-003',
      itemName: 'Hearing Aid Digital',
      fromWarehouse: 'Warehouse B',
      toWarehouse: 'Warehouse A',
      quantity: 10,
      requestDate: '2024-01-18',
      requestedBy: 'Mike Johnson',
      status: 'completed',
      priority: 'low'
    }
  ]);

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
    toast({
      title: "Transfer Approved",
      description: "Transfer request has been approved."
    });
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
    toast({
      title: "Transfer Rejected",
      description: "Transfer request has been rejected."
    });
  };

  const handleComplete = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'completed' } : req
    ));
    toast({
      title: "Transfer Completed",
      description: "Transfer has been marked as completed."
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-blue-600">Approved</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-600">Completed</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Transfer Requests</h2>
        <div className="flex gap-2">
          <Badge variant="outline">
            Pending: {requests.filter(req => req.status === 'pending').length}
          </Badge>
          <Badge variant="outline">
            Approved: {requests.filter(req => req.status === 'approved').length}
          </Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <h3 className="font-semibold">{request.itemName}</h3>
                    {getStatusBadge(request.status)}
                    {getPriorityBadge(request.priority)}
                  </div>
                  <p className="text-sm text-gray-600">Request ID: {request.id}</p>
                  <p className="text-sm">
                    <strong>From:</strong> {request.fromWarehouse} → <strong>To:</strong> {request.toWarehouse}
                  </p>
                  <p className="text-sm">Quantity: <strong>{request.quantity} units</strong></p>
                  <p className="text-sm">Requested by: {request.requestedBy}</p>
                  <p className="text-sm text-gray-500">Date: {request.requestDate}</p>
                </div>
                <div className="flex gap-2">
                  {request.status === 'pending' && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleReject(request.id)}>
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button size="sm" onClick={() => handleApprove(request.id)}>
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    </>
                  )}
                  {request.status === 'approved' && (
                    <Button size="sm" className="bg-green-600" onClick={() => handleComplete(request.id)}>
                      <Check className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
