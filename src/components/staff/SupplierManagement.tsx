
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Eye, CheckCircle, XCircle, Building } from 'lucide-react';
import { SupplierDetailModal } from './SupplierDetailModal';
import { useToast } from '@/hooks/use-toast';

export const SupplierManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const [mockSuppliers, setMockSuppliers] = useState([
    {
      id: 'SUP-001',
      name: 'MedTech Solutions Ltd',
      email: 'contact@medtech.com',
      phone: '+91 98765 43210',
      category: 'Medical Equipment',
      registrationDate: '2024-01-10',
      status: 'approved',
      documentsCount: 8,
      lastUpdate: '2024-01-15',
      updatedBy: 'John Doe'
    },
    {
      id: 'SUP-002',
      name: 'Healthcare Innovations',
      email: 'info@healthcareinno.com',
      phone: '+91 87654 32109',
      category: 'Prosthetics',
      registrationDate: '2024-01-08',
      status: 'pending',
      documentsCount: 6,
      lastUpdate: '2024-01-12',
      updatedBy: 'Jane Smith'
    },
    {
      id: 'SUP-003',
      name: 'TechCare Services',
      email: 'support@techcare.com',
      phone: '+91 76543 21098',
      category: 'Maintenance',
      registrationDate: '2024-01-05',
      status: 'rejected',
      documentsCount: 4,
      lastUpdate: '2024-01-10',
      updatedBy: 'Mike Johnson'
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="default" className="bg-green-600">Approved</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleViewDetails = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = (supplierId: string, status: string, notes: string) => {
    setMockSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId ? { ...supplier, status } : supplier
    ));
    console.log('Status update:', { supplierId, status, notes });
  };

  const handleAddSupplier = () => {
    toast({
      title: "Add Supplier",
      description: "Add supplier functionality will be implemented."
    });
  };

  const handleQuickApprove = (supplierId: string) => {
    setMockSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId ? { ...supplier, status: 'approved' } : supplier
    ));
    toast({
      title: "Supplier Approved",
      description: "Supplier has been approved successfully."
    });
  };

  const handleQuickReject = (supplierId: string) => {
    setMockSuppliers(prev => prev.map(supplier => 
      supplier.id === supplierId ? { ...supplier, status: 'rejected' } : supplier
    ));
    toast({
      title: "Supplier Rejected",
      description: "Supplier has been rejected."
    });
  };

  const filteredSuppliers = mockSuppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supplier Management</h2>
        <Button onClick={handleAddSupplier}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Supplier
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Suppliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or category..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <h3 className="font-semibold">{supplier.name}</h3>
                    {getStatusBadge(supplier.status)}
                  </div>
                  <p className="text-sm text-gray-600">ID: {supplier.id}</p>
                  <p className="text-sm">Category: {supplier.category}</p>
                  <p className="text-sm">Email: {supplier.email}</p>
                  <p className="text-sm">Phone: {supplier.phone}</p>
                  <p className="text-sm">Registered: {supplier.registrationDate}</p>
                  <p className="text-sm text-gray-600">{supplier.documentsCount} compliance documents</p>
                  <p className="text-xs text-gray-500">
                    Last updated: {supplier.lastUpdate} by {supplier.updatedBy}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(supplier)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {supplier.status === 'pending' && (
                    <>
                      <Button variant="default" size="sm" className="bg-green-600" onClick={() => handleQuickApprove(supplier.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleQuickReject(supplier.id)}>
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

      <SupplierDetailModal
        supplier={selectedSupplier}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
};
