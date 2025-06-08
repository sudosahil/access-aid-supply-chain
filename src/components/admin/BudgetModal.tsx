
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/data/mockData';
import { budgetService, BudgetData } from '@/services/budgetService';
import { BudgetForm } from '@/components/forms/BudgetForm';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
  editBudget?: any;
}

export const BudgetModal = ({ isOpen, onClose, user, onSuccess, editBudget }: BudgetModalProps) => {
  const [formData, setFormData] = useState<{
    title: string;
    amount: string;
    source: BudgetData['source'];
    purpose: string;
    assigned_to: string;
    notes: string;
  }>({
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
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Budget title is required');
      }
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        throw new Error('Budget amount must be greater than 0');
      }
      if (!formData.purpose.trim()) {
        throw new Error('Budget purpose is required');
      }

      const budgetData: BudgetData = {
        title: formData.title.trim(),
        amount: parseFloat(formData.amount),
        source: formData.source,
        purpose: formData.purpose.trim(),
        assigned_to: formData.assigned_to || undefined,
        notes: formData.notes || undefined
      };

      console.log('Submitting budget data:', budgetData);
      console.log('User:', user);

      if (editBudget) {
        await budgetService.updateBudget(editBudget.id, budgetData);
        toast({
          title: "Budget Updated",
          description: "Budget has been updated successfully.",
        });
      } else {
        // Create new budget
        const result = await budgetService.createBudget(budgetData, user.id);
        console.log('Budget creation result:', result);
        toast({
          title: "Budget Created",
          description: "Budget has been created successfully and sent for approval.",
        });
      }

      onSuccess();
      onClose();
      
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
          <BudgetForm formData={formData} onFormDataChange={setFormData} />

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
