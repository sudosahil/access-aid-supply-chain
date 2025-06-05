
import { Calendar, FileText, Package, MessageSquare, Activity, Settings, User, Home, Building, Users, ClipboardList, DollarSign, GitBranch, CheckSquare } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { User as UserType } from '@/data/mockData';
import { usePermissions, UserPermissions } from '@/hooks/usePermissions';

interface AppSidebarProps {
  user: UserType;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ALL_MENU_ITEMS = [
  { id: 'dashboard', title: 'Dashboard', icon: Home },
  { id: 'rfqs', title: 'RFQs', icon: FileText },
  { id: 'bids', title: 'Bids', icon: ClipboardList },
  { id: 'suppliers', title: 'Suppliers', icon: Building },
  { id: 'inventory', title: 'Inventory', icon: Package },
  { id: 'warehouses', title: 'Warehouses', icon: Building },
  { id: 'messaging', title: 'Messaging', icon: MessageSquare },
  { id: 'audit', title: 'Audit Logs', icon: Activity },
  { id: 'users', title: 'User Management', icon: Users },
  { id: 'settings', title: 'Settings', icon: Settings },
  { id: 'budgets', title: 'Budget Management', icon: DollarSign },
  { id: 'approval-workflows', title: 'Approval Workflows', icon: GitBranch },
  { id: 'approval-dashboard', title: 'Approval Dashboard', icon: CheckSquare },
  { id: 'reports', title: 'Reports', icon: FileText },
  { id: 'profile', title: 'Profile', icon: User }
];

export const AppSidebar = ({ user, activeTab, onTabChange }: AppSidebarProps) => {
  const { hasPermission, loading } = usePermissions(user);

  console.log('AppSidebar render - user:', user);
  console.log('AppSidebar render - loading:', loading);

  // Show loading state briefly but don't block the UI
  if (loading) {
    console.log('AppSidebar showing loading state');
    return (
      <Sidebar>
        <SidebarContent className="bg-slate-900">
          <SidebarGroup>
            <SidebarGroupLabel className="text-white">SSEPD Procurement</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="text-white text-sm p-2">Loading menu...</div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    );
  }

  // Get menu items based on role with proper fallback
  let menuItems = [];

  // Admin gets everything
  if (user.role === 'admin') {
    menuItems = [...ALL_MENU_ITEMS];
  }
  // Staff gets most things except user management and some admin features
  else if (user.role === 'staff') {
    menuItems = ALL_MENU_ITEMS.filter(item => 
      !['users', 'settings', 'audit', 'approval-workflows'].includes(item.id)
    );
    // Rename budget management for staff
    menuItems = menuItems.map(item => 
      item.id === 'budgets' ? { ...item, title: 'Budget Overview' } : item
    );
  }
  // Contractor gets limited access
  else if (user.role === 'contractor') {
    menuItems = ALL_MENU_ITEMS.filter(item => 
      ['dashboard', 'rfqs', 'bids', 'messaging', 'contracts', 'profile'].includes(item.id)
    );
    // Rename items for contractors
    menuItems = menuItems.map(item => {
      if (item.id === 'rfqs') return { ...item, title: 'Available RFQs' };
      if (item.id === 'bids') return { ...item, title: 'My Bids' };
      return item;
    });
    // Add live bids viewing
    const dashboardIndex = menuItems.findIndex(item => item.id === 'dashboard');
    menuItems.splice(dashboardIndex + 1, 0, { 
      id: 'live-bids', 
      title: 'Live Bid Status', 
      icon: Activity 
    });
  }
  // Warehouse gets inventory and transfer focused items
  else if (user.role === 'warehouse') {
    menuItems = [
      { id: 'dashboard', title: 'Dashboard', icon: Home },
      { id: 'inventory', title: 'Warehouse Inventory', icon: Package },
      { id: 'warehouse-transfers', title: 'Transfer Requests', icon: Activity },
      { id: 'messaging', title: 'Messaging', icon: MessageSquare },
      { id: 'profile', title: 'Profile', icon: User }
    ];
  }
  // Workflow testing roles (requester, manager, finance_director)
  else if (['requester', 'manager', 'finance_director'].includes(user.role)) {
    menuItems = [
      { id: 'dashboard', title: 'Dashboard', icon: Home },
      { id: 'rfqs', title: user.role === 'requester' ? 'My Requests' : 'RFQs', icon: FileText },
      { id: 'bids', title: 'Bids', icon: ClipboardList },
      { id: 'budgets', title: 'Budget Management', icon: DollarSign },
      { id: 'messaging', title: 'Messaging', icon: MessageSquare },
      { id: 'approval-workflows', title: 'Approval Workflows', icon: GitBranch },
      { id: 'approval-dashboard', title: user.role === 'requester' ? 'My Approvals' : 'Pending Approvals', icon: CheckSquare },
      { id: 'reports', title: 'Reports', icon: FileText },
      { id: 'profile', title: 'Profile', icon: User }
    ];
  }
  // Fallback for any other roles
  else {
    menuItems = [
      { id: 'dashboard', title: 'Dashboard', icon: Home },
      { id: 'messaging', title: 'Messaging', icon: MessageSquare },
      { id: 'profile', title: 'Profile', icon: User }
    ];
  }

  console.log('Final menu items for role', user.role, ':', menuItems.map(item => item.title));

  return (
    <Sidebar>
      <SidebarContent className="bg-slate-900">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white">SSEPD Procurement</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={activeTab === item.id} 
                    onClick={() => onTabChange(item.id)}
                    className="text-white hover:bg-slate-800"
                  >
                    <button className="w-full">
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
