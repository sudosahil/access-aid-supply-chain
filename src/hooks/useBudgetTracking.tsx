
import { useState, useEffect } from 'react';
import { useBudgetContext } from '@/contexts/BudgetContext';

export interface BudgetUtilization {
  totalBudget: number;
  utilizedBudget: number;
  availableBudget: number;
  pendingBudget: number;
  utilizationPercentage: number;
  warningLevel: 'safe' | 'warning' | 'critical' | 'over';
  isOverBudget: boolean;
}

export const useBudgetTracking = (userId?: string) => {
  const { budgets, loading: budgetLoading } = useBudgetContext();
  const [budgetUtilization, setBudgetUtilization] = useState<BudgetUtilization>({
    totalBudget: 0,
    utilizedBudget: 0,
    availableBudget: 0,
    pendingBudget: 0,
    utilizationPercentage: 0,
    warningLevel: 'safe',
    isOverBudget: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (budgetLoading) return;

    const calculateUtilization = () => {
      let relevantBudgets = budgets;
      
      // Filter by user if userId is provided
      if (userId) {
        relevantBudgets = budgets.filter(b => 
          b.assigned_to === userId || b.created_by === userId
        );
      }

      const totalBudget = relevantBudgets.reduce((sum, budget) => sum + budget.amount, 0);
      const utilizedBudget = relevantBudgets
        .filter(b => b.status === 'active' || b.status === 'completed')
        .reduce((sum, budget) => sum + budget.amount, 0);
      const pendingBudget = relevantBudgets
        .filter(b => b.status === 'pending_approval')
        .reduce((sum, budget) => sum + budget.amount, 0);
      const availableBudget = totalBudget - utilizedBudget - pendingBudget;
      
      const utilizationPercentage = totalBudget > 0 ? (utilizedBudget / totalBudget) * 100 : 0;
      
      let warningLevel: 'safe' | 'warning' | 'critical' | 'over' = 'safe';
      if (utilizationPercentage >= 100) warningLevel = 'over';
      else if (utilizationPercentage >= 90) warningLevel = 'critical';
      else if (utilizationPercentage >= 75) warningLevel = 'warning';

      setBudgetUtilization({
        totalBudget,
        utilizedBudget,
        availableBudget,
        pendingBudget,
        utilizationPercentage,
        warningLevel,
        isOverBudget: utilizationPercentage >= 100
      });
    };

    calculateUtilization();
    setLoading(false);
  }, [budgets, userId, budgetLoading]);

  const getThresholdColor = (level: string) => {
    switch (level) {
      case 'over': return '#ef4444';
      case 'critical': return '#f97316';
      case 'warning': return '#eab308';
      default: return '#22c55e';
    }
  };

  return {
    budgetUtilization,
    loading,
    getThresholdColor
  };
};
