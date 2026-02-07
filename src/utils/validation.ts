import type { Subscription, HistoryEntry } from '../types';
import { CATEGORIES } from '../constants';

function isValidSubscription(obj: unknown): obj is Subscription {
  if (typeof obj !== 'object' || obj === null) return false;
  const s = obj as Record<string, unknown>;

  return (
    (typeof s.id === 'string' || typeof s.id === 'number') &&
    typeof s.name === 'string' && s.name.length > 0 &&
    typeof s.amount === 'number' && s.amount > 0 &&
    typeof s.category === 'string' && (CATEGORIES as readonly string[]).includes(s.category) &&
    (s.cycle === 'monthly' || s.cycle === 'yearly') &&
    typeof s.nextBillingDate === 'string' && !isNaN(Date.parse(s.nextBillingDate)) &&
    typeof s.satisfaction === 'number' && s.satisfaction >= 1 && s.satisfaction <= 5 &&
    typeof s.frequency === 'number' && s.frequency >= 1 && s.frequency <= 5 &&
    typeof s.isPaused === 'boolean'
  );
}

function isValidHistoryEntry(obj: unknown): obj is HistoryEntry {
  if (typeof obj !== 'object' || obj === null) return false;
  const h = obj as Record<string, unknown>;

  return (
    (typeof h.id === 'string' || typeof h.id === 'number') &&
    (h.type === 'cancel' || h.type === 'resume' || h.type === 'new') &&
    typeof h.name === 'string' && h.name.length > 0 &&
    typeof h.date === 'string' && !isNaN(Date.parse(h.date)) &&
    typeof h.amount === 'number' && h.amount > 0 &&
    (h.cycle === 'monthly' || h.cycle === 'yearly')
  );
}

/** Normalize legacy numeric IDs to string */
function normalizeId<T extends { id: string | number }>(item: T): T & { id: string } {
  return { ...item, id: String(item.id) };
}

export interface ImportValidationResult {
  success: boolean;
  errors: string[];
  data?: {
    subscriptions: Subscription[];
    history: HistoryEntry[];
    monthlyIncome: number;
    language?: 'ja' | 'en';
    isDarkMode?: boolean;
  };
}

export function validateImportData(jsonString: string): ImportValidationResult {
  const errors: string[] = [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch {
    return { success: false, errors: ['JSON parse error'] };
  }

  if (typeof parsed !== 'object' || parsed === null) {
    return { success: false, errors: ['Invalid data format'] };
  }

  const data = parsed as Record<string, unknown>;

  // Validate subscriptions
  const subscriptions: Subscription[] = [];
  if (Array.isArray(data.subscriptions)) {
    data.subscriptions.forEach((item, i) => {
      if (isValidSubscription(item)) {
        subscriptions.push(normalizeId(item as Subscription & { id: string | number }));
      } else {
        errors.push(`subscriptions[${i}]: invalid`);
      }
    });
  }

  // Validate history
  const history: HistoryEntry[] = [];
  if (Array.isArray(data.history)) {
    data.history.forEach((item, i) => {
      if (isValidHistoryEntry(item)) {
        history.push(normalizeId(item as HistoryEntry & { id: string | number }));
      } else {
        errors.push(`history[${i}]: invalid`);
      }
    });
  }

  const monthlyIncome = typeof data.monthlyIncome === 'number' && data.monthlyIncome >= 0
    ? data.monthlyIncome
    : 0;

  const language = (data.language === 'ja' || data.language === 'en')
    ? data.language
    : undefined;

  const isDarkMode = typeof data.isDarkMode === 'boolean'
    ? data.isDarkMode
    : undefined;

  return {
    success: true,
    errors,
    data: { subscriptions, history, monthlyIncome, language, isDarkMode },
  };
}
