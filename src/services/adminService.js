import { STORAGE_KEYS } from './storageService';

export const ADMIN_CREDENTIALS = {
  email: 'it24647@mbstu.ac.bd',
  password: 'saikat20034'
};

const SEED_PLATFORM_MESSES = [
  {
    id: 'mess-001',
    name: 'পদ্মা মেস (Padma Residence)',
    subtitle: 'চলতি মাসের হিসাব',
    location: 'ঢাকা, বাংলাদেশ',
    invite_code: 'PADMA2026',
    manager_name: 'Mazharul Islam (Saikat)',
    manager_email: 'it24647@mbstu.ac.bd',
    manager_phone: '01630496007',
    members_count: 7,
    created_at: '2026-08-01',
    last_active: '2026-10-21',
    total_meals: 486.5,
    total_expenses: 32450,
    total_deposits: 35000,
    status: 'Active'
  },
  {
    id: 'mess-002',
    name: 'মেঘনা ব্যাচেলর হোম (Meghna Bachelor Flat)',
    subtitle: 'রুম ২০৪, শান্তি নিকেতন',
    location: 'পান্থপথ, ঢাকা',
    invite_code: 'MEGHNA02',
    manager_name: 'Tanvir Ahmed',
    manager_email: 'tanvir.ahmed@gmail.com',
    manager_phone: '01712345678',
    members_count: 5,
    created_at: '2026-07-15',
    last_active: '2026-10-20',
    total_meals: 390.0,
    total_expenses: 24800,
    total_deposits: 26000,
    status: 'Active'
  },
  {
    id: 'mess-003',
    name: 'যমুনা স্কলার্স মেস (Jamuna Scholars)',
    subtitle: 'ব্লক বি, গ্রিন রোড',
    location: 'ফার্মগেট, ঢাকা',
    invite_code: 'JAMUNA88',
    manager_name: 'Shakil Hasan',
    manager_email: 'shakil.hasan@yahoo.com',
    manager_phone: '01898765432',
    members_count: 8,
    created_at: '2026-06-01',
    last_active: '2026-10-21',
    total_meals: 620.25,
    total_expenses: 41200,
    total_deposits: 44000,
    status: 'Active'
  },
  {
    id: 'mess-004',
    name: 'সুরমা ছাত্রাবাস (Surma Hostel)',
    subtitle: 'হাউজ ১২, রোড ৫',
    location: 'মিরপুর ১০, ঢাকা',
    invite_code: 'SURMA26',
    manager_name: 'Rakibul Islam',
    manager_email: 'rakib.islam@outlook.com',
    manager_phone: '01511223344',
    members_count: 6,
    created_at: '2026-09-01',
    last_active: '2026-10-19',
    total_meals: 280.0,
    total_expenses: 19500,
    total_deposits: 21000,
    status: 'Active'
  },
  {
    id: 'mess-005',
    name: 'কর্ণফুলী এক্সিকিউটিভ ফ্ল্যাট',
    subtitle: 'চাকরিজীবী শেয়ার্ড অ্যাপার্টমেন্ট',
    location: 'জিইসি মোড়, চট্টগ্রাম',
    invite_code: 'KPF2026',
    manager_name: 'Mahmudur Rahman',
    manager_email: 'mahmud.ctg@gmail.com',
    manager_phone: '01677889900',
    members_count: 4,
    created_at: '2026-08-20',
    last_active: '2026-10-21',
    total_meals: 245.5,
    total_expenses: 28900,
    total_deposits: 30000,
    status: 'Active'
  },
  {
    id: 'mess-006',
    name: 'তিস্তা যুব মেস (Teesta Youth Home)',
    subtitle: 'রোড ৪, হাউজিং স্টেট',
    location: 'সাতমাথা, বগুড়া',
    invite_code: 'TEESTA99',
    manager_name: 'Arif Chowdhury',
    manager_email: 'arif.bogra@gmail.com',
    manager_phone: '01922334455',
    members_count: 8,
    created_at: '2026-05-10',
    last_active: '2026-10-18',
    total_meals: 540.0,
    total_expenses: 37600,
    total_deposits: 39500,
    status: 'Active'
  }
];

