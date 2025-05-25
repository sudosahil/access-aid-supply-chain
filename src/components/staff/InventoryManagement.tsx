
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Search, Plus, Package, AlertTriangle, Edit, Truck } from 'lucide-react';
import { InventoryItemModal } from './InventoryItemModal';
import { useToast } from '@/hooks/use-toast';

export const InventoryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'add'>('view');
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferData, setTransferData] = useState({ fromWarehouse: '', toWarehouse: '', quantity: 0 });
  const { toast } = useToast();

  const [mockInventory, setMockInventory] = useState([
    {
      id: 'INV-001',
      name: 'Electric Wheelchair Model A',
      category: 'Mobility Aids',
      serialNumber: 'EW-2024-001',
      description: '24V Electric wheelchair with joystick control, weight capacity 120kg',
      unitPrice: '₹45,000',
      quantity: 15,
      warehouse: 'Warehouse-A',
      reorderLevel: 5,
      lastUpdate: '2024-01-15',
      updatedBy: 'John Doe',
      dimensions: '120×80×95 cm',
      weight: '45 kg',
      manufacturer: 'MedEquip Corp',
      model: 'EC-2024-A',
      purchaseDate: '2024-01-01',
      warrantyExpiry: '2026-01-01'
    },
    {
      id: 'INV-002',
      name: 'Prosthetic Leg - Adult',
      category: 'Prosthetics',
      serialNumber: 'PL-2024-002',
      description: 'Adult prosthetic leg, adjustable height 160-180cm',
      unitPrice: '₹75,000',
      quantity: 3,
      warehouse: 'Warehouse-B',
      reorderLevel: 5,
      lastUpdate: '2024-01-14',
      updatedBy: 'Jane Smith',
      dimensions: '80×20×15 cm',
      weight: '2.5 kg',
      manufacturer: 'ProstheTech',
      model: 'PT-AL-2024',
      purchaseDate: '2024-01-05',
      warrantyExpiry: '2027-01-05'
    },
    {
      id: 'INV-003',
      name: 'Hearing Aid Digital',
      category: 'Hearing Aids',
      serialNumber: 'HA-2024-003',
      description: 'Digital hearing aid with bluetooth connectivity',
      unitPrice: '₹25,000',
      quantity: 28,
      warehouse: 'Warehouse-A',
      reorderLevel: 10,
      lastUpdate: '2024-01-13',
      updatedBy: 'Mike Johnson',
      dimensions: '3×2×1 cm',
      weight: '0.02 kg',
      manufacturer: 'AudioTech',
      model: 'AT-DH-2024',
      purchaseDate: '2024-01-08',
      warrantyExpiry: '2026-01-08'
    }
  ]);

  const isLowStock = (quantity: number, reorderLevel: number) => quantity <= reorderLevel;

  const handleViewItem = (item: any) => {
    setSelectedItem(item);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditItem = (item: any) => {
    setSelectedItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setSelectedItem(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleTransferItem = (item: any) => {
    setSelectedItem(item);
    setTransferData({ fromWarehouse: item.warehouse, toWarehouse: '', quantity: 0 });
    setIsTransferModalOpen(true);
  };

  const handleItemUpdate = (itemId: string, updates: any) => {
    if (itemId === 'new') {
      const newItem = {
        ...updates,
        id: `INV-${String(mockInventory.length + 1).padStart(3, '0')}`,
        lastUpdate: new Date().toISOString().split('T')[0],
        updatedBy: 'Current User'
      };
      setMockInventory(prev => [...prev, newItem]);
    } else {
      setMockInventory(prev => prev.map(item => 
        item.id === itemId ? { ...item, ...updates, lastUpdate: new Date().toISOString().split('T')[0] } : item
      ));
    }
  };

  const handleTransfer = () => {
    if (!transferData.toWarehouse || transferData.quantity <= 0) {
      toast({
        title: "Invalid Transfer",
        description: "Please select destination warehouse and valid quantity.",
        variant: "destructive"
      });
      return;
    }

    if (transferData.quantity > selectedItem.quantity) {
      toast({
        title: "Insufficient Stock",
        description: "Transfer quantity cannot exceed available stock.",
        variant: "destructive"
      });
      return;
    }

    // Update inventory
    setMockInventory(prev => prev.map(item => 
      item.id === selectedItem.id 
        ? { ...item, quantity: item.quantity - transferData.quantity }
        : item
    ));

    toast({
      title: "Transfer Initiated",
      description: `${transferData.quantity} units transferred from ${transferData.fromWarehouse} to ${transferData.toWarehouse}.`
    });
    
    setIsTransferModalOpen(false);
  };

  const filteredInventory = mockInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWarehouse = warehouseFilter === 'all' || item.warehouse === warehouseFilter;
    return matchesSearch && matchesWarehouse;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <Button onClick={handleAddItem}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold">{mockInventory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold">
                  {mockInventory.filter(item => isLowStock(item.quantity, item.reorderLevel)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-2xl font-bold">
                  {mockInventory.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Warehouses</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, category, or serial number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by warehouse" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Warehouses</SelectItem>
                <SelectItem value="Warehouse-A">Warehouse A</SelectItem>
                <SelectItem value="Warehouse-B">Warehouse B</SelectItem>
                <SelectItem value="Warehouse-C">Warehouse C</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredInventory.map((item) => (
          <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewItem(item)}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    {isLowStock(item.quantity, item.reorderLevel) && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">ID: {item.id} • Serial: {item.serialNumber}</p>
                  <p className="text-sm">Category: {item.category} • Manufacturer: {item.manufacturer}</p>
                  <p className="text-sm">Warehouse: {item.warehouse} • Model: {item.model}</p>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm">Dimensions: {item.dimensions} • Weight: {item.weight}</p>
                  <div className="flex gap-4 text-sm">
                    <span>Unit Price: {item.unitPrice}</span>
                    <span>Quantity: <strong>{item.quantity}</strong></span>
                    <span>Reorder Level: {item.reorderLevel}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Last updated: {item.lastUpdate} by {item.updatedBy}
                  </p>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleTransferItem(item)}>
                    <Truck className="h-4 w-4 mr-2" />
                    Transfer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <InventoryItemModal
        item={selectedItem}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleItemUpdate}
        mode={modalMode}
      />

      {/* Transfer Modal */}
      <Dialog open={isTransferModalOpen} onOpenChange={setIsTransferModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Inventory</DialogTitle>
            <DialogDescription>Transfer {selectedItem?.name} to another warehouse</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>From Warehouse</Label>
              <Input value={transferData.fromWarehouse} disabled />
            </div>
            <div>
              <Label>To Warehouse</Label>
              <Select value={transferData.toWarehouse} onValueChange={(value) => setTransferData(prev => ({ ...prev, toWarehouse: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Warehouse-A">Warehouse A</SelectItem>
                  <SelectItem value="Warehouse-B">Warehouse B</SelectItem>
                  <SelectItem value="Warehouse-C">Warehouse C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Quantity (Available: {selectedItem?.quantity})</Label>
              <Input
                type="number"
                value={transferData.quantity}
                onChange={(e) => setTransferData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                max={selectedItem?.quantity}
                min={1}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsTransferModalOpen(false)}>Cancel</Button>
              <Button onClick={handleTransfer}>Confirm Transfer</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
