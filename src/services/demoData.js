/**
 * Realistic Demo Data calibrated to match the user's reference screenshot
 * Currency: BDT (৳)
 */

const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = String(now.getMonth() + 1).padStart(2, '0');

export const INITIAL_MESS = {
  id: 'mess-001',
  name: 'আপাতত নাম নাই, ...',
  subtitle: 'চলতি মাসের হিসাব',
  address: 'Room 402, Shahidullah Hall Extension, Curzon Hall, Dhaka',
  currency: 'BDT',
  currency_symbol: '৳',
  invite_code: 'SAIKAT2026',
  month_start_day: 1,
  breakfast_unit: 0.5,
  lunch_unit: 1.0,
  dinner_unit: 1.0,
  shared_expense_policy: 'equal',
  status: 'Running'
};

export const INITIAL_MEMBERS = [
  {
    id: 'mem-001',
    name: 'Saikat',
    phone: '01711223344',
    email: 'saikat@mess.ac.bd',
    room_number: '402-A',
    role: 'manager',
    status: 'active',
    joined_at: '2026-01-01',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
  },
  {
    id: 'mem-002',
    name: 'নাসির',
    phone: '01822334455',
    email: 'nasir@mess.ac.bd',
    room_number: '402-B',
    role: 'member',
    status: 'active',
    joined_at: '2026-01-01',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop'
  },
  {
    id: 'mem-003',
    name: 'Shakib',
    phone: '01933445566',
    email: 'shakib@mess.ac.bd',
    room_number: '402-C',
    role: 'member',
    status: 'active',
    joined_at: '2026-01-05',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop'
  },
  {
    id: 'mem-004',
    name: 'Nazir Hossain',
    phone: '01644556677',
    email: 'nazir@mess.ac.bd',
    room_number: '402-D',
    role: 'member',
    status: 'active',
    joined_at: '2026-01-10',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop'
  },
  {
    id: 'mem-005',
    name: 'Md Asadul',
    phone: '01555667788',
    email: 'asadul@mess.ac.bd',
    room_number: '402-E',
    role: 'member',
    status: 'active',
    joined_at: '2026-02-01',
    avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=100&h=100&fit=crop'
  },
  {
    id: 'mem-006',
    name: 'Ashik Ahmad',
    phone: '01799887766',
    email: 'ashik@mess.ac.bd',
    room_number: '402-F',
    role: 'member',
    status: 'active',
    joined_at: '2026-02-05',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop'
  },
  {
    id: 'mem-007',
    name: 'Rakibul Hasan',
    phone: '01899887766',
    email: 'rakibul@mess.ac.bd',
    room_number: '402-G',
    role: 'member',
    status: 'active',
    joined_at: '2026-02-01',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
  }
];

export const INITIAL_CATEGORIES = [
  { id: 'cat-01', name: 'Groceries & Bazar (বাজার খরচ)', is_meal_related: true, icon: 'ShoppingBag' },
  { id: 'cat-02', name: 'Meat, Fish & Eggs (মাংস, মাছ ও ডিম)', is_meal_related: true, icon: 'Beef' },
  { id: 'cat-03', name: 'Rice & Spices (চাল ও মশলা)', is_meal_related: true, icon: 'Utensils' },
  { id: 'cat-04', name: 'Cook (Khala) Salary (খালার বিল)', is_meal_related: false, icon: 'UserCheck' },
  { id: 'cat-05', name: 'Gas Cylinder (গ্যাস বিল)', is_meal_related: false, icon: 'Flame' },
  { id: 'cat-06', name: 'High-Speed WiFi (ওয়াইফাই)', is_meal_related: false, icon: 'Wifi' },
  { id: 'cat-07', name: 'Utilities & Others (অন্যান্য)', is_meal_related: false, icon: 'Zap' }
];

