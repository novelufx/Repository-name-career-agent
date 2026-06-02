/**
 * 模拟面试 Prompt
 * 用途：生成面试问题和追问
 * 输入：简历、JD 分析、面试历史
 * 输出：面试问题和参考答案
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
  const historyContext =
    input.interviewHistory && input.interviewHistory.length > 0
      ? `
已问过的问题：
${input.interviewHistory.map((h, i) => `${i + 1}. ${h.question}`).join("\n")}

请避免重复问类似的问题，从不同角度提问。`
      : "这是第一个问题，从简历中的项目经历开始问起。";

  return `你是一位经验丰富的技术面试官，正在面试一位求职者。

## 任务

生成一个有针对性的面试问题。

## 输入

简历内容：
${input.resumeText}

岗位信息：
- 岗位：${input.jdAnalysis.jobTitle}
- 公司：${input.jdAnalysis.company}
- 必备技能：${input.jdAnalysis.requiredSkills.join("、")}

${historyContext}

## 输出要求

请严格按照以下 JSON 格式输出，不要包含任何其他文字：

{
  "question": "问题内容",
  "type": "technical 或 behavioral 或 situational",
  "difficulty": "easy 或 medium 或 hard",
  "category": "问题分类，如项目经历、AI产品理解、团队协作",
  "intent": "这个问题想考察什么",
  "keyPoints": ["回答时应该覆盖的要点1", "要点2"],
  "sampleAnswer": "参考答案，基于用户的简历内容",
  "followUp": ["可能的追问问题1", "追问问题2"]
}

## 规则

1. 所有字段必须输出，不能省略
2. 第一个问题从简历中的项目经历开始
3. 问题类型分布：技术 40%，行为 30%，情景 30%
4. 问题要具体，不能是"请介绍一下你自己"这种泛泛的问题
5. sampleAnswer 要基于用户的简历内容
6. followUp 提供 1-2 个可能的追问
7. 不要使用 Markdown 格式，直接输出 JSON
8. 确保 JSON 格式正确，可以被 JSON.parse() 解析`;
}
