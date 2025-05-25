import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { User } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, LogOut } from 'lucide-react';
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
  return <div className="min-h-screen flex w-full">
      <SidebarProvider>
        <AppSidebar user={user} activeTab={activeTab} onTabChange={onTabChange} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
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
          <main className="flex-1 overflow-auto p-6 bg-slate-900">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </div>;
};