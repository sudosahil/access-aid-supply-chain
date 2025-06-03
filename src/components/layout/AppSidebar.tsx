
import { Calendar, FileText, Package, MessageSquare, Activity, Settings, User, Home, Building, Users, ClipboardList, DollarSign, GitBranch } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { User as UserType } from '@/data/mockData';
import { usePermissions } from '@/hooks/usePermissions';

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
  { id: 'reports', title: 'Reports', icon: FileText },
  { id: 'profile', title: 'Profile', icon: User }
];

// Warehouse-specific menu items for different naming
const WAREHOUSE_SPECIFIC_ITEMS = {
  'inventory': { id: 'inventory', title: 'Warehouse Inventory', icon: Package },
  'transfers': { id: 'transfers', title: 'Transfer Requests', icon: Activity }
};

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

  // Filter menu items based on permissions
  let menuItems = ALL_MENU_ITEMS.filter(item => {
    // Profile is always available
    if (item.id === 'profile') return true;
    // Check if user has permission for this item
    const hasAccess = hasPermission(item.id);
    console.log(`Menu item ${item.id}: hasAccess = ${hasAccess}`);
    return hasAccess;
  });

  console.log('Filtered menu items:', menuItems.map(item => item.id));

  // Special handling for warehouse role
  if (user.role === 'warehouse') {
    menuItems = menuItems.map(item => {
      if (item.id === 'inventory') {
        return WAREHOUSE_SPECIFIC_ITEMS.inventory;
      }
      return item;
    });
    
    // Add transfer requests for warehouse users if they have inventory permission
    if (hasPermission('inventory')) {
      const transfersIndex = menuItems.findIndex(item => item.id === 'inventory') + 1;
      menuItems.splice(transfersIndex, 0, { 
        id: 'warehouse-transfers', 
        title: 'Transfer Requests', 
        icon: Activity 
      });
    }
  }

  // Special handling for contractor role - rename some items
  if (user.role === 'contractor') {
    menuItems = menuItems.map(item => {
      if (item.id === 'rfqs') {
        return { ...item, title: 'Available RFQs' };
      }
      if (item.id === 'bids') {
        return { ...item, title: 'My Bids' };
      }
      return item;
    });
  }

  // For staff role, rename budget management
  if (user.role === 'staff') {
    menuItems = menuItems.map(item => {
      if (item.id === 'budgets') {
        return { ...item, title: 'Budget Overview' };
      }
      return item;
    });
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
