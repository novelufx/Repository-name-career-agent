import { createContext, useContext, useReducer, type ReactNode } from 'react';
import { loadConfig } from '../services/settingsService';
import type { ApiConfig } from '../types/api';

interface WorkflowState {
  currentStep: string | null;
  status: 'idle' | 'in-progress' | 'completed' | 'error';
  jdData: unknown;
  resumeData: unknown;
  projectData: unknown;
  interviewData: unknown;
  feedbackData: unknown;
}

interface AppState {
  apiConfig: ApiConfig;
  workflow: WorkflowState;
  isMockMode: boolean;
}

type AppAction =
  | { type: 'SET_API_CONFIG'; payload: ApiConfig }
  | { type: 'SET_WORKFLOW_STEP'; payload: string }
  | { type: 'SET_WORKFLOW_STATUS'; payload: WorkflowState['status'] }
  | { type: 'SET_JD_DATA'; payload: unknown }
  | { type: 'SET_RESUME_DATA'; payload: unknown }
  | { type: 'SET_PROJECT_DATA'; payload: unknown }
  | { type: 'SET_INTERVIEW_DATA'; payload: unknown }
  | { type: 'SET_FEEDBACK_DATA'; payload: unknown }
  | { type: 'RESET_WORKFLOW' };

const initialApiConfig = loadConfig();

const initialWorkflow: WorkflowState = {
  currentStep: null,
  status: 'idle',
  jdData: null,
  resumeData: null,
  projectData: null,
  interviewData: null,
  feedbackData: null,
};

const initialState: AppState = {
  apiConfig: initialApiConfig,
  workflow: initialWorkflow,
  isMockMode: initialApiConfig.useMockMode || !initialApiConfig.apiKey,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_API_CONFIG':
      return {
        ...state,
        apiConfig: action.payload,
        isMockMode: action.payload.useMockMode || !action.payload.apiKey,
      };
    case 'SET_WORKFLOW_STEP':
      return {
        ...state,
        workflow: { ...state.workflow, currentStep: action.payload },
      };
    case 'SET_WORKFLOW_STATUS':
      return {
        ...state,
        workflow: { ...state.workflow, status: action.payload },
      };
    case 'SET_JD_DATA':
      return {
        ...state,
        workflow: { ...state.workflow, jdData: action.payload },
      };
    case 'SET_RESUME_DATA':
      return {
        ...state,
        workflow: { ...state.workflow, resumeData: action.payload },
      };
    case 'SET_PROJECT_DATA':
      return {
        ...state,
        workflow: { ...state.workflow, projectData: action.payload },
      };
    case 'SET_INTERVIEW_DATA':
      return {
        ...state,
        workflow: { ...state.workflow, interviewData: action.payload },
      };
    case 'SET_FEEDBACK_DATA':
      return {
        ...state,
        workflow: { ...state.workflow, feedbackData: action.payload },
      };
    case 'RESET_WORKFLOW':
      return {
        ...state,
        workflow: initialWorkflow,
      };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
