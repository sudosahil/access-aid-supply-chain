
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Building, Package, Users, MapPin, Phone, Mail, Eye, Settings, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WarehouseManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  const mockWarehouses = [
    {
      id: 'WH-001',
      name: 'Warehouse A - Bhubaneswar Central',
      location: 'Bhubaneswar, Odisha',
      address: 'Plot No. 123, Industrial Area, Bhubaneswar - 751024',
      manager: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'warehouse.a@ssepd.gov.in',
      capacity: '5000 sq ft',
      totalItems: 156,
      lowStockItems: 8,
      status: 'active',
      lastUpdate: '2024-01-15',
      workers: 12
    },
    {
      id: 'WH-002',
      name: 'Warehouse B - Cuttack District',
      location: 'Cuttack, Odisha',
      address: 'NH-16, Cuttack Industrial Complex - 753014',
      manager: 'Priya Patel',
      phone: '+91 87654 32109',
      email: 'warehouse.b@ssepd.gov.in',
      capacity: '3500 sq ft',
      totalItems: 89,
      lowStockItems: 3,
      status: 'active',
      lastUpdate: '2024-01-14',
      workers: 8
    },
    {
      id: 'WH-003',
      name: 'Warehouse C - Berhampur Regional',
      location: 'Berhampur, Odisha',
      address: 'Industrial Estate, Berhampur - 760001',
      manager: 'Amit Singh',
      phone: '+91 76543 21098',
      email: 'warehouse.c@ssepd.gov.in',
      capacity: '4200 sq ft',
      totalItems: 67,
      lowStockItems: 12,
      status: 'maintenance',
      lastUpdate: '2024-01-12',
      workers: 10
    }
  ];

  const handleViewDetails = (warehouse: any) => {
    setSelectedWarehouse(warehouse);
    setIsDetailsModalOpen(true);
  };

  const handleManageInventory = (warehouseId: string) => {
    toast({
      title: "Opening Inventory Management",
      description: `Redirecting to inventory management for ${warehouseId}`,
    });
    // In a real app, this would navigate to the inventory management page
    console.log(`Navigate to inventory management for ${warehouseId}`);
  };

  const handleTransferRequests = (warehouseId: string) => {
    toast({
      title: "Opening Transfer Requests",
      description: `Viewing transfer requests for ${warehouseId}`,
    });
    // In a real app, this would navigate to the transfer requests page
    console.log(`Navigate to transfer requests for ${warehouseId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-600">Active</Badge>;
      case 'maintenance':
        return <Badge variant="secondary">Maintenance</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredWarehouses = mockWarehouses.filter(warehouse =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Warehouse Management</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Warehouses</p>
                <p className="text-2xl font-bold">{mockWarehouses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">
                  {mockWarehouses.reduce((sum, wh) => sum + wh.totalItems, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Workers</p>
                <p className="text-2xl font-bold">
                  {mockWarehouses.reduce((sum, wh) => sum + wh.workers, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold">
                  {mockWarehouses.filter(wh => wh.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Warehouses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, location, or manager..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredWarehouses.map((warehouse) => (
          <Card key={warehouse.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    <h3 className="font-semibold text-lg">{warehouse.name}</h3>
                    {getStatusBadge(warehouse.status)}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{warehouse.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>Manager: {warehouse.manager}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{warehouse.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{warehouse.email}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p>Capacity: <strong>{warehouse.capacity}</strong></p>
                      <p>Total Items: <strong>{warehouse.totalItems}</strong></p>
                      <p>Low Stock Items: <strong className="text-red-600">{warehouse.lowStockItems}</strong></p>
                      <p>Workers: <strong>{warehouse.workers}</strong></p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    Last updated: {warehouse.lastUpdate}
                  </p>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(warehouse)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleManageInventory(warehouse.id)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Inventory
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleTransferRequests(warehouse.id)}
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Transfer Requests
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Warehouse Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Warehouse Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedWarehouse?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedWarehouse && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Warehouse ID</Label>
                  <p className="text-sm font-medium">{selectedWarehouse.id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedWarehouse.status)}</div>
                </div>
              </div>
              <div>
                <Label>Full Address</Label>
                <p className="text-sm">{selectedWarehouse.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Manager</Label>
                  <p className="text-sm">{selectedWarehouse.manager}</p>
                </div>
                <div>
                  <Label>Contact</Label>
                  <p className="text-sm">{selectedWarehouse.phone}</p>
                  <p className="text-sm text-gray-600">{selectedWarehouse.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Capacity</Label>
                  <p className="text-sm font-medium">{selectedWarehouse.capacity}</p>
                </div>
                <div>
                  <Label>Total Items</Label>
                  <p className="text-sm font-medium">{selectedWarehouse.totalItems}</p>
                </div>
                <div>
                  <Label>Workers</Label>
                  <p className="text-sm font-medium">{selectedWarehouse.workers}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
