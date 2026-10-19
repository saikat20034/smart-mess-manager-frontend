import { describe, it, expect } from 'vitest';
import {
  formatBDT,
  calculateMealUnits,
  calculateTotalMealUnits,
  calculateMealRate,
  allocateSharedExpenses,
  categorizeExpenses,
  calculateMemberBalances,
  DEFAULT_CONFIG
} from './calculations.js';

describe('Calculations Utility Tests', () => {
  it('formats BDT currency correctly', () => {
    expect(formatBDT(1500)).toBe('৳ 1,500.00');
    expect(formatBDT(0)).toBe('৳ 0.00');
    expect(formatBDT(23.456)).toBe('৳ 23.46');
  });

  it('calculates meal units with default weights (0.5, 1.0, 1.0)', () => {
    const entry = { breakfast: 1, lunch: 1, dinner: 1 };
    expect(calculateMealUnits(entry, DEFAULT_CONFIG)).toBe(2.5);

    const halfBreakfast = { breakfast: 0.5, lunch: 0, dinner: 1 };
    expect(calculateMealUnits(halfBreakfast, DEFAULT_CONFIG)).toBe(1.25);
  });

  it('calculates total meal units correctly across entries', () => {
    const entries = [
      { breakfast: 1, lunch: 1, dinner: 1 }, // 2.5
      { breakfast: 0, lunch: 1, dinner: 1 }, // 2.0
      { breakfast: 1, lunch: 0, dinner: 0 }  // 0.5
    ];
    expect(calculateTotalMealUnits(entries, DEFAULT_CONFIG)).toBe(5.0);
  });

  it('calculates meal rate correctly and handles zero meals', () => {
    const expenses = [
      { amount: 2000, is_meal_related: true },
      { amount: 1500, is_meal_related: true },
      { amount: 800, is_meal_related: false } // WiFi (non-meal)
    ];
    // Meal expenses = 3500, meals = 100 -> rate = 35.00
    expect(calculateMealRate(expenses, 100)).toBe(35);

    // Zero meals should safely return 0 without division by zero
    expect(calculateMealRate(expenses, 0)).toBe(0);
  });

  it('categorizes expenses accurately', () => {
    const expenses = [
      { title: 'Rice', amount: 2000, is_meal_related: true },
      { title: 'Chicken', amount: 1200, is_meal_related: true },
      { title: 'Cook Salary', amount: 2500, is_meal_related: false },
      { title: 'Gas Cylinder', amount: 1400, is_meal_related: false }
    ];
    const cat = categorizeExpenses(expenses);
    expect(cat.mealExpenses).toBe(3200);
    expect(cat.sharedExpenses).toBe(3900);
    expect(cat.totalExpenses).toBe(7100);
  });

  it('allocates shared overhead equally among active members', () => {
    const members = [
      { id: '1', name: 'Tanvir', status: 'active' },
      { id: '2', name: 'Arif', status: 'active' },
      { id: '3', name: 'Rakib', status: 'active' },
      { id: '4', name: 'Sakib', status: 'inactive' } // inactive member excluded
    ];
    // 3 active members sharing 3000 -> 1000 each
    expect(allocateSharedExpenses(3000, members, 'equal')).toBe(1000);
  });

  it('calculates full member balances, cash in hand, and dues correctly', () => {
    const members = [
      { id: 'm1', name: 'Tanvir', role: 'manager', status: 'active' },
      { id: 'm2', name: 'Arif', role: 'member', status: 'active' }
    ];

    // Tanvir: 20 meals; Arif: 30 meals; Total = 50 meals
    const meals = [
      { member_id: 'm1', breakfast: 0, lunch: 10, dinner: 10 }, // 20 units
      { member_id: 'm2', breakfast: 0, lunch: 15, dinner: 15 }  // 30 units
    ];

    // Meal expenses = 2000 (rate = 2000/50 = 40 ৳/meal)
    // Shared overhead = 1000 (500 per member)
    const expenses = [
      { amount: 2000, is_meal_related: true },
      { amount: 1000, is_meal_related: false }
    ];

    // Tanvir deposited 2000; Arif deposited 1200
    const deposits = [
      { member_id: 'm1', amount: 2000 },
      { member_id: 'm2', amount: 1200 }
    ];

    const result = calculateMemberBalances({ members, meals, expenses, deposits });

    // Summary checks
    expect(result.summary.totalMealUnits).toBe(50);
    expect(result.summary.mealRate).toBe(40);
    expect(result.summary.totalExpenses).toBe(3000);
    expect(result.summary.totalDeposits).toBe(3200);
    expect(result.summary.cashInHand).toBe(200); // 3200 - 3000 = 200

    // Member 1 (Tanvir):
    // Meal Cost = 20 * 40 = 800; Shared = 500; Total Cost = 1300
    // Deposits = 2000 -> Net Balance = 2000 - 1300 = +700 (Credit)
    const tanvir = result.members.find(m => m.memberId === 'm1');
    expect(tanvir.mealCost).toBe(800);
    expect(tanvir.sharedCost).toBe(500);
    expect(tanvir.totalCost).toBe(1300);
    expect(tanvir.netBalance).toBe(700);
    expect(tanvir.isCredit).toBe(true);

    // Member 2 (Arif):
    // Meal Cost = 30 * 40 = 1200; Shared = 500; Total Cost = 1700
    // Deposits = 1200 -> Net Balance = 1200 - 1700 = -500 (Due)
    const arif = result.members.find(m => m.memberId === 'm2');
    expect(arif.mealCost).toBe(1200);
    expect(arif.sharedCost).toBe(500);
    expect(arif.totalCost).toBe(1700);
    expect(arif.netBalance).toBe(-500);
    expect(arif.isDue).toBe(true);

    expect(result.summary.outstandingDues).toBe(500);
    expect(result.summary.totalCredits).toBe(700);
  });
});
