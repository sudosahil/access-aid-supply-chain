
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { useBudgetContext } from '@/contexts/BudgetContext';

interface BudgetButtonProps {
  userRole: string;
  onViewBudgets: () => void;
}

export const BudgetButton = ({ userRole, onViewBudgets }: BudgetButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    getTotalBudget, 
    getUtilizedBudget, 
    getPendingBudget, 
    getAvailableBudget, 
    getUtilizationPercentage,
    loading 
  } = useBudgetContext();

  const stats = {
    total: getTotalBudget(),
    utilized: getUtilizedBudget(),
    pending: getPendingBudget(),
    available: getAvailableBudget()
  };

  const utilizationPercentage = getUtilizationPercentage();

  const getBudgetStatusColor = () => {
    if (utilizationPercentage > 90) return 'text-red-600';
    if (utilizationPercentage > 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getBudgetStatusIcon = () => {
    if (utilizationPercentage > 90) return <AlertTriangle className="h-4 w-4" />;
    if (utilizationPercentage > 75) return <TrendingUp className="h-4 w-4" />;
    return <DollarSign className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Button variant="outline" disabled className="flex items-center gap-2">
        <DollarSign className="h-4 w-4" />
        Budget
        <Badge variant="secondary" className="ml-1">
          ...
        </Badge>
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center gap-2 ${getBudgetStatusColor()}`}
        >
          {getBudgetStatusIcon()}
          Budget
          <Badge 
            variant={utilizationPercentage > 90 ? "destructive" : 
                    utilizationPercentage > 75 ? "secondary" : "default"}
            className="ml-1"
          >
            {utilizationPercentage.toFixed(0)}%
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Budget Overview</DialogTitle>
          <DialogDescription>
            Current budget status and utilization
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold">₹{stats.total.toLocaleString()}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600">Utilized</p>
              <p className="text-2xl font-bold text-blue-600">₹{stats.utilized.toLocaleString()}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">₹{stats.pending.toLocaleString()}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-600">Available</p>
              <p className="text-2xl font-bold text-green-600">₹{stats.available.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full ${
                utilizationPercentage > 90 ? 'bg-red-600' :
                utilizationPercentage > 75 ? 'bg-yellow-600' : 'bg-green-600'
              }`}
              style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Budget Utilization: {utilizationPercentage.toFixed(1)}%</span>
            <span className={getBudgetStatusColor()}>
              {utilizationPercentage > 90 ? 'Critical' :
               utilizationPercentage > 75 ? 'Warning' : 'Healthy'}
            </span>
          </div>

          <Button 
            onClick={() => {
              onViewBudgets();
              setIsOpen(false);
            }}
            className="w-full"
          >
            View Detailed Budget Management
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
