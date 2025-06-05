
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBudgetContext } from '@/contexts/BudgetContext';

export interface BudgetUtilization {
  totalBudget: number;
  utilizedBudget: number;
  pendingBudget: number;
  availableBudget: number;
  utilizationPercentage: number;
  isOverBudget: boolean;
  warningLevel: 'safe' | 'warning' | 'critical' | 'over';
}

export interface BudgetAlert {
  id: string;
  type: 'threshold' | 'exceeded' | 'updated';
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'error';
}

export const useBudgetTracking = (userId?: string) => {
  const [budgetUtilization, setBudgetUtilization] = useState<BudgetUtilization>({
    totalBudget: 0,
    utilizedBudget: 0,
    pendingBudget: 0,
    availableBudget: 0,
    utilizationPercentage: 0,
    isOverBudget: false,
    warningLevel: 'safe'
  });
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { budgets, getTotalBudget, getUtilizedBudget, getPendingBudget, getAvailableBudget } = useBudgetContext();

  useEffect(() => {
    calculateBudgetUtilization();
  }, [budgets]);

  useEffect(() => {
    // Set up real-time budget monitoring
    const channel = supabase
      .channel('budget-tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'budgets'
        },
        () => {
          console.log('Budget changed, recalculating utilization...');
          setTimeout(calculateBudgetUtilization, 100); // Small delay to ensure data consistency
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workflow_instances'
        },
        (payload) => {
          if (payload.new && typeof payload.new === 'object' && 'status' in payload.new && payload.new.status === 'approved') {
            console.log('Workflow approved, updating budget utilization...');
            setTimeout(calculateBudgetUtilization, 100);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const calculateBudgetUtilization = async () => {
    try {
      const total = getTotalBudget();
      const utilized = getUtilizedBudget();
      const pending = getPendingBudget();
      const available = getAvailableBudget();
      const percentage = total > 0 ? (utilized / total) * 100 : 0;
      
      const isOverBudget = utilized > total;
      let warningLevel: 'safe' | 'warning' | 'critical' | 'over' = 'safe';
      
      if (isOverBudget) {
        warningLevel = 'over';
      } else if (percentage >= 90) {
        warningLevel = 'critical';
      } else if (percentage >= 75) {
        warningLevel = 'warning';
      }

      const newUtilization: BudgetUtilization = {
        totalBudget: total,
        utilizedBudget: utilized,
        pendingBudget: pending,
        availableBudget: available,
        utilizationPercentage: percentage,
        isOverBudget,
        warningLevel
      };

      // Check for threshold alerts
      const previousPercentage = budgetUtilization.utilizationPercentage;
      checkForThresholdAlerts(percentage, previousPercentage, warningLevel);

      setBudgetUtilization(newUtilization);
    } catch (error) {
      console.error('Error calculating budget utilization:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForThresholdAlerts = (
    currentPercentage: number, 
    previousPercentage: number, 
    warningLevel: string
  ) => {
    const alerts: BudgetAlert[] = [];

    // 75% threshold alert
    if (currentPercentage >= 75 && previousPercentage < 75) {
      alerts.push({
        id: `threshold-75-${Date.now()}`,
        type: 'threshold',
        message: 'Budget utilization reached 75% - Consider reviewing spending',
        timestamp: new Date().toISOString(),
        severity: 'warning'
      });
    }

    // 90% threshold alert
    if (currentPercentage >= 90 && previousPercentage < 90) {
      alerts.push({
        id: `threshold-90-${Date.now()}`,
        type: 'threshold',
        message: 'Budget utilization reached 90% - Immediate attention required',
        timestamp: new Date().toISOString(),
        severity: 'error'
      });
    }

    // Over budget alert
    if (warningLevel === 'over' && budgetUtilization.warningLevel !== 'over') {
      alerts.push({
        id: `exceeded-${Date.now()}`,
        type: 'exceeded',
        message: 'Budget exceeded! New requests will be blocked',
        timestamp: new Date().toISOString(),
        severity: 'error'
      });
    }

    if (alerts.length > 0) {
      setAlerts(prev => [...alerts, ...prev.slice(0, 9)]); // Keep last 10 alerts
    }
  };

  const canSubmitRequest = (requestAmount: number): boolean => {
    return budgetUtilization.availableBudget >= requestAmount && !budgetUtilization.isOverBudget;
  };

  const getRemainingBudget = (): number => {
    return Math.max(0, budgetUtilization.availableBudget);
  };

  const getThresholdColor = (warningLevel: string): string => {
    switch (warningLevel) {
      case 'over':
        return 'rgb(239, 68, 68)'; // red-500
      case 'critical':
        return 'rgb(245, 158, 11)'; // amber-500
      case 'warning':
        return 'rgb(251, 191, 36)'; // amber-400
      default:
        return 'rgb(34, 197, 94)'; // green-500
    }
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return {
    budgetUtilization,
    alerts,
    loading,
    canSubmitRequest,
    getRemainingBudget,
    getThresholdColor,
    clearAlerts,
    refreshBudgetData: calculateBudgetUtilization
  };
};
