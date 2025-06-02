
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/data/mockData';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
}

const BUDGET_SOURCES = [
  { value: 'government_grant', label: 'Government Grant' },
  { value: 'internal_allocation', label: 'Internal Allocation' },
  { value: 'donor_funding', label: 'Donor Funding' },
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'project_specific', label: 'Project Specific' },
  { value: 'other', label: 'Other' }
];

const FISCAL_YEARS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' }
];

export const BudgetModal = ({ isOpen, onClose, user, onSuccess }: BudgetModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    source: 'internal_allocation',
    fiscal_year: '2025',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const budgetData = {
        title: formData.title,
        amount: parseFloat(formData.amount),
        source: formData.source as any,
        purpose: formData.description || `Budget for fiscal year ${formData.fiscal_year}`,
        assigned_to: null,
        approved_by: null,
        notes: `Fiscal Year: ${formData.fiscal_year}${formData.description ? `\nDescription: ${formData.description}` : ''}`,
        created_by: user.id,
        attachments: []
      };

      const { error } = await supabase
        .from('budgets')
        .insert([budgetData]);

      if (error) throw error;

      toast({
        title: "Budget Created",
        description: "Budget has been successfully created."
      });

      // Reset form
      setFormData({
        title: '',
        amount: '',
        source: 'internal_allocation',
        fiscal_year: '2025',
        description: ''
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: "Failed to save budget.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      amount: '',
      source: 'internal_allocation',
      fiscal_year: '2025',
      description: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Budget</DialogTitle>
          <DialogDescription>
            Create a new budget entry for your organization
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Budget Title*</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Enter budget title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="amount">Amount (INR)*</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <Label htmlFor="source">Source of Funds*</Label>
            <Select value={formData.source} onValueChange={(value) => setFormData({...formData, source: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
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
            <Label htmlFor="fiscal_year">Fiscal Year*</Label>
            <Select value={formData.fiscal_year} onValueChange={(value) => setFormData({...formData, fiscal_year: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select fiscal year" />
              </SelectTrigger>
              <SelectContent>
                {FISCAL_YEARS.map(year => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Optional description"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Budget'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
