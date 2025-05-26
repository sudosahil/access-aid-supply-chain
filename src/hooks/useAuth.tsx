
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/data/mockData';

export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await loadUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      if (user) {
        setCurrentUser({
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role as 'admin' | 'staff' | 'contractor' | 'warehouse',
          profilePhoto: user.profile_photo,
          phone: '', // Default empty since not in database
          address: '', // Default empty since not in database
          organization: user.warehouse_name || '', // Use warehouse_name as organization fallback
          warehouseName: user.warehouse_name,
          warehouseId: user.warehouse_id,
          isActive: true,
          createdAt: user.created_at
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Check if user exists in our users table
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (userError || !user) {
        console.error('Login failed:', userError);
        return false;
      }

      setCurrentUser({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role as 'admin' | 'staff' | 'contractor' | 'warehouse',
        profilePhoto: user.profile_photo,
        phone: '', // Default empty since not in database
        address: '', // Default empty since not in database
        organization: user.warehouse_name || '', // Use warehouse_name as organization fallback
        warehouseName: user.warehouse_name,
        warehouseId: user.warehouse_id,
        isActive: true,
        createdAt: user.created_at
      });

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return {
    currentUser,
    loading,
    login,
    logout
  };
};
