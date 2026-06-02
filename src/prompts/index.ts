/**
 * Prompt 模块入口
 * 导出所有 Prompt 模板和类型定义
 */

export {
  getJDAnalysisPrompt,
  type JDAnalysisInput,
  type JDAnalysisOutput,
} from "./jdAnalysisPrompt";

export {
  getResumeMatchPrompt,
  type ResumeMatchInput,
  type ResumeMatchOutput,
} from "./resumeMatchPrompt";

export {
  getProjectOptimizePrompt,
  type ProjectOptimizeInput,
  type ProjectOptimizeOutput,
} from "./projectOptimizePrompt";

export {
  getInterviewPrompt,
  type InterviewInput,
  type InterviewOutput,
} from "./interviewPrompt";

export {
  getFeedbackPrompt,
  type FeedbackInput,
  type FeedbackOutput,
} from "./feedbackPrompt";
