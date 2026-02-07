import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CATEGORY_COLORS } from '../constants';

const SATISFACTION_COLORS = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#10b981'];

export const AnalysisView: React.FC = () => {
  const { subscriptions, t, monthlyIncome, setMonthlyIncome } = useApp();
  const [incomeInput, setIncomeInput] = useState(monthlyIncome.toString());

  const activeSubscriptions = subscriptions.filter((sub) => !sub.isPaused);

  const getMonthlyAmount = (sub: typeof subscriptions[0]) =>
    sub.cycle === 'yearly' ? Math.round(sub.amount / 12) : sub.amount;

  const totalMonthly = useMemo(
    () => activeSubscriptions.reduce((sum, sub) => sum + getMonthlyAmount(sub), 0),
    [activeSubscriptions]
  );

  // Category data for pie chart
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

  // Satisfaction data for pie chart
  const satisfactionData = useMemo(() => {
    const data = [1, 2, 3, 4, 5].map((sat) => {
      const total = activeSubscriptions
        .filter((s) => s.satisfaction === sat)
        .reduce((sum, s) => sum + getMonthlyAmount(s), 0);
      return {
        name: t.form.satisfaction.levels[sat - 1],
        value: total,
        color: SATISFACTION_COLORS[sat - 1],
      };
    }).filter((d) => d.value > 0);
    return data.length > 0 ? data : [{ name: 'None', value: 1, color: '#f1f5f9' }];
  }, [activeSubscriptions, t]);

  // Category ranking
  const categoryRanking = useMemo(() => {
    const ranking = CATEGORIES.map((cat) => {
      const total = activeSubscriptions
        .filter((s) => s.category === cat)
        .reduce((sum, s) => sum + getMonthlyAmount(s), 0);
      return {
        name: t.categories[cat],
        value: total,
        color: CATEGORY_COLORS[cat],
      };
    })
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
    return ranking;
  }, [activeSubscriptions, t]);

  // Budget status
  const budgetStatus = useMemo(() => {
    if (!monthlyIncome || monthlyIncome <= 0) return null;
    const ratio = (totalMonthly / monthlyIncome) * 100;
    if (ratio < 5)
      return {
        color: 'text-emerald-600',
        bg: 'bg-emerald-100',
        bar: 'bg-emerald-500',
        message: '素晴らしい！余裕があります 💰',
      };
    if (ratio < 10)
      return {
        color: 'text-blue-600',
        bg: 'bg-blue-100',
        bar: 'bg-blue-500',
        message: '適正範囲内です ✅',
      };
    if (ratio < 15)
      return {
        color: 'text-amber-600',
        bg: 'bg-amber-100',
        bar: 'bg-amber-500',
        message: '少し高いかも…見直し検討 🤔',
      };
    return {
      color: 'text-rose-600',
      bg: 'bg-rose-100',
      bar: 'bg-rose-500',
      message: '使いすぎの可能性！要見直し 🚨',
    };
  }, [monthlyIncome, totalMonthly]);

  const handleIncomeChange = (value: string) => {
    setIncomeInput(value);
    const num = Number(value);
    if (!isNaN(num)) {
      setMonthlyIncome(num);
    }
  };

  return (
    <div className="space-y-6">
      {/* Budget Check */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-skin-card rounded-3xl p-5 border border-skin-border shadow-skin"
      >
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
          💰 {t.analysis.budgetCheck}
        </h3>
        <div className="mb-4">
          <input
            type="number"
            placeholder={t.analysis.incomeLabel}
            value={incomeInput}
            onChange={(e) => handleIncomeChange(e.target.value)}
            className="w-full px-3 py-2 bg-skin-base border border-skin-border rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-skin-primary"
          />
        </div>
        {monthlyIncome > 0 && (
          <div className="bg-skin-base rounded-xl p-3">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span>{t.analysis.ratio}</span>
              <span>{((totalMonthly / monthlyIncome) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-skin-border h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${budgetStatus?.bar}`}
                style={{
                  width: `${Math.min(100, (totalMonthly / monthlyIncome) * 100)}%`,
                }}
              />
            </div>
            {budgetStatus && (
              <p className="text-xs text-skin-subtext mt-2 leading-relaxed">
                {budgetStatus.message}
                <br />
                <span className="opacity-70">
                  適正目安(5%): {t.currency}
                  {(monthlyIncome * 0.05).toLocaleString()}
                </span>
              </p>
            )}
          </div>
        )}
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-skin-card rounded-3xl p-4 border border-skin-border shadow-skin flex flex-col items-center"
        >
          <span className="text-xs font-bold text-skin-subtext mb-2">
            {t.analysis.category}
          </span>
          <div className="w-full h-32">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={25}
                  outerRadius={45}
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-skin-card rounded-3xl p-4 border border-skin-border shadow-skin flex flex-col items-center"
        >
          <span className="text-xs font-bold text-skin-subtext mb-2">
            {t.analysis.satisfaction}
          </span>
          <div className="w-full h-32">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={satisfactionData}
                  innerRadius={25}
                  outerRadius={45}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Spending Ranking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-skin-card rounded-3xl p-5 shadow-skin border border-skin-border"
      >
        <h3 className="text-sm font-bold text-skin-text mb-4">
          {t.analysis.ranking}
        </h3>
        <div className="space-y-4">
          {categoryRanking.map((cat, idx) => (
            <div key={cat.name} className="flex items-center gap-3">
              <span
                className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                  idx < 3
                    ? 'bg-skin-primary text-skin-primary-fg'
                    : 'bg-skin-base text-skin-subtext'
                }`}
              >
                {idx + 1}
              </span>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-bold text-skin-text">{cat.name}</span>
                  <span className="font-bold">
                    {t.currency}
                    {cat.value.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-skin-base rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.value / totalMonthly) * 100}%` }}
                    transition={{ delay: 0.4 + idx * 0.1, duration: 0.5 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
