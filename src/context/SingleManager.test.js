import { describe, it, expect, beforeEach } from 'vitest';

// Setup mock localStorage on global object before importing modules
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
};

import { dataService, STORAGE_KEYS } from '../services/storageService';

describe('Single Manager Invariant & Role Transfer', () => {
  beforeEach(() => {
    localStorage.clear();
    // Initialize mock members with 1 manager and 3 regular members
    const initialMembers = [
      {
        id: 'mem-001',
        name: 'Saikat',
        role: 'manager',
        status: 'active',
        phone: '01711223344'
      },
      {
        id: 'mem-002',
        name: 'Nasir',
        role: 'member',
        status: 'active',
        phone: '01822334455'
      },
      {
        id: 'mem-003',
        name: 'Shakib',
        role: 'member',
        status: 'active',
        phone: '01933445566'
      },
      {
        id: 'mem-004',
        name: 'Nazir Hossain',
        role: 'member',
        status: 'active',
        phone: '01644556677'
      }
    ];
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(initialMembers));
  });

  it('guarantees strictly one manager initially', async () => {
    const members = await dataService.getMembers();
    const managers = members.filter((m) => m.role === 'manager');
    expect(managers.length).toBe(1);
    expect(managers[0].name).toBe('Saikat');
  });

  it('transfers manager role to another member and demotes previous manager to member', async () => {
    const transferResult = await dataService.transferManagerRole('mem-002', 'Saikat');
    expect(transferResult).toBeDefined();
    expect(transferResult.newManager.id).toBe('mem-002');
    expect(transferResult.previousManager.id).toBe('mem-001');

    const updatedMembers = await dataService.getMembers();
    const managers = updatedMembers.filter((m) => m.role === 'manager');
    expect(managers.length).toBe(1);
    expect(managers[0].id).toBe('mem-002');
    expect(managers[0].name).toBe('Nasir');

    // Confirm previous manager is now a regular member
    const previousManager = updatedMembers.find((m) => m.id === 'mem-001');
    expect(previousManager.role).toBe('member');
  });

  it('maintains exactly one manager across multiple consecutive transfers', async () => {
    // 1. Transfer to Shakib (mem-003)
    await dataService.transferManagerRole('mem-003', 'Saikat');
    let members = await dataService.getMembers();
    expect(members.filter((m) => m.role === 'manager').length).toBe(1);
    expect(members.find((m) => m.role === 'manager').name).toBe('Shakib');

    // 2. Transfer to Nazir (mem-004)
    await dataService.transferManagerRole('mem-004', 'Shakib');
    members = await dataService.getMembers();
    expect(members.filter((m) => m.role === 'manager').length).toBe(1);
    expect(members.find((m) => m.role === 'manager').name).toBe('Nazir Hossain');

    // 3. Transfer back to Saikat (mem-001)
    await dataService.transferManagerRole('mem-001', 'Nazir Hossain');
    members = await dataService.getMembers();
    expect(members.filter((m) => m.role === 'manager').length).toBe(1);
    expect(members.find((m) => m.role === 'manager').name).toBe('Saikat');
  });

  it('self-heals if duplicate managers were ever placed in storage', async () => {
    // Simulate corrupted storage with 2 managers
    const corruptedMembers = [
      { id: 'mem-001', name: 'Saikat', role: 'manager', status: 'active' },
      { id: 'mem-002', name: 'Nasir', role: 'manager', status: 'active' },
      { id: 'mem-003', name: 'Shakib', role: 'member', status: 'active' }
    ];
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(corruptedMembers));

    const normalizedMembers = await dataService.getMembers();
    const managers = normalizedMembers.filter((m) => m.role === 'manager');
    expect(managers.length).toBe(1);
    expect(managers[0].id).toBe('mem-001');
    expect(normalizedMembers.find((m) => m.id === 'mem-002').role).toBe('member');
  });
});
