
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/data/mockData';
import { Upload, X, FileText } from 'lucide-react';

interface Budget {
  id: string;
  title: string;
  amount: number;
  source: string;
  purpose: string;
  assigned_to: string | null;
  approved_by: string | null;
  status: string;
  notes: string | null;
  attachments: any[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSuccess: () => void;
  editBudget?: Budget | null;
}

const BUDGET_SOURCES = [
  { value: 'government_grant', label: 'Government Grant' },
  { value: 'internal_allocation', label: 'Internal Allocation' },
  { value: 'donor_funding', label: 'Donor Funding' },
  { value: 'emergency_fund', label: 'Emergency Fund' },
  { value: 'project_specific', label: 'Project Specific' },
  { value: 'other', label: 'Other' }
] as const;

const FISCAL_YEARS = [
  { value: '2024', label: '2024' },
  { value: '2025', label: '2025' },
  { value: '2026', label: '2026' }
];

type BudgetSource = typeof BUDGET_SOURCES[number]['value'];

export const BudgetModal = ({ isOpen, onClose, user, onSuccess, editBudget }: BudgetModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    source: 'internal_allocation' as BudgetSource,
    fiscal_year: '2025',
    description: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    size: number;
    type: string;
    url: string;
  }>>([]);

  // Reset form when modal opens/closes or editBudget changes
  useEffect(() => {
    if (editBudget) {
      setFormData({
        title: editBudget.title,
        amount: editBudget.amount.toString(),
        source: editBudget.source as BudgetSource,
        fiscal_year: '2025', // Extract from notes if needed
        description: editBudget.purpose
      });
      setUploadedFiles(editBudget.attachments || []);
    } else {
      setFormData({
        title: '',
        amount: '',
        source: 'internal_allocation',
        fiscal_year: '2025',
        description: ''
      });
      setUploadedFiles([]);
    }
  }, [editBudget, isOpen]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      // For demo purposes, we'll create a mock URL
      // In a real implementation, you would upload to a storage service
      const mockUrl = `/docs/${file.name}`;
      
      setUploadedFiles(prev => [...prev, {
        name: file.name,
        size: file.size,
        type: file.type,
        url: mockUrl
      }]);
    });

    // Clear the input
    event.target.value = '';
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

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

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      const budgetData = {
        title: formData.title,
        amount: amount,
        source: formData.source,
        purpose: formData.description || `Budget for fiscal year ${formData.fiscal_year}`,
        assigned_to: null,
        approved_by: null,
        status: 'draft' as const,
        notes: `Fiscal Year: ${formData.fiscal_year}${formData.description ? `\nDescription: ${formData.description}` : ''}`,
        created_by: user.id,
        attachments: uploadedFiles
      };

      console.log(editBudget ? 'Updating budget:' : 'Creating budget:', budgetData);

      if (editBudget) {
        // Update existing budget
        const { data, error } = await supabase
          .from('budgets')
          .update(budgetData)
          .eq('id', editBudget.id)
          .select();

        if (error) {
          console.log('Supabase update error:', error);
          throw error;
        }

        console.log('Budget updated successfully:', data);
        toast({
          title: "Budget Updated",
          description: "Budget has been successfully updated."
        });
      } else {
        // Create new budget
        const { data, error } = await supabase
          .from('budgets')
          .insert(budgetData)
          .select();

        if (error) {
          console.log('Supabase insert error:', error);
          throw error;
        }

        console.log('Budget created successfully:', data);
        toast({
          title: "Budget Created",
          description: "Budget has been successfully created."
        });
      }

      // Reset form
      setFormData({
        title: '',
        amount: '',
        source: 'internal_allocation',
        fiscal_year: '2025',
        description: ''
      });
      setUploadedFiles([]);

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: "Failed to save budget. Please try again.",
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
    setUploadedFiles([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editBudget ? 'Edit Budget' : 'Add New Budget'}</DialogTitle>
          <DialogDescription>
            {editBudget ? 'Update the budget details' : 'Create a new budget entry for your organization'}
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
              min="0"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              placeholder="Enter amount"
              required
            />
          </div>

          <div>
            <Label htmlFor="source">Source of Funds*</Label>
            <Select value={formData.source} onValueChange={(value: BudgetSource) => setFormData({...formData, source: value})}>
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

          <div>
            <Label>Supporting Documents</Label>
            <div className="mt-2">
              <div className="flex items-center justify-center w-full">
                <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX, XLS, XLSX (MAX. 10MB)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <Label>Uploaded Files</Label>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (editBudget ? 'Updating...' : 'Creating...') : (editBudget ? 'Update Budget' : 'Create Budget')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
