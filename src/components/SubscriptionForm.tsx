import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Modal } from './Modal';
import type { Subscription } from '../types';
import { SERVICE_PRESETS } from '../utils/translations';

interface SubscriptionFormProps {
  isOpen: boolean;
  onClose: () => void;
  subscription?: Subscription | null;
}

import { CATEGORIES } from '../constants';

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  isOpen,
  onClose,
  subscription,
}) => {
  const { t, addSubscription, updateSubscription } = useApp();
  const isEditing = !!subscription;

  const [formData, setFormData] = useState({
    name: '',
    amount: 0,
    category: 'other' as string,
    cycle: 'monthly' as 'monthly' | 'yearly',
    nextBillingDate: '',
    satisfaction: 3,
    frequency: 3,
  });

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name,
        amount: subscription.amount,
        category: subscription.category,
        cycle: subscription.cycle,
        nextBillingDate: subscription.nextBillingDate,
        satisfaction: subscription.satisfaction,
        frequency: subscription.frequency,
      });
    } else {
      // Default to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setFormData({
        name: '',
        amount: 0,
        category: 'other',
        cycle: 'monthly',
        nextBillingDate: tomorrow.toISOString().split('T')[0],
        satisfaction: 3,
        frequency: 3,
      });
    }
  }, [subscription, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.amount <= 0 || !formData.nextBillingDate) {
      return;
    }

    if (isEditing && subscription) {
      updateSubscription(subscription.id, formData);
    } else {
      addSubscription({
        ...formData,
        isPaused: false,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t.form.editTitle : t.form.title}
      footer={
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          className="w-full bg-skin-primary text-skin-primary-fg py-3 rounded-skin text-sm font-bold shadow-sm transition-all"
        >
          {t.form.save}
        </motion.button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Name */}
        <div>
          <label className="text-xs font-bold text-skin-subtext mb-1 block">
            {t.form.name}
          </label>
          <input
            type="text"
            list="service-presets"
            placeholder="Netflix, Spotify..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-skin-base border border-skin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-skin-primary transition-all"
          />
          <datalist id="service-presets">
            {SERVICE_PRESETS.map((preset) => (
              <option key={preset} value={preset} />
            ))}
          </datalist>
        </div>

        {/* Amount and Cycle */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-skin-subtext mb-1 block">
              {t.form.amount}
            </label>
            <input
              type="number"
              placeholder="0"
              value={formData.amount || ''}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              className="w-full px-3 py-2 bg-skin-base border border-skin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-skin-primary"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-skin-subtext mb-1 block">
              {t.form.cycle.label}
            </label>
            <select
              value={formData.cycle}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  cycle: e.target.value as 'monthly' | 'yearly',
                })
              }
              className="w-full px-3 py-2 bg-skin-base border border-skin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-skin-primary"
            >
              <option value="monthly">{t.form.cycle.monthly}</option>
              <option value="yearly">{t.form.cycle.yearly}</option>
            </select>
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-xs font-bold text-skin-subtext mb-1 block">
            {t.form.category}
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-3 py-2 bg-skin-base border border-skin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-skin-primary"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {t.categories[cat]}
              </option>
            ))}
          </select>
        </div>

        {/* Next Billing */}
        <div>
          <label className="text-xs font-bold text-skin-subtext mb-1 block">
            {t.form.nextBilling}
          </label>
          <input
            type="date"
            value={formData.nextBillingDate}
            onChange={(e) =>
              setFormData({ ...formData, nextBillingDate: e.target.value })
            }
            className="w-full px-3 py-2 bg-skin-base border border-skin-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-skin-primary"
          />
        </div>

        {/* Satisfaction */}
        <div>
          <label className="text-xs font-bold text-skin-subtext mb-1 block">
            {t.form.satisfaction.label}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <motion.button
                key={level}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, satisfaction: level })}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  formData.satisfaction === level
                    ? 'bg-skin-primary text-skin-primary-fg'
                    : 'bg-skin-base border border-skin-border text-skin-subtext'
                }`}
              >
                {t.form.satisfaction.levels[level - 1]}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="text-xs font-bold text-skin-subtext mb-1 block">
            {t.form.frequency.label}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <motion.button
                key={level}
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, frequency: level })}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  formData.frequency === level
                    ? 'bg-skin-primary text-skin-primary-fg'
                    : 'bg-skin-base border border-skin-border text-skin-subtext'
                }`}
              >
                {t.form.frequency.levels[level - 1]}
              </motion.button>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
};
