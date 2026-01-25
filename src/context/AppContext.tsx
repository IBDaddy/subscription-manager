import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import localforage from 'localforage';
import type { Subscription, HistoryEntry, Language, TabType, SortMode, DisplayCycle, Translations } from '../types';
import { TRANSLATIONS } from '../utils/translations';

interface AppContextType {
  // Data
  subscriptions: Subscription[];
  history: HistoryEntry[];
  monthlyIncome: number;

  // UI State
  language: Language;
  activeTab: TabType;
  sortMode: SortMode;
  displayCycle: DisplayCycle;
  isDarkMode: boolean;
  isLoaded: boolean;

  // Actions
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  updateSubscription: (id: number, subscription: Partial<Subscription>) => void;
  deleteSubscription: (id: number) => void;
  togglePauseSubscription: (id: number) => void;

  addHistory: (entry: Omit<HistoryEntry, 'id'>) => void;

  setLanguage: (lang: Language) => void;
  setActiveTab: (tab: TabType) => void;
  setSortMode: (mode: SortMode) => void;
  setDisplayCycle: (cycle: DisplayCycle) => void;
  setMonthlyIncome: (income: number) => void;
  toggleDarkMode: () => void;

  exportData: () => void;
  importData: (data: string) => void;
  resetAllData: () => void;

  // Helper
  t: Translations;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [monthlyIncome, setMonthlyIncomeState] = useState<number>(0);

  const [language, setLanguageState] = useState<Language>('ja');
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [sortMode, setSortMode] = useState<SortMode>('date');
  const [displayCycle, setDisplayCycle] = useState<DisplayCycle>('monthly');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localforage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSubs = await localforage.getItem<Subscription[]>('subscriptions_pwa');
        const savedHistory = await localforage.getItem<HistoryEntry[]>('history_pwa');
        const savedIncome = await localforage.getItem<number>('monthly_income_pwa');
        const savedLang = await localforage.getItem<Language>('language_pwa');
        const savedDark = await localforage.getItem<boolean>('dark_mode_pwa');

        if (savedSubs) setSubscriptions(savedSubs);
        if (savedHistory) setHistory(savedHistory);
        if (savedIncome) setMonthlyIncomeState(savedIncome);
        if (savedLang) setLanguageState(savedLang);
        if (savedDark !== null) setIsDarkMode(savedDark);

        setIsLoaded(true);
      } catch (err) {
        console.error('Failed to load data:', err);
        setIsLoaded(true);
      }
    };
    loadData();
  }, []);

  // Save subscriptions
  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('subscriptions_pwa', subscriptions);
    }
  }, [subscriptions, isLoaded]);

  // Save history
  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('history_pwa', history);
    }
  }, [history, isLoaded]);

  // Save monthlyIncome
  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('monthly_income_pwa', monthlyIncome);
    }
  }, [monthlyIncome, isLoaded]);

  // Save language
  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('language_pwa', language);
    }
  }, [language, isLoaded]);

  // Save dark mode and apply to DOM
  useEffect(() => {
    if (isLoaded) {
      localforage.setItem('dark_mode_pwa', isDarkMode);
    }
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, isLoaded]);

  // Actions
  const addSubscription = (sub: Omit<Subscription, 'id'>) => {
    const newSub: Subscription = {
      ...sub,
      id: Date.now() + Math.random(),
    };
    setSubscriptions(prev => [...prev, newSub]);

    addHistory({
      type: 'new',
      name: newSub.name,
      date: new Date().toISOString(),
      amount: newSub.amount,
      cycle: newSub.cycle,
    });
  };

  const updateSubscription = (id: number, updates: Partial<Subscription>) => {
    setSubscriptions(prev =>
      prev.map(sub => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  };

  const deleteSubscription = (id: number) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      setSubscriptions(prev => prev.filter(s => s.id !== id));
      addHistory({
        type: 'cancel',
        name: sub.name,
        date: new Date().toISOString(),
        amount: sub.amount,
        cycle: sub.cycle,
      });
    }
  };

  const togglePauseSubscription = (id: number) => {
    const sub = subscriptions.find(s => s.id === id);
    if (sub) {
      const newPausedState = !sub.isPaused;
      updateSubscription(id, { isPaused: newPausedState });

      if (newPausedState) {
        // Paused - no history
      } else {
        addHistory({
          type: 'resume',
          name: sub.name,
          date: new Date().toISOString(),
          amount: sub.amount,
          cycle: sub.cycle,
        });
      }
    }
  };

  const addHistory = (entry: Omit<HistoryEntry, 'id'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: Date.now() + Math.random(),
    };
    setHistory(prev => [newEntry, ...prev]);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setMonthlyIncome = (income: number) => {
    setMonthlyIncomeState(income);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const exportData = () => {
    const data = {
      subscriptions,
      history,
      monthlyIncome,
      language,
      isDarkMode,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subsco_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.subscriptions) setSubscriptions(data.subscriptions);
      if (data.history) setHistory(data.history);
      if (data.monthlyIncome) setMonthlyIncomeState(data.monthlyIncome);
      if (data.language) setLanguageState(data.language);
      if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);
    } catch (err) {
      console.error('Failed to import data:', err);
      alert('データの復元に失敗しました');
    }
  };

  const resetAllData = () => {
    if (confirm(TRANSLATIONS[language].settings.resetWarning)) {
      setSubscriptions([]);
      setHistory([]);
      setMonthlyIncomeState(0);
      localforage.clear();
    }
  };

  const value: AppContextType = {
    subscriptions,
    history,
    monthlyIncome,
    language,
    activeTab,
    sortMode,
    displayCycle,
    isDarkMode,
    isLoaded,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    togglePauseSubscription,
    addHistory,
    setLanguage,
    setActiveTab,
    setSortMode,
    setDisplayCycle,
    setMonthlyIncome,
    toggleDarkMode,
    exportData,
    importData,
    resetAllData,
    t: TRANSLATIONS[language],
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
