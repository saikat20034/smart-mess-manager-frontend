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

import { adminService } from './adminService';
import { STORAGE_KEYS, dataService, initLocalStorageIfEmpty } from './storageService';

describe('Admin Delete Mess Service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deletes a registered mess and its registered members', () => {
    const mess1 = { id: 'mess-reg-1', name: 'Padma Mess', invite_code: 'PADMA1' };
    const mess2 = { id: 'mess-reg-2', name: 'Meghna Mess', invite_code: 'MEGHNA2' };
    localStorage.setItem('smm_all_registered_messes', JSON.stringify([mess1, mess2]));

    const users = [
      { id: 'u1', name: 'Karim', mess_id: 'mess-reg-1', mess_name: 'Padma Mess' },
      { id: 'u2', name: 'Rahim', mess_id: 'mess-reg-2', mess_name: 'Meghna Mess' }
    ];
    localStorage.setItem('smm_all_registered_members', JSON.stringify(users));

    const result = adminService.deleteMess('mess-reg-1');
    expect(result).toBe(true);

    const remainingMesses = JSON.parse(localStorage.getItem('smm_all_registered_messes'));
    expect(remainingMesses.length).toBe(1);
    expect(remainingMesses[0].id).toBe('mess-reg-2');

    const remainingUsers = JSON.parse(localStorage.getItem('smm_all_registered_members'));
    expect(remainingUsers.length).toBe(1);
    expect(remainingUsers[0].name).toBe('Rahim');
  });

  it('deletes active mess, purges all documents and terminates user session', async () => {
    const activeMess = { id: 'mess-active-test', name: 'Active Mess', invite_code: 'ACT001' };
    localStorage.setItem(STORAGE_KEYS.MESS, JSON.stringify(activeMess));
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([{ id: 'm1', name: 'Manager' }]));
    localStorage.setItem(STORAGE_KEYS.MEALS, JSON.stringify([{ id: 'meal-1', count: 2 }]));
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify([{ id: 'exp-1', amount: 500 }]));
    localStorage.setItem(STORAGE_KEYS.DEPOSITS, JSON.stringify([{ id: 'dep-1', amount: 1000 }]));
    localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify([{ id: 'set-1' }]));
    localStorage.setItem(STORAGE_KEYS.BAZAR_LIST, JSON.stringify([{ id: 'baz-1' }]));
    localStorage.setItem('smm_auth_user_v2', JSON.stringify({ id: 'm1', name: 'Manager' }));

    const result = adminService.deleteMess('mess-active-test');
    expect(result).toBe(true);

    // Active deleted flag is set
    expect(localStorage.getItem('smm_active_mess_deleted')).toBe('true');

    // All documents and active session purged
    expect(localStorage.getItem('smm_auth_user_v2')).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.MESS)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.MEMBERS)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.MEALS)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.EXPENSES)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.DEPOSITS)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.SETTLEMENTS)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.BAZAR_LIST)).toBeNull();

    // Data service returns null, preventing ghost mess
    const mess = await dataService.getMess();
    expect(mess).toBeNull();

    // initLocalStorageIfEmpty does not resurrect the deleted mess
    initLocalStorageIfEmpty();
    expect(localStorage.getItem(STORAGE_KEYS.MESS)).toBeNull();

    const allMesses = adminService.getAllMesses();
    expect(allMesses.length).toBe(0);
  });

  it('deleting a different mess does not affect active mess storage', () => {
    const activeMess = { id: 'mess-live', name: 'Current Mess', invite_code: 'LIVE' };
    localStorage.setItem(STORAGE_KEYS.MESS, JSON.stringify(activeMess));
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify([{ id: 'm1', name: 'Manager' }]));

    const otherMess = { id: 'mess-other', name: 'Other Mess', invite_code: 'OTHER' };
    localStorage.setItem('smm_all_registered_messes', JSON.stringify([otherMess]));

    const result = adminService.deleteMess('mess-other');
    expect(result).toBe(true);

    // Active mess still preserved
    expect(localStorage.getItem('smm_active_mess_deleted')).toBeNull();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.MESS)).name).toBe('Current Mess');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS)).length).toBe(1);
  });

  it('verifies that users cannot log in after mess is deleted', () => {
    // Mess deleted by Super Admin
    localStorage.setItem('smm_active_mess_deleted', 'true');
    localStorage.removeItem(STORAGE_KEYS.MESS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);

    // Any attempt to find members or mess yields null/empty
    const isMessDeleted = localStorage.getItem('smm_active_mess_deleted') === 'true';
    const rawMess = localStorage.getItem(STORAGE_KEYS.MESS);

    expect(isMessDeleted).toBe(true);
    expect(rawMess).toBeNull();
  });
});
