/**
 * 项目经历优化 Prompt
 * 用途：优化项目经历描述
 * 输入：项目描述 + JD 分析结果（可选）
 * 输出：优化后的描述和改进分析
 */

import type { JDAnalysisOutput } from "./jdAnalysisPrompt";

export interface ProjectOptimizeInput {
  projectDescription: string;
  jdAnalysis?: JDAnalysisOutput;
}

export interface ProjectOptimizeOutput {
  original: string;
  bulletVersion: string;
  starVersion: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  optimized: {
    version: string;
    description: string;
    suitableFor: string;
  }[];
  improvements: {
    aspect: string;
    before: string;
    after: string;
    reason: string;
  }[];
  keywordsAdded: string[];
}

export function getProjectOptimizePrompt(input: ProjectOptimizeInput): string {
  return `你是一位简历优化专家，擅长把简单的项目描述改写成专业、有说服力的经历描述。

## 任务

优化以下项目经历描述，使其更专业、更有说服力。

## 输入

项目经历描述：
${input.projectDescription}

## 输出要求

请严格按照以下 JSON 格式输出，不要包含任何其他文字：

{
  "original": "原始描述",
  "bulletVersion": "简历 bullet 版本，适合直接写在简历上",
  "starVersion": {
    "situation": "项目背景",
    "task": "你的任务",
    "action": "你的行动",
    "result": "项目成果"
  },
  "optimized": [
    {
      "version": "产品视角",
      "description": "针对产品岗的描述",
      "suitableFor": "产品实习生、AI 产品实习生"
    },
    {
      "version": "技术视角",
      "description": "针对技术岗的描述",
      "suitableFor": "软件开发实习生、前端开发实习生"
    }
  ],
  "improvements": [
    {
      "aspect": "改进方面",
      "before": "原始写法",
      "after": "优化后写法",
      "reason": "为什么这样改更好"
    }
  ],
  "keywordsAdded": ["新增关键词1", "新增关键词2"]
}

## 规则

1. 所有字段必须输出，不能省略
2. bulletVersion 要简洁有力，适合直接写在简历上
3. starVersion 要完整覆盖 STAR 四个要素
4. optimized 至少提供 2 个版本
5. improvements 每条都必须有 before 和 after 的对比
6. 不要使用 Markdown 格式，直接输出 JSON
7. 确保 JSON 格式正确，可以被 JSON.parse() 解析`;
}
