
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AdminDashboard } from '@/components/dashboards/AdminDashboard';
import { StaffDashboard } from '@/components/dashboards/StaffDashboard';
import { ContractorDashboard } from '@/components/dashboards/ContractorDashboard';
import { mockUsers } from '@/data/mockData';

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLogin = (email: string, password: string) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  const renderDashboard = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
      case 'staff':
        return <StaffDashboard user={currentUser} onLogout={handleLogout} />;
      case 'contractor':
        return <ContractorDashboard user={currentUser} onLogout={handleLogout} />;
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
