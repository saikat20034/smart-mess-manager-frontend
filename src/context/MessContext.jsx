import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dataService, resetDemoData, createNewFreshMess } from '../services/storageService';
import { calculateMemberBalances } from '../utils/calculations';

const MessContext = createContext(null);

export const MessProvider = ({ children }) => {
  const now = new Date();
  const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);
  const [mess, setMess] = useState(null);
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [bazarList, setBazarList] = useState([]);
  const [bazarSchedule, setBazarSchedule] = useState([]);
  const [mealRequests, setMealRequests] = useState({ auto: false, morning: 0, lunch: 0, dinner: 0 });
  const [loading, setLoading] = useState(true);

  // Load all data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        messData,
        membersData,
        catsData,
        mealsData,
        expensesData,
        depositsData,
        settlementsData,
        activitiesData,
        bazarListData,
        bazarSchedData,
        mealReqData
      ] = await Promise.all([
        dataService.getMess(),
        dataService.getMembers(),
        dataService.getCategories(),
        dataService.getMeals(selectedMonth),
        dataService.getExpenses(selectedMonth),
        dataService.getDeposits(selectedMonth),
        dataService.getSettlements(),
        dataService.getActivityLogs(),
        dataService.getBazarList(),
        dataService.getBazarSchedule(),
        dataService.getMealRequests()
      ]);

      setMess(messData);
      setMembers(membersData);
      setCategories(catsData);
      setMeals(mealsData);
      setExpenses(expensesData);
      setDeposits(depositsData);
      setSettlements(settlementsData);
      setActivities(activitiesData);
      setBazarList(bazarListData);
      setBazarSchedule(bazarSchedData);
      setMealRequests(mealReqData);
    } catch (err) {
      console.error('Error refreshing mess data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Real-time calculation of member balances and summary metrics
  const financialData = React.useMemo(() => {
    if (!members.length) {
      return {
        members: [],
        summary: {
          totalMembers: 0,
          activeMembers: 0,
          totalMealUnits: 0,
          mealExpenses: 0,
          sharedExpenses: 0,
          totalExpenses: 0,
          mealRate: 0,
          totalDeposits: 0,
          outstandingDues: 0,
          totalCredits: 0,
          cashInHand: 0
        }
      };
    }

    return calculateMemberBalances({
      members,
      meals,
      expenses,
      deposits,
      settings: mess || {}
    });
  }, [members, meals, expenses, deposits, mess]);

  // Mutations
  const recordDailyMealsBulk = async (date, entries) => {
    await dataService.saveMealsBulk(date, entries);
    await refreshData();
  };

  const addExpense = async (expenseData) => {
    await dataService.addExpense(expenseData);
    await refreshData();
  };

  const updateExpense = async (id, updates) => {
    await dataService.updateExpense(id, updates);
    await refreshData();
  };

  const deleteExpense = async (id) => {
    await dataService.deleteExpense(id);
    await refreshData();
  };

  const addDeposit = async (depositData) => {
    await dataService.addDeposit(depositData);
    await refreshData();
  };

  const updateDeposit = async (id, updates) => {
    await dataService.updateDeposit(id, updates);
    await refreshData();
  };

  const deleteDeposit = async (id) => {
    await dataService.deleteDeposit(id);
    await refreshData();
  };

  const addMember = async (memberData) => {
    const newMem = await dataService.addMember(memberData);
    await refreshData();
    return newMem;
  };

  const updateMember = async (id, updates) => {
    await dataService.updateMember(id, updates);
    await refreshData();
  };

  const deactivateMember = async (id) => {
    await dataService.deactivateMember(id);
    await refreshData();
  };

  const updateMessSettings = async (updates) => {
    await dataService.updateMess(updates);
    await refreshData();
  };

  const finalizeMonthlySettlement = async (snapshotData) => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const record = await dataService.finalizeSettlement({
      month: parseInt(monthStr, 10),
      year: parseInt(yearStr, 10),
      ...financialData.summary,
      member_items: financialData.members,
      ...snapshotData
    });
    await refreshData();
    return record;
  };

  // Bazar actions
  const addBazarItem = async (item) => {
    await dataService.addBazarItem(item);
    await refreshData();
  };

  const toggleBazarItem = async (id) => {
    await dataService.toggleBazarItem(id);
    await refreshData();
  };

  const deleteBazarItem = async (id) => {
    await dataService.deleteBazarItem(id);
    await refreshData();
  };

  const addBazarScheduleEntry = async (entry) => {
    await dataService.addBazarScheduleEntry(entry);
    await refreshData();
  };

  const saveMealRequest = async (requests) => {
    await dataService.saveMealRequest(requests);
    await refreshData();
  };

  const createNewMess = async (params) => {
    const fresh = createNewFreshMess(params);
    await refreshData();
    return fresh;
  };

  const resetAllDemoData = () => {
    resetDemoData();
    refreshData();
  };

  return (
    <MessContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        mess,
        members,
        categories,
        meals,
        expenses,
        deposits,
        settlements,
        activities,
        bazarList,
        bazarSchedule,
        mealRequests,
        loading,
        refreshData,
        // Calculated data
        memberBalances: financialData.members,
        metrics: financialData.summary,
        // Actions
        recordDailyMealsBulk,
        addExpense,
        updateExpense,
        deleteExpense,
        addDeposit,
        updateDeposit,
        deleteDeposit,
        addMember,
        updateMember,
        deactivateMember,
        updateMessSettings,
        finalizeMonthlySettlement,
        addBazarItem,
        toggleBazarItem,
        deleteBazarItem,
        addBazarScheduleEntry,
        saveMealRequest,
        createNewMess,
        resetAllDemoData
      }}
    >
      {children}
    </MessContext.Provider>
  );
};

export const useMess = () => {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
};
