/**
 * Realistic Demo Data for Bangladeshi University Mess
 * Mess: Padma Hall Mess, Dhaka University
 * Currency: BDT (৳)
 */

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

export const INITIAL_MESS = {
  id: 'mess-001',
  name: 'Padma Hall Mess (Dhaka University)',
  address: 'Room 402, Shahidullah Hall Extension, Curzon Hall, Dhaka',
  currency: 'BDT',
  currency_symbol: '৳',
  invite_code: 'PADMA2026',
  month_start_day: 1,
  breakfast_unit: 0.5,
  lunch_unit: 1.0,
  dinner_unit: 1.0,
  shared_expense_policy: 'equal'
};

export const INITIAL_MEMBERS = [
  {
    id: 'mem-001',
    name: 'Tanvir Ahmed (Manager)',
    phone: '01711223344',
    email: 'tanvir@du.ac.bd',
    room_number: '402-A',
    role: 'manager',
    status: 'active',
    joined_at: '2026-01-01',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
  },
  {
    id: 'mem-002',
    name: 'Arif Hossain',
    phone: '01822334455',
    email: 'arif@du.ac.bd',
    room_number: '402-B',
    role: 'member',
    status: 'active',
    joined_at: '2026-01-01',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop'
  },
  {
    id: 'mem-003',
    name: 'Rakib Hasan',
    phone: '01933445566',
    email: 'rakib@du.ac.bd',
    room_number: '402-C',
    role: 'member',
    status: 'active',
    joined_at: '2026-01-05',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop'
  },
  {
    id: 'mem-004',
    name: 'Sakibul Islam',
    phone: '01644556677',
    email: 'sakib@du.ac.bd',
    room_number: '402-D',
    role: 'member',
    status: 'active',
    joined_at: '2026-01-10',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop'
  },
  {
    id: 'mem-005',
    name: 'Naimur Rahman',
    phone: '01555667788',
    email: 'naim@du.ac.bd',
    room_number: '402-E',
    role: 'member',
    status: 'active',
    joined_at: '2026-02-01',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&h=100&fit=crop'
  }
];

export const INITIAL_CATEGORIES = [
  { id: 'cat-01', name: 'Groceries & Bazar', is_meal_related: true, icon: 'ShoppingBag' },
  { id: 'cat-02', name: 'Meat, Fish & Eggs', is_meal_related: true, icon: 'Beef' },
  { id: 'cat-03', name: 'Rice & Spices', is_meal_related: true, icon: 'Utensils' },
  { id: 'cat-04', name: 'Cook (Khala) Salary', is_meal_related: false, icon: 'UserCheck' },
  { id: 'cat-05', name: 'Gas Cylinder', is_meal_related: false, icon: 'Flame' },
  { id: 'cat-06', name: 'High-Speed WiFi', is_meal_related: false, icon: 'Wifi' },
  { id: 'cat-07', name: 'Electricity & Utilities', is_meal_related: false, icon: 'Zap' },
  { id: 'cat-08', name: 'Cleaning & Miscellaneous', is_meal_related: false, icon: 'Sparkles' }
];

export const INITIAL_EXPENSES = [
  {
    id: 'exp-01',
    title: 'Miniket Rice (25kg Bag) & Spices',
    amount: 2150,
    category_id: 'cat-03',
    category_name: 'Rice & Spices',
    date: `${currentYear}-${currentMonth}-02`,
    paid_by_member_id: 'mem-001',
    paid_by_name: 'Tanvir Ahmed',
    is_meal_related: true,
    notes: 'Bought from Karwan Bazar wholesale market',
    receipt_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&h=200&fit=crop'
  },
  {
    id: 'exp-02',
    title: 'Broiler Chicken (4kg) & Eggs (2 Dozen)',
    amount: 1350,
    category_id: 'cat-02',
    category_name: 'Meat, Fish & Eggs',
    date: `${currentYear}-${currentMonth}-04`,
    paid_by_member_id: 'mem-002',
    paid_by_name: 'Arif Hossain',
    is_meal_related: true,
    notes: 'Ananda Bazar morning grocery',
    receipt_url: ''
  },
  {
    id: 'exp-03',
    title: 'High-Speed WiFi Bill (50 Mbps)',
    amount: 800,
    category_id: 'cat-06',
    category_name: 'High-Speed WiFi',
    date: `${currentYear}-${currentMonth}-05`,
    paid_by_member_id: 'mem-003',
    paid_by_name: 'Rakib Hasan',
    is_meal_related: false,
    notes: 'Paid via bKash to Link3 ISP',
    receipt_url: ''
  },
  {
    id: 'exp-04',
    title: 'Fresh Vegetables, Onion, Garlic & Green Chili',
    amount: 680,
    category_id: 'cat-01',
    category_name: 'Groceries & Bazar',
    date: `${currentYear}-${currentMonth}-08`,
    paid_by_member_id: 'mem-004',
    paid_by_name: 'Sakibul Islam',
    is_meal_related: true,
    notes: 'Palashi Bazar weekly vegetables',
    receipt_url: ''
  },
  {
    id: 'exp-05',
    title: 'Rui Fish (3kg) & Mustard Oil (1L)',
    amount: 1220,
    category_id: 'cat-02',
    category_name: 'Meat, Fish & Eggs',
    date: `${currentYear}-${currentMonth}-11`,
    paid_by_member_id: 'mem-001',
    paid_by_name: 'Tanvir Ahmed',
    is_meal_related: true,
    notes: 'New Market fresh fish',
    receipt_url: ''
  },
  {
    id: 'exp-06',
    title: 'Cook (Khala) Monthly Salary',
    amount: 2500,
    category_id: 'cat-04',
    category_name: 'Cook (Khala) Salary',
    date: `${currentYear}-${currentMonth}-10`,
    paid_by_member_id: 'mem-001',
    paid_by_name: 'Tanvir Ahmed',
    is_meal_related: false,
    notes: 'October cook bill paid in cash',
    receipt_url: ''
  },
  {
    id: 'exp-07',
    title: 'LP Gas Cylinder Refill (12kg)',
    amount: 1450,
    category_id: 'cat-05',
    category_name: 'Gas Cylinder',
    date: `${currentYear}-${currentMonth}-12`,
    paid_by_member_id: 'mem-002',
    paid_by_name: 'Arif Hossain',
    is_meal_related: false,
    notes: 'Beximco LPG cylinder refill',
    receipt_url: ''
  },
  {
    id: 'exp-08',
    title: 'Beef (2kg), Potatoes & Lentils (Dal)',
    amount: 1850,
    category_id: 'cat-02',
    category_name: 'Meat, Fish & Eggs',
    date: `${currentYear}-${currentMonth}-15`,
    paid_by_member_id: 'mem-005',
    paid_by_name: 'Naimur Rahman',
    is_meal_related: true,
    notes: 'Special weekend feast bazar',
    receipt_url: ''
  }
];

