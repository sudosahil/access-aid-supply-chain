import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Eye, Check } from 'lucide-react';
import { mockPurchaseOrders, mockSuppliers, PurchaseOrder } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
export const PurchaseOrderManagement = () => {
  const [purchaseOrders, setPurchaseOrders] = useState(mockPurchaseOrders);
  const {
    toast
  } = useToast();
  const handleApprovePO = (poId: string) => {
    setPurchaseOrders(purchaseOrders.map(po => po.id === poId ? {
      ...po,
      status: 'approved'
    } : po));
    toast({
      title: "Purchase Order Approved",
      description: "Purchase order has been approved and sent to supplier."
    });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'delivered':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getSupplierName = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    return supplier ? supplier.name : 'Unknown Supplier';
  };
  return <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-300">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Purchase Order Management</CardTitle>
              <CardDescription className="text-slate-950">Manage purchase orders and track deliveries</CardDescription>
            </div>
            <Button className="text-slate-950">
              <Plus className="h-4 w-4 mr-2" />
              Create PO
            </Button>
          </div>
        </CardHeader>
        <CardContent className="bg-slate-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-slate-950">PO ID</TableHead>
                <TableHead className="bg-slate-950">Supplier</TableHead>
                <TableHead className="bg-slate-950">Total Amount</TableHead>
                <TableHead className="bg-slate-950">Delivery Date</TableHead>
                <TableHead className="bg-slate-950">Status</TableHead>
                <TableHead className="bg-slate-950">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map(po => <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.id.toUpperCase()}</TableCell>
                  <TableCell>{getSupplierName(po.supplierId)}</TableCell>
                  <TableCell>${po.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(po.deliveryDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(po.status)}>
                      {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Purchase Order Details</DialogTitle>
                            <DialogDescription>Review purchase order information</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium">PO ID</h4>
                                <p className="text-sm text-gray-600">{po.id.toUpperCase()}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Supplier</h4>
                                <p className="text-sm text-gray-600">{getSupplierName(po.supplierId)}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Total Amount</h4>
                                <p className="text-sm text-gray-600">${po.totalAmount.toLocaleString()}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Delivery Date</h4>
                                <p className="text-sm text-gray-600">{new Date(po.deliveryDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium">Items</h4>
                              <div className="mt-2 space-y-2">
                                {po.items.map((item, index) => <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="text-sm">Item ID: {item.itemId}</span>
                                    <span className="text-sm">Qty: {item.quantity}</span>
                                    <span className="text-sm">${item.unitPrice.toFixed(2)}</span>
                                  </div>)}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      {po.status === 'draft' && <Button size="sm" onClick={() => handleApprovePO(po.id)} className="text-slate-950">
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>}
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
};