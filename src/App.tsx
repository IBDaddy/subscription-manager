import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from './context/AppContext';
import { SubscriptionForm } from './components/SubscriptionForm';
import { ListView } from './components/ListView';
import { MatrixView } from './components/MatrixView';
import { AnalysisView } from './components/AnalysisView';
import { HistoryView } from './components/HistoryView';
import { SettingsView } from './components/SettingsView';
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
  const { t, activeTab, setActiveTab, subscriptions, isLoaded } = useApp();

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
            {activeTab === 'list' && <ListView onEdit={handleEdit} onAddNew={handleAddNew} />}

            {activeTab === 'matrix' && <MatrixView />}

            {activeTab === 'analysis' && <AnalysisView />}

            {activeTab === 'history' && <HistoryView />}

            {activeTab === 'settings' && <SettingsView />}
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

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 mt-12 border-t border-skin-border">
        <div className="text-center space-y-3">
          <p className="text-xs text-skin-subtext">
            寄付歓迎 ☕
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://buymeacoffee.com/ibdaddy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 text-amber-900 rounded-full text-sm font-bold hover:bg-amber-500 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.216 6.415l-.132-.666c-.119-.598-.388-1.163-1.001-1.379-.197-.069-.42-.098-.57-.241-.152-.143-.196-.366-.231-.572-.065-.378-.125-.756-.192-1.133-.057-.325-.102-.69-.25-.987-.195-.4-.597-.634-.996-.788a5.723 5.723 0 00-.626-.194c-1-.263-2.05-.36-3.077-.416a25.834 25.834 0 00-3.7.062c-.915.083-1.88.184-2.75.5-.318.116-.646.256-.888.501-.297.302-.393.77-.177 1.146.154.267.415.456.692.58.36.162.737.284 1.123.366 1.075.238 2.189.331 3.287.37 1.218.05 2.437.01 3.65-.118.299-.033.598-.073.896-.119.352-.054.578-.513.474-.834-.124-.383-.457-.531-.834-.473-.466.074-.96.108-1.382.146-1.177.08-2.358.082-3.536.006a22.228 22.228 0 01-1.157-.107c-.086-.01-.18-.025-.258-.036-.243-.036-.484-.08-.724-.13-.111-.027-.111-.185 0-.212h.005c.277-.06.557-.108.838-.147h.002c.131-.009.263-.032.394-.048a25.076 25.076 0 013.426-.12c.674.019 1.347.067 2.017.144l.228.031c.267.04.533.088.798.145.392.085.895.113 1.07.542.055.137.08.288.111.431l.319 1.484a.237.237 0 01-.199.284h-.003c-.037.006-.075.01-.112.015a36.704 36.704 0 01-4.743.295 37.059 37.059 0 01-4.699-.304c-.14-.017-.293-.042-.417-.06-.326-.048-.649-.108-.973-.161-.393-.065-.768-.032-1.123.161-.29.16-.527.404-.675.701-.154.316-.199.66-.267 1-.069.34-.176.707-.135 1.056.087.753.613 1.365 1.37 1.502a39.69 39.69 0 0011.343.376.483.483 0 01.535.53l-.071.697-1.018 9.907c-.041.41-.047.832-.125 1.237-.122.637-.553 1.028-1.182 1.171-.577.131-1.165.2-1.756.205-.656.004-1.31-.025-1.966-.022-.699.004-1.556-.06-2.095-.58-.475-.458-.54-1.174-.605-1.793l-.731-7.013-.322-3.094c-.037-.351-.286-.695-.678-.678-.336.015-.718.3-.678.679l.228 2.185.949 9.112c.147 1.344 1.174 2.068 2.446 2.272.742.12 1.503.144 2.257.156.966.016 1.942.053 2.892-.122 1.408-.258 2.465-1.198 2.616-2.657.34-3.332.683-6.663 1.024-9.995l.215-2.087a.484.484 0 01.39-.426c.402-.078.787-.212 1.074-.518.455-.488.546-1.124.385-1.766zm-1.478.772c-.145.137-.363.201-.578.233-2.416.359-4.866.54-7.308.46-1.748-.06-3.477-.254-5.207-.498-.17-.024-.353-.055-.47-.18-.22-.236-.111-.71-.054-.995.052-.26.152-.609.463-.646.484-.057 1.046.148 1.526.22.577.088 1.156.16 1.737.212 2.48.226 5.002.19 7.472-.14.45-.06.899-.13 1.345-.21.399-.072.84-.206 1.08.206.166.281.188.657.162.974a.544.544 0 01-.169.364z"/>
            </svg>
            Buy me a coffee
          </motion.a>
          <p className="text-[10px] text-skin-subtext">
            Subsco v2.0.0 TypeScript + Framer Motion
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
