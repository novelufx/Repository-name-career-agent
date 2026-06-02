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

export function getFeedbackPrompt(_input: FeedbackInput): string {
  return `你是一位职业发展顾问，擅长综合评估求职者的准备情况并给出可执行的行动计划。

## 任务

生成一份全面的面试反馈报告。

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
      "question": "问题",
      "answer": "回答摘要",
      "reason": "为什么答得好"
    }
  ],
  "issues": [
    {
      "question": "问题",
      "answer": "回答摘要",
      "problem": "问题是什么",
      "suggestion": "怎么改进"
    }
  ],
  "optimizationSuggestions": [
    {
      "category": "回答结构",
      "suggestion": "使用 STAR 法则组织回答",
      "example": "具体示例"
    }
  ],
  "improvedAnswers": [
    {
      "question": "问题",
      "originalAnswer": "原始回答",
      "improvedAnswer": "改进后的回答",
      "improvement": "改进了什么"
    }
  ],
  "summary": "一句话总结整体表现"
}

## 规则

1. 所有字段必须输出，不能省略
2. dimensionScores 必须包含 5 个维度
3. highlights 和 issues 都必须有具体的问题和回答
4. optimizationSuggestions 要具体可执行
5. improvedAnswers 展示更优的回答方式
6. 不要使用 Markdown 格式，直接输出 JSON
7. 确保 JSON 格式正确，可以被 JSON.parse() 解析`;
}
