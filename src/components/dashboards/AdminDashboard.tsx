
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  Package, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
  GitBranch,
  CheckSquare
} from 'lucide-react';
import { BudgetButton } from '@/components/common/BudgetButton';

interface AdminDashboardProps {
  onTabChange: (tab: string) => void;
}

export const AdminDashboard = ({ onTabChange }: AdminDashboardProps) => {
  const stats = [
    { title: 'Active Users', value: '127', icon: Users, color: 'text-blue-600' },
    { title: 'Pending RFQs', value: '23', icon: FileText, color: 'text-orange-600' },
    { title: 'Low Stock Items', value: '8', icon: Package, color: 'text-red-600' },
    { title: 'Monthly Savings', value: '₹2.4M', icon: TrendingUp, color: 'text-green-600' },
  ];

  const quickActions = [
    { 
      title: 'User Management', 
      description: 'Manage user accounts and permissions',
      icon: Users,
      action: () => onTabChange('users'),
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      title: 'Budget Management', 
      description: 'Monitor and control organizational budgets',
      icon: DollarSign,
      action: () => onTabChange('budgets'),
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      title: 'Approval Workflows', 
      description: 'Configure approval processes',
      icon: GitBranch,
      action: () => onTabChange('approval-workflows'),
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      title: 'Approval Dashboard', 
      description: 'Monitor real-time approval status',
      icon: CheckSquare,
      action: () => onTabChange('approval-dashboard'),
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    { 
      title: 'Supplier Management', 
      description: 'Manage supplier relationships',
      icon: Building,
      action: () => onTabChange('suppliers'),
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    { 
      title: 'System Reports', 
      description: 'Generate comprehensive reports',
      icon: FileText,
      action: () => onTabChange('reports'),
      color: 'bg-gray-50 text-gray-700 border-gray-200'
    }
  ];

  const recentActivities = [
    { type: 'approval', message: 'Budget approval completed for Marketing Campaign', time: '2 hours ago', status: 'approved' },
    { type: 'user', message: 'New contractor registered: TechBuild Solutions', time: '4 hours ago', status: 'pending' },
    { type: 'rfq', message: 'RFQ-2024-001 published for IT Equipment', time: '6 hours ago', status: 'active' },
    { type: 'budget', message: 'Q3 Budget allocation updated', time: '1 day ago', status: 'completed' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'rfq': return <FileText className="h-4 w-4 text-orange-500" />;
      case 'budget': return <DollarSign className="h-4 w-4 text-purple-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-purple-100 text-purple-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your organization.</p>
        </div>
        <div className="flex gap-2">
          <BudgetButton userRole="admin" onViewBudgets={() => onTabChange('budgets')} />
          <Button onClick={() => onTabChange('approval-dashboard')} className="bg-indigo-600 hover:bg-indigo-700">
            <CheckSquare className="h-4 w-4 mr-2" />
            Approval Dashboard
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used administrative functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className={`cursor-pointer hover:shadow-md transition-all border-2 ${action.color}`} onClick={action.action}>
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <action.icon className="h-6 w-6 mt-1" />
                    <div>
                      <h3 className="font-semibold">{action.title}</h3>
                      <p className="text-sm opacity-75 mt-1">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <p className="font-medium text-red-800">8 items below reorder level</p>
                <p className="text-sm text-red-600">Immediate restocking required</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onTabChange('inventory')}>
                View
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div>
                <p className="font-medium text-yellow-800">3 pending user approvals</p>
                <p className="text-sm text-yellow-600">New contractor registrations</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onTabChange('users')}>
                Review
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <p className="font-medium text-blue-800">5 budget approvals pending</p>
                <p className="text-sm text-blue-600">Requires immediate attention</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => onTabChange('approval-dashboard')}>
                Review
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest system activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge className={getStatusBadge(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
