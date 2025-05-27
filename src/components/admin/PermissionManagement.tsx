
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, mockUsers } from '@/data/mockData';
import { Settings, Users, History } from 'lucide-react';

const PERMISSIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'rfqs', label: 'RFQs' },
  { id: 'bids', label: 'Bids' },
  { id: 'suppliers', label: 'Suppliers' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'warehouses', label: 'Warehouses' },
  { id: 'messaging', label: 'Messaging' },
  { id: 'audit', label: 'Audit Logs' },
  { id: 'users', label: 'User Management' },
  { id: 'settings', label: 'Settings' },
  { id: 'budgets', label: 'Budget Management' },
  { id: 'reports', label: 'Reports' }
];

const ROLES = ['admin', 'staff', 'contractor', 'warehouse'];

export const PermissionManagement = () => {
  const [rolePermissions, setRolePermissions] = useState<any[]>([]);
  const [userPermissions, setUserPermissions] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState('admin');
  const [selectedUser, setSelectedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = async () => {
    try {
      const [rolePerms, userPerms, logs] = await Promise.all([
        supabase.from('role_permissions').select('*'),
        supabase.from('user_permissions').select('*, users(name)'),
        supabase.from('permission_audit_logs').select('*, users!changed_by(name), target_users:users!target_user_id(name)').order('created_at', { ascending: false }).limit(20)
      ]);

      setRolePermissions(rolePerms.data || []);
      setUserPermissions(userPerms.data || []);
      setAuditLogs(logs.data || []);
    } catch (error) {
      console.error('Error loading permission data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateRolePermission = async (role: string, permission: string, enabled: boolean) => {
    try {
      const existing = rolePermissions.find(p => p.role === role && p.permission === permission);
      
      if (existing) {
        await supabase
          .from('role_permissions')
          .update({ enabled, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('role_permissions')
          .insert({ role, permission, enabled });
      }

      // Log the change
      await supabase.from('permission_audit_logs').insert({
        target_role: role,
        permission,
        old_value: existing?.enabled || false,
        new_value: enabled,
        action_type: 'role_permission_change'
      });

      toast({
        title: "Permission Updated",
        description: `${permission} permission for ${role} role ${enabled ? 'enabled' : 'disabled'}.`
      });

      loadData();
    } catch (error) {
      console.error('Error updating role permission:', error);
      toast({
        title: "Error",
        description: "Failed to update permission.",
        variant: "destructive"
      });
    }
  };

  const updateUserPermission = async (userId: string, permission: string, enabled: boolean) => {
    try {
      const existing = userPermissions.find(p => p.user_id === userId && p.permission === permission);
      
      if (existing) {
        if (enabled) {
          await supabase
            .from('user_permissions')
            .update({ enabled, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('user_permissions')
            .delete()
            .eq('id', existing.id);
        }
      } else if (enabled) {
        await supabase
          .from('user_permissions')
          .insert({ user_id: userId, permission, enabled });
      }

      // Log the change
      await supabase.from('permission_audit_logs').insert({
        target_user_id: userId,
        permission,
        old_value: existing?.enabled || false,
        new_value: enabled,
        action_type: 'user_permission_override'
      });

      const userName = mockUsers.find(u => u.id === userId)?.name || 'Unknown User';
      toast({
        title: "User Permission Updated",
        description: `${permission} permission for ${userName} ${enabled ? 'enabled' : 'disabled'}.`
      });

      loadData();
    } catch (error) {
      console.error('Error updating user permission:', error);
      toast({
        title: "Error",
        description: "Failed to update user permission.",
        variant: "destructive"
      });
    }
  };

  const getRolePermission = (role: string, permission: string): boolean => {
    const perm = rolePermissions.find(p => p.role === role && p.permission === permission);
    return perm?.enabled || false;
  };

  const getUserPermission = (userId: string, permission: string): boolean | null => {
    const perm = userPermissions.find(p => p.user_id === userId && p.permission === permission);
    return perm ? perm.enabled : null;
  };

  if (loading) return <div>Loading permissions...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Permission Management
          </CardTitle>
          <CardDescription>
            Manage role-based permissions and individual user overrides with real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="roles">Role Permissions</TabsTrigger>
              <TabsTrigger value="users">User Overrides</TabsTrigger>
              <TabsTrigger value="audit">Audit Trail</TabsTrigger>
            </TabsList>

            <TabsContent value="roles" className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="role-select">Select Role:</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(role => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PERMISSIONS.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-2 p-3 border rounded">
                    <Checkbox
                      id={`role-${selectedRole}-${permission.id}`}
                      checked={getRolePermission(selectedRole, permission.id)}
                      onCheckedChange={(checked) => 
                        updateRolePermission(selectedRole, permission.id, checked as boolean)
                      }
                    />
                    <Label htmlFor={`role-${selectedRole}-${permission.id}`} className="flex-1">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="user-select">Select User:</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {PERMISSIONS.map(permission => {
                    const userPerm = getUserPermission(selectedUser, permission.id);
                    const roleDefault = getRolePermission(
                      mockUsers.find(u => u.id === selectedUser)?.role || 'staff', 
                      permission.id
                    );

                    return (
                      <div key={permission.id} className="flex items-center space-x-2 p-3 border rounded">
                        <Checkbox
                          id={`user-${selectedUser}-${permission.id}`}
                          checked={userPerm !== null ? userPerm : roleDefault}
                          onCheckedChange={(checked) => 
                            updateUserPermission(selectedUser, permission.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={`user-${selectedUser}-${permission.id}`} className="flex-1">
                          {permission.label}
                          {userPerm !== null && (
                            <Badge variant="outline" className="ml-2">Override</Badge>
                          )}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Recent Permission Changes
                </h4>
                {auditLogs.map(log => (
                  <div key={log.id} className="p-3 border rounded text-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {log.action_type === 'role_permission_change' ? 'Role Permission' : 'User Override'}: 
                          <span className="capitalize"> {log.permission}</span>
                        </p>
                        <p className="text-gray-600">
                          {log.target_role && `Role: ${log.target_role}`}
                          {log.target_users && `User: ${log.target_users.name}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          Changed from {log.old_value ? 'enabled' : 'disabled'} to {log.new_value ? 'enabled' : 'disabled'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {new Date(log.created_at).toLocaleString()}
                        </p>
                        {log.users && (
                          <p className="text-xs font-medium">{log.users.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
