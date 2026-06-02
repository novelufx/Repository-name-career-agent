/**
 * 简历匹配度诊断 Prompt
 * 用途：评估简历与岗位的匹配度
 * 输入：简历内容 + JD 分析结果
 * 输出：匹配度评分和优化建议
 */

import type { JDAnalysisOutput } from "./jdAnalysisPrompt";

export interface ResumeMatchInput {
  resumeText: string;
  jdAnalysis: JDAnalysisOutput;
}

export interface ResumeMatchOutput {
  matchScore: number;
  keywordCoverage: {
    covered: string[];
    missing: string[];
  };
  dimensionScores: {
    dimension: string;
    score: number;
    feedback: string;
  }[];
  strengths: {
    area: string;
    detail: string;
    evidence: string;
  }[];
  weaknesses: {
    area: string;
    detail: string;
    suggestion: string;
  }[];
  optimizationSuggestions: {
    priority: "high" | "medium" | "low";
    category: string;
    suggestion: string;
    example: string;
  }[];
  summary: string;
}

export function getResumeMatchPrompt(input: ResumeMatchInput): string {
  return `你是一位简历优化专家，擅长评估简历与岗位的匹配度。

## 任务

根据 JD 分析结果，诊断简历的匹配度，找出差距，给出具体的优化建议。

## 输入

简历内容：
${input.resumeText}

岗位信息：
- 岗位：${input.jdAnalysis.jobTitle}
- 公司：${input.jdAnalysis.company}
- 必备技能：${input.jdAnalysis.requiredSkills.join("、")}
- 关键词：${input.jdAnalysis.keywords.join("、")}

## 输出要求

请严格按照以下 JSON 格式输出，不要包含任何其他文字：

{
  "matchScore": 68,
  "keywordCoverage": {
    "covered": ["已覆盖的关键词1", "关键词2"],
    "missing": ["缺失的关键词1", "关键词2"]
  },
  "dimensionScores": [
    {
      "dimension": "关键词匹配",
      "score": 70,
      "feedback": "具体反馈"
    },
    {
      "dimension": "技能匹配",
      "score": 65,
      "feedback": "具体反馈"
    },
    {
      "dimension": "项目相关性",
      "score": 72,
      "feedback": "具体反馈"
    },
    {
      "dimension": "表达专业度",
      "score": 60,
      "feedback": "具体反馈"
    }
  ],
  "strengths": [
    {
      "area": "优势领域",
      "detail": "具体说明",
      "evidence": "简历中的原文引用"
    }
  ],
  "weaknesses": [
    {
      "area": "待提升领域",
      "detail": "具体说明",
      "suggestion": "具体的优化建议"
    }
  ],
  "optimizationSuggestions": [
    {
      "priority": "high",
      "category": "补充 AI 相关经历",
      "suggestion": "具体的优化建议",
      "example": "示例写法"
    }
  ],
  "summary": "一句话总结诊断结果"
}

## 规则

1. 所有字段必须输出，不能省略
2. matchScore 按照规则计算：关键词匹配 40%，技能匹配 30%，项目相关性 30%
3. dimensionScores 必须包含 4 个维度
4. strengths 和 weaknesses 都必须有 evidence 支撑
5. optimizationSuggestions 按优先级排序
6. 不要使用 Markdown 格式，直接输出 JSON
7. 确保 JSON 格式正确，可以被 JSON.parse() 解析`;
}
