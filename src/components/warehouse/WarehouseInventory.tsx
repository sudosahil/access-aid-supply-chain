
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Package, AlertTriangle, Plus, Minus, Clock, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedStockModal } from './EnhancedStockModal';

interface WarehouseInventoryProps {
  warehouseId: string;
}

export const WarehouseInventory = ({ warehouseId }: WarehouseInventoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const { toast } = useToast();

  const [inventory, setInventory] = useState([
    {
      id: 'INV-001',
      name: 'Electric Wheelchair Model A',
      category: 'Mobility Aids',
      serialNumber: 'EW-2024-001',
      quantity: 15,
      reorderLevel: 5,
      location: 'Section A-1',
      unitPrice: '₹45,000',
      lastRestocked: '15 Jan 2024, 2:30 PM',
      lastSupplier: 'MedEquip Corp',
      lastBatchId: 'ME-2024-001',
      stockHistory: []
    },
    {
      id: 'INV-002',
      name: 'Prosthetic Leg - Adult',
      category: 'Prosthetics',
      serialNumber: 'PL-2024-002',
      quantity: 3,
      reorderLevel: 5,
      location: 'Section B-2',
      unitPrice: '₹75,000',
      lastRestocked: '12 Jan 2024, 10:15 AM',
      lastSupplier: 'ProstheTech',
      lastBatchId: 'PT-2024-002',
      stockHistory: []
    },
    {
      id: 'INV-003',
      name: 'Hearing Aid Digital',
      category: 'Hearing Aids',
      serialNumber: 'HA-2024-003',
      quantity: 28,
      reorderLevel: 10,
      location: 'Section C-1',
      unitPrice: '₹25,000',
      lastRestocked: '18 Jan 2024, 4:45 PM',
      lastSupplier: 'AudioTech',
      lastBatchId: 'AT-2024-003',
      stockHistory: []
    }
  ]);

  const handleQuantityChange = (itemId: string, change: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ));
    
    toast({
      title: "Stock Updated",
      description: `Inventory quantity ${change > 0 ? 'increased' : 'decreased'} successfully.`
    });
  };

  const handleEnhancedRestock = (item: any) => {
    setSelectedItem(item);
    setIsStockModalOpen(true);
  };

  const handleStockUpdate = (itemId: string, updates: any) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const isLowStock = (quantity: number, reorderLevel: number) => quantity <= reorderLevel;

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Warehouse Inventory</h2>
        <div className="flex gap-2">
          <Badge variant="outline">Items: {inventory.length}</Badge>
          <Badge variant="destructive">
            Low Stock: {inventory.filter(item => isLowStock(item.quantity, item.reorderLevel)).length}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, category, or serial number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredInventory.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    <h3 className="font-semibold">{item.name}</h3>
                    {isLowStock(item.quantity, item.reorderLevel) && (
                      <Badge variant="destructive">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Low Stock
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">ID: {item.id} • Serial: {item.serialNumber}</p>
                  <p className="text-sm">Category: {item.category}</p>
                  <p className="text-sm">Location: {item.location}</p>
                  <div className="flex gap-4 text-sm">
                    <span>Current Stock: <strong>{item.quantity}</strong></span>
                    <span>Unit Price: <strong>{item.unitPrice}</strong></span>
                    <span>Reorder Level: {item.reorderLevel}</span>
                  </div>
                  {item.lastRestocked && (
                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                      <Clock className="h-3 w-3" />
                      <span><strong>Last Restocked:</strong> {item.lastRestocked}</span>
                    </div>
                  )}
                  {item.lastSupplier && (
                    <p className="text-sm text-gray-600">
                      Supplier: {item.lastSupplier} • Batch: {item.lastBatchId}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, -1)}
                      disabled={item.quantity <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-3 py-1 border rounded min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => handleEnhancedRestock(item)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Restock
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <EnhancedStockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        item={selectedItem}
        onUpdate={handleStockUpdate}
      />
    </div>
  );
};