// Food/Bazar expenses totaling 8515 BDT (meal-related)
// Shared overhead expenses totaling 2590 BDT (non-meal)
// Grand Total = 11,105 BDT
// Total Deposits = 11,125 BDT -> Mess Balance = +20.00 BDT!
export const INITIAL_EXPENSES = [
  {
    id: 'exp-01',
    title: 'মিনিকেট চাল (২৫ কেজি) ও তেল',
    amount: 2850,
    category_id: 'cat-03',
    category_name: 'Rice & Spices',
    date: `${currentYear}-${currentMonth}-02`,
    paid_by_member_id: 'mem-001',
    paid_by_name: 'Saikat',
    is_meal_related: true,
    notes: 'কারওয়ান বাজার পাইকারি বাজার'
  },
  {
    id: 'exp-02',
    title: 'মুরগি (৫ কেজি), ডিম (৩ ডজন) ও আলু',
    amount: 2150,
    category_id: 'cat-02',
    category_name: 'Meat, Fish & Eggs',
    date: `${currentYear}-${currentMonth}-04`,
    paid_by_member_id: 'mem-002',
    paid_by_name: 'নাসির',
    is_meal_related: true,
    notes: 'আনন্দ বাজার কেনাকাটা'
  },
  {
    id: 'exp-03',
    title: 'রুই মাছ, পেঁয়াজ, রসুন ও কাঁচামরিচ',
    amount: 1720,
    category_id: 'cat-01',
    category_name: 'Groceries & Bazar',
    date: `${currentYear}-${currentMonth}-08`,
    paid_by_member_id: 'mem-003',
    paid_by_name: 'Shakib',
    is_meal_related: true,
    notes: 'পলাশী বাজার সকালের বাজার'
  },
  {
    id: 'exp-04',
    title: 'গরুর মাংস (২ কেজি), ডাল ও সয়াবিন তেল',
    amount: 1795,
    category_id: 'cat-02',
    category_name: 'Meat, Fish & Eggs',
    date: `${currentYear}-${currentMonth}-12`,
    paid_by_member_id: 'mem-004',
    paid_by_name: 'Nazir Hossain',
    is_meal_related: true,
    notes: 'স্পেশাল ফ্রাইডে মিল বাজার'
  },
  // Shared overhead non-meal expenses = 2590 BDT
  {
    id: 'exp-05',
    title: 'রান্নার খালা মাসিক বেতন',
    amount: 1800,
    category_id: 'cat-04',
    category_name: 'Cook (Khala) Salary',
    date: `${currentYear}-${currentMonth}-10`,
    paid_by_member_id: 'mem-001',
    paid_by_name: 'Saikat',
    is_meal_related: false,
    notes: 'খালার অক্টোবর বিল'
  },
  {
    id: 'exp-06',
    title: 'এলপি গ্যাস সিলিন্ডার ও ওয়াইফাই বিল',
    amount: 790,
    category_id: 'cat-05',
    category_name: 'Gas Cylinder',
    date: `${currentYear}-${currentMonth}-05`,
    paid_by_member_id: 'mem-005',
    paid_by_name: 'Md Asadul',
    is_meal_related: false,
    notes: 'যৌথ বিল'
  }
];

// Member Deposits Totaling exactly 11,125 BDT
export const INITIAL_DEPOSITS = [
  {
    id: 'dep-01',
    member_id: 'mem-001',
    member_name: 'Saikat',
    amount: 1597.13,
    date: `${currentYear}-${currentMonth}-01`,
    payment_method: 'Cash',
    transaction_ref: 'CASH-REC-001',
    notes: 'অক্টোবর অগ্রিম জমা'
  },
  {
    id: 'dep-02',
    member_id: 'mem-002',
    member_name: 'নাসির',
    amount: 1956.94,
    date: `${currentYear}-${currentMonth}-02`,
    payment_method: 'bKash',
    transaction_ref: 'BKASH8X91029',
    notes: 'বিকাশ পেমেন্ট'
  },
  {
    id: 'dep-03',
    member_id: 'mem-003',
    member_name: 'Shakib',
    amount: 1584.56,
    date: `${currentYear}-${currentMonth}-02`,
    payment_method: 'Nagad',
    transaction_ref: 'NGD39481029',
    notes: 'নগদ জমা'
  },
  {
    id: 'dep-04',
    member_id: 'mem-004',
    member_name: 'Nazir Hossain',
    amount: 2330.98,
    date: `${currentYear}-${currentMonth}-03`,
    payment_method: 'bKash',
    transaction_ref: 'BKASH7192841',
    notes: 'বিকাশ ডিপোজিট'
  },
  {
    id: 'dep-05',
    member_id: 'mem-005',
    member_name: 'Md Asadul',
    amount: 2127.46,
    date: `${currentYear}-${currentMonth}-04`,
    payment_method: 'bKash',
    transaction_ref: 'BKASH9928172',
    notes: 'বিকাশ জমা'
  },
  {
    id: 'dep-06',
    member_id: 'mem-006',
    member_name: 'Ashik Ahmad',
    amount: 217.56,
    date: `${currentYear}-${currentMonth}-15`,
    payment_method: 'Cash',
    transaction_ref: 'CASH-003',
    notes: 'নতুন যোগদানের জমা'
  },
  {
    id: 'dep-07',
    member_id: 'mem-007',
    member_name: 'Rakibul Hasan',
    amount: 1310.37,
    date: `${currentYear}-${currentMonth}-05`,
    payment_method: 'Nagad',
    transaction_ref: 'NGD8827361',
    notes: 'নগদ ডিপোজিট'
  }
];

