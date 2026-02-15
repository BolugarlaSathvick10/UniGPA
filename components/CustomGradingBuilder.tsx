'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Grade } from '@/types/grading';

interface CustomGradingBuilderProps {
  grades: Grade[];
  onChange: (grades: Grade[]) => void;
}

export function CustomGradingBuilder({ grades, onChange }: CustomGradingBuilderProps) {
  const [label, setLabel] = useState('');
  const [points, setPoints] = useState('');

  const addGrade = () => {
    const trimmedLabel = label.trim();
    const pointsValue = Number(points);

    if (!trimmedLabel) {
      alert('Please enter a grade label');
      return;
    }

    if (!points.trim() || isNaN(pointsValue)) {
      alert('Please enter a valid number for points');
      return;
    }

    if (pointsValue < 0) {
      alert('Points cannot be negative');
      return;
    }

    if (grades.some(g => g.label.toLowerCase() === trimmedLabel.toLowerCase())) {
      alert('This grade label already exists');
      return;
    }

    const newGrade: Grade = {
      label: trimmedLabel,
      points: pointsValue,
    };

    onChange([...grades, newGrade]);
    setLabel('');
    setPoints('');
  };

  const removeGrade = (index: number) => {
    onChange(grades.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="glass-card p-6 overflow-hidden w-full"
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Custom Grading System
      </h3>

      {/* 🔥 RESPONSIVE FIX APPLIED HERE */}
      <div className="flex flex-col md:flex-row gap-3 mb-4 w-full">
        <input
          type="text"
          placeholder="Grade Label (e.g., A+)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full md:flex-1 px-4 py-2 rounded-lg bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="number"
          inputMode="decimal"
          placeholder="Points"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          step="any"
          onWheel={(e) => e.currentTarget.blur()}
          className="w-full md:w-32 px-4 py-2 rounded-lg bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addGrade}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              addGrade();
            }
          }}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Add
        </motion.button>
      </div>

      <AnimatePresence>
        {grades.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Custom Grades:
            </p>

            {grades.map((grade, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="flex items-center justify-between p-3 bg-white/30 dark:bg-black/20 rounded-lg"
              >
                <span className="text-gray-800 dark:text-gray-200">
                  {grade.label} - {grade.points} points
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => removeGrade(index)}
                  className="text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
