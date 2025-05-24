
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Settings, LogOut, Menu, Building2 } from 'lucide-react';
import { User } from '@/data/mockData';

interface LayoutProps {
  children: ReactNode;
  user: User;
  onLogout: () => void;
  title: string;
}

export const Layout = ({ children, user, onLogout, title }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Government Header Bar */}
      <div className="gov-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Building2 className="h-8 w-8 text-white" />
              <div>
                <h1 className="text-xl font-bold text-white">Government of Odisha</h1>
                <p className="text-slate-200 text-sm">SSEPD Procurement & Inventory Management</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700">
                <Settings className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-600">
                <Avatar className="h-8 w-8 ring-2 ring-slate-300">
                  <AvatarImage src={user.profilePhoto} />
                  <AvatarFallback className="bg-slate-600 text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-slate-300 capitalize">{user.role}</p>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogout}
                className="text-white hover:bg-slate-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
              <p className="text-sm text-slate-600">Dashboard & Management Console</p>
            </div>
            <div className="text-sm text-slate-500">
              Welcome, {user.name} | Role: <span className="font-medium text-blue-800 capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5" />
              <span className="text-sm">© 2024 Government of Odisha - SSEPD</span>
            </div>
            <div className="text-sm">
              Procurement & Inventory Management System
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
