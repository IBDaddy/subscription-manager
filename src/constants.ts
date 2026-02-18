export const CATEGORIES = [
  'streaming', 'cloud', 'tool', 'learning', 'health', 'delivery', 'news', 'game', 'other',
] as const;

export type Category = typeof CATEGORIES[number];

export const PAYMENT_METHODS = [
  'credit_card', 'google_play', 'apple_store', 'cash', 'bank_transfer', 'other',
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number];

export const PAYMENT_METHOD_COLORS: Record<string, string> = {
  credit_card: '#6366f1',
  google_play: '#34a853',
  apple_store: '#a855f7',
  cash: '#f59e0b',
  bank_transfer: '#0ea5e9',
  other: '#64748b',
};

export const CATEGORY_COLORS: Record<string, string> = {
  streaming: '#f43f5e',
  cloud: '#0ea5e9',
  tool: '#3b82f6',
  learning: '#f59e0b',
  health: '#10b981',
  delivery: '#06b6d4',
  news: '#8b5cf6',
  game: '#d946ef',
  other: '#64748b',
};
