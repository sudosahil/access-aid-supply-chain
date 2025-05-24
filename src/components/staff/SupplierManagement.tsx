import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Eye } from 'lucide-react';
import { mockSuppliers, Supplier } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
export const SupplierManagement = () => {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    specializations: ''
  });
  const {
    toast
  } = useToast();
  const handleAddSupplier = () => {
    const newSupplier: Supplier = {
      id: `s${suppliers.length + 1}`,
      name: formData.name,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      status: 'pending',
      complianceDocuments: [],
      specializations: formData.specializations.split(',').map(s => s.trim()),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSuppliers([...suppliers, newSupplier]);
    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      specializations: ''
    });
    toast({
      title: "Supplier Added",
      description: "New supplier has been registered and is pending approval."
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Supplier Management</CardTitle>
              <CardDescription className="text-slate-950">Manage suppliers and track their information</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-slate-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-300">
                <DialogHeader>
                  <DialogTitle>Add New Supplier</DialogTitle>
                  <DialogDescription>Register a new supplier in the system</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Company Name</Label>
                      <Input id="name" value={formData.name} onChange={e => setFormData({
                      ...formData,
                      name: e.target.value
                    })} required />
                    </div>
                    <div>
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input id="contactPerson" value={formData.contactPerson} onChange={e => setFormData({
                      ...formData,
                      contactPerson: e.target.value
                    })} required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={formData.email} onChange={e => setFormData({
                      ...formData,
                      email: e.target.value
                    })} required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" value={formData.phone} onChange={e => setFormData({
                      ...formData,
                      phone: e.target.value
                    })} required />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" value={formData.address} onChange={e => setFormData({
                    ...formData,
                    address: e.target.value
                  })} required />
                  </div>
                  <div>
                    <Label htmlFor="specializations">Specializations (comma-separated)</Label>
                    <Input id="specializations" value={formData.specializations} onChange={e => setFormData({
                    ...formData,
                    specializations: e.target.value
                  })} placeholder="e.g., Wheelchairs, Hearing Aids, Prosthetics" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddSupplier}>Add Supplier</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="bg-slate-200">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-slate-950">Name</TableHead>
                <TableHead className="bg-slate-950">ContPersonact </TableHead>
                <TableHead className="bg-slate-950">Email</TableHead>
                <TableHead className="bg-slate-950">Specializations</TableHead>
                <TableHead className="bg-slate-950">Status</TableHead>
                <TableHead className="bg-slate-950">Actions</TableHead>
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
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
};