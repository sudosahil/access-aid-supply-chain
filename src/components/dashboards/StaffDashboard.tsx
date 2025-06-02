
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, Package, MessageSquare, DollarSign, Users, TrendingUp } from 'lucide-react';
import { BudgetButton } from '@/components/common/BudgetButton';

interface StaffDashboardProps {
  user: any;
  onTabChange: (tab: string) => void;
}

export const StaffDashboard = ({ user, onTabChange }: StaffDashboardProps) => {
  // Mock staff stats
  const staffStats = {
    activeRfqs: 6,
    pendingBids: 15,
    managedInventory: 230,
    budgetUtilization: 68,
    suppliers: 25,
    warehouses: 4
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Staff Dashboard</h1>
        <BudgetButton 
          userRole={user.role} 
          onViewBudgets={() => onTabChange('budgets')} 
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Essential staff management functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={() => onTabChange('rfqs')} className="h-20 flex-col">
              <FileText className="h-6 w-6 mb-2" />
              Manage RFQs
              <Badge variant="default" className="mt-1">
                {staffStats.activeRfqs}
              </Badge>
            </Button>
            <Button onClick={() => onTabChange('bids')} variant="outline" className="h-20 flex-col">
              <Eye className="h-6 w-6 mb-2" />
              Review Bids
              {staffStats.pendingBids > 0 && (
                <Badge variant="secondary" className="mt-1">
                  {staffStats.pendingBids} pending
                </Badge>
              )}
            </Button>
            <Button onClick={() => onTabChange('inventory')} variant="outline" className="h-20 flex-col">
              <Package className="h-6 w-6 mb-2" />
              Inventory
              <Badge variant="outline" className="mt-1">
                {staffStats.managedInventory} items
              </Badge>
            </Button>
            <Button onClick={() => onTabChange('suppliers')} variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Suppliers
              <Badge variant="outline" className="mt-1">
                {staffStats.suppliers}
              </Badge>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staff Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active RFQs</p>
                <p className="text-3xl font-bold">{staffStats.activeRfqs}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Bids</p>
                <p className="text-3xl font-bold">{staffStats.pendingBids}</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Managed Items</p>
                <p className="text-3xl font-bold">{staffStats.managedInventory}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Usage</p>
                <p className="text-3xl font-bold">{staffStats.budgetUtilization}%</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest staff activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">RFQ created</p>
                <p className="text-sm text-gray-600">Emergency Medical Supplies - Budget: ₹5,00,000</p>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Eye className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">Bid approved</p>
                <p className="text-sm text-gray-600">Wheelchair procurement - TechCare Solutions</p>
              </div>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Package className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <p className="font-medium">Inventory updated</p>
                <p className="text-sm text-gray-600">Prosthetic limbs stock levels adjusted</p>
              </div>
              <span className="text-sm text-gray-500">6 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
