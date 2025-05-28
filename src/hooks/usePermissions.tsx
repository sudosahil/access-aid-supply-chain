
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/data/mockData';

interface Permission {
  id: string;
  permission: string;
  enabled: boolean;
}

interface RolePermission extends Permission {
  role: string;
}

interface UserPermission extends Permission {
  user_id: string;
}

// Fallback permissions for when database is not available
const FALLBACK_PERMISSIONS = {
  admin: ['dashboard', 'rfqs', 'bids', 'suppliers', 'inventory', 'warehouses', 'messaging', 'audit', 'users', 'settings', 'budgets', 'reports'],
  staff: ['dashboard', 'rfqs', 'bids', 'suppliers', 'inventory', 'warehouses', 'messaging', 'audit', 'budgets'],
  contractor: ['dashboard', 'rfqs', 'bids', 'messaging'],
  warehouse: ['dashboard', 'inventory', 'messaging']
};

export const usePermissions = (user: User) => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(true); // Default to fallback for mock users

  console.log('usePermissions - User:', user);
  console.log('usePermissions - User role:', user?.role);

  const hasPermission = (permission: string): boolean => {
    console.log('Checking permission:', permission, 'for user role:', user?.role);
    
    // Always use fallback permissions for mock users
    if (useFallback || !user?.id) {
      const userRole = user?.role as keyof typeof FALLBACK_PERMISSIONS;
      const hasAccess = FALLBACK_PERMISSIONS[userRole]?.includes(permission) || false;
      console.log('Using fallback permissions. Has access:', hasAccess);
      return hasAccess;
    }

    // Check user-specific override first
    const userOverride = userPermissions.find(p => p.permission === permission);
    if (userOverride) {
      console.log('User override found:', userOverride.enabled);
      return userOverride.enabled;
    }

    // Fall back to role permission
    const rolePermission = rolePermissions.find(p => p.role === user.role && p.permission === permission);
    const hasAccess = rolePermission?.enabled || false;
    console.log('Role permission result:', hasAccess);
    return hasAccess;
  };

  const loadPermissions = async () => {
    console.log('Loading permissions for user:', user);
    
    // For mock users (which don't have proper Supabase auth), use fallback immediately
    if (!user?.id || typeof user.id === 'string') {
      console.log('Mock user detected, using fallback permissions');
      setUseFallback(true);
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting to load permissions from database');
      
      // Check if we have a valid Supabase session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No Supabase session found, using fallback permissions');
        setUseFallback(true);
        setLoading(false);
        return;
      }

      // Load role permissions
      const { data: rolePerms, error: roleError } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role', user.role);

      if (roleError) {
        console.error('Error loading role permissions:', roleError);
        setUseFallback(true);
        setLoading(false);
        return;
      }

      // Load user-specific permissions
      const { data: userPerms, error: userError } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id);

      if (userError) {
        console.error('Error loading user permissions:', userError);
      }

      console.log('Successfully loaded permissions from database');
      setRolePermissions(rolePerms || []);
      setUserPermissions(userPerms || []);
      setUseFallback(false);
    } catch (error) {
      console.error('Error loading permissions:', error);
      setUseFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('usePermissions useEffect triggered');
    
    if (user?.role) {
      loadPermissions();
    } else {
      console.log('No user or role found, using fallback');
      setUseFallback(true);
      setLoading(false);
    }
  }, [user?.id, user?.role]);

  console.log('usePermissions returning - loading:', loading, 'useFallback:', useFallback);
  
  return { hasPermission, loading, rolePermissions, userPermissions };
};
