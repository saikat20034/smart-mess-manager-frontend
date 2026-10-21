import React, { createContext, useContext, useState, useEffect } from 'react';
import { isSupabaseConfigured, supabase } from '../services/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize user, synchronizing with active mess members in storage
  const [user, setUser] = useState(() => {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('smm_auth_user_v2') : null;
      let parsed = saved ? JSON.parse(saved) : null;

      const rawMembers = typeof localStorage !== 'undefined' ? localStorage.getItem('smm_members_v2') : null;
      if (rawMembers) {
        const members = JSON.parse(rawMembers);
        if (Array.isArray(members) && members.length > 0) {
          // 1. If parsed user matches a member in this mess, use that member
          if (parsed) {
            const matched = members.find(
              (m) =>
                m.id === parsed.id ||
                (m.email && m.email.toLowerCase() === parsed.email?.toLowerCase()) ||
                (m.phone && m.phone === parsed.phone)
            );
            if (matched) return matched;
          }

          // 2. If parsed user is dummy Saikat but the mess has real members (e.g. Mazharul Islam):
          // Automatically sync with the actual manager/member of this mess!
          const activeManager = members.find((m) => m.role === 'manager') || members[0];
          if (activeManager) {
            if (typeof localStorage !== 'undefined') {
              localStorage.setItem('smm_auth_user_v2', JSON.stringify(activeManager));
            }
            return activeManager;
          }
        }
      }

      if (parsed) return parsed;
    } catch (e) {
      console.error('Error reading auth user:', e);
    }

    return {
      id: 'mem-001',
      name: 'Saikat',
      email: 'saikat@mess.ac.bd',
      phone: '01711223344',
      role: 'manager',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    };
  });

  const [loading, setLoading] = useState(false);

  // Proactively sync user with active mess members if stored user is out-of-sync
  useEffect(() => {
    try {
      if (typeof localStorage === 'undefined') return;
      const rawMembers = localStorage.getItem('smm_members_v2');
      if (rawMembers) {
        const members = JSON.parse(rawMembers);
        if (Array.isArray(members) && members.length > 0) {
          const isMemberPresent = members.some(
            (m) =>
              m.id === user?.id ||
              (m.email && m.email.toLowerCase() === user?.email?.toLowerCase())
          );
          // If the active user has the placeholder Saikat email, but the mess has real members:
          if (!isMemberPresent || user?.email === 'saikat@mess.ac.bd') {
            const realLeader = members.find((m) => m.role === 'manager') || members[0];
            if (realLeader && realLeader.email !== 'saikat@mess.ac.bd') {
              setUser(realLeader);
              localStorage.setItem('smm_auth_user_v2', JSON.stringify(realLeader));
            }
          }
        }
      }
    } catch (e) {
      console.error('Error synchronizing auth user:', e);
    }
  }, []);

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
    const updated = { ...user, role: newRole };
    setUser(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smm_auth_user_v2', JSON.stringify(updated));
    }
  };

  // Demote active user to member when manager role is transferred
  const demoteToMember = () => {
    if (!user) return;
    const updated = { ...user, role: 'member' };
    setUser(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smm_auth_user_v2', JSON.stringify(updated));
    }
    return updated;
  };

  // Promote active user to manager
  const promoteToManager = () => {
    if (!user) return;
    const updated = { ...user, role: 'manager' };
    setUser(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smm_auth_user_v2', JSON.stringify(updated));
    }
    return updated;
  };

  // Switch session to another member in the roster
  const loginAsMemberUser = (member) => {
    if (!member) return;
    const switchedUser = {
      id: member.id || member.memberId,
      name: member.name,
      email: member.email || `${member.name.toLowerCase().replace(/\s+/g, '')}@mess.ac.bd`,
      phone: member.phone || '',
      role: member.role || 'member',
      avatar: member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    };
    setUser(switchedUser);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smm_auth_user_v2', JSON.stringify(switchedUser));
    }
    return switchedUser;
  };

  // Update avatar
  const updateAvatar = (newAvatar) => {
    if (!user) return;
    const updated = { ...user, avatar: newAvatar };
    setUser(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smm_auth_user_v2', JSON.stringify(updated));
    }
    return updated;
  };

  // Update profile details
  const updateUserProfile = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('smm_auth_user_v2', JSON.stringify(updated));
    }
    return updated;
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
        const cleanInput = (email || '').trim().toLowerCase();
        let storedMembers = [];
        try {
          const raw = localStorage.getItem('smm_members_v2');
          if (raw) storedMembers = JSON.parse(raw);
        } catch (e) {}

        // 1. Look for existing member matching email, phone, or name
        const matchedMember = storedMembers.find(
          (m) =>
            (m.email && m.email.trim().toLowerCase() === cleanInput) ||
            (m.phone && m.phone.trim() === cleanInput) ||
            (m.name && m.name.trim().toLowerCase() === cleanInput)
        );

        if (matchedMember) {
          setUser(matchedMember);
          localStorage.setItem('smm_auth_user_v2', JSON.stringify(matchedMember));
          return { success: true, user: matchedMember };
        }

        // 2. Explicit demo logins
        if (cleanInput.includes('demo-manager') || cleanInput === 'saikat@mess.ac.bd') {
          return { success: true, user: loginAsManager() };
        }
        if (cleanInput.includes('demo-member') || cleanInput === 'shakib@mess.ac.bd') {
          return { success: true, user: loginAsMember() };
        }

        // 3. Custom email / login (e.g. mazharulislamsaikat2000gmail.com)
        const activeManager = storedMembers.find((m) => m.role === 'manager');
        const isResident = cleanInput.includes('member') || cleanInput.includes('resident');
        const role = isResident ? 'member' : (activeManager ? 'member' : 'manager');

        // Extract clean readable name from email
        let cleanName = (email || '').split('@')[0].replace(/[._0-9]/g, ' ').trim();
        if (!cleanName) cleanName = 'User';
        cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

        const customUser = {
          id: `mem-${Date.now()}`,
          name: cleanName,
          email: email.trim(),
          phone: '',
          role,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
        };
        setUser(customUser);
        localStorage.setItem('smm_auth_user_v2', JSON.stringify(customUser));
        return { success: true, user: customUser };
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
        loginAsMemberUser,
        demoteToMember,
        promoteToManager,
        switchRole,
        updateAvatar,
        updateUserProfile,
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
