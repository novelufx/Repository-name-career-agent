/**
 * 模拟面试 Prompt
 * 用途：生成面试问题和追问
 * 输入：简历摘要、JD 分析
 * 输出：5 个面试问题和参考答案
 */

import type { JDAnalysisOutput } from "./jdAnalysisPrompt";

export interface InterviewInput {
  resumeText: string;
  jdAnalysis: JDAnalysisOutput;
  currentQuestion?: string;
  userAnswer?: string;
  interviewHistory?: {
    question: string;
    answer: string;
    feedback: string;
  }[];
}

export interface InterviewOutput {
  questions: InterviewQuestion[];
}

export interface InterviewQuestion {
  question: string;
  type: "technical" | "behavioral" | "situational";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  intent: string;
  keyPoints: string[];
  sampleAnswer: string;
  followUp: string[];
}

export function getInterviewPrompt(input: InterviewInput): string {
  // 构建更丰富的岗位上下文
  const jdContext = [
    `- 岗位：${input.jdAnalysis.jobTitle}`,
    `- 公司：${input.jdAnalysis.company}`,
    input.jdAnalysis.requiredSkills?.length > 0 ? `- 必备技能：${input.jdAnalysis.requiredSkills.join("、")}` : "",
    input.jdAnalysis.preferredSkills?.length > 0 ? `- 加分技能：${input.jdAnalysis.preferredSkills.join("、")}` : "",
    input.jdAnalysis.keywords?.length > 0 ? `- 关键词：${input.jdAnalysis.keywords.join("、")}` : "",
    input.jdAnalysis.interviewFocus?.length > 0 ? `- 面试关注点：${input.jdAnalysis.interviewFocus.join("、")}` : "",
    input.jdAnalysis.responsibilities?.length > 0 ? `- 核心职责：${input.jdAnalysis.responsibilities.join("、")}` : "",
  ].filter(Boolean).join("\n");

  return `你是一位经验丰富的技术面试官，正在为一位求职者准备模拟面试。

## 任务

生成 5 个有针对性的面试问题，涵盖不同类型和难度。

## 输入

简历/简历摘要：
${input.resumeText}

岗位信息：
${jdContext}

## 输出要求

请严格按照以下 JSON 格式输出，不要包含任何其他文字：

{
  "questions": [
    {
      "question": "问题内容",
      "type": "technical",
      "difficulty": "medium",
      "category": "问题分类",
      "intent": "考察什么",
      "keyPoints": ["要点1", "要点2"],
      "sampleAnswer": "参考答案",
      "followUp": ["追问1"]
    }
  ]
}

## 规则

1. 必须输出 5 个问题，放在 questions 数组中
2. 第一个问题从简历中的项目经历开始问起
3. 问题类型分布：至少包含 1 个 technical、1 个 behavioral、1 个 situational
4. 难度分布：至少包含 1 个 easy、2 个 medium、1 个 hard
5. 问题要具体，不能是"请介绍一下你自己"这种泛泛的问题
6. sampleAnswer 要基于用户的简历内容，体现针对性
7. followUp 提供 1-2 个可能的追问
8. 每个问题的 category 不能完全相同，要覆盖不同考察维度
9. 问题要结合岗位的核心职责、必备技能和面试关注点
10. 不要使用 Markdown 格式，直接输出 JSON
11. 确保 JSON 格式正确，可以被 JSON.parse() 解析`;
}
