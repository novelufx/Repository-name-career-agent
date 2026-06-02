// Workflow types
export type WorkflowStep =
  | 'jd-analysis'
  | 'resume-diagnosis'
  | 'project-optimization'
  | 'mock-interview'
  | 'feedback-report';

export type WorkflowStatus =
  | 'idle'
  | 'in-progress'
  | 'completed'
  | 'error';

export interface WorkflowState {
  currentStep: WorkflowStep | null;
  status: WorkflowStatus;
  jdData: JDAnalysisResult | null;
  resumeData: ResumeDiagnosisResult | null;
  projectData: ProjectOptimizationResult | null;
  interviewData: MockInterviewResult | null;
  feedbackData: FeedbackReportResult | null;
}

// JD Analysis types
export interface JDAnalysisResult {
  jobTitle: string;
  company: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: string;
  salaryRange?: string;
  companyCulture?: string;
}

// Resume Diagnosis types
export interface ResumeDiagnosisResult {
  matchScore: number;
  keywordMatches: {
    matched: string[];
    missing: string[];
  };
  skillAnalysis: {
    skill: string;
    level: 'strong' | 'moderate' | 'weak' | 'missing';
    suggestion?: string;
  }[];
  experienceRelevance: number;
  suggestions: string[];
}

// Project Optimization types
export interface ProjectOptimizationResult {
  originalDescription: string;
  optimizedDescription: string;
  improvements: {
    aspect: string;
    before: string;
    after: string;
    reason: string;
  }[];
  keywordsAdded: string[];
}

// Mock Interview types
export interface InterviewQuestion {
  id: string;
  question: string;
  category: 'technical' | 'behavioral' | 'situational';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InterviewAnswer {
  questionId: string;
  answer: string;
  feedback: {
    score: number;
    strengths: string[];
    improvements: string[];
    sampleAnswer?: string;
  };
}

export interface MockInterviewResult {
  questions: InterviewQuestion[];
  answers: InterviewAnswer[];
  overallScore: number;
  summary: string;
}

// Feedback Report types
export interface FeedbackReportResult {
  overallScore: number;
  categoryScores: {
    category: string;
    score: number;
    feedback: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  actionItems: string[];
  resources: {
    title: string;
    url?: string;
    description: string;
  }[];
}

// API types
export interface ApiConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Navigation types
export interface NavItem {
  path: string;
  label: string;
  icon: string;
  description: string;
}
