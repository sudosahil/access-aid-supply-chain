
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { mockUsers, User } from '@/data/mockData';
import { budgetService } from '@/services/budgetService';

const BUDGET_SOURCES = [
  { value: 'government_grant', label: 'Government Grant' },
  { value: 'internal_allocation', label: 'Internal Allocation' },
  { value: 'donor_funding', label: 'Donor Funding' },
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'project_specific', label: 'Project Specific' },
  { value: 'other', label: 'Other' }
];

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
  editBudget?: any;
}

export const BudgetModal = ({ isOpen, onClose, user, onSuccess, editBudget }: BudgetModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    source: 'government_grant',
    purpose: '',
    assigned_to: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editBudget) {
      setFormData({
        title: editBudget.title || '',
        amount: editBudget.amount?.toString() || '',
        source: editBudget.source || 'government_grant',
        purpose: editBudget.purpose || '',
        assigned_to: editBudget.assigned_to || '',
        notes: editBudget.notes || ''
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        source: 'government_grant',
        purpose: '',
        assigned_to: '',
        notes: ''
      });
    }
  }, [editBudget, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const budgetData = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        source: formData.source,
        purpose: formData.purpose,
        assigned_to: formData.assigned_to || undefined,
        notes: formData.notes || undefined
      };

      if (editBudget) {
        await budgetService.updateBudget(editBudget.id, budgetData);
      } else {
        await budgetService.createBudget(budgetData, user.id);
      }

      onSuccess();
      onClose();
      
      toast({
        title: editBudget ? "Budget Updated" : "Budget Created",
        description: editBudget ? "Budget has been updated successfully." : "Budget has been created successfully.",
      });
    } catch (error: any) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save budget. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editBudget ? 'Edit Budget' : 'Create New Budget'}</DialogTitle>
          <DialogDescription>
            {editBudget ? 'Update budget information' : 'Create a new budget allocation'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Budget Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter budget title"
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount (₹)*</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Budget Source*</Label>
              <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUDGET_SOURCES.map(source => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Select value={formData.assigned_to} onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Unassigned</SelectItem>
                  {mockUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="purpose">Purpose*</Label>
            <Textarea
              id="purpose"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              placeholder="Describe the purpose of this budget"
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes (optional)"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editBudget ? 'Update Budget' : 'Create Budget')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
