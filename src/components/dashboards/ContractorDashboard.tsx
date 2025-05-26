import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ClipboardList, MessageSquare, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { AvailableRFQs } from '@/components/contractor/AvailableRFQs';
import { MyBids } from '@/components/contractor/MyBids';
import { MyContracts } from '@/components/contractor/MyContracts';
import { InvoiceManagement } from '@/components/contractor/InvoiceManagement';
import { ContractorNotifications } from '@/components/contractor/ContractorNotifications';
import { ProfileManagement } from '@/components/common/ProfileManagement';
import { MessagingSystem } from '@/components/messaging/MessagingSystem';
import { User } from '@/data/mockData';

interface ContractorDashboardProps {
  user: User;
  onLogout: () => void;
}

export const ContractorDashboard = ({ user, onLogout }: ContractorDashboardProps) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = {
    availableRFQs: 12,
    activeBids: 8,
    wonContracts: 15,
    totalEarnings: 2500000
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Contractor Dashboard';
      case 'rfqs': return 'Available RFQs';
      case 'bids': return 'My Bids';
      case 'messaging': return 'Messaging System';
      case 'profile': return 'Profile Management';
      default: return 'Contractor Dashboard';
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
                      <p className="text-sm font-medium text-gray-600">Available RFQs</p>
                      <p className="text-2xl font-bold">{stats.availableRFQs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ClipboardList className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Bids</p>
                      <p className="text-2xl font-bold">{stats.activeBids}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Won Contracts</p>
                      <p className="text-2xl font-bold">{stats.wonContracts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold">₹{(stats.totalEarnings / 100000).toFixed(1)}L</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Opportunities</CardTitle>
                  <CardDescription>Latest RFQs matching your profile</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Electric Wheelchairs Procurement</p>
                        <p className="text-xs text-gray-500">Budget: ₹5,00,000 • Deadline: 2 days</p>
                      </div>
                      <Clock className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Prosthetic Limbs Supply</p>
                        <p className="text-xs text-gray-500">Budget: ₹7,50,000 • Deadline: 5 days</p>
                      </div>
                      <Clock className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Medical Equipment Maintenance</p>
                        <p className="text-xs text-gray-500">Budget: ₹3,00,000 • Deadline: 1 week</p>
                      </div>
                      <Clock className="h-4 w-4 text-green-500" />
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
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('rfqs')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Available RFQs
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('bids')}>
                    <ClipboardList className="h-4 w-4 mr-2" />
                    Manage My Bids
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('messaging')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Check Messages
                  </Button>
                  <Button className="w-full justify-start" variant="outline" onClick={() => setActiveTab('profile')}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Update Profile
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
    </MainLayout>
  );
};
