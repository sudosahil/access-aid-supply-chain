
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Truck, AlertTriangle, CheckCircle, Plus, TrendingUp } from 'lucide-react';
import { BudgetButton } from '@/components/common/BudgetButton';
import { WarehouseInventory } from '@/components/warehouse/WarehouseInventory';
import { EnhancedTransferRequests } from '@/components/warehouse/EnhancedTransferRequests';

interface WarehouseDashboardProps {
  user: any;
  onLogout: () => void;
  onTabChange?: (tab: string) => void;
}

export const WarehouseDashboard = ({ user, onLogout, onTabChange }: WarehouseDashboardProps) => {
  const [activeView, setActiveView] = useState('overview');

  // Mock warehouse stats - in real implementation, this would come from props or API
  const warehouseStats = {
    totalItems: 156,
    lowStockItems: 8,
    pendingTransfers: 5,
    completedTransfers: 23,
    incomingTransfers: 3,
    inventoryValue: 1250000
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'inventory':
        return <WarehouseInventory warehouseId={user.warehouse_id || 'warehouse-a'} />;
      case 'transfers':
        return (
          <EnhancedTransferRequests 
            warehouseId={user.warehouse_id || 'warehouse-a'}
            currentUserId={user.id}
            currentUserName={user.name}
          />
        );
      default:
        return (
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Essential warehouse management tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button onClick={() => setActiveView('inventory')} className="h-20 flex-col">
                    <Package className="h-6 w-6 mb-2" />
                    Inventory
                    {warehouseStats.lowStockItems > 0 && (
                      <Badge variant="destructive" className="mt-1">
                        {warehouseStats.lowStockItems} low
                      </Badge>
                    )}
                  </Button>
                  <Button onClick={() => setActiveView('transfers')} variant="outline" className="h-20 flex-col">
                    <Truck className="h-6 w-6 mb-2" />
                    Transfers
                    {warehouseStats.pendingTransfers > 0 && (
                      <Badge variant="secondary" className="mt-1">
                        {warehouseStats.pendingTransfers} pending
                      </Badge>
                    )}
                  </Button>
                  <Button 
                    onClick={() => setActiveView('transfers')} 
                    variant="default" 
                    className="h-20 flex-col bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    Generate Transfer Request
                  </Button>
                  <BudgetButton 
                    userRole={user.role} 
                    onViewBudgets={() => onTabChange && onTabChange('budgets')} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Warehouse Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Items</p>
                      <p className="text-3xl font-bold">{warehouseStats.totalItems}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                      <p className="text-3xl font-bold text-red-600">{warehouseStats.lowStockItems}</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Transfers</p>
                      <p className="text-3xl font-bold">{warehouseStats.pendingTransfers}</p>
                    </div>
                    <Truck className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Inventory Value</p>
                      <p className="text-2xl font-bold">₹{warehouseStats.inventoryValue.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Incoming Transfers Section */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Incoming Transfers</CardTitle>
                    <CardDescription>Transfers awaiting your approval or confirmation</CardDescription>
                  </div>
                  <Button onClick={() => setActiveView('transfers')}>
                    Manage All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Awaiting Approval</p>
                        <p className="text-2xl font-bold">2</p>
                      </div>
                      <CheckCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">In Transit</p>
                        <p className="text-2xl font-bold">1</p>
                      </div>
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Ready for Receipt</p>
                        <p className="text-2xl font-bold">{warehouseStats.incomingTransfers}</p>
                      </div>
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest warehouse operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-medium">Transfer completed</p>
                      <p className="text-sm text-gray-600">Electric Wheelchair - 5 units to Warehouse B</p>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium">Inventory updated</p>
                      <p className="text-sm text-gray-600">Prosthetic Leg restocked - 10 units</p>
                    </div>
                    <span className="text-sm text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <div className="flex-1">
                      <p className="font-medium">Low stock alert</p>
                      <p className="text-sm text-gray-600">Hearing Aid Digital - 3 units remaining</p>
                    </div>
                    <span className="text-sm text-gray-500">6 hours ago</span>
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
        <h1 className="text-3xl font-bold">Warehouse Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
          >
            Overview
          </Button>
          <Button 
            variant={activeView === 'inventory' ? 'default' : 'outline'}
            onClick={() => setActiveView('inventory')}
          >
            Inventory
          </Button>
          <Button 
            variant={activeView === 'transfers' ? 'default' : 'outline'}
            onClick={() => setActiveView('transfers')}
          >
            Transfers
            {warehouseStats.pendingTransfers > 0 && (
              <Badge variant="secondary" className="ml-2">
                {warehouseStats.pendingTransfers}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {renderActiveView()}
    </div>
  );
};
