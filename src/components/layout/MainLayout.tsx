
import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { User } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogOut, Palette } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ThemeSelector } from '@/components/common/ThemeSelector';

// Import all the components that can be rendered based on active tab
import { ApprovalManagement } from '@/components/admin/ApprovalManagement';
import { ApprovalDashboard } from '@/components/admin/ApprovalDashboard';
import { TransferTrackingDashboard } from '@/components/admin/TransferTrackingDashboard';
import { LiveBidViewing } from '@/components/contractor/LiveBidViewing';
import { RFQManagement } from '@/components/staff/RFQManagement';
import { BidManagement } from '@/components/staff/BidManagement';
import { InventoryManagement } from '@/components/staff/InventoryManagement';
import { SupplierManagement } from '@/components/staff/SupplierManagement';
import { WarehouseInventory } from '@/components/warehouse/WarehouseInventory';
import { EnhancedTransferRequests } from '@/components/warehouse/EnhancedTransferRequests';
import { EnhancedMessagingSystem } from '@/components/messaging/EnhancedMessagingSystem';
import { AuditLogs } from '@/components/audit/AuditLogs';
import { UserManagement } from '@/components/admin/UserManagement';
import { BudgetManagement } from '@/components/admin/BudgetManagement';
import { AdminReports } from '@/components/admin/AdminReports';
import { ProfileManagement } from '@/components/common/ProfileManagement';
import { AvailableRFQs } from '@/components/contractor/AvailableRFQs';
import { MyBids } from '@/components/contractor/MyBids';
import { ApprovalWorkflows } from '@/components/admin/ApprovalWorkflows';
import { BudgetOverview } from '@/components/staff/BudgetOverview';

interface MainLayoutProps {
  children: ReactNode;
  user: User;
  onLogout: () => void;
  title: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MainLayout = ({
  children,
  user,
  onLogout,
  title,
  activeTab,
  onTabChange
}: MainLayoutProps) => {
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return children;
      
      // Admin specific tabs
      case 'approvals':
        return <ApprovalManagement currentUserId={user.id} currentUserName={user.name} />;
      case 'approval-dashboard':
        return <ApprovalDashboard />;
      case 'transfers':
        return <TransferTrackingDashboard />;
      case 'users':
        return <UserManagement />;
      case 'budgets':
        if (user.role === 'staff') {
          return <BudgetOverview />;
        }
        return <BudgetManagement user={user} />;
      case 'approval-workflows':
        return <ApprovalWorkflows />;
      case 'reports':
        return <AdminReports />;
      
      // Staff specific tabs
      case 'rfqs':
        if (user.role === 'contractor') {
          return <AvailableRFQs contractorId={user.id} />;
        }
        return <RFQManagement />;
      case 'bids':
        if (user.role === 'contractor') {
          return <MyBids contractorId={user.id} />;
        }
        return <BidManagement />;
      case 'suppliers':
        return <SupplierManagement />;
      
      // Warehouse specific tabs
      case 'inventory':
        if (user.role === 'warehouse') {
          // Use a default warehouse ID if not available on user
          const warehouseId = (user as any).warehouse_id || 'warehouse-a';
          return <WarehouseInventory warehouseId={warehouseId} />;
        }
        return <InventoryManagement />;
      case 'warehouse-transfers':
        if (user.role === 'warehouse') {
          const warehouseId = (user as any).warehouse_id || 'warehouse-a';
          return (
            <EnhancedTransferRequests 
              warehouseId={warehouseId}
              currentUserId={user.id}
              currentUserName={user.name}
            />
          );
        }
        return <TransferTrackingDashboard />;
      
      // Contractor specific tabs
      case 'live-bids':
        return <LiveBidViewing />;
      
      // Common tabs
      case 'messaging':
        return <EnhancedMessagingSystem 
          currentUserId={user.id} 
          currentUserName={user.name}
          currentUserRole={user.role}
        />;
      case 'audit':
        return <AuditLogs />;
      case 'profile':
        return <ProfileManagement user={user} />;
      
      default:
        return children;
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar user={user} activeTab={activeTab} onTabChange={onTabChange} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Palette className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Customize Theme</DialogTitle>
                  </DialogHeader>
                  <ThemeSelector />
                </DialogContent>
              </Dialog>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.profilePhoto} />
                  <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-gray-600 capitalize">{user.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            {renderTabContent()}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};
