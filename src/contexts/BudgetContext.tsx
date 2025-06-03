
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sampleBudgets } from '@/data/sampleBudgetData';

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
  created_by: string;
  created_at: string;
}

interface BudgetContextType {
  budgets: Budget[];
  loading: boolean;
  refreshBudgets: () => Promise<void>;
  getTotalBudget: () => number;
  getUtilizedBudget: () => number;
  getPendingBudget: () => number;
  getAvailableBudget: () => number;
  getUtilizationPercentage: () => number;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const useBudgetContext = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgetContext must be used within a BudgetProvider');
  }
  return context;
};

interface BudgetProviderProps {
  children: ReactNode;
}

export const BudgetProvider = ({ children }: BudgetProviderProps) => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBudgets = async () => {
    console.log('BudgetContext: Loading budgets...');
    try {
      // First try to load from Supabase
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('BudgetContext: Supabase response:', { data, error });

      if (error) {
        console.log('BudgetContext: Supabase error, using sample data:', error);
        setBudgets(sampleBudgets as Budget[]);
      } else if (data && data.length > 0) {
        // Transform the data to match our interface
        const transformedBudgets: Budget[] = data.map(budget => ({
          ...budget,
          attachments: Array.isArray(budget.attachments) ? budget.attachments : []
        }));
        console.log('BudgetContext: Using Supabase data:', transformedBudgets);
        setBudgets(transformedBudgets);
      } else {
        // If no data in Supabase, use sample data
        console.log('BudgetContext: No data in Supabase, using sample data');
        setBudgets(sampleBudgets as Budget[]);
      }
    } catch (error) {
      console.error('BudgetContext: Error loading budgets:', error);
      setBudgets(sampleBudgets as Budget[]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets();

    // Set up real-time subscription
    const channel = supabase
      .channel('budget-context-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'budgets' },
        (payload) => {
          console.log('BudgetContext: Budget change detected:', payload);
          loadBudgets(); // Reload data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getTotalBudget = () => {
    return budgets.reduce((sum, budget) => sum + budget.amount, 0);
  };

  const getUtilizedBudget = () => {
    // Consider active and completed budgets as utilized
    const utilizedBudgets = budgets.filter(b => 
      b.status === 'active' || b.status === 'completed'
    );
    return utilizedBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  };

  const getPendingBudget = () => {
    // Consider pending approval budgets
    const pendingBudgets = budgets.filter(b => b.status === 'pending_approval');
    return pendingBudgets.reduce((sum, budget) => sum + budget.amount, 0);
  };

  const getAvailableBudget = () => {
    // Available = Total - Utilized - Pending
    return getTotalBudget() - getUtilizedBudget() - getPendingBudget();
  };

  const getUtilizationPercentage = () => {
    const total = getTotalBudget();
    if (total === 0) return 0;
    return (getUtilizedBudget() / total) * 100;
  };

  const refreshBudgets = async () => {
    await loadBudgets();
  };

  const value: BudgetContextType = {
    budgets,
    loading,
    refreshBudgets,
    getTotalBudget,
    getUtilizedBudget,
    getPendingBudget,
    getAvailableBudget,
    getUtilizationPercentage
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};
