
import { Calendar, FileText, Package, MessageSquare, Activity, Settings, User, Home, Building, Users, ClipboardList } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { User as UserType } from '@/data/mockData';

interface AppSidebarProps {
  user: UserType;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const getMenuItemsForRole = (role: string) => {
  const commonItems = [
    { id: 'dashboard', title: 'Dashboard', icon: Home },
    { id: 'profile', title: 'Profile', icon: User },
  ];

  const adminItems = [
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
    { id: 'profile', title: 'Profile', icon: User },
  ];

  const staffItems = [
    { id: 'dashboard', title: 'Dashboard', icon: Home },
    { id: 'rfqs', title: 'RFQs', icon: FileText },
    { id: 'bids', title: 'Bids', icon: ClipboardList },
    { id: 'suppliers', title: 'Suppliers', icon: Building },
    { id: 'inventory', title: 'Inventory', icon: Package },
    { id: 'warehouses', title: 'Warehouses', icon: Building },
    { id: 'messaging', title: 'Messaging', icon: MessageSquare },
    { id: 'audit', title: 'Audit Logs', icon: Activity },
    { id: 'profile', title: 'Profile', icon: User },
  ];

  const contractorItems = [
    { id: 'dashboard', title: 'Dashboard', icon: Home },
    { id: 'rfqs', title: 'Available RFQs', icon: FileText },
    { id: 'bids', title: 'My Bids', icon: ClipboardList },
    { id: 'messaging', title: 'Messaging', icon: MessageSquare },
    { id: 'profile', title: 'Profile', icon: User },
  ];

  const warehouseItems = [
    { id: 'dashboard', title: 'Dashboard', icon: Home },
    { id: 'inventory', title: 'Warehouse Inventory', icon: Package },
    { id: 'transfers', title: 'Transfer Requests', icon: Activity },
    { id: 'messaging', title: 'Messaging', icon: MessageSquare },
    { id: 'profile', title: 'Profile', icon: User },
  ];

  switch (role) {
    case 'admin':
      return adminItems;
    case 'staff':
      return staffItems;
    case 'contractor':
      return contractorItems;
    case 'warehouse':
      return warehouseItems;
    default:
      return commonItems;
  }
};

export const AppSidebar = ({ user, activeTab, onTabChange }: AppSidebarProps) => {
  const menuItems = getMenuItemsForRole(user.role);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>SSEPD Procurement</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={activeTab === item.id}
                    onClick={() => onTabChange(item.id)}
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
