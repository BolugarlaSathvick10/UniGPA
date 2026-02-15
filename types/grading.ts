export type GradingSystem = '10-point' | '4-point' | '7-point' | 'custom';

export interface Grade {
  label: string;
  points: number;
}

export const GRADING_SYSTEMS: Record<GradingSystem, Grade[]> = {
  '10-point': [
    { label: 'O (Outstanding)', points: 10 },
    { label: 'A+ (Excellent)', points: 9 },
    { label: 'A (Very Good)', points: 8 },
    { label: 'B+ (Good)', points: 7 },
    { label: 'B (Above Average)', points: 6 },
    { label: 'C (Average)', points: 5 },
    { label: 'P (Pass)', points: 4 },
    { label: 'F (Fail)', points: 0 },
  ],
  '4-point': [
    { label: 'A', points: 4.0 },
    { label: 'B', points: 3.0 },
    { label: 'C', points: 2.0 },
    { label: 'D', points: 1.0 },
    { label: 'F', points: 0.0 },
  ],
  '7-point': [
    { label: 'A+', points: 7 },
    { label: 'A', points: 6 },
    { label: 'B+', points: 5 },
    { label: 'B', points: 4 },
    { label: 'C+', points: 3 },
    { label: 'C', points: 2 },
    { label: 'F', points: 0 },
  ],
  'custom': [],
};

export function getGradesForSystem(
  system: GradingSystem,
  customGrades: Grade[] = []
): Grade[] {
  if (system === 'custom') {
    return customGrades;
  }
  return GRADING_SYSTEMS[system];
}

