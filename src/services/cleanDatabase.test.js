import { describe, it, expect, beforeEach } from 'vitest';

// Setup mock localStorage on global object before importing modules
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); }
};

import { cleanDatabase, STORAGE_KEYS } from './storageService';
import { calculateMemberBalances } from '../utils/calculations';

describe('Clean Database Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('purges all demo records and sets clean database flag', () => {
    const manager = {
      id: 'mem-saikat',
      name: 'Saikat',
      email: 'saikat@mess.ac.bd',
      phone: '01711223344',
      role: 'manager'
    };

    const res = cleanDatabase(manager);

    expect(localStorage.getItem(STORAGE_KEYS.CLEAN_DATABASE_FLAG)).toBe('true');
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.MEALS))).toEqual([]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES))).toEqual([]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.DEPOSITS))).toEqual([]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTLEMENTS))).toEqual([]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.BAZAR_LIST))).toEqual([]);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEYS.BAZAR_SCHEDULE))).toEqual([]);

    const storedMembers = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEMBERS));
    expect(storedMembers.length).toBe(1);
    expect(storedMembers[0].name).toBe('Saikat');
    expect(storedMembers[0].role).toBe('manager');
  });

  it('financial calculations on clean database yield 0 for all metrics', () => {
    const members = [
      { id: 'mem-001', name: 'Saikat', role: 'manager', status: 'active' }
    ];
    const meals = [];
    const expenses = [];
    const deposits = [];
    const settings = { breakfast_unit: 1.0, lunch_unit: 1.0, dinner_unit: 1.0 };

    const financialData = calculateMemberBalances({
      members,
      meals,
      expenses,
      deposits,
      settings
    });

    expect(financialData.summary.totalMealUnits).toBe(0);
    expect(financialData.summary.mealExpenses).toBe(0);
    expect(financialData.summary.totalDeposits).toBe(0);
    expect(financialData.summary.mealRate).toBe(0);
    expect(financialData.summary.cashInHand).toBe(0);

    expect(financialData.members.length).toBe(1);
    expect(financialData.members[0].mealUnits).toBe(0);
    expect(financialData.members[0].totalCost).toBe(0);
    expect(financialData.members[0].totalDeposits).toBe(0);
    expect(financialData.members[0].netBalance).toBe(0);
  });
});
