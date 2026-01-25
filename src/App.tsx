import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import { SubscriptionCard } from './components/SubscriptionCard';
import { SubscriptionForm } from './components/SubscriptionForm';
import type { TabType, Subscription } from './types';

// Tab Button Component
const TabButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
      active
        ? 'bg-skin-primary text-skin-primary-fg shadow-skin'
        : 'text-skin-subtext hover:text-skin-text hover:bg-skin-card'
    }`}
  >
    {children}
  </motion.button>
);

const App: React.FC = () => {
  const {
    t,
    activeTab,
    setActiveTab,
    subscriptions,
    isLoaded,
    deleteSubscription,
    togglePauseSubscription,
    sortMode,
    setSortMode,
  } = useApp();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);

  const handleEdit = (sub: Subscription) => {
    setEditingSubscription(sub);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingSubscription(null);
  };

  const handleAddNew = () => {
    setEditingSubscription(null);
    setIsFormOpen(true);
  };

  // Filter active subscriptions
  const activeSubscriptions = subscriptions.filter((sub) => !sub.isPaused);
  const pausedSubscriptions = subscriptions.filter((sub) => sub.isPaused);

  // Sorting
  const sortedSubscriptions = [...activeSubscriptions].sort((a, b) => {
    if (sortMode === 'date') {
      return new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime();
    }
    if (sortMode === 'price') {
      return b.amount - a.amount;
    }
    if (sortMode === 'satisfaction') {
      return a.satisfaction - b.satisfaction;
    }
    return 0;
  });

  if (!isLoaded) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-skin-base flex items-center justify-center"
      >
        <div className="text-skin-text font-skin text-lg">Loading...</div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-skin-base text-skin-text font-skin transition-colors duration-300 selection:bg-skin-primary selection:text-skin-primary-fg pb-24">
      {/* Subscription Form Modal */}
      <SubscriptionForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        subscription={editingSubscription}
      />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-skin-base/95 backdrop-blur-sm border-b border-skin-border"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-skin-text">{t.appTitle}</h1>
              <p className="text-sm text-skin-subtext">{t.appDesc}</p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-skin-subtext">
                {subscriptions.length} {t.stats.items}
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
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
                {/* Sort Controls */}
                {activeSubscriptions.length > 0 && (
                  <div className="flex justify-end">
                    <select
                      value={sortMode}
                      onChange={(e) => setSortMode(e.target.value as any)}
                      className="text-xs bg-transparent border-none text-skin-subtext font-medium focus:ring-0 cursor-pointer"
                    >
                      <option value="date">{t.sort.date}</option>
                      <option value="price">{t.sort.price}</option>
                      <option value="satisfaction">{t.sort.satisfaction}</option>
                    </select>
                  </div>
                )}

                {/* Active Subscriptions */}
                {sortedSubscriptions.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 text-skin-subtext"
                  >
                    <p className="mb-4">サブスクリプションがありません</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddNew}
                      className="bg-skin-primary text-skin-primary-fg px-6 py-2 rounded-full text-sm font-bold"
                    >
                      最初のサブスクを追加
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {sortedSubscriptions.map((sub) => (
                        <SubscriptionCard
                          key={sub.id}
                          subscription={sub}
                          onEdit={handleEdit}
                          onDelete={deleteSubscription}
                          onTogglePause={togglePauseSubscription}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Paused Subscriptions */}
                {pausedSubscriptions.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-dashed border-skin-border">
                    <h3 className="text-sm font-bold text-skin-subtext mb-4">
                      {t.status.paused} ({pausedSubscriptions.length})
                    </h3>
                    <div className="space-y-2 opacity-60">
                      {pausedSubscriptions.map((sub) => (
                        <SubscriptionCard
                          key={sub.id}
                          subscription={sub}
                          onEdit={handleEdit}
                          onDelete={deleteSubscription}
                          onTogglePause={togglePauseSubscription}
                        />
                      ))}
                    </div>
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

      {/* Floating Action Button (only on list view) */}
      {activeTab === 'list' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="fixed bottom-6 right-6 w-14 h-14 bg-skin-primary text-skin-primary-fg rounded-full flex items-center justify-center shadow-2xl z-50"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default App;
