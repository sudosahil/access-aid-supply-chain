import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, X, Eye } from 'lucide-react';
import { mockSuppliers, Supplier } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
export const SupplierApproval = () => {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const {
    toast
  } = useToast();
  const handleApproveSupplier = (supplierId: string) => {
    setSuppliers(suppliers.map(supplier => supplier.id === supplierId ? {
      ...supplier,
      status: 'approved'
    } : supplier));
    toast({
      title: "Supplier Approved",
      description: "Supplier has been approved and can now participate in RFQs."
    });
  };
  const handleRejectSupplier = (supplierId: string) => {
    setSuppliers(suppliers.map(supplier => supplier.id === supplierId ? {
      ...supplier,
      status: 'rejected'
    } : supplier));
    toast({
      title: "Supplier Rejected",
      description: "Supplier application has been rejected.",
      variant: "destructive"
    });
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
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
          <CardTitle>Supplier Management</CardTitle>
          <CardDescription className="text-slate-950">Review and approve supplier registrations</CardDescription>
        </CardHeader>
        <CardContent className="bg-slate-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-slate-400">Name</TableHead>
                <TableHead className="rounded-none bg-slate-400">Contact Person</TableHead>
                <TableHead className="bg-slate-400">Email</TableHead>
                <TableHead className="bg-slate-400">Specializations</TableHead>
                <TableHead className="bg-slate-400">Status</TableHead>
                <TableHead className="bg-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map(supplier => <TableRow key={supplier.id}>
                  <TableCell className="font-medium">{supplier.name}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {supplier.specializations.slice(0, 2).map((spec, index) => <Badge key={index} variant="outline" className="text-xs">
                          {spec}
                        </Badge>)}
                      {supplier.specializations.length > 2 && <Badge variant="outline" className="text-xs">
                          +{supplier.specializations.length - 2}
                        </Badge>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(supplier.status)}>
                      {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedSupplier(supplier)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Supplier Details</DialogTitle>
                            <DialogDescription>Review supplier information and documents</DialogDescription>
                          </DialogHeader>
                          {selectedSupplier && <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium">Company Name</h4>
                                  <p className="text-sm text-gray-600">{selectedSupplier.name}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Contact Person</h4>
                                  <p className="text-sm text-gray-600">{selectedSupplier.contactPerson}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Email</h4>
                                  <p className="text-sm text-gray-600">{selectedSupplier.email}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium">Phone</h4>
                                  <p className="text-sm text-gray-600">{selectedSupplier.phone}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium">Address</h4>
                                <p className="text-sm text-gray-600">{selectedSupplier.address}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Specializations</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {selectedSupplier.specializations.map((spec, index) => <Badge key={index} variant="outline">{spec}</Badge>)}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium">Compliance Documents</h4>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {selectedSupplier.complianceDocuments.map((doc, index) => <Badge key={index} className="bg-blue-100 text-blue-800">{doc}</Badge>)}
                                </div>
                              </div>
                              {selectedSupplier.status === 'pending' && <div className="flex justify-end space-x-2 pt-4">
                                  <Button variant="outline" onClick={() => handleRejectSupplier(selectedSupplier.id)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Reject
                                  </Button>
                                  <Button onClick={() => handleApproveSupplier(selectedSupplier.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                </div>}
                            </div>}
                        </DialogContent>
                      </Dialog>
                      {supplier.status === 'pending' && <>
                          <Button variant="outline" size="sm" onClick={() => handleApproveSupplier(supplier.id)} className="text-green-600 hover:text-green-700">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleRejectSupplier(supplier.id)} className="text-red-600 hover:text-red-700">
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