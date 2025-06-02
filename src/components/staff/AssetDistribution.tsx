
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Truck, RotateCcw } from 'lucide-react';
import { mockAssetDistribution, mockInventoryItems, AssetDistribution as AssetDistributionType } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

export const AssetDistribution = () => {
  const [distributions, setDistributions] = useState(mockAssetDistribution);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    itemId: mockInventoryItems.length > 0 ? mockInventoryItems[0].id : 'default-item', // Set default value instead of empty string
    quantity: '',
    assignedTo: '',
    purpose: ''
  });
  const { toast } = useToast();

  const handleAddDistribution = () => {
    const newDistribution: AssetDistributionType = {
      id: `ad${distributions.length + 1}`,
      itemId: formData.itemId,
      quantity: parseInt(formData.quantity),
      assignedTo: formData.assignedTo,
      assignedBy: '4', // Current staff user
      purpose: formData.purpose,
      distributionDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setDistributions([...distributions, newDistribution]);
    setIsAddDialogOpen(false);
    setFormData({ 
      itemId: mockInventoryItems.length > 0 ? mockInventoryItems[0].id : 'default-item', // Reset to default value instead of empty string
      quantity: '', 
      assignedTo: '', 
      purpose: '' 
    });
    toast({
      title: "Asset Distributed",
      description: "Asset has been successfully distributed.",
    });
  };

  const handleReturnAsset = (distributionId: string) => {
    setDistributions(distributions.map(dist =>
      dist.id === distributionId 
        ? { ...dist, status: 'returned', returnDate: new Date().toISOString().split('T')[0] }
        : dist
    ));
    toast({
      title: "Asset Returned",
      description: "Asset has been marked as returned.",
    });
  };

  const getItemName = (itemId: string) => {
    const item = mockInventoryItems.find(i => i.id === itemId);
    return item ? item.name : 'Unknown Item';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'returned': return 'bg-blue-100 text-blue-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Asset Distribution</CardTitle>
              <CardDescription>Manage asset distribution and tracking</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Distribute Asset
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Distribute Asset</DialogTitle>
                  <DialogDescription>Assign assets to users or locations</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="item">Select Item</Label>
                    <Select value={formData.itemId} onValueChange={(value) => setFormData({ ...formData, itemId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockInventoryItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} (Available: {item.currentStock})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="assignedTo">Assigned To</Label>
                      <Input
                        id="assignedTo"
                        value={formData.assignedTo}
                        onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        placeholder="e.g., Regional Office North"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="purpose">Purpose</Label>
                    <Input
                      id="purpose"
                      value={formData.purpose}
                      onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                      placeholder="e.g., Client loan program"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddDistribution}>Distribute</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Distribution Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributions.map((distribution) => (
                <TableRow key={distribution.id}>
                  <TableCell className="font-medium">{getItemName(distribution.itemId)}</TableCell>
                  <TableCell>{distribution.quantity}</TableCell>
                  <TableCell>{distribution.assignedTo}</TableCell>
                  <TableCell>{distribution.purpose}</TableCell>
                  <TableCell>{new Date(distribution.distributionDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(distribution.status)}>
                      {distribution.status.charAt(0).toUpperCase() + distribution.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {distribution.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReturnAsset(distribution.id)}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
