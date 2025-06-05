
import { useState, useEffect } from 'react';
import { User } from '@/data/mockData';
import { rolePermissions, getDefaultPermissions, UserPermissions } from '@/config/rolePermissions';

export type { UserPermissions } from '@/config/rolePermissions';

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
        setPermissions(getDefaultPermissions());
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
