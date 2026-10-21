import {
  INITIAL_MESS,
  INITIAL_MEMBERS,
  INITIAL_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_DEPOSITS,
  INITIAL_MEALS,
  INITIAL_SETTLEMENTS,
  INITIAL_BAZAR_LIST,
  INITIAL_BAZAR_SCHEDULE,
  INITIAL_ACTIVITIES
} from './demoData';
import { supabase, isSupabaseConfigured } from './supabase';

export const STORAGE_KEYS = {
  MESS: 'smm_mess_data_v2',
  MEMBERS: 'smm_members_v2',
  CATEGORIES: 'smm_categories_v2',
  EXPENSES: 'smm_expenses_v2',
  DEPOSITS: 'smm_deposits_v2',
  MEALS: 'smm_meals_v2',
  SETTLEMENTS: 'smm_settlements_v2',
  ACTIVITIES: 'smm_activities_v2',
  BAZAR_LIST: 'smm_bazar_list_v2',
  BAZAR_SCHEDULE: 'smm_bazar_schedule_v2',
  MEAL_REQUESTS: 'smm_meal_requests_v2',
  CLEAN_DATABASE_FLAG: 'smm_clean_database_v2'
};

function getCleanFallback(key, fallback) {
  if (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEYS.CLEAN_DATABASE_FLAG) === 'true') {
    if (key === STORAGE_KEYS.MESS) {
      return {
        id: 'mess-clean',
        name: 'আমাদের মেস',
        subtitle: 'চলতি মাসের হিসাব',
        address: 'ঢাকা, বাংলাদেশ',
        currency: 'BDT',
        currency_symbol: '৳',
        invite_code: 'MESS2026',
        month_start_day: 1,
        breakfast_unit: 1.0,
        lunch_unit: 1.0,
        dinner_unit: 1.0,
        shared_expense_policy: 'equal',
        status: 'Running',
        is_clean: true
      };
    }
    if (key === STORAGE_KEYS.MEMBERS) {
      return [];
    }
    if (key === STORAGE_KEYS.MEAL_REQUESTS) {
      return { auto: false, morning: 0, lunch: 0, dinner: 0 };
    }
    return [];
  }
  return fallback;
}

function getLocalItem(key, fallback) {
  try {
    if (typeof localStorage === 'undefined') return getCleanFallback(key, fallback);
    const val = localStorage.getItem(key);
    if (val !== null && val !== undefined) {
      return JSON.parse(val);
    }
    return getCleanFallback(key, fallback);
  } catch (e) {
    console.error(`Error reading ${key}:`, e);
    return getCleanFallback(key, fallback);
  }
}

function setLocalItem(key, data) {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`Error writing ${key}:`, e);
  }
}

export function cleanDatabase(managerUser) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CLEAN_DATABASE_FLAG, 'true');
    }

    const currentMess = getLocalItem(STORAGE_KEYS.MESS, null);
    const existingName = (currentMess?.name && currentMess.name !== 'আপাতত নাম নাই, ...')
      ? currentMess.name
      : 'আমাদের মেস';

    const cleanMess = {
      id: currentMess?.id || `mess-${Date.now()}`,
      name: existingName,
      subtitle: 'চলতি মাসের হিসাব',
      address: currentMess?.address || 'ঢাকা, বাংলাদেশ',
      currency: 'BDT',
      currency_symbol: '৳',
      invite_code: currentMess?.invite_code || 'MESS2026',
      month_start_day: 1,
      breakfast_unit: 1.0,
      lunch_unit: 1.0,
      dinner_unit: 1.0,
      shared_expense_policy: 'equal',
      status: 'Running',
      is_clean: true
    };

    let activeManager = managerUser;
    if (!activeManager) {
      try {
        const savedAuth = localStorage.getItem('smm_auth_user_v2');
        if (savedAuth) {
          activeManager = JSON.parse(savedAuth);
        }
      } catch (e) {
        // fallback
      }
    }

    if (!activeManager) {
      activeManager = {
        id: 'mem-001',
        name: 'Saikat',
        email: 'saikat@mess.ac.bd',
        phone: '01711223344',
        role: 'manager',
        status: 'active',
        joined_at: new Date().toISOString().split('T')[0],
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
      };
    } else {
      activeManager = {
        ...activeManager,
        role: 'manager',
        status: 'active',
        joined_at: new Date().toISOString().split('T')[0]
      };
    }

    setLocalItem(STORAGE_KEYS.MESS, cleanMess);
    setLocalItem(STORAGE_KEYS.MEMBERS, [activeManager]);
    setLocalItem(STORAGE_KEYS.EXPENSES, []);
    setLocalItem(STORAGE_KEYS.DEPOSITS, []);
    setLocalItem(STORAGE_KEYS.MEALS, []);
    setLocalItem(STORAGE_KEYS.SETTLEMENTS, []);
    setLocalItem(STORAGE_KEYS.BAZAR_LIST, []);
    setLocalItem(STORAGE_KEYS.BAZAR_SCHEDULE, []);
    setLocalItem(STORAGE_KEYS.ACTIVITIES, [
      {
        id: `act-${Date.now()}`,
        action: 'CLEAN_DATABASE',
        title: 'ডাটাবেস সম্পূর্ণ খালি করা হয়েছে',
        details: 'সকল ডেমো মিল, খরচ ও জমার হিসাব মুছে ফেলা হয়েছে। মেস এখন ফ্রেশ ও নতুন হিসাবের জন্য প্রস্তুত।',
        timestamp: new Date().toISOString()
      }
    ]);
    setLocalItem(STORAGE_KEYS.MEAL_REQUESTS, { auto: false, morning: 0, lunch: 0, dinner: 0 });

    return { mess: cleanMess, members: [activeManager] };
  } catch (err) {
    console.error('Error cleaning database:', err);
    return null;
  }
}

