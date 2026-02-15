'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { roundToTwoDecimals } from '@/lib/utils';
import { saveToStorage, loadFromStorage, STORAGE_KEYS } from '@/lib/storage';
import { exportToPDF } from '@/lib/pdf';

interface Semester {
  id: string;
  semester: string;
  sgpa: number;
  effectiveCredits: number; // Effective GPA credits (non-starred subjects only)
}

export function CGPACalculator() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [cgpa, setCgpa] = useState<number | null>(null);
  const [totalCredits, setTotalCredits] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = loadFromStorage<any[]>(STORAGE_KEYS.CGPA_SEMESTERS, []);
    if (saved.length > 0) {
      // Migrate old data: convert 'credits' to 'effectiveCredits' if needed
      const migrated = saved.map((semester) => ({
        ...semester,
        effectiveCredits: semester.effectiveCredits !== undefined 
          ? semester.effectiveCredits 
          : (semester.credits || 0),
      }));
      setSemesters(migrated);
    }
  }, []);

  // Save to localStorage whenever semesters change
  useEffect(() => {
    if (semesters.length > 0) {
      saveToStorage(STORAGE_KEYS.CGPA_SEMESTERS, semesters);
    }
  }, [semesters]);

  // Calculate CGPA using effective credits
  // CGPA = Σ(SGPA × effectiveCredits) / Σ(effectiveCredits)
  useEffect(() => {
    let totalPoints = 0;
    let totalEffectiveCreds = 0;

    semesters.forEach((semester) => {
      if (semester.effectiveCredits > 0 && semester.sgpa >= 0) {
        totalPoints += semester.sgpa * semester.effectiveCredits;
        totalEffectiveCreds += semester.effectiveCredits;
      }
    });

    setTotalCredits(totalEffectiveCreds);
    if (totalEffectiveCreds > 0) {
      setCgpa(roundToTwoDecimals(totalPoints / totalEffectiveCreds));
    } else {
      setCgpa(null);
    }
  }, [semesters]);

  const addSemester = () => {
    const newSemester: Semester = {
      id: Date.now().toString(),
      semester: `Semester ${semesters.length + 1}`,
      sgpa: 0,
      effectiveCredits: 0,
    };
    setSemesters([...semesters, newSemester]);
  };

  const removeSemester = (id: string) => {
    setSemesters(semesters.filter((s) => s.id !== id));
  };

  const updateSemester = (id: string, field: keyof Semester, value: string | number) => {
    setSemesters(
      semesters.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const resetData = () => {
    setSemesters([]);
    setCgpa(null);
    setTotalCredits(0);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.CGPA_SEMESTERS);
    }
  };

  const handleExportPDF = async () => {
    const chartData = semesters.map((sem, index) => ({
      semester: sem.semester,
      sgpa: sem.sgpa,
      credits: sem.effectiveCredits,
    }));

    await exportToPDF({
      cgpa: {
        semesters: chartData,
        cgpa: cgpa || 0,
        totalCredits,
      },
      gradingSystem: 'CGPA Calculation',
    });
  };

  // Prepare chart data
  const chartData = semesters.map((sem, index) => ({
    name: sem.semester,
    SGPA: sem.sgpa,
    Credits: sem.effectiveCredits,
  }));

  return (
    <>
      <div className="bg-white/70 dark:bg-black/20 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            CGPA Calculator
          </h2>
        <div className="flex gap-2">
          {cgpa !== null && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportPDF}
              className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-2xl transition-colors"
            >
              Export PDF
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetData}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-2xl transition-colors"
          >
            Reset
          </motion.button>
        </div>
      </div>

        <div className="space-y-4 mb-6">
          {semesters.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
              <svg
                className="w-12 h-12 mb-3 text-gray-400 dark:text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <p className="text-center text-gray-700 dark:text-gray-300">
                No semesters added yet. Click '+ Add Semester' to begin.
              </p>
            </div>
        ) : (
          <AnimatePresence>
            {semesters.map((semester) => (
            <motion.div
              key={semester.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 rounded-2xl bg-white/30 dark:bg-black/20 border border-white/30 dark:border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Semester Name"
                  value={semester.semester}
                  onChange={(e) => updateSemester(semester.id, 'semester', e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="SGPA"
                  value={semester.sgpa || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0 && value <= 10) {
                      updateSemester(semester.id, 'sgpa', value || 0);
                    }
                  }}
                  min="0"
                  max="10"
                  step="0.01"
                  className="px-3 py-2 rounded-lg bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Effective Credits"
                  value={semester.effectiveCredits || ''}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (value >= 0) {
                      updateSemester(semester.id, 'effectiveCredits', value || 0);
                    }
                  }}
                  min="0"
                  step="0.5"
                  className="px-3 py-2 rounded-lg bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeSemester(semester.id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-medium transition-colors"
                >
                  Remove
                </motion.button>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addSemester}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-colors mb-6"
        >
          + Add Semester
        </motion.button>

        {cgpa !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl p-6 text-center"
          >
            <p className="text-gray-700 dark:text-gray-300 mb-2 text-sm">
              Total Effective Credits: <span className="font-semibold">{totalCredits}</span>
            </p>
            <p className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
              CGPA: {cgpa.toFixed(2)}
            </p>
          </motion.div>
        )}
      </div>

      {/* Semester Performance Graph - Separate Section */}
      {cgpa !== null && chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white/70 dark:bg-black/20 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
            Semester Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="currentColor"
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis 
                stroke="currentColor"
                className="text-gray-600 dark:text-gray-400"
                domain={[0, 10]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="SGPA" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </>
  );
}

