
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, FileText, Settings, TrendingUp, AlertTriangle } from 'lucide-react';
import { UserManagement } from '@/components/admin/UserManagement';
import { SupplierApproval } from '@/components/admin/SupplierApproval';
import { SystemConfig } from '@/components/admin/SystemConfig';
import { AdminReports } from '@/components/admin/AdminReports';
import { ProfileManagement } from '@/components/common/ProfileManagement';
import { RFQManagement } from '@/components/rfq/RFQManagement';
import { MessagingSystem } from '@/components/messaging/MessagingSystem';
import { AuditLogs } from '@/components/audit/AuditLogs';
import { BidManagement } from '@/components/staff/BidManagement';
import { SupplierManagement } from '@/components/staff/SupplierManagement';
import { InventoryManagement } from '@/components/staff/InventoryManagement';
import { WarehouseManagement } from '@/components/staff/WarehouseManagement';
import { User, mockUsers, mockSuppliers, mockInventoryItems, mockRFQs } from '@/data/mockData';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const AdminDashboard = ({ user, onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = {
    totalUsers: mockUsers.length,
    activeSuppliers: mockSuppliers.filter(s => s.status === 'approved').length,
    lowStockItems: mockInventoryItems.filter(i => i.currentStock <= i.reorderLevel).length,
    openRFQs: mockRFQs.filter(r => r.status === 'published').length
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Administrator Dashboard';
      case 'rfqs': return 'RFQ Management';
      case 'bids': return 'Bid Management';
      case 'suppliers': return 'Supplier Management';
      case 'inventory': return 'Inventory Management';
      case 'warehouses': return 'Warehouse Management';
      case 'messaging': return 'Messaging System';
      case 'audit': return 'Audit Logs';
      case 'users': return 'User Management';
      case 'settings': return 'System Settings';
      case 'profile': return 'Profile Management';
      default: return 'Administrator Dashboard';
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
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold">{stats.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
                      <p className="text-2xl font-bold">{stats.activeSuppliers}</p>
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
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Open RFQs</p>
                      <p className="text-2xl font-bold">{stats.openRFQs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Latest system activities and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm">New supplier registration approved</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm">RFQ published for electric wheelchairs</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm">Low stock alert for prosthetic limbs</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-sm">New user account created</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('users')}>
                    <Users className="h-4 w-4 mr-2" />
                    Add New User
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('suppliers')}>
                    <Package className="h-4 w-4 mr-2" />
                    Review Supplier Applications
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('audit')}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Audit Logs
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure System Settings
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
        return <MessagingSystem />;
      case 'audit':
        return <AuditLogs />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <SystemConfig />;
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
