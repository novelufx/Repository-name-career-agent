/**
 * 工作流全局 Context
 * 跨步骤共享 JD、简历、诊断、优化等数据
 * 状态持久化到 localStorage，刷新可恢复
 */

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from "react";
import type { JDAnalysisResult, ResumeDiagnosisResult, ProjectOptimizationResult } from "../mock/data";
import type { RoleCategory } from "../utils/roleClassifier";

const STORAGE_KEY = "career-agent-workflow-state";

// ---- State ----

export interface WorkflowState {
  jdText: string;
  jdAnalysisResult: JDAnalysisResult | null;
  detectedRole: string;
  roleCategory: RoleCategory;
  resumeText: string;
  resumeSummary: string;
  extractedProjects: string[];
  selectedProjectText: string;
  resumeDiagnosisResult: ResumeDiagnosisResult | null;
  projectOptimizationResult: ProjectOptimizationResult | null;
}

const defaultState: WorkflowState = {
  jdText: "",
  jdAnalysisResult: null,
  detectedRole: "",
  roleCategory: "other",
  resumeText: "",
  resumeSummary: "",
  extractedProjects: [],
  selectedProjectText: "",
  resumeDiagnosisResult: null,
  projectOptimizationResult: null,
};

// ---- Actions ----

type WorkflowAction =
  | { type: "SET_JD_TEXT"; payload: string }
  | { type: "SET_JD_ANALYSIS_RESULT"; payload: JDAnalysisResult }
  | { type: "SET_DETECTED_ROLE"; payload: string }
  | { type: "SET_ROLE_CATEGORY"; payload: RoleCategory }
  | { type: "SET_RESUME_TEXT"; payload: string }
  | { type: "SET_RESUME_SUMMARY"; payload: string }
  | { type: "SET_EXTRACTED_PROJECTS"; payload: string[] }
  | { type: "SET_SELECTED_PROJECT_TEXT"; payload: string }
  | { type: "SET_RESUME_DIAGNOSIS_RESULT"; payload: ResumeDiagnosisResult }
  | { type: "SET_PROJECT_OPTIMIZATION_RESULT"; payload: ProjectOptimizationResult }
  | { type: "CLEAR_WORKFLOW" };

function workflowReducer(state: WorkflowState, action: WorkflowAction): WorkflowState {
  switch (action.type) {
    case "SET_JD_TEXT":
      return { ...state, jdText: action.payload };
    case "SET_JD_ANALYSIS_RESULT":
      return { ...state, jdAnalysisResult: action.payload };
    case "SET_DETECTED_ROLE":
      return { ...state, detectedRole: action.payload };
    case "SET_ROLE_CATEGORY":
      return { ...state, roleCategory: action.payload };
    case "SET_RESUME_TEXT":
      return { ...state, resumeText: action.payload };
    case "SET_RESUME_SUMMARY":
      return { ...state, resumeSummary: action.payload };
    case "SET_EXTRACTED_PROJECTS":
      return { ...state, extractedProjects: action.payload };
    case "SET_SELECTED_PROJECT_TEXT":
      return { ...state, selectedProjectText: action.payload };
    case "SET_RESUME_DIAGNOSIS_RESULT":
      return { ...state, resumeDiagnosisResult: action.payload };
    case "SET_PROJECT_OPTIMIZATION_RESULT":
      return { ...state, projectOptimizationResult: action.payload };
    case "CLEAR_WORKFLOW":
      return { ...defaultState };
    default:
      return state;
  }
}

// ---- Context ----

interface WorkflowContextType {
  state: WorkflowState;
  dispatch: Dispatch<WorkflowAction>;
  setJdText: (v: string) => void;
  setJdAnalysisResult: (v: JDAnalysisResult) => void;
  setDetectedRole: (v: string) => void;
  setRoleCategory: (v: RoleCategory) => void;
  setResumeText: (v: string) => void;
  setResumeSummary: (v: string) => void;
  setExtractedProjects: (v: string[]) => void;
  setSelectedProjectText: (v: string) => void;
  setResumeDiagnosisResult: (v: ResumeDiagnosisResult) => void;
  setProjectOptimizationResult: (v: ProjectOptimizationResult) => void;
  clearWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

// ---- Load from localStorage ----

function loadState(): WorkflowState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...defaultState, ...parsed };
    }
  } catch {
    // ignore
  }
  return defaultState;
}

function saveState(state: WorkflowState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

// ---- Provider ----

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workflowReducer, undefined, loadState);

  // 持久化到 localStorage
  useEffect(() => {
    saveState(state);
  }, [state]);

  const ctx: WorkflowContextType = {
    state,
    dispatch,
    setJdText: (v) => dispatch({ type: "SET_JD_TEXT", payload: v }),
    setJdAnalysisResult: (v) => dispatch({ type: "SET_JD_ANALYSIS_RESULT", payload: v }),
    setDetectedRole: (v) => dispatch({ type: "SET_DETECTED_ROLE", payload: v }),
    setRoleCategory: (v) => dispatch({ type: "SET_ROLE_CATEGORY", payload: v }),
    setResumeText: (v) => dispatch({ type: "SET_RESUME_TEXT", payload: v }),
    setResumeSummary: (v) => dispatch({ type: "SET_RESUME_SUMMARY", payload: v }),
    setExtractedProjects: (v) => dispatch({ type: "SET_EXTRACTED_PROJECTS", payload: v }),
    setSelectedProjectText: (v) => dispatch({ type: "SET_SELECTED_PROJECT_TEXT", payload: v }),
    setResumeDiagnosisResult: (v) => dispatch({ type: "SET_RESUME_DIAGNOSIS_RESULT", payload: v }),
    setProjectOptimizationResult: (v) => dispatch({ type: "SET_PROJECT_OPTIMIZATION_RESULT", payload: v }),
    clearWorkflow: () => {
      dispatch({ type: "CLEAR_WORKFLOW" });
      localStorage.removeItem(STORAGE_KEY);
    },
  };

  return (
    <WorkflowContext.Provider value={ctx}>
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error("useWorkflow must be used within a WorkflowProvider");
  }
  return context;
}
