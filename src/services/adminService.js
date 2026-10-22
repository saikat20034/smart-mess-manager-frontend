import { STORAGE_KEYS } from './storageService';

export const ADMIN_CREDENTIALS = {
  email: 'it24647@mbstu.ac.bd',
  password: 'saikat20034'
};

export const adminService = {
  // Get all messes registered across the app (Real data only, zero demo data)
  getAllMesses: () => {
    try {
      const rawRegistered = localStorage.getItem('smm_all_registered_messes');
      let registeredList = rawRegistered ? JSON.parse(rawRegistered) : [];
      if (!Array.isArray(registeredList)) registeredList = [];

      const rawMess = localStorage.getItem(STORAGE_KEYS.MESS);
      const activeMess = rawMess ? JSON.parse(rawMess) : null;

      const rawMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      const activeMembers = rawMembers ? JSON.parse(rawMembers) : [];

      const rawMeals = localStorage.getItem(STORAGE_KEYS.MEALS);
      const activeMeals = rawMeals ? JSON.parse(rawMeals) : [];

      const rawExpenses = localStorage.getItem(STORAGE_KEYS.EXPENSES);
      const activeExpenses = rawExpenses ? JSON.parse(rawExpenses) : [];

      const rawDeposits = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
      const activeDeposits = rawDeposits ? JSON.parse(rawDeposits) : [];

      let totalActiveMeals = 0;
      activeMeals.forEach((m) => {
        totalActiveMeals += Number(m.total_units || 0);
      });

      let totalActiveExpenses = 0;
      activeExpenses.forEach((e) => {
        totalActiveExpenses += Number(e.amount || 0);
      });

      let totalActiveDeposits = 0;
      activeDeposits.forEach((d) => {
        totalActiveDeposits += Number(d.amount || 0);
      });

      const activeManager = activeMembers.find((m) => m.role === 'manager') || activeMembers[0];

      const isMessDeleted = localStorage.getItem('smm_active_mess_deleted') === 'true';

      // If active mess exists and has a name and has not been deleted by Super Admin, include it
      if (!isMessDeleted && activeMess && activeMess.name) {
        const formattedActive = {
          id: activeMess.id || 'mess-active',
          name: activeMess.name,
          subtitle: activeMess.subtitle || 'চলতি মেস',
          location: activeMess.address || 'বাংলাদেশ',
          invite_code: activeMess.invite_code || 'MESS',
          manager_name: activeManager?.name || '—',
          manager_email: activeManager?.email || '—',
          manager_phone: activeManager?.phone || '—',
          members_count: activeMembers.length,
          created_at: activeMess.created_at || (activeMembers[0]?.joined_at || new Date().toISOString().split('T')[0]),
          last_active: new Date().toISOString().split('T')[0],
          total_meals: Math.round(totalActiveMeals * 100) / 100,
          total_expenses: totalActiveExpenses,
          total_deposits: totalActiveDeposits,
          status: 'Active'
        };

        // Avoid duplication with registeredList
        registeredList = registeredList.filter((m) => m.id !== formattedActive.id);
        registeredList.unshift(formattedActive);
      }

      return registeredList;
    } catch (e) {
      console.error('Error fetching messes:', e);
      return [];
    }
  },

  // Get all registered users across all messes (Real data only, zero demo data)
  getAllUsers: () => {
    try {
      const rawMembers = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      const activeMembers = rawMembers ? JSON.parse(rawMembers) : [];
      const rawMess = localStorage.getItem(STORAGE_KEYS.MESS);
      const activeMess = rawMess ? JSON.parse(rawMess) : null;
      const activeMessName = activeMess?.name || 'আমাদের মেস';

      const isMessDeleted = localStorage.getItem('smm_active_mess_deleted') === 'true';
      const users = [];

      // 1. Add active mess members if active mess is not deleted
      if (!isMessDeleted && Array.isArray(activeMembers) && activeMembers.length > 0) {
        activeMembers.forEach((m) => {
          users.push({
            id: m.id,
            name: m.name,
            mess_name: activeMessName,
            role: m.role || 'member',
            email: m.email || '—',
            phone: m.phone || '—',
            joined_at: m.joined_at || new Date().toISOString().split('T')[0],
            status: m.status || 'active',
            avatar: m.avatar
          });
        });
      }

      // 2. Add other registered mess members from smm_all_registered_members if present
      const rawOtherMembers = localStorage.getItem('smm_all_registered_members');
      if (rawOtherMembers) {
        try {
          const others = JSON.parse(rawOtherMembers);
          if (Array.isArray(others)) {
            others.forEach((o) => {
              if (!users.some((u) => u.id === o.id)) {
                users.push(o);
              }
            });
          }
        } catch (e) {}
      }

      return users;
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

    try {
      const rawDeposits = localStorage.getItem(STORAGE_KEYS.DEPOSITS);
      if (rawDeposits) {
        const depList = JSON.parse(rawDeposits);
        if (Array.isArray(depList)) {
          let directDep = 0;
          depList.forEach((d) => {
            directDep += Number(d.amount || 0);
          });
          if (directDep > totalDeposits) totalDeposits = directDep;
        }
      }
    } catch (e) {}

    const activeMessesCount = messes.filter((m) => m.status === 'Active').length;

    const currentMonthLabel = new Date().toLocaleDateString('bn-BD', {
      month: 'long',
      year: 'numeric'
    });

    const messesGrowth =
      messes.length > 0
        ? [
            {
              month: currentMonthLabel,
              messes: messes.length,
              users: users.length,
              meals: Math.round(totalMeals)
            }
          ]
        : [];

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
      messesGrowth
    };
  },

  // Delete a mess and all its associated data from the platform database
  deleteMess: (messId) => {
    try {
      if (typeof localStorage === 'undefined') return false;

      // 1. Remove from all registered messes registry
      const rawRegistered = localStorage.getItem('smm_all_registered_messes');
      let registeredList = rawRegistered ? JSON.parse(rawRegistered) : [];
      const targetMess = registeredList.find((m) => m.id === messId) || null;
      registeredList = registeredList.filter((m) => m.id !== messId);
      localStorage.setItem('smm_all_registered_messes', JSON.stringify(registeredList));

      // 2. Remove associated users from smm_all_registered_members
      const rawOtherMembers = localStorage.getItem('smm_all_registered_members');
      if (rawOtherMembers) {
        try {
          let others = JSON.parse(rawOtherMembers);
          if (Array.isArray(others)) {
            others = others.filter(
              (u) => u.mess_id !== messId && (!targetMess || u.mess_name !== targetMess.name)
            );
            localStorage.setItem('smm_all_registered_members', JSON.stringify(others));
          }
        } catch (e) {}
      }

      // 3. Check if target is the currently active mess
      const rawActiveMess = localStorage.getItem(STORAGE_KEYS.MESS);
      let isActive = false;
      if (rawActiveMess) {
        try {
          const activeMess = JSON.parse(rawActiveMess);
          if (
            activeMess.id === messId ||
            messId === 'mess-active' ||
            (targetMess && activeMess.name === targetMess.name)
          ) {
            isActive = true;
          }
        } catch (e) {}
      }

      // If active or target is active mess, wipe active storage keys and mark deleted
      if (isActive || messId === 'mess-active') {
        localStorage.setItem('smm_active_mess_deleted', 'true');
        localStorage.removeItem(STORAGE_KEYS.MESS);
        localStorage.removeItem(STORAGE_KEYS.MEMBERS);
        localStorage.removeItem(STORAGE_KEYS.MEALS);
        localStorage.removeItem(STORAGE_KEYS.EXPENSES);
        localStorage.removeItem(STORAGE_KEYS.DEPOSITS);
        localStorage.removeItem(STORAGE_KEYS.SETTLEMENTS);
        localStorage.removeItem(STORAGE_KEYS.BAZAR_LIST);
        localStorage.removeItem(STORAGE_KEYS.BAZAR_SCHEDULE);
        localStorage.removeItem(STORAGE_KEYS.MEAL_REQUESTS);
        localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
      }

      return true;
    } catch (e) {
      console.error('Error deleting mess:', e);
      return false;
    }
  }
};
