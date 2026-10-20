import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const TRANSLATIONS = {
  bn: {
    // Navigation
    homePage: 'হোম পেজ',
    calcRoom: 'হিসাব রুম',
    addMeal: 'মিল যুক্ত',
    addExpense: 'খরচ যুক্ত',
    bazarRoster: 'বাজারের ফর্দ ও শিডিউল',
    previousMonth: 'পূর্ববর্তী মাস',
    allMonths: 'সকল মাস',
    currentMonth: 'চলতি মাস',
    returnToCurrentMonth: 'চলতি মাসে ফিরুন',
    viewingPreviousMonthAlert: 'আপনি বিগত মাসের হিসাব দেখছেন',
    allMonthsTitle: 'সকল মাসের হিসাব ও আর্কাইভ',
    allMonthsSubtitle: 'মেসের সকল চলমান ও পূর্ববর্তী মাসের হিসাব, মিল রেট ও চূড়ান্ত বিবরণী',
    members: 'সকল মেম্বার',
    reports: 'রিপোর্ট ও প্রিন্ট',
    settings: 'মেস সেটিংস',
    dayMode: 'দিন মোড',
    nightMode: 'রাত মোড',
    logout: 'লগআউট',
    manager: 'Manager',
    resident: 'Resident',

    // Mess Summary Card (Left)
    messSummaryTitle: 'মেস হিসাব',
    running: 'Running',
    messBalance: 'মেস ব্যালেন্স',
    totalDeposits: 'মেসের মোট জমা',
    totalMeals: 'মোট মিল',
    totalMealCost: 'মোট মিল খরচ',
    mealRate: 'মিল রেট',
    individualExpense: 'মোট একক অন্যান্য খরচ',
    sharedExpense: 'মোট যৌথ অন্যান্য খরচ',
    detailedCalcBtn: 'বিস্তারিত হিসাব',

    // My Account (আমার হিসাব)
    myAccountTitle: 'আমার হিসাব',
    myTotalMeals: 'মোট মিল',
    myTotalDeposits: 'মোট জমা',
    myTotalExpenses: 'মোট খরচ',
    myBalance: 'ব্যালেন্স',

    // Meal Request (মিল রিকুয়েস্ট)
    mealRequestTitle: 'মিল রিকুয়েস্ট',
    autoRequestOff: 'অটো মিল রিকোয়েস্ট বন্ধ আছে, চালু করুন',
    autoRequestOn: 'অটো মিল রিকোয়েস্ট চালু আছে',
    morning: 'সকাল',
    lunch: 'দুপুর',
    dinner: 'রাত',
    requestDeadline: 'আজকের রিকুয়েস্ট দেওয়ার শেষ সময়',
    requestSaved: 'মিল রিকোয়েস্ট সফলভাবে জমা হয়েছে!',
    total: 'মোট',

    // Bazar Schedule
    myBazarDateTitle: 'আমার বাজারের তারিখ',
    setBazarDateBtn: 'বাজার ডেট সেট করুন',
    nextBazar: 'পরবর্তী নির্ধারিত বাজার',
    noBazarScheduled: 'এখনও কোনো বাজার ডেট নির্ধারিত হয়নি',
    noBazarForMember: 'আপনার কোনো বাজার দায়িত্ব নির্ধারিত হয়নি',
    dutyForYou: 'আপনার দায়িত্ব',

    // All Members Grid
    allMembersTitle: 'সকল মেম্বার',
    totalMembersCount: 'Total {count} Members',
    dueTag: 'দিতে',
    receivableTag: 'পায়',
    cardMeals: 'মোট মিল',
    cardDeposits: 'মোট জমা',
    cardMealCost: 'মিল খরচ',
    cardIndividualCost: 'একক অন্যান্য খরচ',
    cardSharedCost: 'যৌথ অন্যান্য খরচ',
    cardTotalCost: 'মোট খরচ (মিল+অন্যান্য)',
    sendReminder: 'WhatsApp তাগাদা পাঠান',
    recordDeposit: 'জমা লিখুন',

    // Modals & Actions
    confirm: 'নিশ্চিত করুন',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ করুন',
    whatsappMessageTitle: 'বকেয়া পরিশোধের মেসেজ',
    copyMessage: 'মেসেজ কপি করুন',
    bazarListTitle: 'বাজারের ফর্দ (Shopping List)',
    addItem: 'নতুন আইটেম যুক্ত করুন',
    estimatedCost: 'আনুমানিক খরচ',

    // Auth & Signup
    signUp: 'সাইন আপ',
    signIn: 'লগ ইন',
    createMess: 'নতুন মেস তৈরি করুন',
    joinMess: 'কোড দিয়ে যোগ দিন',
    fullName: 'পূর্ণ নাম',
    email: 'ইমেইল এড্রেস',
    phone: 'মোবাইল / বিকাশ নম্বর',
    password: 'পাসওয়ার্ড',
    confirmPassword: 'পাসওয়ার্ড নিশ্চিত করুন',
    inviteCode: 'ইনভাইট কোড',
    messName: 'মেসের নাম'
  },
  en: {
    // Navigation
    homePage: 'Home Page',
    calcRoom: 'Financial Room',
    addMeal: 'Add Meals',
    addExpense: 'Add Expenses',
    bazarRoster: 'Bazar Checklist & Roster',
    previousMonth: 'Previous Month',
    allMonths: 'All Months',
    currentMonth: 'Current Month',
    returnToCurrentMonth: 'Return to Current Month',
    viewingPreviousMonthAlert: 'You are viewing past month records',
    allMonthsTitle: 'All Months Financial Archive',
    allMonthsSubtitle: 'Comprehensive archive of current and past monthly settlements and meal rates',
    members: 'All Members',
    reports: 'Reports & Print',
    settings: 'Mess Settings',
    dayMode: 'Day Mode',
    nightMode: 'Night Mode',
    logout: 'Sign Out',
    manager: 'Manager',
    resident: 'Resident',

    // Mess Summary Card (Left)
    messSummaryTitle: 'Mess Summary',
    running: 'Running',
    messBalance: 'Mess Balance',
    totalDeposits: 'Total Deposits',
    totalMeals: 'Total Meals',
    totalMealCost: 'Total Meal Food Cost',
    mealRate: 'Meal Rate',
    individualExpense: 'Individual Other Cost',
    sharedExpense: 'Total Shared Overhead',
    detailedCalcBtn: 'Detailed Settlement',

    // My Account
    myAccountTitle: 'My Account',
    myTotalMeals: 'Total Meals',
    myTotalDeposits: 'Total Deposits',
    myTotalExpenses: 'Total Expenses',
    myBalance: 'Balance',

    // Meal Request
    mealRequestTitle: 'Meal Request',
    autoRequestOff: 'Auto meal request is off, turn on',
    autoRequestOn: 'Auto meal request is active',
    morning: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    requestDeadline: "Today's request deadline is",
    requestSaved: 'Meal request saved successfully!',
    total: 'Total',

    // Bazar Schedule
    myBazarDateTitle: 'My Bazar Duty Date',
    setBazarDateBtn: 'Set Bazar Date',
    nextBazar: 'Next Scheduled Bazar',
    noBazarScheduled: 'No bazar date scheduled yet',
    noBazarForMember: 'No bazar duty assigned to you yet',
    dutyForYou: 'Your Duty',

    // All Members Grid
    allMembersTitle: 'All Members',
    totalMembersCount: 'Total {count} Members',
    dueTag: 'Due',
    receivableTag: 'Receivable',
    cardMeals: 'Total Meals',
    cardDeposits: 'Total Deposits',
    cardMealCost: 'Meal Cost',
    cardIndividualCost: 'Individual Cost',
    cardSharedCost: 'Shared Overhead',
    cardTotalCost: 'Total Cost (Meal+Other)',
    sendReminder: 'Send WhatsApp Reminder',
    recordDeposit: 'Record Payment',

    // Modals & Actions
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    whatsappMessageTitle: 'Payment Reminder Message',
    copyMessage: 'Copy Message',
    bazarListTitle: 'Bazar Shopping List',
    addItem: 'Add Item',
    estimatedCost: 'Estimated Cost',

    // Auth & Signup
    signUp: 'Sign Up',
    signIn: 'Sign In',
    createMess: 'Create New Mess',
    joinMess: 'Join With Code',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone / bKash Number',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    inviteCode: 'Invite Code',
    messName: 'Mess Name'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('smm_language') || 'bn'; // default to Bengali matching user screenshot
  });

  useEffect(() => {
    localStorage.setItem('smm_language', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  const t = (key, params = {}) => {
    let str = TRANSLATIONS[lang]?.[key] || TRANSLATIONS['bn']?.[key] || key;
    Object.keys(params).forEach((paramKey) => {
      str = str.replace(`{${paramKey}}`, params[paramKey]);
    });
    return str;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isBn: lang === 'bn' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
