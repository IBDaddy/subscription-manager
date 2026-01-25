import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import type { Subscription } from '../types';

const SATISFACTION_LEVELS = [5, 4, 3, 2, 1];
const FREQUENCY_LEVELS = [5, 4, 3, 2, 1];

const getMatrixCellColor = (sat: number, freq: number): string => {
  const score = (5 - sat) + (5 - freq);
  if (score >= 6) return 'bg-rose-50 border-rose-200';
  if (score >= 4) return 'bg-amber-50 border-amber-200';
  if (score >= 2) return 'bg-yellow-50 border-yellow-200';
  return 'bg-emerald-50 border-emerald-200';
};

export const MatrixView: React.FC = () => {
  const { subscriptions, t } = useApp();

  const activeSubscriptions = subscriptions.filter((sub) => !sub.isPaused);

  const matrixData = useMemo(() => {
    const matrix: Record<number, Record<number, Subscription[]>> = {};
    SATISFACTION_LEVELS.forEach((sat) => {
      matrix[sat] = {};
      FREQUENCY_LEVELS.forEach((freq) => {
        matrix[sat][freq] = activeSubscriptions.filter(
          (sub) => sub.satisfaction === sat && sub.frequency === freq
        );
      });
    });
    return matrix;
  }, [activeSubscriptions]);

  const getMonthlyAmount = (sub: Subscription) =>
    sub.cycle === 'yearly' ? Math.round(sub.amount / 12) : sub.amount;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-skin-card rounded-3xl p-6 border border-skin-border shadow-skin"
      >
        <p className="text-xs text-skin-subtext mb-6 whitespace-pre-wrap">
          {t.matrix.description}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-xs">
            <thead>
              <tr>
                <th className="p-2 text-left w-20 text-skin-subtext font-normal">
                  {t.matrix.axisX} →<br />↓ {t.matrix.axisY}
                </th>
                {FREQUENCY_LEVELS.map((freq) => (
                  <th
                    key={freq}
                    className="p-2 text-center font-bold text-skin-text bg-skin-base rounded-t-lg"
                  >
                    {t.form.frequency.levels[freq - 1]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SATISFACTION_LEVELS.map((sat) => (
                <tr key={sat}>
                  <td className="p-2 font-bold text-skin-text bg-skin-base rounded-l-lg">
                    {t.form.satisfaction.levels[sat - 1]}
                  </td>
                  {FREQUENCY_LEVELS.map((freq) => {
                    const subs = matrixData[sat][freq];
                    const cellColor = getMatrixCellColor(sat, freq);
                    return (
                      <td
                        key={freq}
                        className={`p-1 border-2 border-skin-bg align-top ${cellColor} rounded-lg h-24 w-24 relative`}
                      >
                        <div className="absolute inset-0 p-1 overflow-y-auto scrollbar-hide">
                          {subs.map((sub) => (
                            <motion.div
                              key={sub.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="bg-skin-card/90 backdrop-blur-sm rounded p-1.5 mb-1 shadow-sm border border-skin-border cursor-pointer hover:scale-105 transition-transform"
                            >
                              <p className="font-bold truncate text-[10px] text-skin-text">
                                {sub.name}
                              </p>
                              <p className="text-[9px] text-skin-subtext">
                                {t.currency}
                                {getMonthlyAmount(sub).toLocaleString()}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};