export function initLocalStorageIfEmpty() {
  if (typeof localStorage === 'undefined') return;
  if (localStorage.getItem(STORAGE_KEYS.CLEAN_DATABASE_FLAG) === 'true') {
    if (!localStorage.getItem(STORAGE_KEYS.MESS)) {
      cleanDatabase();
    }
    return;
  }

  // Automatically initialize database clean as requested
  cleanDatabase();
}

export function resetDemoData() {
  cleanDatabase();
}

export function createNewFreshMess({ messName, managerUser }) {
  const codeSuffix = Math.floor(1000 + Math.random() * 9000);
  const cleanPrefix = (messName || 'MESS')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 4) || 'MESS';
  const inviteCode = `${cleanPrefix}${codeSuffix}`;

  const freshMess = {
    id: `mess-${Date.now()}`,
    name: messName || 'নতুন মেস',
    subtitle: 'চলতি মাসের হিসাব',
    address: 'ঢাকা, বাংলাদেশ',
    currency: 'BDT',
    currency_symbol: '৳',
    invite_code: inviteCode,
    month_start_day: 1,
    breakfast_unit: 1.0,
    lunch_unit: 1.0,
    dinner_unit: 1.0,
    shared_expense_policy: 'equal',
    status: 'Running',
    is_fresh: true
  };

  const initialMembers = managerUser ? [
    {
      id: managerUser.id,
      name: managerUser.name,
      phone: managerUser.phone || '',
      email: managerUser.email || '',
      room_number: '',
      role: 'manager',
      status: 'active',
      joined_at: new Date().toISOString().split('T')[0],
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
    }
  ] : [];

  setLocalItem(STORAGE_KEYS.MESS, freshMess);
  setLocalItem(STORAGE_KEYS.MEMBERS, initialMembers);
  setLocalItem(STORAGE_KEYS.EXPENSES, []);
  setLocalItem(STORAGE_KEYS.DEPOSITS, []);
  setLocalItem(STORAGE_KEYS.MEALS, []);
  setLocalItem(STORAGE_KEYS.SETTLEMENTS, []);
  setLocalItem(STORAGE_KEYS.BAZAR_LIST, []);
  setLocalItem(STORAGE_KEYS.BAZAR_SCHEDULE, []);
  setLocalItem(STORAGE_KEYS.ACTIVITIES, [
    {
      id: `act-${Date.now()}`,
      action: 'CREATE_MESS',
      title: 'নতুন মেস তৈরি করা হয়েছে',
      details: `${freshMess.name} সফলভাবে গঠিত হয়েছে। ইনভাইট কোড: ${inviteCode}`,
      timestamp: new Date().toISOString()
    }
  ]);
  setLocalItem(STORAGE_KEYS.MEAL_REQUESTS, { auto: false, morning: 0, lunch: 0, dinner: 0 });

  return freshMess;
}

// Auto-run init & clean database check
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  if (localStorage.getItem(STORAGE_KEYS.CLEAN_DATABASE_FLAG) !== 'true') {
    cleanDatabase();
  }
}
initLocalStorageIfEmpty();

