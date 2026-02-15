// LocalStorage utilities for persisting data

export const STORAGE_KEYS = {
  SGPA_SUBJECTS: 'unigpa_sgpa_subjects',
  CGPA_SEMESTERS: 'unigpa_cgpa_semesters',
  GRADING_SYSTEM: 'unigpa_grading_system',
  CUSTOM_GRADES: 'unigpa_custom_grades',
} as const;

export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }
  return defaultValue;
}

export function clearStorage(): void {
  if (typeof window !== 'undefined') {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

