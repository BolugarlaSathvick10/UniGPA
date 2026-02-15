'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export function CalculationInfo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className=""
    >
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            How GPA Is Calculated
          </h3>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="w-5 h-5 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </motion.svg>
        </button>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-6 space-y-6">
            {/* SGPA Calculation */}
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                1. SGPA Calculation
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                SGPA uses credits and grade points. Subjects with higher credits
                carry more weight.
              </p>

              <div className="mx-auto w-full max-w-md bg-white/50 dark:bg-black/20 rounded-2xl px-6 py-4 shadow-sm font-mono text-xl font-semibold text-center">
                SGPA = Σ(Credits × GP) / Σ(Effective Credits)
              </div>

              <p className="text-xs text-gray-500">
                Effective Credits are the credits counted for GPA. When
                “Exclude Mandatory Subjects” is on, starred (*) courses are
                omitted; otherwise all subjects count.
              </p>
            </div>

            {/* CGPA Calculation */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                2. CGPA Calculation
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                CGPA combines semester SGPAs; two calculation modes are
                provided.
              </p>

              {/* Quick Estimate */}
              <div className="space-y-1">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  🟢 Quick Estimate
                </span>
                <div className="mx-auto w-full max-w-md bg-white/50 dark:bg-black/20 rounded-2xl px-6 py-4 shadow-sm font-mono text-xl font-semibold text-center">
                  CGPA = Σ(SGPA) / N
                </div>
                <p className="text-xs text-gray-500">
                  Assumes equal credits per semester.
                </p>
              </div>

              {/* Accurate */}
              <div className="space-y-1">
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  🔵 Accurate (Credit Weighted)
                </span>
                <div className="mx-auto w-full max-w-md bg-white/50 dark:bg-black/20 rounded-2xl px-6 py-4 shadow-sm font-mono text-xl font-semibold text-center">
                  CGPA = Σ(SGPA × Credits) / Σ(Credits)
                </div>
                <p className="text-xs text-gray-500">
                  Semesters with more credits have greater impact.
                </p>
              </div>

              <p className="text-xs text-gray-500 mt-2">
                If all semesters carry equal credits, both formulas give similar
                results.
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

