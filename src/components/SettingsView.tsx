import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export const SettingsView: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    isDarkMode,
    toggleDarkMode,
    exportData,
    importData,
    resetAllData,
  } = useApp();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result as string;
        importData(data);
      } catch (err) {
        alert('データの復元に失敗しました');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Language Switch */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-skin-card rounded-3xl p-4 border border-skin-border shadow-sm flex items-center justify-between"
      >
        <h3 className="font-bold text-skin-text text-sm flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {t.settings.language}
        </h3>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage('ja')}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              language === 'ja'
                ? 'bg-skin-primary text-skin-primary-fg border-skin-primary'
                : 'bg-skin-base border-skin-border text-skin-subtext'
            }`}
          >
            JP
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLanguage('en')}
            className={`px-3 py-1 text-xs rounded-full border transition-all ${
              language === 'en'
                ? 'bg-skin-primary text-skin-primary-fg border-skin-primary'
                : 'bg-skin-base border-skin-border text-skin-subtext'
            }`}
          >
            EN
          </motion.button>
        </div>
      </motion.div>

      {/* Dark Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-skin-card rounded-3xl p-4 border border-skin-border shadow-sm flex items-center justify-between"
      >
        <h3 className="font-bold text-skin-text text-sm flex items-center gap-3">
          {isDarkMode ? '🌙' : '☀️'} {t.settings.darkMode}
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleDarkMode}
          className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
            isDarkMode
              ? 'bg-skin-primary text-skin-primary-fg border-skin-primary'
              : 'bg-skin-base border-skin-border text-skin-subtext'
          }`}
        >
          {isDarkMode ? 'ON' : 'OFF'}
        </motion.button>
      </motion.div>

      {/* Backup */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={exportData}
        className="w-full bg-skin-card p-4 rounded-3xl border border-skin-border shadow-sm flex items-center justify-between text-sm font-bold hover:bg-skin-base transition-colors"
      >
        <span className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {t.settings.backup}
        </span>
      </motion.button>

      {/* Restore */}
      <div className="relative w-full">
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleImportClick}
          className="w-full bg-skin-card p-4 rounded-3xl border border-skin-border shadow-sm flex items-center justify-between text-sm font-bold hover:bg-skin-base transition-colors"
        >
          <span className="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {t.settings.restore}
          </span>
        </motion.button>
      </div>

      {/* Reset */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={resetAllData}
        className="w-full bg-rose-50 p-4 rounded-3xl border border-rose-100 flex items-center justify-between text-sm font-bold text-rose-600 hover:opacity-80 transition-colors mt-8"
      >
        <span className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          {t.settings.reset}
        </span>
      </motion.button>

    </div>
  );
};
