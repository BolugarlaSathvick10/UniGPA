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
                SGPA is calculated using the formula:
              </p>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-3 font-mono text-sm">
                SGPA = Σ(Credits × Grade Points of non-mandatory subjects) / Σ(Effective Credits)
              </div>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm ml-4">
                <li>• Only regular (non-starred) subjects are included.</li>
                <li>• Mandatory (*) subjects are excluded.</li>
                <li>• Grade Points are assigned based on grading scale.</li>
                <li>• Result is rounded to 2 decimal places.</li>
              </ul>
            </div>

            {/* CGPA Calculation */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                2. CGPA Calculation
              </h4>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                CGPA is calculated using:
              </p>
              <div className="bg-white/50 dark:bg-black/20 rounded-lg p-4 mb-3 font-mono text-sm">
                CGPA = Σ(SGPA × Effective Credits) / Σ(Total Effective Credits Across Semesters)
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 text-sm">
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                  Important:
                </p>
                <ul className="space-y-1 text-gray-600 dark:text-gray-400 ml-4">
                  <li>• Effective Credits = Credits excluding mandatory (*) subjects.</li>
                  <li>• Mandatory subjects do NOT affect SGPA or CGPA.</li>
                  <li>• They still count as registered/completed credits.</li>
                </ul>
              </div>
            </div>

            {/* What Is Considered */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                3. What Is Considered
              </h4>
              <div className="space-y-2">
                {[
                  'Regular academic subjects',
                  'Credit-weighted grade points',
                  'Only non-mandatory credits',
                  '2-decimal rounding',
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What Is Ignored */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                4. What Is Ignored
              </h4>
              <div className="space-y-2">
                {[
                  'Mandatory (*) subjects',
                  'Audit courses',
                  'Zero-credit courses',
                ].map((item, index) => (
                  <div key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg
                      className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparency Section */}
            <div className="bg-white/70 dark:bg-black/20 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                5. Transparency
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                The calculator displays:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Registered Credits:</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">All subjects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Mandatory Credits:</span>
                  <span className="font-semibold text-orange-600 dark:text-orange-400">Starred (*) subjects</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Effective GPA Credits:</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Non-starred subjects</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

