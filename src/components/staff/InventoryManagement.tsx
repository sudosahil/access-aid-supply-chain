import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, AlertTriangle, Package } from 'lucide-react';
import { mockInventoryItems, mockInventoryCategories, mockWarehouses, InventoryItem } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
export const InventoryManagement = () => {
  const [inventory, setInventory] = useState(mockInventoryItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
    currentStock: '',
    reorderLevel: '',
    unit: '',
    unitPrice: '',
    warehouseId: ''
  });
  const {
    toast
  } = useToast();
  const handleAddItem = () => {
    const newItem: InventoryItem = {
      id: `i${inventory.length + 1}`,
      name: formData.name,
      categoryId: formData.categoryId,
      description: formData.description,
      currentStock: parseInt(formData.currentStock),
      reorderLevel: parseInt(formData.reorderLevel),
      unit: formData.unit,
      unitPrice: parseFloat(formData.unitPrice),
      warehouseId: formData.warehouseId,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInventory([...inventory, newItem]);
    setIsAddDialogOpen(false);
    setFormData({
      name: '',
      categoryId: '',
      description: '',
      currentStock: '',
      reorderLevel: '',
      unit: '',
      unitPrice: '',
      warehouseId: ''
    });
    toast({
      title: "Item Added",
      description: "New inventory item has been added successfully."
    });
  };
  const getCategoryName = (categoryId: string) => {
    const category = mockInventoryCategories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };
  const getWarehouseName = (warehouseId: string) => {
    const warehouse = mockWarehouses.find(w => w.id === warehouseId);
    return warehouse ? warehouse.name : 'Unknown Warehouse';
  };
  const isLowStock = (item: InventoryItem) => item.currentStock <= item.reorderLevel;
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 bg-slate-300">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 bg-slate-300">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold">{inventory.filter(isLowStock).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 bg-slate-300">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Stock Value</p>
                <p className="text-2xl font-bold">
                  ${inventory.reduce((sum, item) => sum + item.currentStock * item.unitPrice, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="bg-slate-400">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription className="text-slate-950">Manage inventory items and stock levels</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-slate-950">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                  <DialogDescription>Add a new item to inventory</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Item Name</Label>
                      <Input id="name" value={formData.name} onChange={e => setFormData({
                      ...formData,
                      name: e.target.value
                    })} required />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.categoryId} onValueChange={value => setFormData({
                      ...formData,
                      categoryId: value
                    })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockInventoryCategories.map(category => <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" value={formData.description} onChange={e => setFormData({
                    ...formData,
                    description: e.target.value
                  })} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="currentStock">Current Stock</Label>
                      <Input id="currentStock" type="number" value={formData.currentStock} onChange={e => setFormData({
                      ...formData,
                      currentStock: e.target.value
                    })} />
                    </div>
                    <div>
                      <Label htmlFor="reorderLevel">Reorder Level</Label>
                      <Input id="reorderLevel" type="number" value={formData.reorderLevel} onChange={e => setFormData({
                      ...formData,
                      reorderLevel: e.target.value
                    })} />
                    </div>
                    <div>
                      <Label htmlFor="unit">Unit</Label>
                      <Input id="unit" value={formData.unit} onChange={e => setFormData({
                      ...formData,
                      unit: e.target.value
                    })} placeholder="e.g., units, pairs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="unitPrice">Unit Price ($)</Label>
                      <Input id="unitPrice" type="number" step="0.01" value={formData.unitPrice} onChange={e => setFormData({
                      ...formData,
                      unitPrice: e.target.value
                    })} />
                    </div>
                    <div>
                      <Label htmlFor="warehouse">Warehouse</Label>
                      <Select value={formData.warehouseId} onValueChange={value => setFormData({
                      ...formData,
                      warehouseId: value
                    })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select warehouse" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockWarehouses.map(warehouse => <SelectItem key={warehouse.id} value={warehouse.id}>
                              {warehouse.name}
                            </SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddItem}>Add Item</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="bg-slate-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="bg-slate-950">Name</TableHead>
                <TableHead className="bg-slate-950">Category</TableHead>
                <TableHead className="bg-slate-950">Current Stock</TableHead>
                <TableHead className="bg-slate-950">Reorder Level</TableHead>
                <TableHead className="bg-slate-950">Unit Price</TableHead>
                <TableHead className="bg-slate-950">Warehouse</TableHead>
                <TableHead className="bg-slate-950">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map(item => <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryName(item.categoryId)}</Badge>
                  </TableCell>
                  <TableCell>
                    {item.currentStock} {item.unit}
                    {isLowStock(item) && <AlertTriangle className="h-4 w-4 text-red-500 inline ml-2" />}
                  </TableCell>
                  <TableCell>{item.reorderLevel} {item.unit}</TableCell>
                  <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                  <TableCell>{getWarehouseName(item.warehouseId)}</TableCell>
                  <TableCell>
                    <Badge className={isLowStock(item) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                      {isLowStock(item) ? 'Low Stock' : 'In Stock'}
                    </Badge>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>;
};