
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, Package, MessageSquare, TrendingUp, DollarSign, CheckCircle, Clock } from 'lucide-react';
import { BudgetButton } from '@/components/common/BudgetButton';
import { ApprovalManagement } from '@/components/admin/ApprovalManagement';
import { TransferTrackingDashboard } from '@/components/admin/TransferTrackingDashboard';
import { LiveBidViewing } from '@/components/contractor/LiveBidViewing';

interface AdminDashboardProps {
  user: any;
  onTabChange: (tab: string) => void;
}

export const AdminDashboard = ({ user, onTabChange }: AdminDashboardProps) => {
  const [activeView, setActiveView] = useState('overview');

  const dashboardStats = {
    users: 45,
    activeRfqs: 12,
    pendingApprovals: 8,
    totalBudget: 2500000,
    utilizationRate: 68,
    activeBids: 23,
    transfers: 15,
    completedTransfers: 142
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'approvals':
        return <ApprovalManagement currentUserId={user.id} currentUserName={user.name} />;
      case 'transfers':
        return <TransferTrackingDashboard />;
      case 'live-bids':
        return <LiveBidViewing />;
      default:
        return (
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used administrative functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button onClick={() => setActiveView('approvals')} className="h-20 flex-col">
                    <CheckCircle className="h-6 w-6 mb-2" />
                    Approvals
                    {dashboardStats.pendingApprovals > 0 && (
                      <Badge variant="destructive" className="mt-1">
                        {dashboardStats.pendingApprovals}
                      </Badge>
                    )}
                  </Button>
                  <Button onClick={() => setActiveView('transfers')} variant="outline" className="h-20 flex-col">
                    <Package className="h-6 w-6 mb-2" />
                    Transfer Tracking
                  </Button>
                  <Button onClick={() => setActiveView('live-bids')} variant="outline" className="h-20 flex-col">
                    <TrendingUp className="h-6 w-6 mb-2" />
                    Live Bids
                  </Button>
                  <BudgetButton 
                    userRole={user.role} 
                    onViewBudgets={() => onTabChange('budgets')} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold">{dashboardStats.users}</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active RFQs</p>
                      <p className="text-3xl font-bold">{dashboardStats.activeRfqs}</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Live Bids</p>
                      <p className="text-3xl font-bold">{dashboardStats.activeBids}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                      <p className="text-3xl font-bold">{dashboardStats.utilizationRate}%</p>
                    </div>
                    <DollarSign className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Approvals Summary */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>Items requiring immediate attention</CardDescription>
                  </div>
                  <Button onClick={() => setActiveView('approvals')}>
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending RFQs</p>
                        <p className="text-2xl font-bold">5</p>
                      </div>
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Pending Bids</p>
                        <p className="text-2xl font-bold">3</p>
                      </div>
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Transfer Requests</p>
                        <p className="text-2xl font-bold">2</p>
                      </div>
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={activeView === 'approvals' ? 'default' : 'outline'}
            onClick={() => setActiveView('approvals')}
          >
            Approvals
            {dashboardStats.pendingApprovals > 0 && (
              <Badge variant="destructive" className="ml-2">
                {dashboardStats.pendingApprovals}
              </Badge>
            )}
          </Button>
          <Button 
            variant={activeView === 'transfers' ? 'default' : 'outline'}
            onClick={() => setActiveView('transfers')}
          >
            Transfers
          </Button>
          <Button 
            variant={activeView === 'live-bids' ? 'default' : 'outline'}
            onClick={() => setActiveView('live-bids')}
          >
            Live Bids
          </Button>
        </div>
      </div>

      {renderActiveView()}
    </div>
  );
};
