
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onUpdate: (itemId: string, updates: any) => void;
}

export const EnhancedStockModal = ({ isOpen, onClose, item, onUpdate }: EnhancedStockModalProps) => {
  const [stockData, setStockData] = useState({
    quantity: 0,
    unitPrice: 0,
    supplier: '',
    batchId: '',
    purchaseDate: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  // Calculate weighted average price
  const calculateNewUnitPrice = () => {
    if (!item || stockData.quantity <= 0) return 0;
    
    const currentValue = item.quantity * parseFloat(item.unitPrice.replace('₹', '').replace(',', ''));
    const newValue = stockData.quantity * stockData.unitPrice;
    const totalQuantity = item.quantity + stockData.quantity;
    
    return totalQuantity > 0 ? (currentValue + newValue) / totalQuantity : 0;
  };

  const handleAddStock = () => {
    if (stockData.quantity <= 0 || stockData.unitPrice <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid quantity and unit price.",
        variant: "destructive"
      });
      return;
    }

    if (!stockData.supplier || !stockData.batchId) {
      toast({
        title: "Missing Information",
        description: "Please provide supplier and batch ID.",
        variant: "destructive"
      });
      return;
    }

    const newUnitPrice = calculateNewUnitPrice();
    const newQuantity = item.quantity + stockData.quantity;
    const timestamp = new Date().toLocaleString('en-IN', { 
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    const updates = {
      quantity: newQuantity,
      unitPrice: `₹${Math.round(newUnitPrice).toLocaleString()}`,
      lastRestocked: timestamp,
      lastSupplier: stockData.supplier,
      lastBatchId: stockData.batchId,
      lastPurchaseDate: stockData.purchaseDate,
      stockHistory: [
        ...(item.stockHistory || []),
        {
          date: timestamp,
          quantity: stockData.quantity,
          unitPrice: stockData.unitPrice,
          supplier: stockData.supplier,
          batchId: stockData.batchId,
          purchaseDate: stockData.purchaseDate
        }
      ]
    };

    onUpdate(item.id, updates);
    
    toast({
      title: "Stock Added Successfully",
      description: `Added ${stockData.quantity} units. New total: ${newQuantity} units at ₹${Math.round(newUnitPrice).toLocaleString()} per unit.`
    });

    // Reset form
    setStockData({
      quantity: 0,
      unitPrice: 0,
      supplier: '',
      batchId: '',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    
    onClose();
  };

  const newUnitPrice = calculateNewUnitPrice();
  const newTotalQuantity = item ? item.quantity + stockData.quantity : 0;
  const netPriceChange = newUnitPrice - (item ? parseFloat(item.unitPrice.replace('₹', '').replace(',', '')) : 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add Stock: {item?.name}
          </DialogTitle>
          <DialogDescription>
            Enhance inventory with detailed restocking information
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Current Stock</Label>
              <div className="text-lg font-semibold text-blue-600">{item?.quantity || 0} units</div>
            </div>
            <div>
              <Label>Current Unit Price</Label>
              <div className="text-lg font-semibold">{item?.unitPrice || '₹0'}</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Add Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={stockData.quantity || ''}
                  onChange={(e) => setStockData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  placeholder="Enter quantity"
                />
              </div>
              <div>
                <Label htmlFor="unitPrice">Unit Price (₹)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={stockData.unitPrice || ''}
                  onChange={(e) => setStockData(prev => ({ ...prev, unitPrice: parseFloat(e.target.value) || 0 }))}
                  placeholder="Enter price"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="supplier">Supplier</Label>
              <Select value={stockData.supplier} onValueChange={(value) => setStockData(prev => ({ ...prev, supplier: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medequip-corp">MedEquip Corp</SelectItem>
                  <SelectItem value="prosthetech">ProstheTech</SelectItem>
                  <SelectItem value="audiotech">AudioTech</SelectItem>
                  <SelectItem value="healthsupply-co">HealthSupply Co</SelectItem>
                  <SelectItem value="medcare-solutions">MedCare Solutions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="batchId">Batch ID</Label>
              <Input
                id="batchId"
                value={stockData.batchId}
                onChange={(e) => setStockData(prev => ({ ...prev, batchId: e.target.value }))}
                placeholder="Enter batch ID"
              />
            </div>

            <div>
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={stockData.purchaseDate}
                onChange={(e) => setStockData(prev => ({ ...prev, purchaseDate: e.target.value }))}
              />
            </div>
          </div>

          {stockData.quantity > 0 && stockData.unitPrice > 0 && (
            <div className="border-t pt-4 bg-gray-50 p-3 rounded">
              <div className="flex items-center gap-2 mb-2">
                <Calculator className="h-4 w-4" />
                <Label className="font-semibold">Calculated Results</Label>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>New Total Quantity:</span>
                  <span className="font-semibold text-green-600">{newTotalQuantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span>New Weighted Avg Price:</span>
                  <span className="font-semibold">₹{Math.round(newUnitPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Price Change:</span>
                  <span className={`font-semibold ${netPriceChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {netPriceChange >= 0 ? '+' : ''}₹{Math.round(Math.abs(netPriceChange)).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Investment:</span>
                  <span className="font-semibold">₹{(stockData.quantity * stockData.unitPrice).toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleAddStock}>Add Stock</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
