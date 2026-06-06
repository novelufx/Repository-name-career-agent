/**
 * 面试反馈报告 Prompt
 * 用途：生成综合评估报告
 * 输入：所有前面步骤的结果
 * 输出：全面的评估报告和行动计划
 */

import type { JDAnalysisOutput } from "./jdAnalysisPrompt";
import type { ResumeMatchOutput } from "./resumeMatchPrompt";
import type { ProjectOptimizeOutput } from "./projectOptimizePrompt";

export interface FeedbackInput {
  resumeText: string;
  jdAnalysis: JDAnalysisOutput;
  resumeDiagnosis: ResumeMatchOutput;
  projectOptimization: ProjectOptimizeOutput;
  interviewHistory: {
    question: string;
    answer: string;
    feedback: string;
    score: number;
  }[];
}

export interface FeedbackOutput {
  overallScore: number;
  dimensionScores: {
    dimension: string;
    score: number;
    feedback: string;
  }[];
  highlights: {
    question: string;
    answer: string;
    reason: string;
  }[];
  issues: {
    question: string;
    answer: string;
    problem: string;
    suggestion: string;
  }[];
  optimizationSuggestions: {
    category: string;
    suggestion: string;
    example: string;
  }[];
  improvedAnswers: {
    question: string;
    originalAnswer: string;
    improvedAnswer: string;
    improvement: string;
  }[];
  summary: string;
}

export function getFeedbackPrompt(input: FeedbackInput): string {
  // 构建面试记录摘要
  const interviewSummary = input.interviewHistory
    .map(
      (h, i) =>
        `问题 ${i + 1}: ${h.question}\n回答: ${h.answer}`
    )
    .join("\n\n");

  // 构建岗位信息摘要
  const jdSummary = input.jdAnalysis
    ? `岗位: ${input.jdAnalysis.jobTitle}\n公司: ${input.jdAnalysis.company}\n必备技能: ${input.jdAnalysis.requiredSkills.join("、")}\n关键词: ${input.jdAnalysis.keywords.join("、")}`
    : "未提供";

  // 构建简历诊断摘要
  const diagnosisSummary = input.resumeDiagnosis
    ? `匹配度: ${input.resumeDiagnosis.matchScore}\n优势: ${input.resumeDiagnosis.strengths.map((s) => s.area).join("、")}\n短板: ${input.resumeDiagnosis.weaknesses.map((w) => w.area).join("、")}`
    : "未提供";

  // 构建项目优化摘要
  const projectSummary = input.projectOptimization
    ? `优化后的 bullet: ${input.projectOptimization.bulletVersion}`
    : "未提供";

  return `你是一位职业发展顾问，擅长综合评估求职者的准备情况并给出可执行的行动计划。

## 任务

基于求职者的简历、JD 分析、简历诊断、项目优化和模拟面试表现，生成一份全面的面试反馈报告。

## 输入

### 简历内容
${input.resumeText || "(未提供原始简历文本)"}

### 岗位信息
${jdSummary}

### 简历诊断结果
${diagnosisSummary}

### 项目优化结果
${projectSummary}

### 模拟面试记录
${interviewSummary}

## 输出要求

请严格按照以下 JSON 格式输出，不要包含任何其他文字：

{
  "overallScore": 72,
  "dimensionScores": [
    {
      "dimension": "表达清晰度",
      "score": 78,
      "feedback": "具体反馈"
    },
    {
      "dimension": "逻辑结构",
      "score": 70,
      "feedback": "具体反馈"
    },
    {
      "dimension": "岗位匹配度",
      "score": 68,
      "feedback": "具体反馈"
    },
    {
      "dimension": "回答完整度",
      "score": 75,
      "feedback": "具体反馈"
    },
    {
      "dimension": "案例支撑",
      "score": 65,
      "feedback": "具体反馈"
    }
  ],
  "highlights": [
    {
      "question": "面试问题",
      "answer": "回答摘要（不超过30字）",
      "reason": "为什么答得好"
    }
  ],
  "issues": [
    {
      "question": "面试问题",
      "answer": "回答摘要（不超过30字）",
      "problem": "问题是什么",
      "suggestion": "怎么改进"
    }
  ],
  "optimizationSuggestions": [
    {
      "category": "建议类别",
      "suggestion": "具体建议",
      "example": "示例写法"
    }
  ],
  "improvedAnswers": [
    {
      "question": "原始问题",
      "originalAnswer": "原始回答摘要",
      "improvedAnswer": "改进后的回答",
      "improvement": "改进了什么"
    }
  ],
  "summary": "一句话总结整体表现"
}

## 规则

1. 所有字段必须输出，不能省略
2. dimensionScores 必须包含 5 个维度
3. overallScore 是 5 个维度的加权平均
4. highlights 和 issues 都必须引用具体的面试问题和回答
5. optimizationSuggestions 要结合简历诊断中的短板，给出具体可执行的建议
6. improvedAnswers 至少展示 1 个改进示例，基于实际面试回答
7. 所有评分和反馈必须基于上面提供的真实数据，不要编造
8. 不要使用 Markdown 格式，直接输出 JSON
9. 确保 JSON 格式正确，可以被 JSON.parse() 解析`;
}
