/**
 * Smart Mess Manager - Mathematical Calculation Engine
 * Currency: Bangladeshi Taka (BDT ৳)
 * Sign Convention:
 *   Positive balance (>= 0) = Credit / Surplus (Mess owes member or advance remaining)
 *   Negative balance (< 0)  = Due / Deficit (Member owes mess)
 */

export const DEFAULT_CONFIG = {
  breakfast_unit: 1.0,
  lunch_unit: 1.0,
  dinner_unit: 1.0,
  shared_expense_policy: 'equal' // 'equal' | 'per_meal'
};

/**
 * Format any numeric value as Bangladeshi Taka (BDT)
 * e.g. 1250.5 -> "৳ 1,250.50"
 */
export function formatBDT(amount) {
  const num = Number(amount) || 0;
  return `৳ ${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * Calculate total meal units for a single meal record based on weights
 */
export function calculateMealUnits(entry = {}, config = DEFAULT_CONFIG) {
  const bWeight = Number(config?.breakfast_unit ?? 1.0);
  const lWeight = Number(config?.lunch_unit ?? 1.0);
  const dWeight = Number(config?.dinner_unit ?? 1.0);

  const b = (Number(entry.breakfast) || 0) * bWeight;
  const l = (Number(entry.lunch) || 0) * lWeight;
  const d = (Number(entry.dinner) || 0) * dWeight;

  return Math.round((b + l + d + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate total meal units across all entries for given period
 */
export function calculateTotalMealUnits(entries = [], config = DEFAULT_CONFIG) {
  const total = entries.reduce((acc, entry) => {
    return acc + calculateMealUnits(entry, config);
  }, 0);
  return Math.round((total + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate meal rate: Total Meal Expenses / Total Meal Units
 */
export function calculateMealRate(expenses = [], totalMealUnits = 0) {
  if (!totalMealUnits || totalMealUnits <= 0) {
    return 0;
  }

  const mealExpenses = expenses
    .filter(exp => exp.is_meal_related !== false)
    .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

  const rate = mealExpenses / totalMealUnits;
  return Math.round((rate + Number.EPSILON) * 100) / 100;
}

/**
 * Aggregate expenses by type: meal-related (bazar) vs shared overhead
 */
export function categorizeExpenses(expenses = []) {
  let mealExpenses = 0;
  let sharedExpenses = 0;

  expenses.forEach(exp => {
    const amt = Number(exp.amount) || 0;
    if (exp.is_meal_related !== false) {
      mealExpenses += amt;
    } else {
      sharedExpenses += amt;
    }
  });

  return {
    mealExpenses: Math.round((mealExpenses + Number.EPSILON) * 100) / 100,
    sharedExpenses: Math.round((sharedExpenses + Number.EPSILON) * 100) / 100,
    totalExpenses: Math.round((mealExpenses + sharedExpenses + Number.EPSILON) * 100) / 100
  };
}

/**
 * Allocate shared non-meal expenses among members
 */
export function allocateSharedExpenses(sharedExpensesAmount = 0, members = [], policy = 'equal') {
  const activeMembers = members.filter(m => m.status === 'active' || !m.status);
  const count = Math.max(activeMembers.length, 1);

  if (policy === 'equal') {
    const perMember = sharedExpensesAmount / count;
    return Math.round((perMember + Number.EPSILON) * 100) / 100;
  }

  return Math.round(((sharedExpensesAmount / count) + Number.EPSILON) * 100) / 100;
}

/**
 * Calculate complete member balances and audit breakdown
 */
export function calculateMemberBalances({
  members = [],
  meals = [],
  expenses = [],
  deposits = [],
  settings = DEFAULT_CONFIG
}) {
  // 1. Calculate meal units per member
  const memberUnitsMap = {};
  members.forEach(m => {
    memberUnitsMap[m.id] = 0;
  });

  meals.forEach(entry => {
    const units = calculateMealUnits(entry, settings);
    if (memberUnitsMap[entry.member_id] !== undefined) {
      memberUnitsMap[entry.member_id] += units;
    }
  });

  // 2. Total meal units
  const totalMealUnits = Object.values(memberUnitsMap).reduce((a, b) => a + b, 0);

  // 3. Categorize expenses
  const { mealExpenses, sharedExpenses, totalExpenses } = categorizeExpenses(expenses);

  // 4. Meal Rate
  const mealRate = totalMealUnits > 0
    ? Math.round(((mealExpenses / totalMealUnits) + Number.EPSILON) * 100) / 100
    : 0;

  // 5. Shared cost per active member
  const activeMembers = members.filter(m => m.status !== 'inactive' && m.status !== 'archived');
  const sharedCostPerMember = allocateSharedExpenses(
    sharedExpenses,
    activeMembers,
    settings.shared_expense_policy
  );

  // 6. Deposits per member
  const depositsMap = {};
  members.forEach(m => {
    depositsMap[m.id] = 0;
  });

  deposits.forEach(dep => {
    if (depositsMap[dep.member_id] !== undefined) {
      depositsMap[dep.member_id] += Number(dep.amount) || 0;
    }
  });

  // 7. Assemble per-member items
  const memberSummaries = members.map(member => {
    const units = Math.round(((memberUnitsMap[member.id] || 0) + Number.EPSILON) * 100) / 100;
    const mealCost = Math.round(((units * mealRate) + Number.EPSILON) * 100) / 100;
    const sharedCost = member.status === 'inactive' ? 0 : sharedCostPerMember;
    const totalCost = Math.round(((mealCost + sharedCost) + Number.EPSILON) * 100) / 100;
    const totalDeposits = Math.round(((depositsMap[member.id] || 0) + Number.EPSILON) * 100) / 100;
    const netBalance = Math.round(((totalDeposits - totalCost) + Number.EPSILON) * 100) / 100;

    return {
      memberId: member.id,
      name: member.name,
      phone: member.phone || '',
      email: member.email || '',
      roomNumber: member.room_number || '',
      role: member.role || 'member',
      status: member.status || 'active',
      mealUnits: units,
      mealCost,
      sharedCost,
      totalCost,
      totalDeposits,
      netBalance,
      isCredit: netBalance >= 0,
      isDue: netBalance < 0
    };
  });

  // 8. Overall totals
  const totalDepositsAll = Object.values(depositsMap).reduce((a, b) => a + b, 0);
  const outstandingDues = memberSummaries
    .filter(m => m.netBalance < 0)
    .reduce((sum, m) => sum + Math.abs(m.netBalance), 0);
  const totalCredits = memberSummaries
    .filter(m => m.netBalance > 0)
    .reduce((sum, m) => sum + m.netBalance, 0);

  // Cash in hand = Total Deposits collected - Total Expenses spent
  const cashInHand = Math.round(((totalDepositsAll - totalExpenses) + Number.EPSILON) * 100) / 100;

  return {
    members: memberSummaries,
    summary: {
      totalMembers: members.length,
      activeMembers: activeMembers.length,
      totalMealUnits: Math.round((totalMealUnits + Number.EPSILON) * 100) / 100,
      mealExpenses,
      sharedExpenses,
      totalExpenses,
      mealRate,
      totalDeposits: Math.round((totalDepositsAll + Number.EPSILON) * 100) / 100,
      outstandingDues: Math.round((outstandingDues + Number.EPSILON) * 100) / 100,
      totalCredits: Math.round((totalCredits + Number.EPSILON) * 100) / 100,
      cashInHand
    }
  };
}
