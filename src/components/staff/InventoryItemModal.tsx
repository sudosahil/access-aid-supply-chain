
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InventoryItemModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (itemId: string, updates: any) => void;
  mode: 'view' | 'edit' | 'add';
}

export const InventoryItemModal = ({ item, isOpen, onClose, onUpdate, mode }: InventoryItemModalProps) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'add');
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    serialNumber: item?.serialNumber || '',
    description: item?.description || '',
    unitPrice: item?.unitPrice || '',
    quantity: item?.quantity || 0,
    warehouse: item?.warehouse || '',
    reorderLevel: item?.reorderLevel || 0,
    dimensions: item?.dimensions || '',
    weight: item?.weight || '',
    manufacturer: item?.manufacturer || '',
    model: item?.model || '',
    purchaseDate: item?.purchaseDate || '',
    warrantyExpiry: item?.warrantyExpiry || ''
  });
  const { toast } = useToast();

  const handleSave = () => {
    onUpdate(item?.id || 'new', formData);
    toast({
      title: mode === 'add' ? "Item Added" : "Item Updated",
      description: mode === 'add' ? "New inventory item added successfully." : "Inventory item updated successfully."
    });
    onClose();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (mode === 'add') {
      onClose();
    } else {
      setIsEditing(false);
      // Reset form data to original values
      setFormData({
        name: item?.name || '',
        category: item?.category || '',
        serialNumber: item?.serialNumber || '',
        description: item?.description || '',
        unitPrice: item?.unitPrice || '',
        quantity: item?.quantity || 0,
        warehouse: item?.warehouse || '',
        reorderLevel: item?.reorderLevel || 0,
        dimensions: item?.dimensions || '',
        weight: item?.weight || '',
        manufacturer: item?.manufacturer || '',
        model: item?.model || '',
        purchaseDate: item?.purchaseDate || '',
        warrantyExpiry: item?.warrantyExpiry || ''
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'add' ? 'Add New Inventory Item' : isEditing ? 'Edit Inventory Item' : 'Inventory Item Details'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'add' ? 'Enter details for the new inventory item' : 'View and manage inventory item information'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Item Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mobility Aids">Mobility Aids</SelectItem>
                      <SelectItem value="Prosthetics">Prosthetics</SelectItem>
                      <SelectItem value="Hearing Aids">Hearing Aids</SelectItem>
                      <SelectItem value="Visual Aids">Visual Aids</SelectItem>
                      <SelectItem value="Medical Equipment">Medical Equipment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Unit Price (₹)</Label>
                  <Input
                    id="unitPrice"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Current Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="reorderLevel">Reorder Level</Label>
                  <Input
                    id="reorderLevel"
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, reorderLevel: parseInt(e.target.value) || 0 }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="warehouse">Warehouse *</Label>
                  <Select 
                    value={formData.warehouse} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, warehouse: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Warehouse-A">Warehouse A</SelectItem>
                      <SelectItem value="Warehouse-B">Warehouse B</SelectItem>
                      <SelectItem value="Warehouse-C">Warehouse C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="dimensions">Dimensions (L×W×H)</Label>
                  <Input
                    id="dimensions"
                    value={formData.dimensions}
                    onChange={(e) => setFormData(prev => ({ ...prev, dimensions: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="e.g., 120×80×95 cm"
                  />
                </div>
                <div>
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
                  <Input
                    id="warrantyExpiry"
                    type="date"
                    value={formData.warrantyExpiry}
                    onChange={(e) => setFormData(prev => ({ ...prev, warrantyExpiry: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-4">
            {!isEditing && mode !== 'add' && (
              <Button onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Item
              </Button>
            )}
            {isEditing && (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === 'add' ? 'Add Item' : 'Save Changes'}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
