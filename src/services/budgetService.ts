
import { supabase } from '@/integrations/supabase/client';

export interface BudgetData {
  title: string;
  amount: number;
  source: 'government_grant' | 'internal_allocation' | 'donor_funding' | 'emergency_fund' | 'project_specific' | 'other';
  purpose: string;
  assigned_to?: string;
  notes?: string;
  attachments?: any[];
}

export interface BudgetValidation {
  isValid: boolean;
  errors: string[];
}

export const budgetService = {
  // Validate budget data
  validateBudget: (budgetData: BudgetData): BudgetValidation => {
    const errors: string[] = [];

    if (!budgetData.title || budgetData.title.trim().length === 0) {
      errors.push('Budget title is required');
    }

    if (!budgetData.amount || budgetData.amount <= 0) {
      errors.push('Budget amount must be greater than 0');
    }

    if (!budgetData.source) {
      errors.push('Budget source is required');
    }

    if (!budgetData.purpose || budgetData.purpose.trim().length === 0) {
      errors.push('Budget purpose is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Create budget with transaction handling
  createBudget: async (budgetData: BudgetData, userId: string) => {
    try {
      console.log('Creating budget with data:', budgetData);

      // Validate budget data
      const validation = budgetService.validateBudget(budgetData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const { data, error } = await supabase
        .from('budgets')
        .insert({
          title: budgetData.title,
          amount: budgetData.amount,
          source: budgetData.source,
          purpose: budgetData.purpose,
          assigned_to: budgetData.assigned_to || null,
          notes: budgetData.notes || null,
          attachments: budgetData.attachments || [],
          created_by: userId,
          status: 'draft'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating budget:', error);
        throw new Error(`Failed to create budget: ${error.message}`);
      }

      console.log('Budget created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createBudget:', error);
      throw error;
    }
  },

  // Update budget with validation
  updateBudget: async (budgetId: string, budgetData: Partial<BudgetData>) => {
    try {
      console.log('Updating budget:', budgetId, 'with data:', budgetData);

      // Prepare update object with only valid budget fields
      const updateData: any = {
        updated_at: new Date().toISOString()
      };

      // Only include fields that are defined and valid
      if (budgetData.title !== undefined) updateData.title = budgetData.title;
      if (budgetData.amount !== undefined) updateData.amount = budgetData.amount;
      if (budgetData.source !== undefined) updateData.source = budgetData.source;
      if (budgetData.purpose !== undefined) updateData.purpose = budgetData.purpose;
      if (budgetData.assigned_to !== undefined) updateData.assigned_to = budgetData.assigned_to;
      if (budgetData.notes !== undefined) updateData.notes = budgetData.notes;
      if (budgetData.attachments !== undefined) updateData.attachments = budgetData.attachments;

      const { data, error } = await supabase
        .from('budgets')
        .update(updateData)
        .eq('id', budgetId)
        .select()
        .single();

      if (error) {
        console.error('Error updating budget:', error);
        throw new Error(`Failed to update budget: ${error.message}`);
      }

      console.log('Budget updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in updateBudget:', error);
      throw error;
    }
  },

  // Get budgets with error handling
  getBudgets: async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching budgets:', error);
        throw new Error(`Failed to fetch budgets: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBudgets:', error);
      throw error;
    }
  }
};
