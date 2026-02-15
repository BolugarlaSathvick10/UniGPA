'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GradingSystem, getGradesForSystem, Grade } from '@/types/grading';
import { roundToTwoDecimals } from '@/lib/utils';
import { exportToPDF } from '@/lib/pdf';

interface Subject {
  id: string;
  credits: number;
  grade: string;
  isStarred: boolean; // Mandatory (*) subject flag
}

interface SGPACalculatorProps {
  gradingSystem: GradingSystem;
  customGrades: Grade[];
  gradingSystemLabel?: string;
}

export function SGPACalculator({ gradingSystem, customGrades, gradingSystemLabel }: SGPACalculatorProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sgpa, setSgpa] = useState<number | null>(null);
  const [totalRegisteredCredits, setTotalRegisteredCredits] = useState(0);
  const [mandatoryCredits, setMandatoryCredits] = useState(0);
  const [effectiveCredits, setEffectiveCredits] = useState(0);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [excludeMandatory, setExcludeMandatory] = useState(false);

  // Calculate SGPA - optionally exclude mandatory subjects
  // SGPA = Σ(C × GP of included subjects) / Σ(C of included subjects)
  useEffect(() => {
    const grades = getGradesForSystem(gradingSystem, customGrades);
    const gradeMap = new Map(grades.map(g => [g.label, g.points]));

    let totalPoints = 0;
    let totalCreds = 0;
    let mandatoryCreds = 0;
    let registeredCreds = 0;

    subjects.forEach((subject) => {
      registeredCreds += subject.credits || 0;

      if (subject.isStarred) {
        mandatoryCreds += subject.credits || 0;
      }

      const isExcluded = excludeMandatory && subject.isStarred;
      if (!isExcluded && subject.credits > 0 && subject.grade) {
        const gradePoints = gradeMap.get(subject.grade) || 0;
        totalPoints += subject.credits * gradePoints;
        totalCreds += subject.credits;
      }
    });

    setTotalRegisteredCredits(registeredCreds);
    setMandatoryCredits(mandatoryCreds);
    setEffectiveCredits(totalCreds);

    // Calculate SGPA
    if (subjects.length === 0) {
      setSgpa(null);
    } else if (totalCreds > 0) {
      setSgpa(roundToTwoDecimals(totalPoints / totalCreds));
    } else {
      setSgpa(0);
    }
  }, [subjects, gradingSystem, customGrades, excludeMandatory]);

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      credits: 0,
      grade: '',
      isStarred: false, // Default: not mandatory
    };
    setSubjects([...subjects, newSubject]);
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const updateSubject = (id: string, field: keyof Subject, value: string | number | boolean) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const resetData = () => {
    setSubjects([]);
    setSgpa(null);
    setTotalRegisteredCredits(0);
    setMandatoryCredits(0);
    setEffectiveCredits(0);
    setExcludeMandatory(false);
    setIsAdvancedOpen(false);
  };

  const handleExportPDF = async () => {
    const subjectsData = subjects.map((s, index) => ({
      name: `Subject ${index + 1}`,
      credits: s.credits,
      grade: s.grade || 'N/A',
      isStarred: s.isStarred,
    }));

    await exportToPDF({
      sgpa: {
        subjects: subjectsData,
        sgpa: sgpa || 0,
        totalCredits: totalRegisteredCredits,
        effectiveCredits,
        mandatoryCredits,
        excludeMandatory,
      },
      gradingSystem: gradingSystemLabel || gradingSystem,
    });
  };

  const grades = getGradesForSystem(gradingSystem, customGrades);
  const gradeMap = new Map(grades.map(g => [g.label, g.points]));

  return (
    <div className="bg-white/70 dark:bg-black/20 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          SGPA Calculator
        </h2>
        <div className="flex gap-2">
          {sgpa !== null && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportPDF}
              className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Export PDF
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetData}
            className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Reset
          </motion.button>
        </div>
      </div>

      {/* advanced options */}
      <div className="mb-4 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-white/30 dark:bg-black/20">
        <button
          onClick={() => setIsAdvancedOpen((o) => !o)}
          className="w-full flex justify-between items-center text-left"
        >
          <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
            Advanced Options
          </span>
          <motion.svg
            animate={{ rotate: isAdvancedOpen ? 180 : 0 }}
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
            height: isAdvancedOpen ? 'auto' : 0,
            opacity: isAdvancedOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden mt-3"
        >
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={excludeMandatory}
                onChange={(e) => setExcludeMandatory(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Exclude Mandatory Subjects
              </span>
            </label>
            <p className="text-xs text-gray-500">
              Enable this if your university excludes mandatory courses from GPA calculation.
            </p>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4 mb-6">
        {subjects.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-center text-gray-700 dark:text-gray-300">
              No subjects added yet. Click {"'+ Add Subject'"} to begin.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {subjects.map((subject, index) => {
            const gradePoints = subject.grade ? (gradeMap.get(subject.grade) || 0) : 0;
            const isFailed = gradePoints === 0 && subject.grade !== '';

            return (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className={`p-4 rounded-2xl border-2 ${
                  isFailed
                    ? 'bg-red-50/50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                    : 'bg-white/30 dark:bg-black/20 border-white/30 dark:border-white/10'
                }`}
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="Credits"
                      value={subject.credits || ''}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0) {
                          updateSubject(subject.id, 'credits', value || 0);
                        }
                      }}
                      min="0"
                      step="any"
                      onWheel={(e) => e.currentTarget.blur()}
                      className="px-3 py-2 rounded-lg bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={subject.grade}
                      onChange={(e) => updateSubject(subject.id, 'grade', e.target.value)}
                      className="px-3 py-2 rounded-lg bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Grade</option>
                      {grades.map((grade) => (
                        <option key={grade.label} value={grade.label}>
                          {grade.label} ({grade.points} pts)
                        </option>
                      ))}
                    </select>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeSubject(subject.id)}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-medium transition-colors"
                    >
                      Remove
                    </motion.button>
                  </div>
                  {excludeMandatory && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`starred-${subject.id}`}
                        checked={subject.isStarred}
                        onChange={(e) => updateSubject(subject.id, 'isStarred', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-white/50 dark:bg-black/20 border border-white/30 dark:border-white/10 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`starred-${subject.id}`}
                        className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                      >
                        Mandatory (*) Subject
                      </label>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          </AnimatePresence>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={addSubject}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-colors mb-6"
      >
        + Add Subject
      </motion.button>

      {sgpa !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="p-6 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-2xl">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                SGPA: {sgpa.toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Credit Breakdown */}
          <div className="p-4 bg-white/20 dark:bg-black/20 rounded-2xl border border-white/30 dark:border-white/10">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Credit Breakdown
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Registered Credits:</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{totalRegisteredCredits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Mandatory Credits:</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">{mandatoryCredits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Effective GPA Credits:</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{effectiveCredits}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

