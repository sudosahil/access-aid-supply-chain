
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, FileText, Users, TrendingUp, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import { ProfileManagement } from '@/components/common/ProfileManagement';
import { RFQManagement } from '@/components/rfq/RFQManagement';
import { MessagingSystem } from '@/components/messaging/MessagingSystem';
import { AuditLogs } from '@/components/audit/AuditLogs';
import { BidManagement } from '@/components/staff/BidManagement';
import { SupplierManagement } from '@/components/staff/SupplierManagement';
import { InventoryManagement } from '@/components/staff/InventoryManagement';
import { WarehouseManagement } from '@/components/staff/WarehouseManagement';
import { BudgetOverview } from '@/components/staff/BudgetOverview';
import { User, mockInventoryItems, mockRFQs, mockPurchaseOrders } from '@/data/mockData';

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
}

export const StaffDashboard = ({ user, onLogout }: StaffDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = {
    openRFQs: mockRFQs.filter(r => r.status === 'published').length,
    pendingPOs: mockPurchaseOrders.filter(po => po.status === 'draft').length,
    lowStockItems: mockInventoryItems.filter(i => i.currentStock <= i.reorderLevel).length,
    completedTasks: 24
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Staff Dashboard';
      case 'rfqs': return 'RFQ Management';
      case 'bids': return 'Bid Evaluation';
      case 'suppliers': return 'Supplier Management';
      case 'inventory': return 'Inventory Management';
      case 'warehouses': return 'Warehouse Coordination';
      case 'messaging': return 'Messaging System';
      case 'audit': return 'Audit Logs';
      case 'budgets': return 'Budget Overview';
      case 'profile': return 'Profile Management';
      default: return 'Staff Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Open RFQs</p>
                      <p className="text-2xl font-bold">{stats.openRFQs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending POs</p>
                      <p className="text-2xl font-bold">{stats.pendingPOs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                      <p className="text-2xl font-bold">{stats.lowStockItems}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Completed Tasks</p>
                      <p className="text-2xl font-bold">{stats.completedTasks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Priorities</CardTitle>
                  <CardDescription>Tasks requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-sm">Review bids for Electric Wheelchairs RFQ</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <p className="text-sm">Approve pending purchase orders</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm">Update inventory levels for low stock items</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm">Generate monthly procurement report</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common staff tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('rfqs')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Create New RFQ
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('bids')}>
                    <Users className="h-4 w-4 mr-2" />
                    Evaluate Bids
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('budgets')}>
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Budget Overview
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('messaging')}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Messages
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'rfqs':
        return <RFQManagement />;
      case 'bids':
        return <BidManagement />;
      case 'suppliers':
        return <SupplierManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'warehouses':
        return <WarehouseManagement />;
      case 'messaging':
        return <MessagingSystem 
          currentUserId={user.id}
          currentUserName={user.name}
          currentUserRole={user.role}
        />;
      case 'audit':
        return <AuditLogs />;
      case 'budgets':
        return <BudgetOverview />;
      case 'profile':
        return <ProfileManagement user={user} />;
      default:
        return null;
    }
  };

  return (
    <MainLayout 
      user={user} 
      onLogout={onLogout} 
      title={getPageTitle()}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {renderContent()}
    </MainLayout>
  );
};
