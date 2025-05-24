
import { useState } from 'react';
import { Layout } from '@/components/common/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Award, DollarSign, Bell, Upload } from 'lucide-react';
import { AvailableRFQs } from '@/components/contractor/AvailableRFQs';
import { MyBids } from '@/components/contractor/MyBids';
import { MyContracts } from '@/components/contractor/MyContracts';
import { InvoiceManagement } from '@/components/contractor/InvoiceManagement';
import { ContractorNotifications } from '@/components/contractor/ContractorNotifications';
import { ProfileManagement } from '@/components/common/ProfileManagement';
import { User, mockRFQs, mockBids, mockContracts, mockInvoices } from '@/data/mockData';

interface ContractorDashboardProps {
  user: User;
  onLogout: () => void;
}

export const ContractorDashboard = ({ user, onLogout }: ContractorDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const userBids = mockBids.filter(b => b.contractorId === user.id);
  const userContracts = mockContracts.filter(c => c.contractorId === user.id);
  const userInvoices = mockInvoices.filter(i => i.contractorId === user.id);

  const stats = {
    openRFQs: mockRFQs.filter(r => r.status === 'published').length,
    myBids: userBids.length,
    activeContracts: userContracts.filter(c => c.status === 'active').length,
    pendingInvoices: userInvoices.filter(i => i.status === 'pending').length
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
                    <FileText className="h-8 w-8 text-blue-800" />
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
                    <Upload className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">My Bids</p>
                      <p className="text-2xl font-bold">{stats.myBids}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-slate-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                      <p className="text-2xl font-bold">{stats.activeContracts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-slate-700" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Pending Invoices</p>
                      <p className="text-2xl font-bold">{stats.pendingInvoices}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your recent bidding and contract activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm">Submitted bid for electric wheelchairs</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm">Contract awarded for hearing aid services</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                      <p className="text-sm">Invoice submitted for therapy equipment</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      <p className="text-sm">New RFQ notification received</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common contractor tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    View Open RFQs
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Submit New Bid
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Upload Invoice
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Check Notifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'rfqs':
        return <AvailableRFQs contractorId={user.id} />;
      case 'bids':
        return <MyBids contractorId={user.id} />;
      case 'contracts':
        return <MyContracts contractorId={user.id} />;
      case 'invoices':
        return <InvoiceManagement contractorId={user.id} />;
      case 'notifications':
        return <ContractorNotifications contractorId={user.id} />;
      case 'profile':
        return <ProfileManagement user={user} />;
      default:
        return null;
    }
  };

  return (
    <Layout user={user} onLogout={onLogout} title="Contractor Dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="rfqs">RFQs</TabsTrigger>
          <TabsTrigger value="bids">My Bids</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {renderContent()}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};
