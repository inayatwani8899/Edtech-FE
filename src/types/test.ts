export type TestType = 'aptitude' | 'personality' | 'interest' | 'emotional-intelligence' | 'professional';

export type QuestionType = 'multiple-choice' | 'likert-scale' | 'true-false' | 'rating';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  scale?: { min: number; max: number; labels?: string[] };
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  gradeLevel?: string;
  type: TestType;
  questions: Question[];
  timeLimit?: number;
  targetAudience: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  instructions: string;
  isActive: boolean;
  status?: string;
  createdBy: string;
  createdAt: Date;

}

export interface TestAttempt {
  id: string;
  testId: string;
  userId: string;
  answers: Record<string, any>;
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  results?: TestResults;
  timeSpent: number;
}

export interface TestResults {
  overallScore: number;
  categoryScores: Record<string, number>;
  percentile?: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  insights: string;
  careerSuggestions?: string[];
}

export interface TestSession {
  testId: string;
  currentQuestionIndex: number;
  answers: Record<string, any>;
  startTime: Date;
  timeRemaining?: number;
}