export const INITIAL_DEPOSITS = [
  {
    id: 'dep-01',
    member_id: 'mem-001',
    member_name: 'Tanvir Ahmed',
    amount: 4000,
    date: `${currentYear}-${currentMonth}-01`,
    payment_method: 'Cash',
    transaction_ref: 'CASH-REC-001',
    notes: 'Initial monthly deposit'
  },
  {
    id: 'dep-02',
    member_id: 'mem-002',
    member_name: 'Arif Hossain',
    amount: 3500,
    date: `${currentYear}-${currentMonth}-02`,
    payment_method: 'bKash',
    transaction_ref: 'BKASH8X91029',
    notes: 'bKash advance to manager'
  },
  {
    id: 'dep-03',
    member_id: 'mem-003',
    member_name: 'Rakib Hasan',
    amount: 3000,
    date: `${currentYear}-${currentMonth}-02`,
    payment_method: 'Nagad',
    transaction_ref: 'NGD39481029',
    notes: 'Nagad deposit'
  },
  {
    id: 'dep-04',
    member_id: 'mem-004',
    member_name: 'Sakibul Islam',
    amount: 3200,
    date: `${currentYear}-${currentMonth}-03`,
    payment_method: 'bKash',
    transaction_ref: 'BKASH7192841',
    notes: 'Deposit for meals & shared bills'
  },
  {
    id: 'dep-05',
    member_id: 'mem-005',
    member_name: 'Naimur Rahman',
    amount: 2500,
    date: `${currentYear}-${currentMonth}-04`,
    payment_method: 'Cash',
    transaction_ref: 'CASH-REC-002',
    notes: 'Cash payment to Tanvir'
  }
];

// Helper to generate realistic daily meals for members across days 1 to 18 of current month
export function generateInitialMeals() {
  const meals = [];
  const days = 18;
  const members = INITIAL_MEMBERS;

  for (let d = 1; d <= days; d++) {
    const dayStr = String(d).padStart(2, '0');
    const date = `${currentYear}-${currentMonth}-${dayStr}`;

    members.forEach((m, idx) => {
      // simulate varied student schedules
      const isWeekend = (d % 7 === 5 || d % 7 === 6);
      const breakfast = (idx === 4 && d % 3 === 0) ? 0 : 1;
      const lunch = (idx === 2 && isWeekend) ? 0 : 1;
      const dinner = 1;

      meals.push({
        id: `meal-${date}-${m.id}`,
        member_id: m.id,
        date,
        breakfast,
        lunch,
        dinner,
        notes: ''
      });
    });
  }
  return meals;
}

export const INITIAL_MEALS = generateInitialMeals();

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-01',
    action: 'RECORD_EXPENSE',
    title: 'Beef & Potatoes Bazar added',
    details: '৳ 1,850 recorded by Naimur Rahman',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
  },
  {
    id: 'act-02',
    action: 'RECORD_MEAL',
    title: 'Daily meals recorded',
    details: 'Daily meals logged for 5 members',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  },
  {
    id: 'act-03',
    action: 'RECORD_DEPOSIT',
    title: 'bKash deposit confirmed',
    details: '৳ 3,200 received from Sakibul Islam',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'act-04',
    action: 'RECORD_EXPENSE',
    title: 'Cook Khala Salary recorded',
    details: '৳ 2,500 paid in cash to Cook',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  }
];