export const dataService = {
  // Mess details
  async getMess() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('messes').select('*').limit(1).single();
      if (!error && data) return data;
    }
    const mess = getLocalItem(STORAGE_KEYS.MESS, INITIAL_MESS);
    if (mess && (mess.breakfast_unit === 0.5 || !mess.breakfast_unit)) {
      mess.breakfast_unit = 1.0;
      setLocalItem(STORAGE_KEYS.MESS, mess);
    }
    return mess;
  },

  async updateMess(updates) {
    const current = getLocalItem(STORAGE_KEYS.MESS, INITIAL_MESS);
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    setLocalItem(STORAGE_KEYS.MESS, updated);
    this.logActivity('UPDATE_SETTINGS', 'মেস সেটিংস আপডেট', 'মেস তথ্য ও নিয়ম পরিবর্তন করা হয়েছে');
    return updated;
  },

  // Members
  async getMembers() {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('mess_members').select('*').order('joined_at', { ascending: true });
      if (!error && data) return data;
    }
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    // Enforce single manager invariant: at most one manager at any time
    let managerFound = false;
    let mutated = false;
    const normalized = (members || []).map((m) => {
      if (m.role === 'manager') {
        if (!managerFound) {
          managerFound = true;
          return m;
        } else {
          mutated = true;
          return { ...m, role: 'member' };
        }
      }
      return m;
    });
    if (mutated) {
      setLocalItem(STORAGE_KEYS.MEMBERS, normalized);
    }
    return normalized;
  },

  async addMember(memberData) {
    const role = memberData.role || 'member';
    const newMember = {
      id: `mem-${Date.now()}`,
      joined_at: new Date().toISOString().split('T')[0],
      status: 'active',
      role,
      avatar: `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 1000)}?w=100&h=100&fit=crop`,
      ...memberData
    };

    const members = getLocalItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    if (role === 'manager') {
      // Enforce single manager invariant: demote any existing manager
      members.forEach((m, idx) => {
        if (m.role === 'manager') {
          members[idx] = { ...m, role: 'member' };
        }
      });
    }
    members.push(newMember);
    setLocalItem(STORAGE_KEYS.MEMBERS, members);
    this.logActivity('ADD_MEMBER', `নতুন মেম্বার: ${newMember.name}`, `রুম: ${newMember.room_number || 'N/A'}`);
    return newMember;
  },

  async updateMember(id, updates) {
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const index = members.findIndex((m) => m.id === id);
    if (index !== -1) {
      if (updates.role === 'manager') {
        // Enforce single manager invariant: demote all other managers
        members.forEach((m, idx) => {
          if (idx !== index && m.role === 'manager') {
            members[idx] = { ...m, role: 'member' };
          }
        });
      }
      members[index] = { ...members[index], ...updates };
      setLocalItem(STORAGE_KEYS.MEMBERS, members);
      this.logActivity('UPDATE_MEMBER', `মেম্বার আপডেট: ${members[index].name}`, `স্ট্যাটাস: ${members[index].status}`);
      return members[index];
    }
    return null;
  },

  async transferManagerRole(newManagerId, currentManagerName = '') {
    const members = getLocalItem(STORAGE_KEYS.MEMBERS, INITIAL_MEMBERS);
    const targetMember = members.find((m) => m.id === newManagerId);
    if (!targetMember) return null;

    let previousManager = null;
    const updatedMembers = members.map((m) => {
      if (m.id === newManagerId) {
        return { ...m, role: 'manager' };
      }
      if (m.role === 'manager') {
        previousManager = m;
        return { ...m, role: 'member' };
      }
      return m;
    });

    setLocalItem(STORAGE_KEYS.MEMBERS, updatedMembers);

    const prevName = previousManager?.name || currentManagerName || 'পূর্ববর্তী ম্যানেজার';
    this.logActivity(
      'TRANSFER_MANAGER',
      `মেস ম্যানেজার পরিবর্তন: ${targetMember.name}`,
      `${prevName} থেকে ${targetMember.name}-এর কাছে মেস পরিচালনার দায়িত্ব হস্তান্তর করা হয়েছে।`
    );

    return {
      previousManager,
      newManager: targetMember,
      members: updatedMembers
    };
  },

  async deactivateMember(id) {
    return this.updateMember(id, { status: 'inactive' });
  },

  // Categories
  async getCategories() {
    return getLocalItem(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // Meals
  async getMeals(monthYear) {
    const allMeals = getLocalItem(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    if (!monthYear) return allMeals;
    return allMeals.filter((m) => m.date && m.date.startsWith(monthYear));
  },

  async saveMealsBulk(date, memberMealEntries) {
    const allMeals = getLocalItem(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    const filtered = allMeals.filter((m) => m.date !== date);

    memberMealEntries.forEach((entry) => {
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
    this.logActivity('RECORD_MEALS', `${date} এর মিল সংরক্ষিত`, `${memberMealEntries.length} জন সদস্যের মিল আপডেট`);
    return filtered.filter((m) => m.date === date);
  },

  // Expenses
  async getExpenses(monthYear) {
    const all = getLocalItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    if (!monthYear) return all;
    return all.filter((e) => e.date && e.date.startsWith(monthYear));
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
      `খরচ যুক্ত: ${newExpense.title}`,
      `৳ ${newExpense.amount} (${newExpense.is_meal_related ? 'মিল বাজার' : 'যৌথ বিল'})`
    );
    return newExpense;
  },

  async updateExpense(id, updates) {
    const expenses = getLocalItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const index = expenses.findIndex((e) => e.id === id);
    if (index !== -1) {
      expenses[index] = { ...expenses[index], ...updates };
      setLocalItem(STORAGE_KEYS.EXPENSES, expenses);
      this.logActivity('UPDATE_EXPENSE', `খরচ সংশোধন: ${expenses[index].title}`, `৳ ${expenses[index].amount}`);
      return expenses[index];
    }
    return null;
  },

  async deleteExpense(id) {
    const expenses = getLocalItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const target = expenses.find((e) => e.id === id);
    const filtered = expenses.filter((e) => e.id !== id);
    setLocalItem(STORAGE_KEYS.EXPENSES, filtered);
    if (target) {
      this.logActivity('DELETE_EXPENSE', `খরচ বাতিল: ${target.title}`, `৳ ${target.amount}`);
    }
    return true;
  },

  // Deposits
  async getDeposits(monthYear) {
    const all = getLocalItem(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
    if (!monthYear) return all;
    return all.filter((d) => d.date && d.date.startsWith(monthYear));
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
      `${newDeposit.member_name} এর জমা`,
      `৳ ${newDeposit.amount} মাধ্যম: ${newDeposit.payment_method}`
    );
    return newDeposit;
  },

  async updateDeposit(id, updates) {
    const deposits = getLocalItem(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
    const index = deposits.findIndex((d) => d.id === id);
    if (index !== -1) {
      deposits[index] = { ...deposits[index], ...updates };
      setLocalItem(STORAGE_KEYS.DEPOSITS, deposits);
      return deposits[index];
    }
    return null;
  },

  async deleteDeposit(id) {
    const deposits = getLocalItem(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
    const target = deposits.find((d) => d.id === id);
    const filtered = deposits.filter((d) => d.id !== id);
    setLocalItem(STORAGE_KEYS.DEPOSITS, filtered);
    if (target) {
      this.logActivity('DELETE_DEPOSIT', `জমা মুছে ফেলা: ৳ ${target.amount}`, `${target.member_name}`);
    }
    return true;
  },

  // Settlements
  async getSettlements() {
    return getLocalItem(STORAGE_KEYS.SETTLEMENTS, INITIAL_SETTLEMENTS);
  },

  async getAvailableMonths() {
    const meals = getLocalItem(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    const expenses = getLocalItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const deposits = getLocalItem(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
    const settlements = getLocalItem(STORAGE_KEYS.SETTLEMENTS, INITIAL_SETTLEMENTS);

    const monthSet = new Set();
    meals.forEach((m) => m.date && monthSet.add(m.date.slice(0, 7)));
    expenses.forEach((e) => e.date && monthSet.add(e.date.slice(0, 7)));
    deposits.forEach((d) => d.date && monthSet.add(d.date.slice(0, 7)));
    settlements.forEach((s) => {
      if (s.monthYear) monthSet.add(s.monthYear);
      else if (s.year && s.month) monthSet.add(`${s.year}-${String(s.month).padStart(2, '0')}`);
    });

    const now = new Date();
    const currStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    monthSet.add(currStr);

    return Array.from(monthSet).sort().reverse();
  },

  async finalizeSettlement(settlementData) {
    const settlements = getLocalItem(STORAGE_KEYS.SETTLEMENTS, INITIAL_SETTLEMENTS);
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
      `${settlementData.month}/${settlementData.year} এর চূড়ান্ত হিসাব সম্পন্ন`,
      `মিল রেট: ৳ ${settlementData.mealRate}`
    );
    return record;
  },

  async deleteMonth(monthYear) {
    if (!monthYear) return false;

    // Filter out meals for that month
    const meals = getLocalItem(STORAGE_KEYS.MEALS, INITIAL_MEALS);
    const updatedMeals = meals.filter((m) => !m.date || !m.date.startsWith(monthYear));
    setLocalItem(STORAGE_KEYS.MEALS, updatedMeals);

    // Filter out expenses for that month
    const expenses = getLocalItem(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES);
    const updatedExpenses = expenses.filter((e) => !e.date || !e.date.startsWith(monthYear));
    setLocalItem(STORAGE_KEYS.EXPENSES, updatedExpenses);

    // Filter out deposits for that month
    const deposits = getLocalItem(STORAGE_KEYS.DEPOSITS, INITIAL_DEPOSITS);
    const updatedDeposits = deposits.filter((d) => !d.date || !d.date.startsWith(monthYear));
    setLocalItem(STORAGE_KEYS.DEPOSITS, updatedDeposits);

    // Filter out settlements for that month
    const [yStr, mStr] = monthYear.split('-');
    const yNum = parseInt(yStr, 10);
    const mNum = parseInt(mStr, 10);

    const settlements = getLocalItem(STORAGE_KEYS.SETTLEMENTS, INITIAL_SETTLEMENTS);
    const updatedSettlements = settlements.filter((s) => {
      if (s.monthYear && s.monthYear === monthYear) return false;
      if (s.year === yNum && s.month === mNum) return false;
      return true;
    });
    setLocalItem(STORAGE_KEYS.SETTLEMENTS, updatedSettlements);

    this.logActivity(
      'DELETE_MONTH',
      `সম্পূর্ণ মাসের হিসাব মুছে ফেলা হয়েছে: ${monthYear}`,
      `মিল, খরচ, ডিপোজিট এবং সেটেলমেন্ট রেকর্ডসমূহ স্থায়ীভাবে মুছে ফেলা হয়েছে`
    );

    return true;
  },

  // Bazar Checklist (বাজারের ফর্দ)
  async getBazarList() {
    return getLocalItem(STORAGE_KEYS.BAZAR_LIST, INITIAL_BAZAR_LIST);
  },

  async addBazarItem(item) {
    const list = getLocalItem(STORAGE_KEYS.BAZAR_LIST, INITIAL_BAZAR_LIST);
    const newItem = {
      id: `bitem-${Date.now()}`,
      completed: false,
      ...item
    };
    list.push(newItem);
    setLocalItem(STORAGE_KEYS.BAZAR_LIST, list);
    return newItem;
  },

  async toggleBazarItem(id) {
    const list = getLocalItem(STORAGE_KEYS.BAZAR_LIST, INITIAL_BAZAR_LIST);
    const target = list.find((i) => i.id === id);
    if (target) {
      target.completed = !target.completed;
      setLocalItem(STORAGE_KEYS.BAZAR_LIST, list);
    }
    return list;
  },

  async deleteBazarItem(id) {
    const list = getLocalItem(STORAGE_KEYS.BAZAR_LIST, INITIAL_BAZAR_LIST);
    const filtered = list.filter((i) => i.id !== id);
    setLocalItem(STORAGE_KEYS.BAZAR_LIST, filtered);
    return filtered;
  },

  // Bazar Duty Schedule (বাজার শিডিউল)
  async getBazarSchedule() {
    return getLocalItem(STORAGE_KEYS.BAZAR_SCHEDULE, INITIAL_BAZAR_SCHEDULE);
  },

  async addBazarScheduleEntry(entry) {
    const schedule = getLocalItem(STORAGE_KEYS.BAZAR_SCHEDULE, INITIAL_BAZAR_SCHEDULE);
    const newEntry = {
      id: `bsched-${Date.now()}`,
      status: 'Upcoming',
      ...entry
    };
    schedule.push(newEntry);
    setLocalItem(STORAGE_KEYS.BAZAR_SCHEDULE, schedule);
    this.logActivity('BAZAR_DUTY', `বাজার দায়িত্ব নির্ধারিত: ${newEntry.member_name}`, `তারিখ: ${newEntry.date}`);
    return newEntry;
  },

  // Meal Requests
  async getMealRequests() {
    return getLocalItem(STORAGE_KEYS.MEAL_REQUESTS, { auto: false, morning: 0, lunch: 0, dinner: 0 });
  },

  async saveMealRequest(requests) {
    setLocalItem(STORAGE_KEYS.MEAL_REQUESTS, requests);
    this.logActivity('MEAL_REQUEST', 'দৈনিক মিল বুকিং আপডেট', `সকাল: ${requests.morning}, দুপুর: ${requests.lunch}, রাত: ${requests.dinner}`);
    return requests;
  },

  // Activities
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
    if (logs.length > 50) logs.pop();
    setLocalItem(STORAGE_KEYS.ACTIVITIES, logs);
    return newLog;
  }
};
