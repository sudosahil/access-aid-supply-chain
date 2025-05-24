import { useState } from 'react';
import { Layout } from '@/components/common/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Package, FileText, Settings, TrendingUp, AlertTriangle } from 'lucide-react';
import { UserManagement } from '@/components/admin/UserManagement';
import { SupplierApproval } from '@/components/admin/SupplierApproval';
import { SystemConfig } from '@/components/admin/SystemConfig';
import { AdminReports } from '@/components/admin/AdminReports';
import { ProfileManagement } from '@/components/common/ProfileManagement';
import { User, mockUsers, mockSuppliers, mockInventoryItems, mockRFQs } from '@/data/mockData';
interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}
export const AdminDashboard = ({
  user,
  onLogout
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const stats = {
    totalUsers: mockUsers.length,
    activeSuppliers: mockSuppliers.filter(s => s.status === 'approved').length,
    lowStockItems: mockInventoryItems.filter(i => i.currentStock <= i.reorderLevel).length,
    openRFQs: mockRFQs.filter(r => r.status === 'published').length
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-800" />
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
                    <AlertTriangle className="h-8 w-8 text-slate-600" />
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
                    <FileText className="h-8 w-8 text-slate-700" />
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
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      <p className="text-sm">Low stock alert for prosthetic limbs</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
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
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Add New User
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Review Supplier Applications
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Generate System Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure System Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>;
      case 'users':
        return <UserManagement />;
      case 'suppliers':
        return <SupplierApproval />;
      case 'config':
        return <SystemConfig />;
      case 'reports':
        return <AdminReports />;
      case 'profile':
        return <ProfileManagement user={user} />;
      default:
        return null;
    }
  };
  return <Layout user={user} onLogout={onLogout} title="Administrator Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard" className="text-slate-950">Dashboard</TabsTrigger>
          <TabsTrigger value="users" className="text-slate-950">Users</TabsTrigger>
          <TabsTrigger value="suppliers" className="text-base text-slate-950">Suppliers</TabsTrigger>
          <TabsTrigger value="config" className="text-slate-950">Config</TabsTrigger>
          <TabsTrigger value="reports" className="text-slate-950">Reports</TabsTrigger>
          <TabsTrigger value="profile" className="text-gray-950">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </Layout>;
};