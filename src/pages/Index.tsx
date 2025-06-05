
import React, { useState } from 'react';
import { EnhancedLoginForm } from '@/components/auth/EnhancedLoginForm';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { StaffDashboard } from '@/components/dashboards/StaffDashboard';
import { ContractorDashboard } from '@/components/dashboards/ContractorDashboard';
import { WarehouseDashboard } from '@/components/dashboards/WarehouseDashboard';
import { MainLayout } from '@/components/layout/MainLayout';
import { useAuth } from '@/hooks/useAuth';
import { BudgetProvider } from '@/contexts/BudgetContext';

const Index = () => {
  const { currentUser, loading, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <EnhancedLoginForm onLogin={login} />;
  }

  const getDashboardTitle = () => {
    switch (currentUser.role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'staff':
        return 'Staff Dashboard';
      case 'contractor':
        return 'Contractor Dashboard';
      case 'warehouse':
        return 'Warehouse Dashboard';
      case 'requester':
        return 'Requester Dashboard';
      case 'manager':
        return 'Manager Dashboard';
      case 'finance_director':
        return 'Finance Director Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return (
          <AdminDashboard 
            onTabChange={setActiveTab}
          />
        );
      case 'staff':
        return (
          <StaffDashboard 
            user={currentUser} 
            onLogout={logout}
            onTabChange={setActiveTab}
          />
        );
      case 'contractor':
        return (
          <ContractorDashboard 
            user={currentUser} 
            onLogout={logout}
            onTabChange={setActiveTab}
          />
        );
      case 'warehouse':
        return (
          <WarehouseDashboard 
            user={currentUser} 
            onLogout={logout}
            onTabChange={setActiveTab}
          />
        );
      case 'requester':
      case 'manager':
      case 'finance_director':
        // For new test roles, show staff dashboard for now
        return (
          <StaffDashboard 
            user={currentUser} 
            onLogout={logout}
            onTabChange={setActiveTab}
          />
        );
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <BudgetProvider>
      <MainLayout
        user={currentUser}
        onLogout={logout}
        title={getDashboardTitle()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {renderDashboard()}
      </MainLayout>
    </BudgetProvider>
  );
};

export default Index;
