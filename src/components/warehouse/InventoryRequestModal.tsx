
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface InventoryRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseId: string;
  warehouseName: string;
}

export const InventoryRequestModal = ({ isOpen, onClose, warehouseId, warehouseName }: InventoryRequestModalProps) => {
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantity: '',
    urgency: 'medium',
    justification: '',
    estimatedCost: ''
  });
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!formData.itemName || !formData.category || !formData.quantity || !formData.justification) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would submit to the backend
    console.log('Inventory request submitted:', {
      ...formData,
      warehouseId,
      warehouseName,
      requestDate: new Date().toISOString(),
      status: 'pending'
    });

    toast({
      title: "Request Submitted",
      description: "Your inventory request has been submitted for approval.",
    });

    setFormData({
      itemName: '',
      category: '',
      quantity: '',
      urgency: 'medium',
      justification: '',
      estimatedCost: ''
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request New Inventory</DialogTitle>
          <DialogDescription>
            Submit a request for new inventory items for {warehouseName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="itemName">Item Name *</Label>
              <Input
                id="itemName"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                placeholder="Enter item name"
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mobility Aids">Mobility Aids</SelectItem>
                  <SelectItem value="Prosthetics">Prosthetics</SelectItem>
                  <SelectItem value="Hearing Aids">Hearing Aids</SelectItem>
                  <SelectItem value="Vision Aids">Vision Aids</SelectItem>
                  <SelectItem value="Medical Equipment">Medical Equipment</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="Enter quantity needed"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="urgency">Urgency Level</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({ ...formData, urgency: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="estimatedCost">Estimated Cost (Optional)</Label>
            <Input
              id="estimatedCost"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
              placeholder="Enter estimated cost (₹)"
            />
          </div>

          <div>
            <Label htmlFor="justification">Justification *</Label>
            <Textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
              placeholder="Explain why this inventory is needed..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Submit Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
