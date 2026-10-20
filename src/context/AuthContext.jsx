import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default user: Saikat (Manager) as in user screenshot
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('smm_auth_user_v2');
    return saved ? JSON.parse(saved) : {
      id: 'mem-001',
      name: 'Saikat',
      email: 'saikat@mess.ac.bd',
      phone: '01711223344',
      role: 'manager',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    };
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('smm_auth_user_v2', JSON.stringify(user));
    } else {
      localStorage.removeItem('smm_auth_user_v2');
    }
  }, [user]);

  // Demo 1-click login as Manager (Saikat)
  const loginAsManager = () => {
    const managerUser = {
      id: 'mem-001',
      name: 'Saikat',
      email: 'saikat@mess.ac.bd',
      phone: '01711223344',
      role: 'manager',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    };
    setUser(managerUser);
    return managerUser;
  };

  // Demo 1-click login as Member (Shakib)
  const loginAsMember = () => {
    const memberUser = {
      id: 'mem-003',
      name: 'Shakib',
      email: 'shakib@mess.ac.bd',
      phone: '01933445566',
      role: 'member',
      avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop'
    };
    setUser(memberUser);
    return memberUser;
  };

  // Switch role seamlessly
  const switchRole = (newRole) => {
    if (!user) return;
    setUser((prev) => ({
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
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: 'manager',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
        };
        setUser(loggedUser);
        return { success: true, user: loggedUser };
      } else {
        const isResident = email.toLowerCase().includes('member') || email.toLowerCase().includes('resident');
        const simulatedUser = isResident ? loginAsMember() : loginAsManager();
        return { success: true, user: simulatedUser };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Full signup functionality
  const register = async ({ name, email, phone, password, role = 'member' }) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, phone }
          }
        });
        if (error) throw error;
        const newUser = {
          id: data.user?.id || `user-${Date.now()}`,
          name,
          email,
          phone,
          role,
          avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?w=100&h=100&fit=crop`
        };
        setUser(newUser);
        return { success: true, user: newUser };
      } else {
        const newUser = {
          id: `mem-${Date.now()}`,
          name,
          email,
          phone,
          role,
          avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?w=100&h=100&fit=crop`
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
    localStorage.removeItem('smm_auth_user_v2');
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
