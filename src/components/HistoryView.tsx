import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';

export const HistoryView: React.FC = () => {
  const { history, t } = useApp();

  const getActionColor = (type: string) => {
    if (type === 'cancel') return 'bg-rose-400';
    if (type === 'resume') return 'bg-emerald-400';
    return 'bg-blue-400';
  };

  const getActionLabel = (type: string) => {
    if (type === 'cancel') return t.history.labels.cancel;
    if (type === 'resume') return t.history.labels.resume;
    return t.history.labels.new;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-skin-card rounded-3xl p-6 border border-skin-border shadow-skin"
      >
        <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {t.history.title}
        </h3>

        <div className="space-y-0">
          {history.length > 0 ? (
            history.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="timeline-line relative pl-6 pb-6 last:pb-0"
              >
                <div
                  className={`absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-skin-card ${getActionColor(
                    entry.type
                  )}`}
                />
                <p className="text-[10px] text-skin-subtext font-bold mb-0.5">
                  {new Date(entry.date).toLocaleDateString()}
                </p>
                <p className="text-sm font-bold text-skin-text">
                  {entry.name}{' '}
                  <span className="text-xs font-normal text-skin-subtext">
                    - {getActionLabel(entry.type)}
                  </span>
                </p>
                <p className="text-xs text-skin-subtext">
                  {t.currency}
                  {entry.amount.toLocaleString()} /{' '}
                  {entry.cycle === 'monthly' ? t.cycle.mo : t.cycle.yr}
                </p>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-xs text-skin-subtext py-8">
              {t.history.noHistory}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
