import type { Translations, Language } from '../types';

export const TRANSLATIONS: Record<Language, Translations> = {
  ja: {
    appTitle: 'Subsco',
    appDesc: '満足度×頻度で最適化',
    currency: '¥',
    cycle: { monthly: '月額', yearly: '年額', mo: '月', yr: '年' },
    tab: { list: '一覧', matrix: '分析', analysis: 'グラフ', history: '履歴', settings: '設定' },
    stats: { total: '合計支出', active: '契約中', savings: '削減余地', items: '件', noSubscriptions: 'サブスクリプションがありません', addFirst: '最初のサブスクを追加' },
    sort: { date: '更新が近い順', price: '金額が高い順', satisfaction: '満足度が低い順' },
    card: { expired: '期限切れ', today: '今日請求', daysLeft: 'あと{days}日' },
    status: { paused: '停止中', resume: '再開', stop: '停止' },
    matrix: { axisX: '満足度', axisY: '頻度', description: '右下にあるサービスほど\n見直しの優先度が高いです' },
    analysis: {
      budgetCheck: '家計負担率チェック', incomeLabel: '手取り月収を入力', ratio: '固定費率',
      category: 'カテゴリ別', satisfaction: '満足度別', ranking: '支出ランキング (カテゴリ)'
    },
    history: { title: '活動履歴', noHistory: '履歴はありません', labels: { cancel: '解約', resume: '再契約', new: '新規契約' } },
    settings: {
      title: '設定', language: '言語', darkMode: 'ダークモード',
      dataManagement: 'データ管理', backup: 'バックアップ', restore: '復元', reset: 'リセット',
      resetWarning: 'すべてのデータが削除されます。本当によろしいですか？',
      importError: 'データの復元に失敗しました'
    },
    form: {
      title: '新規サービス', editTitle: '編集', name: 'サービス名', amount: '月額料金', category: 'カテゴリ',
      cycle: { label: '支払いサイクル', monthly: '月額', yearly: '年額' },
      nextBilling: '次回請求日',
      satisfaction: { label: '満足度', levels: ['不満', 'やや不満', '普通', '満足', '大満足'] },
      frequency: { label: '使用頻度', levels: ['ほぼ未使用', 'たまに', '週1～2', '毎日', 'ヘビー'] },
      save: '保存', cancel: 'キャンセル'
    },
    categories: {
      streaming: '動画/音楽', cloud: 'クラウド', tool: '仕事ツール', learning: '学習/資格',
      health: '健康/フィットネス', delivery: '配達', news: 'ニュース/雑誌', game: 'ゲーム/娯楽', other: 'その他'
    }
  },
  en: {
    appTitle: 'Subsco',
    appDesc: 'Optimize with Satisfaction x Frequency',
    currency: '$',
    cycle: { monthly: 'Monthly', yearly: 'Yearly', mo: '/mo', yr: '/yr' },
    tab: { list: 'List', matrix: 'Matrix', analysis: 'Analysis', history: 'History', settings: 'Settings' },
    stats: { total: 'Total Cost', active: 'Active', savings: 'Potential Savings', items: 'items', noSubscriptions: 'No subscriptions yet', addFirst: 'Add your first subscription' },
    sort: { date: 'Next Billing', price: 'Price (High to Low)', satisfaction: 'Satisfaction (Low to High)' },
    card: { expired: 'Expired', today: 'Due Today', daysLeft: '{days}d left' },
    status: { paused: 'Paused', resume: 'Resume', stop: 'Pause' },
    matrix: { axisX: 'Satisfaction', axisY: 'Frequency', description: 'Services in the bottom-right\nshould be reviewed first' },
    analysis: {
      budgetCheck: 'Budget Impact Check', incomeLabel: 'Monthly Income', ratio: 'Fixed Cost Ratio',
      category: 'By Category', satisfaction: 'By Satisfaction', ranking: 'Spending Ranking (Category)'
    },
    history: { title: 'Activity History', noHistory: 'No history yet', labels: { cancel: 'Cancelled', resume: 'Resumed', new: 'New' } },
    settings: {
      title: 'Settings', language: 'Language', darkMode: 'Dark Mode',
      dataManagement: 'Data Management', backup: 'Backup', restore: 'Restore', reset: 'Reset',
      resetWarning: 'All data will be deleted. Are you sure?',
      importError: 'Failed to restore data'
    },
    form: {
      title: 'New Service', editTitle: 'Edit', name: 'Service Name', amount: 'Monthly Cost', category: 'Category',
      cycle: { label: 'Billing Cycle', monthly: 'Monthly', yearly: 'Yearly' },
      nextBilling: 'Next Billing Date',
      satisfaction: { label: 'Satisfaction', levels: ['Poor', 'Fair', 'Good', 'Great', 'Excellent'] },
      frequency: { label: 'Usage Frequency', levels: ['Rarely', 'Sometimes', '1-2x/week', 'Daily', 'Heavy'] },
      save: 'Save', cancel: 'Cancel'
    },
    categories: {
      streaming: 'Video/Music', cloud: 'Cloud', tool: 'Tools', learning: 'Learning',
      health: 'Health/Fitness', delivery: 'Delivery', news: 'News/Magazine', game: 'Gaming', other: 'Other'
    }
  }
};

export const SERVICE_PRESETS = [
  'Netflix', 'Spotify', 'YouTube Premium', 'Amazon Prime', 'Disney+', 'Hulu', 'Apple Music',
  'iCloud+', 'Google One', 'Dropbox', 'Adobe Creative Cloud', 'Microsoft 365', 'GitHub',
  'ChatGPT Plus', 'Notion', 'Evernote', 'Udemy', 'Coursera', 'Duolingo Plus', 'RIZAP',
  'Uber Eats Pass', 'Nikkei', 'PlayStation Plus', 'Nintendo Switch Online', 'Xbox Game Pass'
];

export const SATISFACTION_LEVELS = [1, 2, 3, 4, 5];
export const FREQUENCY_LEVELS = [1, 2, 3, 4, 5];
