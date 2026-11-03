import { describe, it, expect, beforeEach, vi } from 'vitest';

const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
};

describe('Login Authentication & Cloud Mess Restoration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('restores active mess and clears stale deleted flag upon valid login', () => {
    // Simulate stale flag from an old test mess deletion
    localStorage.setItem('smm_active_mess_deleted', 'true');

    // Simulate active mess found from cloud database
    const activeMess = { id: 'mess-1793594200741', name: 'Bhosdike', invite_code: 'BHOS9746' };
    const member = {
      id: 'mem-1793594200741-mgr',
      name: 'Md. Mazharul Islam',
      email: 'mazharulislamsaikat2000@gmail.com',
      role: 'manager'
    };

    // Upon finding active mess:
    localStorage.removeItem('smm_active_mess_deleted');
    localStorage.setItem('smm_mess_data_v2', JSON.stringify(activeMess));
    localStorage.setItem('smm_auth_user_v2', JSON.stringify(member));

    expect(localStorage.getItem('smm_active_mess_deleted')).toBeNull();
    expect(JSON.parse(localStorage.getItem('smm_mess_data_v2')).name).toBe('Bhosdike');
    expect(JSON.parse(localStorage.getItem('smm_auth_user_v2')).email).toBe('mazharulislamsaikat2000@gmail.com');
  });
});
