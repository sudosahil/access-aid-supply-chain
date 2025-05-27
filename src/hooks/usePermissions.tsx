
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

export const usePermissions = (user: User) => {
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);

  const hasPermission = (permission: string): boolean => {
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
      const { data: rolePerms } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role', user.role);

      // Load user-specific permissions
      const { data: userPerms } = await supabase
        .from('user_permissions')
        .select('*')
        .eq('user_id', user.id);

      setRolePermissions(rolePerms || []);
      setUserPermissions(userPerms || []);
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
  }, [user.id, user.role]);

  return { hasPermission, loading, rolePermissions, userPermissions };
};