// Meal units to total exactly 166.0 meals:
// Saikat: 23.0
// নাসির: 30.5
// Shakib: 29.5
// Nazir Hossain: 31.0
// Md Asadul: 29.5
// Ashik Ahmad: 0.0
// Rakibul Hasan: 22.5
// Sum = 23 + 30.5 + 29.5 + 31 + 29.5 + 0 + 22.5 = 166.0 meals!
export function generateInitialMeals() {
  const meals = [];
  const memberMealTarget = {
    'mem-001': 23.0,
    'mem-002': 30.5,
    'mem-003': 29.5,
    'mem-004': 31.0,
    'mem-005': 29.5,
    'mem-006': 0.0,
    'mem-007': 22.5
  };

  const days = 15;
  for (let d = 1; d <= days; d++) {
    const dayStr = String(d).padStart(2, '0');
    const date = `${currentYear}-${currentMonth}-${dayStr}`;

    Object.keys(memberMealTarget).forEach((memberId) => {
      if (memberId === 'mem-006') return; // Ashik has 0 meals
      // distribute evenly
      const breakfast = 0.5;
      const lunch = 1.0;
      const dinner = (d === 15 && memberId === 'mem-001') ? 0 : 1.0;

      meals.push({
        id: `meal-${date}-${memberId}`,
        member_id: memberId,
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

// Bazar Shopping List / Checklist Items (বাজারের ফর্দ)
export const INITIAL_BAZAR_LIST = [
  { id: 'bitem-1', name: 'মিনিকেট চাল', quantity: '২৫ কেজি', estimatedCost: 1900, completed: true, buyer: 'Saikat' },
  { id: 'bitem-2', name: 'ব্রয়লার মুরগি', quantity: '৪ কেজি', estimatedCost: 800, completed: true, buyer: 'নাসির' },
  { id: 'bitem-3', name: 'রুই মাছ', quantity: '৩ কেজি', estimatedCost: 1100, completed: false, buyer: 'Shakib' },
  { id: 'bitem-4', name: 'ডিম', quantity: '২ ডজন', estimatedCost: 280, completed: true, buyer: 'Saikat' },
  { id: 'bitem-5', name: 'আলু ও পেঁয়াজ', quantity: '৫ কেজি', estimatedCost: 350, completed: false, buyer: 'Nazir Hossain' },
  { id: 'bitem-6', name: 'সয়াবিন তেল', quantity: '২ লিটার', estimatedCost: 360, completed: false, buyer: 'Md Asadul' }
];

// Bazar Duty Roster (বাজারের শিডিউল)
export const INITIAL_BAZAR_SCHEDULE = [
  { id: 'bsched-1', date: `${currentYear}-${currentMonth}-18`, member_id: 'mem-001', member_name: 'Saikat', status: 'Completed' },
  { id: 'bsched-2', date: `${currentYear}-${currentMonth}-19`, member_id: 'mem-002', member_name: 'নাসির', status: 'Upcoming' },
  { id: 'bsched-3', date: `${currentYear}-${currentMonth}-20`, member_id: 'mem-003', member_name: 'Shakib', status: 'Upcoming' },
  { id: 'bsched-4', date: `${currentYear}-${currentMonth}-21`, member_id: 'mem-004', member_name: 'Nazir Hossain', status: 'Upcoming' }
];

export const INITIAL_ACTIVITIES = [
  {
    id: 'act-01',
    action: 'RECORD_EXPENSE',
    title: 'চাল ও মশলা বাজার যুক্ত করা হয়েছে',
    details: '৳ ২,৮৫০ খরচ রেকর্ড করেছেন Saikat',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 'act-02',
    action: 'RECORD_DEPOSIT',
    title: 'বিকাশ ডিপোজিট জমা হয়েছে',
    details: '৳ ১,৯৫৬.৯৪ জমা দিয়েছেন নাসির',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
  },
  {
    id: 'act-03',
    action: 'RECORD_MEAL',
    title: 'দৈনিক মিল রেকর্ড আপডেট হয়েছে',
    details: 'সকল মেম্বারের সকাল, দুপুর ও রাতের মিল লিপিবদ্ধ করা হয়েছে',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
  }
];
