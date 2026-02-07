import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import type { Subscription } from '../types';

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onDelete: (id: string) => void;
  onTogglePause: (id: string) => void;
}

const getDaysUntilBilling = (date: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const billing = new Date(date);
  billing.setHours(0, 0, 0, 0);
  return Math.ceil((billing.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

const getUrgencyColor = (days: number): string => {
  if (days < 0) return 'text-skin-subtext';
  if (days <= 3) return 'text-rose-500 font-bold';
  if (days <= 7) return 'text-amber-500 font-bold';
  return 'text-emerald-500';
};

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  subscription,
  onEdit,
  onDelete,
  onTogglePause,
}) => {
  const { t, displayCycle } = useApp();
  const days = getDaysUntilBilling(subscription.nextBillingDate);

  const amount =
    displayCycle === 'monthly'
      ? subscription.cycle === 'yearly'
        ? Math.round(subscription.amount / 12)
        : subscription.amount
      : subscription.cycle === 'monthly'
      ? subscription.amount * 12
      : subscription.amount;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -20 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-skin-card rounded-3xl p-4 shadow-skin border border-skin-border hover:border-skin-subtext/30 transition-all group relative overflow-hidden"
    >
      {/* Color accent bar */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.1 }}
        className="absolute left-0 top-0 bottom-0 w-1.5 origin-top"
        style={{
          backgroundColor:
            subscription.satisfaction === 5
              ? '#10b981'
              : subscription.satisfaction >= 3
              ? '#f59e0b'
              : '#ef4444',
        }}
      />

      <div className="pl-3 flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-base mb-0.5 text-skin-text">
            {subscription.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-skin-subtext font-medium">
            <span>
              {t.currency}
              {amount.toLocaleString()}
            </span>
            <span className="opacity-60">
              / {subscription.cycle === 'monthly' ? t.cycle.mo : t.cycle.yr}
            </span>
            {subscription.isPaused && (
              <span className="px-1.5 py-0.5 rounded text-[9px] border border-amber-200 text-amber-600 bg-amber-50">
                {t.status.paused}
              </span>
            )}
          </div>
        </div>

        <div className={`text-xs font-bold text-right ${getUrgencyColor(days)}`}>
          {days < 0
            ? t.card.expired
            : days === 0
            ? t.card.today
            : t.card.daysLeft.replace('{days}', String(days))}
        </div>
      </div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="pl-3 mt-4 flex justify-between items-center border-t border-skin-border pt-3"
      >
        <div className="flex gap-3 text-xs text-skin-subtext">
          <span>{subscription.category}</span>
          <span>·</span>
          <span>
            {t.form.satisfaction.levels[subscription.satisfaction - 1]}
          </span>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTogglePause(subscription.id)}
            className="p-1.5 text-amber-400 hover:bg-amber-50 rounded-full transition-colors"
          >
            <PauseIcon />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(subscription)}
            className="p-1.5 text-skin-subtext hover:bg-skin-base rounded-full transition-colors"
          >
            <EditIcon />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(subscription.id)}
            className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-full transition-colors"
          >
            <TrashIcon />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Icons
const PauseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);
