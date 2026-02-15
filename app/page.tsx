'use client';

import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GradingSystemSelector } from '@/components/GradingSystemSelector';
import { CustomGradingBuilder } from '@/components/CustomGradingBuilder';
import { SGPACalculator } from '@/components/SGPACalculator';
import { CGPACalculator } from '@/components/CGPACalculator';
import { Footer } from '@/components/Footer';
import { CalculationInfo } from '@/components/CalculationInfo';
import { useState, useEffect } from 'react';
import { GradingSystem } from '@/types/grading';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { Grade } from '@/types/grading';

export default function Home() {
  const [gradingSystem, setGradingSystem] = useState<GradingSystem>('10-point');
  const [customGrades, setCustomGrades] = useState<Grade[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedSystem = loadFromStorage<GradingSystem>(STORAGE_KEYS.GRADING_SYSTEM, '10-point');
    const savedCustomGrades = loadFromStorage<Grade[]>(STORAGE_KEYS.CUSTOM_GRADES, []);
    setGradingSystem(savedSystem);
    setCustomGrades(savedCustomGrades);
  }, []);

  // Save grading system to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GRADING_SYSTEM, gradingSystem);
  }, [gradingSystem]);

  // Save custom grades to localStorage
  useEffect(() => {
    if (gradingSystem === 'custom') {
      saveToStorage(STORAGE_KEYS.CUSTOM_GRADES, customGrades);
    }
  }, [customGrades, gradingSystem]);

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl relative">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 md:top-6 md:right-6">
        <ThemeToggle />
      </div>

      {/* Header - Centered */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto text-center mt-10 mb-10"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-wide">
          UniGPA
        </h1>
        <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">
          Universal SGPA & CGPA Calculator
        </p>
      </motion.div>

      {/* Grading System Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <GradingSystemSelector
          value={gradingSystem}
          onChange={setGradingSystem}
        />
      </motion.div>

      {/* Custom Grading Builder */}
      {gradingSystem === 'custom' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <CustomGradingBuilder
            grades={customGrades}
            onChange={setCustomGrades}
          />
        </motion.div>
      )}

      {/* Calculators - Vertical Stack */}
      <div className="max-w-4xl mx-auto space-y-10">
        {/* SGPA Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SGPACalculator
            gradingSystem={gradingSystem}
            customGrades={customGrades}
            gradingSystemLabel={
              gradingSystem === '10-point' ? '10 Point Scale' :
              gradingSystem === '4-point' ? '4 Point Scale' :
              gradingSystem === '7-point' ? '7 Point Scale' : 'Custom'
            }
          />
        </motion.div>

        {/* CGPA Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <CGPACalculator />
        </motion.div>

        {/* Calculation Information Section */}
        <CalculationInfo />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}

