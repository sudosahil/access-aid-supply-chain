
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/data/mockData';

export interface UserPermissions {
  dashboard: boolean;
  rfqs: boolean;
  bids: boolean;
  suppliers: boolean;
  inventory: boolean;
  warehouses: boolean;
  messaging: boolean;
  audit: boolean;
  users: boolean;
  settings: boolean;
  budgets: boolean;
  reports: boolean;
  approvals: boolean;
  contracts: boolean;
  transfers: boolean;
}

// Define role-based permissions including new roles
const rolePermissions: Record<string, UserPermissions> = {
  admin: {
    dashboard: true,
    rfqs: true,
    bids: true,
    suppliers: true,
    inventory: true,
    warehouses: true,
    messaging: true,
    audit: true,
    users: true,
    settings: true,
    budgets: true,
    reports: true,
    approvals: true,
    contracts: true,
    transfers: true,
  },
  staff: {
    dashboard: true,
    rfqs: true,
    bids: true,
    suppliers: true,
    inventory: true,
    warehouses: true,
    messaging: true,
    audit: false,
    users: false,
    settings: false,
    budgets: true,
    reports: true,
    approvals: false,
    contracts: true,
    transfers: true,
  },
  requester: {
    dashboard: true,
    rfqs: true,
    bids: false,
    suppliers: false,
    inventory: true,
    warehouses: false,
    messaging: true,
    audit: false,
    users: false,
    settings: false,
    budgets: true,
    reports: false,
    approvals: false,
    contracts: false,
    transfers: false,
  },
  manager: {
    dashboard: true,
    rfqs: true,
    bids: true,
    suppliers: true,
    inventory: true,
    warehouses: true,
    messaging: true,
    audit: true,
    users: false,
    settings: false,
    budgets: true,
    reports: true,
    approvals: true,
    contracts: true,
    transfers: true,
  },
  finance_director: {
    dashboard: true,
    rfqs: true,
    bids: true,
    suppliers: true,
    inventory: true,
    warehouses: true,
    messaging: true,
    audit: true,
    users: false,
    settings: true,
    budgets: true,
    reports: true,
    approvals: true,
    contracts: true,
    transfers: true,
  },
  contractor: {
    dashboard: true,
    rfqs: true,
    bids: true,
    suppliers: false,
    inventory: false,
    warehouses: false,
    messaging: true,
    audit: false,
    users: false,
    settings: false,
    budgets: false,
    reports: false,
    approvals: false,
    contracts: true,
    transfers: false,
  },
  warehouse: {
    dashboard: true,
    rfqs: false,
    bids: false,
    suppliers: false,
    inventory: true,
    warehouses: true,
    messaging: true,
    audit: false,
    users: false,
    settings: false,
    budgets: false,
    reports: false,
    approvals: false,
    contracts: false,
    transfers: true,
  },
};

export const usePermissions = (user: User | null) => {
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log('usePermissions - No user provided');
      setPermissions(null);
      setLoading(false);
      return;
    }

    console.log('usePermissions useEffect triggered');
    console.log('Loading permissions for user:', user);
    loadPermissions();
  }, [user]);

  const loadPermissions = async () => {
    if (!user) return;

    try {
      console.log('usePermissions - User:', user);
      console.log('usePermissions - User role:', user.role);

      // Always use role-based permissions for consistency
      const roleBasedPermissions = rolePermissions[user.role];
      
      if (roleBasedPermissions) {
        console.log('Using role-based permissions for role:', user.role);
        setPermissions(roleBasedPermissions);
        setUseFallback(false);
      } else {
        console.log('No permissions found for role:', user.role, 'using default');
        // Default permissions for unknown roles
        const defaultPermissions: UserPermissions = {
          dashboard: true,
          rfqs: false,
          bids: false,
          suppliers: false,
          inventory: false,
          warehouses: false,
          messaging: true,
          audit: false,
          users: false,
          settings: false,
          budgets: false,
          reports: false,
          approvals: false,
          contracts: false,
          transfers: false,
        };
        setPermissions(defaultPermissions);
        setUseFallback(true);
      }

      console.log('usePermissions returning - loading: false useFallback:', !roleBasedPermissions);
    } catch (error) {
      console.error('Error loading permissions:', error);
      // Fallback to role-based permissions
      const roleBasedPermissions = rolePermissions[user.role] || rolePermissions.requester;
      setPermissions(roleBasedPermissions);
      setUseFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    if (!user || !permissions) {
      console.log('No user or permissions available for permission check:', permission);
      return false;
    }
    
    console.log(`Checking permission: ${permission} for user role: ${user.role}`);
    const hasAccess = permissions[permission];
    console.log(`Permission ${permission}: hasAccess = ${hasAccess}`);
    return hasAccess;
  };

  return {
    permissions,
    loading,
    useFallback,
    hasPermission,
    refetch: loadPermissions
  };
};
