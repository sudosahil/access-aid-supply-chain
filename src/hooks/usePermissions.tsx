
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
  const [useFallback, setUseFallback] = useState(false);

  const hasPermission = (permission: string): boolean => {
    // If using fallback permissions
    if (useFallback) {
      const userRole = user.role as keyof typeof FALLBACK_PERMISSIONS;
      return FALLBACK_PERMISSIONS[userRole]?.includes(permission) || false;
    }

    // Check user-specific override first
    const userOverride = userPermissions.find(p => p.permission === permission);
    if (userOverride) {
      return userOverride.enabled;
    }

    // Fall back to role permission
    const rolePermission = rolePermissions.find(p => p.role === user.role && p.permission === permission);
    return rolePermission?.enabled || false;
  };

  const loadPermissions = async () => {
    try {
      // Load role permissions
      const { data: rolePerms, error: roleError } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role', user.role);

      if (roleError) {
        console.error('Error loading role permissions:', roleError);
        setUseFallback(true);
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
    if (user?.id && user?.role) {
      loadPermissions();

      // Set up real-time subscriptions for permission changes
      const roleChannel = supabase
        .channel('role-permissions')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'role_permissions' },
          () => loadPermissions()
        )
        .subscribe();

      const userChannel = supabase
        .channel('user-permissions')
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'user_permissions' },
          () => loadPermissions()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(roleChannel);
        supabase.removeChannel(userChannel);
      };
    }
  }, [user.id, user.role]);

  return { hasPermission, loading, rolePermissions, userPermissions };
};
