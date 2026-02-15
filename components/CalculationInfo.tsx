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
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                1. SGPA Calculation
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                SGPA uses a credit‑weighted formula. When the advanced option is
                enabled, mandatory (starred) subjects are excluded from both the
                numerator and denominator.
              </p>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-3 font-mono text-sm">
                SGPA = Σ(Credits × Grade Points) / Σ(Effective Credits)
              </div>
            </div>

            {/* CGPA Calculation */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                2. CGPA Calculation
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Two modes are available:
              </p>
              <div className="space-y-2">
                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 font-mono text-sm">
                  Quick Estimate:&nbsp;CGPA = Σ(SGPA) / N<br />
                  (assumes equal credits per semester)
                </div>
                <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 font-mono text-sm">
                  Accurate:&nbsp;CGPA = Σ(SGPA × Credits) / Σ(Credits)
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Quick mode provides a simple estimate, accurate mode uses
                credit‑weighting.
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

