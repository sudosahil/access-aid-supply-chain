import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, TrendingUp, AlertTriangle, Truck, FileText, MessageSquare, Plus } from 'lucide-react';
import { WarehouseInventory } from '@/components/warehouse/WarehouseInventory';
import { TransferRequests } from '@/components/warehouse/TransferRequests';
import { ProfileManagement } from '@/components/common/ProfileManagement';
import { MessagingSystem } from '@/components/messaging/MessagingSystem';
import { InventoryRequestModal } from '@/components/warehouse/InventoryRequestModal';

interface WarehouseDashboardProps {
  user: any;
  onLogout: () => void;
}

export const WarehouseDashboard = ({ user, onLogout }: WarehouseDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const stats = {
    totalItems: 156,
    lowStockItems: 8,
    pendingTransfers: 5,
    completedToday: 12
  };

  // Get warehouse info from user data
  const warehouseId = user.organization || 'WH-001'; // Fallback to default warehouse
  const warehouseName = user.organization || 'Main Warehouse';

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return `${warehouseName} - Dashboard`;
      case 'inventory': return 'Warehouse Inventory';
      case 'transfers': return 'Transfer Requests';
      case 'messaging': return 'Messaging System';
      case 'profile': return 'Profile Management';
      default: return 'Warehouse Dashboard';
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
                    <Package className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Items</p>
                      <p className="text-2xl font-bold">{stats.totalItems}</p>
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
                    <Truck className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Transfers</p>
                      <p className="text-2xl font-bold">{stats.pendingTransfers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Completed Today</p>
                      <p className="text-2xl font-bold">{stats.completedToday}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Today's Tasks</CardTitle>
                  <CardDescription>Items requiring immediate attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <p className="text-sm">Process incoming shipment - Electric Wheelchairs</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <p className="text-sm">Transfer request: 5 Prosthetic Limbs to Warehouse B</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm">Update stock levels for Hearing Aids</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm">Quality check on new inventory batch</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common warehouse tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('inventory')}>
                    <Package className="h-4 w-4 mr-2" />
                    Manage Inventory
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('transfers')}>
                    <Truck className="h-4 w-4 mr-2" />
                    Process Transfers
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setIsRequestModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Request Inventory
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('messaging')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Check Messages
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'inventory':
        return <WarehouseInventory warehouseId={warehouseId} />;
      case 'transfers':
        return <TransferRequests warehouseId={warehouseId} />;
      case 'messaging':
        return <MessagingSystem 
          currentUserId={user.id}
          currentUserName={user.name}
          currentUserRole={user.role}
        />;
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
      
      <InventoryRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        warehouseId={warehouseId}
        warehouseName={warehouseName}
      />
    </MainLayout>
  );
};
