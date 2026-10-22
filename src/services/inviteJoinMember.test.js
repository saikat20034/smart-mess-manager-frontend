import { describe, it, expect, beforeEach } from 'vitest';

const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  get length() { return Object.keys(store).length; },
  key: (i) => Object.keys(store)[i] || null
};

import { dataService, STORAGE_KEYS } from './storageService';
import { getSupabaseCredentials, setCustomSupabaseConfig, clearCustomSupabaseConfig } from './supabase';

describe('Invitation Join & Member Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a new member to local members table and all registered members directory', async () => {
    const existingManager = {
      id: 'mgr-1',
      name: 'Mazharul Islam',
      role: 'manager',
      email: 'manager@example.com'
    };
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([existingManager]));

    // Mess registry
    const targetMess = {
      id: 'mess-101',
      name: 'Padma Mess',
      invite_code: 'PADMA99',
      members_count: 1
    };
    localStorage.setItem(STORAGE_KEYS.ALL_MESSES, JSON.stringify([targetMess]));

    const newMember = {
      id: 'mem-202',
      name: 'Tanvir Ahmed',
      role: 'member',
      email: 'tanvir@example.com',
      phone: '01700000000',
      mess_id: 'mess-101',
      mess_name: 'Padma Mess'
    };

    const saved = await dataService.addMember(newMember);
    expect(saved).toBeDefined();
    expect(saved.name).toBe('Tanvir Ahmed');

    // Check STORAGE_KEYS.MEMBERS
    const members = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
    expect(members.length).toBe(2);
    expect(members.find((m) => m.name === 'Tanvir Ahmed')).toBeDefined();

    // Check smm_all_registered_members
    const allMembers = JSON.parse(localStorage.getItem('smm_all_registered_members'));
    expect(allMembers).toBeDefined();
    expect(allMembers.find((m) => m.name === 'Tanvir Ahmed')).toBeDefined();

    // Check members_count incremented in registered messes
    const messes = JSON.parse(localStorage.getItem(STORAGE_KEYS.ALL_MESSES));
    expect(messes[0].members_count).toBe(2);
  });

  it('manages custom Supabase credentials properly in localStorage', () => {
    // Initially not configured (assuming env is empty or default)
    expect(getSupabaseCredentials()).toBeDefined();

    // Set custom credentials
    if (typeof window === 'undefined') {
      global.window = { location: { reload: () => {} } };
    } else {
      window.location = { reload: () => {} };
    }

    setCustomSupabaseConfig('https://mycustomproject.supabase.co', 'eyJcustomkey123');
    expect(localStorage.getItem('smm_vite_supabase_url')).toBe('https://mycustomproject.supabase.co');
    expect(localStorage.getItem('smm_vite_supabase_anon_key')).toBe('eyJcustomkey123');

    // Clear custom credentials
    clearCustomSupabaseConfig();
    expect(localStorage.getItem('smm_vite_supabase_url')).toBeNull();
    expect(localStorage.getItem('smm_vite_supabase_anon_key')).toBeNull();
  });
});
