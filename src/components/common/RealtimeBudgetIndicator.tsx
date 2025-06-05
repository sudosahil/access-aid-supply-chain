
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, AlertTriangle, Lock } from 'lucide-react';
import { useBudgetTracking } from '@/hooks/useBudgetTracking';

interface RealtimeBudgetIndicatorProps {
  userId?: string;
  compact?: boolean;
}

export const RealtimeBudgetIndicator = ({ userId, compact = false }: RealtimeBudgetIndicatorProps) => {
  const { budgetUtilization, loading, getThresholdColor } = useBudgetTracking(userId);

  if (loading) {
    return (
      <Card className={compact ? "p-3" : "p-4"}>
        <CardContent className="p-0">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 1000).toFixed(0)}k`;
  };

  const getWarningIcon = () => {
    switch (budgetUtilization.warningLevel) {
      case 'over':
        return <Lock className="h-4 w-4 text-red-500" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'warning':
        return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (budgetUtilization.warningLevel) {
      case 'over':
        return 'Budget Exceeded - Requests Blocked';
      case 'critical':
        return 'Critical - Immediate Action Required';
      case 'warning':
        return 'Warning - Monitor Spending';
      default:
        return 'Budget Status Healthy';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
        {getWarningIcon()}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Budget</span>
            <Badge 
              variant={budgetUtilization.warningLevel === 'safe' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {budgetUtilization.utilizationPercentage.toFixed(0)}%
            </Badge>
          </div>
          <Progress 
            value={budgetUtilization.utilizationPercentage} 
            className="h-2"
            style={{
              '--progress-background': getThresholdColor(budgetUtilization.warningLevel)
            } as React.CSSProperties}
          />
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {getWarningIcon()}
            <h3 className="font-semibold">Real-time Budget Tracking</h3>
          </div>
          <Badge 
            variant={
              budgetUtilization.warningLevel === 'over' ? 'destructive' :
              budgetUtilization.warningLevel === 'critical' ? 'destructive' :
              budgetUtilization.warningLevel === 'warning' ? 'secondary' : 'default'
            }
          >
            {getStatusMessage()}
          </Badge>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(budgetUtilization.totalBudget)}
              </div>
              <div className="text-sm text-blue-600">Total Budget</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(budgetUtilization.availableBudget)}
              </div>
              <div className="text-sm text-green-600">Available</div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Utilization: {budgetUtilization.utilizationPercentage.toFixed(1)}%</span>
              <span>{formatCurrency(budgetUtilization.utilizedBudget)} used</span>
            </div>
            <Progress 
              value={budgetUtilization.utilizationPercentage} 
              className="h-3"
              style={{
                '--progress-background': getThresholdColor(budgetUtilization.warningLevel)
              } as React.CSSProperties}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="text-yellow-600">75%</span>
              <span className="text-orange-600">90%</span>
              <span>100%</span>
            </div>
          </div>

          {budgetUtilization.pendingBudget > 0 && (
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {formatCurrency(budgetUtilization.pendingBudget)} pending approval
                </span>
              </div>
            </div>
          )}

          {budgetUtilization.isOverBudget && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  New requests are blocked until budget is available
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
