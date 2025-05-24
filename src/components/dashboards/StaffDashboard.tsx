import { useState } from 'react';
import { Layout } from '@/components/common/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, FileText, Users, ShoppingCart, FileCheck, Truck } from 'lucide-react';
import { SupplierManagement } from '@/components/staff/SupplierManagement';
import { RFQManagement } from '@/components/staff/RFQManagement';
import { BidEvaluation } from '@/components/staff/BidEvaluation';
import { PurchaseOrderManagement } from '@/components/staff/PurchaseOrderManagement';
import { ContractManagement } from '@/components/staff/ContractManagement';
import { InventoryManagement } from '@/components/staff/InventoryManagement';
import { AssetDistribution } from '@/components/staff/AssetDistribution';
import { StaffReports } from '@/components/staff/StaffReports';
import { ProfileManagement } from '@/components/common/ProfileManagement';
import { User, mockRFQs, mockBids, mockPurchaseOrders, mockInventoryItems } from '@/data/mockData';
interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
}
export const StaffDashboard = ({
  user,
  onLogout
}: StaffDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const stats = {
    activeRFQs: mockRFQs.filter(r => r.status === 'published').length,
    pendingBids: mockBids.filter(b => b.status === 'submitted').length,
    activePOs: mockPurchaseOrders.filter(p => p.status === 'approved').length,
    lowStockItems: mockInventoryItems.filter(i => i.currentStock <= i.reorderLevel).length
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 bg-slate-300">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active RFQs</p>
                      <p className="text-2xl font-bold">{stats.activeRFQs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 bg-slate-300">
                  <div className="flex items-center">
                    <FileCheck className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Bids</p>
                      <p className="text-2xl font-bold">{stats.pendingBids}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 bg-slate-300">
                  <div className="flex items-center">
                    <ShoppingCart className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active POs</p>
                      <p className="text-2xl font-bold">{stats.activePOs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 bg-slate-300">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Low Stock</p>
                      <p className="text-2xl font-bold">{stats.lowStockItems}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-300">
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription className="text-slate-950">Your recent procurement activities</CardDescription>
                </CardHeader>
                <CardContent className="bg-slate-300">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm">Created RFQ for electric wheelchairs</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm">Approved purchase order PO-2024-010</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm">Updated inventory for hearing aids</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <p className="text-sm">Distributed assets to rehabilitation center</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-300">
                <CardHeader className="bg-slate-300">
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription className="text-slate-950">Common procurement tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 bg-slate-300">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Create New RFQ
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Add New Supplier
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Package className="h-4 w-4 mr-2" />
                    Update Inventory
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Truck className="h-4 w-4 mr-2" />
                    Distribute Assets
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>;
      case 'suppliers':
        return <SupplierManagement />;
      case 'rfqs':
        return <RFQManagement />;
      case 'bids':
        return <BidEvaluation />;
      case 'pos':
        return <PurchaseOrderManagement />;
      case 'contracts':
        return <ContractManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'distribution':
        return <AssetDistribution />;
      case 'reports':
        return <StaffReports />;
      case 'profile':
        return <ProfileManagement user={user} />;
      default:
        return null;
    }
  };
  return <Layout user={user} onLogout={onLogout} title="Staff Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10">
          <TabsTrigger value="dashboard" className="text-slate-950 bg-slate-400 hover:bg-slate-300">Dashboard</TabsTrigger>
          <TabsTrigger value="suppliers" className="text-slate-950 bg-slate-400 hover:bg-slate-300">Suppliers</TabsTrigger>
          <TabsTrigger value="rfqs" className="bg-slate-400 hover:bg-slate-300 text-slate-950">RFQs</TabsTrigger>
          <TabsTrigger value="bids" className="bg-slate-400 hover:bg-slate-300 text-slate-950">Bids</TabsTrigger>
          <TabsTrigger value="pos" className="bg-slate-400 hover:bg-slate-300 text-slate-950">POs</TabsTrigger>
          <TabsTrigger value="contracts" className="bg-slate-400 hover:bg-slate-300 text-gray-950">Contracts</TabsTrigger>
          <TabsTrigger value="inventory" className="bg-slate-400 hover:bg-slate-300 text-gray-950">Inventory</TabsTrigger>
          <TabsTrigger value="distribution" className="bg-slate-400 hover:bg-slate-300 text-slate-950">Distribution</TabsTrigger>
          <TabsTrigger value="reports" className="bg-slate-400 hover:bg-slate-300 text-slate-950">Reports</TabsTrigger>
          <TabsTrigger value="profile" className="bg-slate-400 hover:bg-slate-300 text-slate-950">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </Layout>;
};