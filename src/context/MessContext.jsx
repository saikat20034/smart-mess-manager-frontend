import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dataService, resetDemoData } from '../services/storageService';
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
  const [loading, setLoading] = useState(true);

  // Load all data for current selection
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
        activitiesData
      ] = await Promise.all([
        dataService.getMess(),
        dataService.getMembers(),
        dataService.getCategories(),
        dataService.getMeals(selectedMonth),
        dataService.getExpenses(selectedMonth),
        dataService.getDeposits(selectedMonth),
        dataService.getSettlements(),
        dataService.getActivityLogs()
      ]);

      setMess(messData);
      setMembers(membersData);
      setCategories(catsData);
      setMeals(mealsData);
      setExpenses(expensesData);
      setDeposits(depositsData);
      setSettlements(settlementsData);
      setActivities(activitiesData);
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
    await dataService.addMember(memberData);
    await refreshData();
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
