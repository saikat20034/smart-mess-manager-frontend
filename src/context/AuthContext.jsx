import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default demo user: Tanvir Ahmed (Manager)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smm_auth_user');
    return saved ? JSON.parse(saved) : {
      id: 'mem-001',
      name: 'Tanvir Ahmed',
      email: 'tanvir@du.ac.bd',
      phone: '01711223344',
      role: 'manager',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    };
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smm_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smm_auth_user');
    }
  }, [user]);

  // Demo 1-click login as Manager
  const loginAsManager = () => {
    const managerUser = {
      id: 'mem-001',
      name: 'Tanvir Ahmed (Manager)',
      email: 'tanvir@du.ac.bd',
      phone: '01711223344',
      role: 'manager',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    };
    setUser(managerUser);
    return managerUser;
  };

  // Demo 1-click login as Member
  const loginAsMember = () => {
    const memberUser = {
      id: 'mem-002',
      name: 'Arif Hossain (Member)',
      email: 'arif@du.ac.bd',
      phone: '01822334455',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop'
    };
    setUser(memberUser);
    return memberUser;
  };

  // Switch role seamlessly for testing
  const switchRole = (newRole) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      role: newRole
    }));
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // In real Supabase, fetch profile & role
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: 'manager'
        };
        setUser(loggedUser);
        return { success: true };
      } else {
        // Local simulation: if email contains 'member' assign member role, otherwise manager
        const isMember = email.toLowerCase().includes('member');
        const simulatedUser = isMember ? loginAsMember() : loginAsManager();
        return { success: true, user: simulatedUser };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, role = 'manager' }) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name }
          }
        });
        if (error) throw error;
        const newUser = {
          id: data.user?.id || `user-${Date.now()}`,
          name,
          email,
          role
        };
        setUser(newUser);
        return { success: true };
      } else {
        const newUser = {
          id: `mem-${Date.now()}`,
          name,
          email,
          role,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
        };
        setUser(newUser);
        return { success: true, user: newUser };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smm_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'member',
        isManager: user?.role === 'manager',
        loading,
        login,
        register,
        logout,
        loginAsManager,
        loginAsMember,
        switchRole,
        isDemoMode: !isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