export const adminService = {
  // Get all messes registered across the app
  getAllMesses: () => {
    try {
      // Synchronize with active local mess if present
      const rawMess = localStorage.getItem(STORAGE_KEYS.MESS);
      const rawMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      const rawMeals = localStorage.getItem(STORAGE_KEYS.MEALS);
      const rawExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);

      const activeMess = rawMess ? JSON.parse(rawMess) : null;
      const activeMembers = rawMembers ? JSON.parse(rawMembers) : [];
      const activeMeals = rawMeals ? JSON.parse(rawMeals) : [];
      const activeExpenses = rawExpenses ? JSON.parse(rawExpenses) : [];

      let totalActiveMeals = 0;
      activeMeals.forEach((m) => {
        totalActiveMeals += Number(m.total_units || 0);
      });

      let totalActiveExpenses = 0;
      activeExpenses.forEach((e) => {
        totalActiveExpenses += Number(e.amount || 0);
      });

      const activeManager = activeMembers.find((m) => m.role === 'manager') || activeMembers[0];

      const mergedMesses = [...SEED_PLATFORM_MESSES];

      if (activeMess) {
        mergedMesses[0] = {
          ...mergedMesses[0],
          name: activeMess.name || mergedMesses[0].name,
          subtitle: activeMess.subtitle || mergedMesses[0].subtitle,
          invite_code: activeMess.invite_code || mergedMesses[0].invite_code,
          manager_name: activeManager ? activeManager.name : mergedMesses[0].manager_name,
          manager_email: activeManager?.email || mergedMesses[0].manager_email,
          manager_phone: activeManager?.phone || mergedMesses[0].manager_phone,
          members_count: activeMembers.length || mergedMesses[0].members_count,
          total_meals: totalActiveMeals > 0 ? totalActiveMeals : mergedMesses[0].total_meals,
          total_expenses: totalActiveExpenses > 0 ? totalActiveExpenses : mergedMesses[0].total_expenses
        };
      }

      return mergedMesses;
    } catch (e) {
      console.error('Error fetching messes:', e);
      return SEED_PLATFORM_MESSES;
    }
  },

  // Get all registered users across all messes
  getAllUsers: () => {
    try {
      const rawMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      const activeMembers = rawMembers ? JSON.parse(rawMembers) : [];
      const activeMess = localStorage.getItem(STORAGE_KEYS.MESS)
        ? JSON.parse(localStorage.getItem(STORAGE_KEYS.MESS))
        : null;

      const activeMessName = activeMess?.name || 'পদ্মা মেস (Padma Residence)';

      const globalUsers = [];

      // 1. Add active mess members
      if (Array.isArray(activeMembers) && activeMembers.length > 0) {
        activeMembers.forEach((m) => {
          globalUsers.push({
            id: m.id,
            name: m.name,
            mess_name: activeMessName,
            role: m.role || 'member',
            email: m.email || '—',
            phone: m.phone || '—',
            joined_at: m.joined_at || '2026-08-01',
            status: m.status || 'active',
            avatar: m.avatar
          });
        });
      }

      // 2. Add realistic seed members from other messes
      const additionalSeedUsers = [
        { id: 'usr-101', name: 'Tanvir Ahmed', mess_name: 'মেঘনা ব্যাচেলর হোম', role: 'manager', email: 'tanvir.ahmed@gmail.com', phone: '01712345678', joined_at: '2026-07-15', status: 'active' },
        { id: 'usr-102', name: 'Hasan Mahmud', mess_name: 'মেঘনা ব্যাচেলর হোম', role: 'member', email: 'hasan.m@gmail.com', phone: '01711224455', joined_at: '2026-07-16', status: 'active' },
        { id: 'usr-103', name: 'Rony Sheikh', mess_name: 'মেঘনা ব্যাচেলর হোম', role: 'member', email: 'rony.sheikh@gmail.com', phone: '01799887766', joined_at: '2026-07-20', status: 'active' },
        { id: 'usr-104', name: 'Shakil Hasan', mess_name: 'যমুনা স্কলার্স মেস', role: 'manager', email: 'shakil.hasan@yahoo.com', phone: '01898765432', joined_at: '2026-06-01', status: 'active' },
        { id: 'usr-105', name: 'Jamil Hossain', mess_name: 'যমুনা স্কলার্স মেস', role: 'member', email: 'jamil.h@yahoo.com', phone: '01811223344', joined_at: '2026-06-05', status: 'active' },
        { id: 'usr-106', name: 'Zahid Hasan', mess_name: 'যমুনা স্কলার্স মেস', role: 'member', email: 'zahid.h@gmail.com', phone: '01855667788', joined_at: '2026-06-10', status: 'active' },
        { id: 'usr-107', name: 'Rakibul Islam', mess_name: 'সুরমা ছাত্রাবাস', role: 'manager', email: 'rakib.islam@outlook.com', phone: '01511223344', joined_at: '2026-09-01', status: 'active' },
        { id: 'usr-108', name: 'Kawsar Ahmed', mess_name: 'সুরমা ছাত্রাবাস', role: 'member', email: 'kawsar.a@gmail.com', phone: '01599887766', joined_at: '2026-09-05', status: 'active' },
        { id: 'usr-109', name: 'Mahmudur Rahman', mess_name: 'কর্ণফুলী এক্সিকিউটিভ ফ্ল্যাট', role: 'manager', email: 'mahmud.ctg@gmail.com', phone: '01677889900', joined_at: '2026-08-20', status: 'active' },
        { id: 'usr-110', name: 'Arif Chowdhury', mess_name: 'তিস্তা যুব মেস', role: 'manager', email: 'arif.bogra@gmail.com', phone: '01922334455', joined_at: '2026-05-10', status: 'active' }
      ];

      return [...globalUsers, ...additionalSeedUsers];
    } catch (e) {
      console.error('Error fetching global users:', e);
      return [];
    }
  },

  // Statistical aggregates across the platform
  getPlatformStats: () => {
    const messes = adminService.getAllMesses();
    const users = adminService.getAllUsers();

    let totalMeals = 0;
    let totalExpenses = 0;
    let totalDeposits = 0;

    messes.forEach((m) => {
      totalMeals += Number(m.total_meals || 0);
      totalExpenses += Number(m.total_expenses || 0);
      totalDeposits += Number(m.total_deposits || 0);
    });

    const activeMessesCount = messes.filter((m) => m.status === 'Active').length;

    return {
      totalMesses: messes.length,
      activeMesses: activeMessesCount,
      totalUsers: users.length,
      totalManagers: users.filter((u) => u.role === 'manager').length,
      totalMembers: users.filter((u) => u.role === 'member').length,
      totalMeals: Math.round(totalMeals * 100) / 100,
      totalExpenses,
      totalDeposits,
      totalTurnover: totalExpenses + totalDeposits,
      averageMealRate: totalMeals > 0 ? Math.round((totalExpenses / totalMeals) * 100) / 100 : 0,
      messesGrowth: [
        { month: 'মে ২০২৬', messes: 1, users: 8, meals: 540 },
        { month: 'জুন ২০২৬', messes: 2, users: 16, meals: 1160 },
        { month: 'জুলাই ২০২৬', messes: 3, users: 21, meals: 1550 },
        { month: 'আগস্ট ২০২৬', messes: 5, users: 32, meals: 2120 },
        { month: 'সেপ্টেম্বর ২০২৬', messes: 6, users: 38, meals: 2560 },
        { month: 'অক্টোবর ২০২৬', messes: 6, users: users.length, meals: Math.round(totalMeals) }
      ]
    };
  }
};

