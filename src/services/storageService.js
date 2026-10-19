import {
  INITIAL_MESS,
  INITIAL_MEMBERS,
  INITIAL_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_DEPOSITS,
  INITIAL_MEALS,
  INITIAL_ACTIVITIES
} from './demoData';
import { supabase, isSupabaseConfigured } from './supabase';

const STORAGE_KEYS = {
  MESS: 'smm_mess_data',
  MEMBERS: 'smm_members',
  CATEGORIES: 'smm_categories',
  EXPENSES: 'smm_expenses',
  DEPOSITS: 'smm_deposits',
  MEALS: 'smm_meals',
  SETTLEMENTS: 'smm_settlements',
  ACTIVITIES: 'smm_activities'
};

// Helper to safely read from localStorage
function getLocalItem(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return fallback;
  }
}

// Helper to safely write to localStorage
function setLocalItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
  }
}

// Initialize localStorage with demo data if empty
export function initLocalStorageIfEmpty() {
  if (!localStorage.getItem(STORAGE_KEYS.MESS)) {
    setLocalItem(STORAGE_KEYS.MESS, INITIAL_MESS);
    setLocalItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    setLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    setLocalItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    setLocalItem(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
    setLocalItem(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    setLocalItem(STORAGE_KEYS.SETTLEMENTS, []);
    setLocalItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  }
}

export function resetDemoData() {
  localStorage.removeItem(STORAGE_KEYS.MESS);
  localStorage.removeItem(STORAGE_KEYS.MEMBERS);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.EXPENSES);
  localStorage.removeItem(STORAGE_KEYS.DEPOSITS);
  localStorage.removeItem(STORAGE_KEYS.MEALS);
  localStorage.removeItem(STORAGE_KEYS.SETTLEMENTS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  initLocalStorageIfEmpty();
}

// Auto init on load
initLocalStorageIfEmpty();

// ============================================================================
// DATA ACCESS LAYER
// ============================================================================

export const dataService = {
  // 1. Mess details
  async getMess() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('messes').select('*').limit(1).single();
      if (!error && data) return data;
    }
    return getLocalItem(STORAGE_KEYS.MESS, INITIAL_MESS);
  },

  async updateMess(updates) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('messes').update(updates).eq('id', updates.id).select().single();
      if (!error && data) return data;
    }
    const current = getLocalItem(STORAGE_KEYS.MESS, INITIAL_MESS);
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    setLocalItem(STORAGE_KEYS.MESS, updated);
    this.logActivity('UPDATE_SETTINGS', 'Mess settings updated', `Updated mess configuration`);
    return updated;
  },

  // 2. Members
  async getMembers() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('mess_members').select('*').order('joined_at', { ascending: true });
      if (!error && data) return data;
    }
    return getLocalItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
  },

  async addMember(memberData) {
    const newMember = {
      id: `mem-${Date.now()}`,
      joined_at: new Date().toISOString().split('T')[0],
      status: 'active',
      role: 'member',
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?w=100&h=100&fit=crop`,
      ...memberData
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('mess_members').insert([newMember]).select().single();
      if (!error && data) return data;
    }

    const members = getLocalItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    members.push(newMember);
    setLocalItem(STORAGE_KEYS.MEMBERS, members);
    this.logActivity('ADD_MEMBER', `Member added: ${newMember.name}`, `Room: ${newMember.room_number || 'N/A'}`);
    return newMember;
  },

  async updateMember(id, updates) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('mess_members').update(updates).eq('id', id).select().single();
      if (!error && data) return data;
    }
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index] = { ...members[index], ...updates };
      setLocalItem(STORAGE_KEYS.MEMBERS, members);
      this.logActivity('UPDATE_MEMBER', `Updated member: ${members[index].name}`, `Status: ${members[index].status}`);
      return members[index];
    }
    return null;
  },

  async deactivateMember(id) {
    return this.updateMember(id, { status: 'inactive' });
  },

  // 3. Categories
  async getCategories() {
    return getLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // 4. Meals
  async getMeals(monthYear) {
    const allMeals = getLocalItem(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    if (!monthYear) return allMeals;
    return allMeals.filter(m => m.date && m.date.startsWith(monthYear));
  },

  async saveMealsBulk(date, memberMealEntries) {
    // memberMealEntries: array of { member_id, breakfast, lunch, dinner, notes }
    const allMeals = getLocalItem(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    // remove existing for this date
    const filtered = allMeals.filter(m => m.date !== date);

    memberMealEntries.forEach(entry => {
      filtered.push({
        id: `meal-${date}-${entry.member_id}`,
        date,
        member_id: entry.member_id,
        breakfast: Number(entry.breakfast) || 0,
        lunch: Number(entry.lunch) || 0,
        dinner: Number(entry.dinner) || 0,
        notes: entry.notes || ''
      });
    });

    setLocalItem(STORAGE_KEYS.MEALS, filtered);
    this.logActivity('RECORD_MEALS', `Bulk meals recorded for ${date}`, `Updated ${memberMealEntries.length} members`);
    return filtered.filter(m => m.date === date);
  },

  async saveMealEntry(mealEntry) {
    const allMeals = getLocalItem(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    const existingIdx = allMeals.findIndex(
      m => m.date === mealEntry.date && m.member_id === mealEntry.member_id
    );

    const record = {
      id: mealEntry.id || `meal-${mealEntry.date}-${mealEntry.member_id}`,
      ...mealEntry
    };

    if (existingIdx !== -1) {
      allMeals[existingIdx] = record;
    } else {
      allMeals.push(record);
    }

    setLocalItem(STORAGE_KEYS.MEALS, allMeals);
    return record;
  },

  // 5. Expenses
  async getExpenses(monthYear) {
    const all = getLocalItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    if (!monthYear) return all;
    return all.filter(e => e.date && e.date.startsWith(monthYear));
  },

  async addExpense(expenseData) {
    const newExpense = {
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...expenseData
    };
    const expenses = getLocalItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    expenses.unshift(newExpense);
    setLocalItem(STORAGE_KEYS.EXPENSES, expenses);
    this.logActivity(
      'RECORD_EXPENSE',
      `Expense: ${newExpense.title}`,
      `৳ ${newExpense.amount} (${newExpense.is_meal_related ? 'Meal Bazar' : 'Shared Cost'})`
    );
    return newExpense;
  },

  async updateExpense(id, updates) {
    const expenses = getLocalItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const index = expenses.findIndex(e => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      setLocalItem(STORAGE_KEYS.EXPENSES, expenses);
      this.logActivity('UPDATE_EXPENSE', `Updated expense: ${expenses[index].title}`, `৳ ${expenses[index].amount}`);
      return expenses[index];
    }
    return null;
  },

  async deleteExpense(id) {
    const expenses = getLocalItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const target = expenses.find(e => e.id === id);
    const filtered = expenses.filter(e => e.id !== id);
    setLocalItem(STORAGE_KEYS.EXPENSES, filtered);
    if (target) {
      this.logActivity('DELETE_EXPENSE', `Deleted expense: ${target.title}`, `৳ ${target.amount}`);
    }
    return true;
  },

  // 6. Deposits
  async getDeposits(monthYear) {
    const all = getLocalItem(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
    if (!monthYear) return all;
    return all.filter(d => d.date && d.date.startsWith(monthYear));
  },

  async addDeposit(depositData) {
    const newDeposit = {
      id: `dep-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...depositData
    };
    const deposits = getLocalItem(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
    deposits.unshift(newDeposit);
    setLocalItem(STORAGE_KEYS.DEPOSITS, deposits);
    this.logActivity(
      'RECORD_DEPOSIT',
      `Deposit from ${newDeposit.member_name}`,
      `৳ ${newDeposit.amount} via ${newDeposit.payment_method}`
    );
    return newDeposit;
  },

  async updateDeposit(id, updates) {
    const deposits = getLocalItem(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
    const index = deposits.findIndex(d => d.id === id);
    if (index !== -1) {
      deposits[index] = { ...deposits[index], ...updates };
      setLocalItem(STORAGE_KEYS.DEPOSITS, deposits);
      this.logActivity('UPDATE_DEPOSIT', `Updated deposit: ৳ ${deposits[index].amount}`, `${deposits[index].member_name}`);
      return deposits[index];
    }
    return null;
  },

  async deleteDeposit(id) {
    const deposits = getLocalItem(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
    const target = deposits.find(d => d.id === id);
    const filtered = deposits.filter(d => d.id !== id);
    setLocalItem(STORAGE_KEYS.DEPOSITS, filtered);
    if (target) {
      this.logActivity('DELETE_DEPOSIT', `Deleted deposit: ৳ ${target.amount}`, `${target.member_name}`);
    }
    return true;
  },

  // 7. Monthly Settlement
  async getSettlements() {
    return getLocalItem(STORAGE_KEYS.SETTLEMENTS, []);
  },

  async finalizeSettlement(settlementData) {
    const settlements = getLocalItem(STORAGE_KEYS.SETTLEMENTS, []);
    const record = {
      id: `set-${Date.now()}`,
      is_finalized: true,
      finalized_at: new Date().toISOString(),
      ...settlementData
    };
    settlements.unshift(record);
    setLocalItem(STORAGE_KEYS.SETTLEMENTS, settlements);
    this.logActivity(
      'FINALIZE_SETTLEMENT',
      `Finalized settlement for ${settlementData.month}/${settlementData.year}`,
      `Meal Rate: ৳ ${settlementData.mealRate}`
    );
    return record;
  },

  async reopenSettlement(id) {
    const settlements = getLocalItem(STORAGE_KEYS.SETTLEMENTS, []);
    const target = settlements.find(s => s.id === id);
    if (target) {
      target.is_finalized = false;
      target.reopened_at = new Date().toISOString();
      setLocalItem(STORAGE_KEYS.SETTLEMENTS, settlements);
      this.logActivity('REOPEN_SETTLEMENT', `Settlement reopened for correction`, `Month: ${target.month}/${target.year}`);
    }
    return target;
  },

  // 8. Activities / Audit Trail
  async getActivityLogs() {
    return getLocalItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  },

  logActivity(action, title, details) {
    const logs = getLocalItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    const newLog = {
      id: `act-${Date.now()}`,
      action,
      title,
      details,
      timestamp: new Date().toISOString()
    };
    logs.unshift(newLog);
    // keep latest 50
    if (logs.length > 50) logs.pop();
    setLocalItem(STORAGE_KEYS.ACTIVITIES, logs);
    return newLog;
  }
};
