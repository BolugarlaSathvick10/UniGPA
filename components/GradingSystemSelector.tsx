'use client';

import { motion } from 'framer-motion';
import { GradingSystem } from '@/types/grading';

interface GradingSystemSelectorProps {
  value: GradingSystem;
  onChange: (system: GradingSystem) => void;
}

export function GradingSystemSelector({ value, onChange }: GradingSystemSelectorProps) {
  const systems: { value: GradingSystem; label: string }[] = [
    { value: '10-point', label: '10 Point Scale' },
    { value: '4-point', label: '4 Point Scale' },
    { value: '7-point', label: '7 Point Scale' },
    { value: 'custom', label: 'Custom' },
  ];

  return (
    <div className="glass-card p-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Select Grading System
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as GradingSystem)}
        className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      >
        {systems.map((system) => (
          <option key={system.value} value={system.value}>
            {system.label}
          </option>
        ))}
      </select>
    </div>
  );
}

