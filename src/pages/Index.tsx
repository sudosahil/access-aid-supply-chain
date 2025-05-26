
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { StaffDashboard } from '@/components/dashboards/StaffDashboard';
import { ContractorDashboard } from '@/components/dashboards/ContractorDashboard';
import { WarehouseDashboard } from '@/components/dashboards/WarehouseDashboard';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { currentUser, loading, login, logout } = useAuth();

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
    return <LoginForm onLogin={login} />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard user={currentUser} onLogout={logout} />;
      case 'staff':
        return <StaffDashboard user={currentUser} onLogout={logout} />;
      case 'contractor':
        return <ContractorDashboard user={currentUser} onLogout={logout} />;
      case 'warehouse':
        return <WarehouseDashboard user={currentUser} onLogout={logout} />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderDashboard()}
    </div>
  );
};

export default Index;
