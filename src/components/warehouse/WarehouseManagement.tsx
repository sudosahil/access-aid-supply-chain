
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Building, Package, Truck, Plus, Edit, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  current_usage: number;
  manager: string;
  status: 'active' | 'inactive' | 'maintenance';
}

export const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    manager: '',
    status: 'active' as const
  });

  // Mock warehouse data - in a real app this would come from Supabase
  const mockWarehouses: Warehouse[] = [
    {
      id: 'warehouse-a',
      name: 'Central Warehouse A',
      location: 'Mumbai, Maharashtra',
      capacity: 1000,
      current_usage: 750,
      manager: 'Rajesh Kumar',
      status: 'active'
    },
    {
      id: 'warehouse-b',
      name: 'Regional Warehouse B',
      location: 'Delhi, NCR',
      capacity: 800,
      current_usage: 600,
      manager: 'Priya Sharma',
      status: 'active'
    },
    {
      id: 'warehouse-c',
      name: 'Branch Warehouse C',
      location: 'Bangalore, Karnataka',
      capacity: 500,
      current_usage: 200,
      manager: 'Amit Patel',
      status: 'maintenance'
    }
  ];

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      // For now, use mock data since warehouse table doesn't exist
      setWarehouses(mockWarehouses);
    } catch (error) {
      console.error('Error loading warehouses:', error);
      toast({
        title: "Error",
        description: "Failed to load warehouses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWarehouse = async () => {
    try {
      const newWarehouse: Warehouse = {
        id: `warehouse-${Date.now()}`,
        name: formData.name,
        location: formData.location,
        capacity: parseInt(formData.capacity),
        current_usage: 0,
        manager: formData.manager,
        status: formData.status
      };

      setWarehouses(prev => [...prev, newWarehouse]);
      setFormData({ name: '', location: '', capacity: '', manager: '', status: 'active' });
      setShowCreateForm(false);
      
      toast({
        title: "Warehouse Created",
        description: "New warehouse has been created successfully"
      });
    } catch (error) {
      console.error('Error creating warehouse:', error);
      toast({
        title: "Error",
        description: "Failed to create warehouse",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUsagePercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  if (loading) return <div>Loading warehouses...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Warehouse Management
              </CardTitle>
              <CardDescription>
                Manage warehouse locations, capacity, and operations
              </CardDescription>
            </div>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Warehouse
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Warehouse</DialogTitle>
                  <DialogDescription>
                    Add a new warehouse location to the system
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Warehouse Name</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Enter warehouse name"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Enter warehouse location"
                    />
                  </div>
                  <div>
                    <Label>Capacity (sq ft)</Label>
                    <Input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                      placeholder="Enter warehouse capacity"
                    />
                  </div>
                  <div>
                    <Label>Manager</Label>
                    <Input
                      value={formData.manager}
                      onChange={(e) => setFormData({...formData, manager: e.target.value})}
                      placeholder="Enter manager name"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateWarehouse}>
                      Create Warehouse
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Warehouses</p>
                    <p className="text-2xl font-bold">{warehouses.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Warehouses</p>
                    <p className="text-2xl font-bold">{warehouses.filter(w => w.status === 'active').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Truck className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                    <p className="text-2xl font-bold">{warehouses.reduce((sum, w) => sum + w.capacity, 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {warehouse.location}
                    </div>
                  </TableCell>
                  <TableCell>{warehouse.manager}</TableCell>
                  <TableCell>{warehouse.capacity.toLocaleString()} sq ft</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{warehouse.current_usage.toLocaleString()}</span>
                        <span>{getUsagePercentage(warehouse.current_usage, warehouse.capacity)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${getUsagePercentage(warehouse.current_usage, warehouse.capacity)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(warehouse.status)}>
                      {warehouse.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {warehouses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No warehouses found. Create one to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
