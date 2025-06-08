
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { mockUsers, User } from '@/data/mockData';
import { BudgetData } from '@/services/budgetService';

const BUDGET_SOURCES = [
  { value: 'government_grant' as const, label: 'Government Grant' },
  { value: 'internal_allocation' as const, label: 'Internal Allocation' },
  { value: 'donor_funding' as const, label: 'Donor Funding' },
  { value: 'emergency_fund' as const, label: 'Emergency Fund' },
  { value: 'project_specific' as const, label: 'Project Specific' },
  { value: 'other' as const, label: 'Other' }
];

interface BudgetFormProps {
  formData: {
    title: string;
    amount: string;
    source: BudgetData['source'];
    purpose: string;
    assigned_to: string;
    notes: string;
  };
  onFormDataChange: (data: any) => void;
}

export const BudgetForm = ({ formData, onFormDataChange }: BudgetFormProps) => {
  const setFormData = (updates: any) => {
    onFormDataChange({ ...formData, ...updates });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Budget Title*</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ title: e.target.value })}
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
            onChange={(e) => setFormData({ amount: e.target.value })}
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
          <Select 
            value={formData.source} 
            onValueChange={(value: BudgetData['source']) => setFormData({ source: value })}
          >
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
          <Select 
            value={formData.assigned_to} 
            onValueChange={(value) => setFormData({ assigned_to: value === "unassigned" ? "" : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
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
          onChange={(e) => setFormData({ purpose: e.target.value })}
          placeholder="Describe the purpose of this budget"
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ notes: e.target.value })}
          placeholder="Additional notes (optional)"
        />
      </div>
    </div>
  );
};
