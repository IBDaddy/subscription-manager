import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import type { TabType } from './types';

// Temporary placeholder components - will be split into separate files
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
      active
        ? 'bg-skin-primary text-skin-primary-fg shadow-skin'
        : 'text-skin-subtext hover:text-skin-text hover:bg-skin-card'
    }`}
  >
    {children}
  </button>
);

const App: React.FC = () => {
  const { t, activeTab, setActiveTab, subscriptions, isLoaded } = useApp();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-skin-base flex items-center justify-center">
        <div className="text-skin-text font-skin">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-skin-base text-skin-text font-skin transition-colors duration-300 selection:bg-skin-primary selection:text-skin-primary-fg">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-skin-base/95 backdrop-blur-sm border-b border-skin-border"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-skin-text">{t.appTitle}</h1>
              <p className="text-sm text-skin-subtext">{t.appDesc}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-sm text-skin-subtext">
                {subscriptions.length} {t.stats.items}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-2 overflow-x-auto pb-2">
            {(['list', 'matrix', 'analysis', 'history', 'settings'] as TabType[]).map((tab) => (
              <TabButton
                key={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              >
                {t.tab[tab]}
              </TabButton>
            ))}
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'list' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{t.tab.list}</h2>
                {subscriptions.length === 0 ? (
                  <div className="text-center py-12 text-skin-subtext">
                    サブスクリプションがありません
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {subscriptions.map((sub) => (
                      <motion.div
                        key={sub.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-skin-card border border-skin-border rounded-3xl p-4 shadow-skin"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-skin-text">{sub.name}</h3>
                            <p className="text-sm text-skin-subtext">{sub.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-skin-text">
                              {t.currency}{sub.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-skin-subtext">
                              {sub.cycle === 'monthly' ? t.cycle.mo : t.cycle.yr}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'matrix' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{t.tab.matrix}</h2>
                <div className="bg-skin-card border border-skin-border rounded-3xl p-6 shadow-skin">
                  <p className="text-skin-subtext">Matrix view - Coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'analysis' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{t.tab.analysis}</h2>
                <div className="bg-skin-card border border-skin-border rounded-3xl p-6 shadow-skin">
                  <p className="text-skin-subtext">Analysis view - Coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{t.tab.history}</h2>
                <div className="bg-skin-card border border-skin-border rounded-3xl p-6 shadow-skin">
                  <p className="text-skin-subtext">History view - Coming soon</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">{t.tab.settings}</h2>
                <div className="bg-skin-card border border-skin-border rounded-3xl p-6 shadow-skin">
                  <p className="text-skin-subtext">Settings view - Coming soon</p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default App;
