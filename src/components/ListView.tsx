import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { SubscriptionCard } from './SubscriptionCard';
import { CATEGORIES, CATEGORY_COLORS } from '../constants';
import type { Subscription, SortMode } from '../types';

interface ListViewProps {
  onEdit: (sub: Subscription) => void;
  onAddNew: () => void;
}

export const ListView: React.FC<ListViewProps> = ({ onEdit, onAddNew }) => {
  const {
    t,
    subscriptions,
    deleteSubscription,
    togglePauseSubscription,
    sortMode,
    setSortMode,
    displayCycle,
    setDisplayCycle,
  } = useApp();

  const activeSubscriptions = subscriptions.filter((sub) => !sub.isPaused);
  const pausedSubscriptions = subscriptions.filter((sub) => sub.isPaused);

  const getMonthlyAmount = (sub: Subscription) =>
    sub.cycle === 'yearly' ? Math.round(sub.amount / 12) : sub.amount;

  const totalMonthly = useMemo(
    () => activeSubscriptions.reduce((sum, sub) => sum + getMonthlyAmount(sub), 0),
    [activeSubscriptions]
  );

  const totalYearly = useMemo(
    () =>
      activeSubscriptions.reduce(
        (sum, sub) => sum + (sub.cycle === 'monthly' ? sub.amount * 12 : sub.amount),
        0
      ),
    [activeSubscriptions]
  );

  const categoryData = useMemo(() => {
    const data = CATEGORIES.map((cat) => {
      const total = activeSubscriptions
        .filter((s) => s.category === cat)
        .reduce((sum, s) => sum + getMonthlyAmount(s), 0);
      return {
        name: t.categories[cat],
        value: total,
        color: CATEGORY_COLORS[cat],
      };
    }).filter((d) => d.value > 0);
    return data.length > 0 ? data : [{ name: 'None', value: 1, color: '#f1f5f9' }];
  }, [activeSubscriptions, t]);

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

  return (
    <div className="space-y-4">
      {/* Stats Card */}
      {activeSubscriptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-skin-card rounded-3xl shadow-skin p-6 mb-6 border border-skin-border relative overflow-hidden"
        >
          <div className="flex justify-between items-center relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-skin-subtext text-xs font-bold uppercase tracking-wider">
                  {t.stats.total}
                </span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setDisplayCycle(displayCycle === 'monthly' ? 'yearly' : 'monthly')
                  }
                  className="text-[10px] bg-skin-base px-2 py-0.5 rounded text-skin-subtext font-bold hover:text-skin-text transition-colors"
                >
                  {displayCycle === 'monthly' ? t.cycle.monthly : t.cycle.yearly}
                </motion.button>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold font-skin">
                  {t.currency}
                  {displayCycle === 'monthly'
                    ? totalMonthly.toLocaleString()
                    : totalYearly.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-skin-subtext mt-2">
                {t.stats.active}: {activeSubscriptions.length}
                {t.stats.items}
              </p>
            </div>

            {/* Mini Pie Chart */}
            <div className="w-20 h-20">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={25}
                    outerRadius={35}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sort Controls */}
      {activeSubscriptions.length > 0 && (
        <div className="flex justify-end items-center px-1">
          <select
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
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
          <p className="mb-4">{t.stats.noSubscriptions}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAddNew}
            className="bg-skin-primary text-skin-primary-fg px-6 py-2 rounded-full text-sm font-bold"
          >
            {t.stats.addFirst}
          </motion.button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {sortedSubscriptions.map((sub) => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                onEdit={onEdit}
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
                onEdit={onEdit}
                onDelete={deleteSubscription}
                onTogglePause={togglePauseSubscription}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
