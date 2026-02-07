export const CATEGORIES = [
  'streaming', 'cloud', 'tool', 'learning', 'health', 'delivery', 'news', 'game', 'other',
] as const;

export type Category = typeof CATEGORIES[number];

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
