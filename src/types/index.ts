export interface Subscription {
  id: string;
  name: string;
  amount: number;
  category: string;
  cycle: 'monthly' | 'yearly';
  nextBillingDate: string;
  satisfaction: number;
  frequency: number;
  isPaused: boolean;
}

export interface HistoryEntry {
  id: string;
  type: 'cancel' | 'resume' | 'new';
  name: string;
  date: string;
  amount: number;
  cycle: 'monthly' | 'yearly';
}

export type Language = 'ja' | 'en';

export type TabType = 'list' | 'matrix' | 'analysis' | 'history' | 'settings';

export type SortMode = 'date' | 'price' | 'satisfaction';

export type DisplayCycle = 'monthly' | 'yearly';

export interface Translations {
  appTitle: string;
  appDesc: string;
  currency: string;
  cycle: {
    monthly: string;
    yearly: string;
    mo: string;
    yr: string;
  };
  tab: {
    list: string;
    matrix: string;
    analysis: string;
    history: string;
    settings: string;
  };
  stats: {
    total: string;
    active: string;
    savings: string;
    items: string;
    noSubscriptions: string;
    addFirst: string;
  };
  sort: {
    date: string;
    price: string;
    satisfaction: string;
  };
  card: {
    expired: string;
    today: string;
    daysLeft: string;
  };
  status: {
    paused: string;
    resume: string;
    stop: string;
  };
  matrix: {
    axisX: string;
    axisY: string;
    description: string;
  };
  analysis: {
    budgetCheck: string;
    incomeLabel: string;
    ratio: string;
    category: string;
    satisfaction: string;
    ranking: string;
  };
  history: {
    title: string;
    noHistory: string;
    labels: {
      cancel: string;
      resume: string;
      new: string;
    };
  };
  settings: {
    title: string;
    language: string;
    darkMode: string;
    dataManagement: string;
    backup: string;
    restore: string;
    reset: string;
    resetWarning: string;
    importError: string;
  };
  form: {
    title: string;
    editTitle: string;
    name: string;
    amount: string;
    category: string;
    cycle: {
      label: string;
      monthly: string;
      yearly: string;
    };
    nextBilling: string;
    satisfaction: {
      label: string;
      levels: string[];
    };
    frequency: {
      label: string;
      levels: string[];
    };
    save: string;
    cancel: string;
  };
  categories: Record<string, string>;
}
