/**
 * 项目经历优化 Prompt
 * 用途：优化项目经历描述
 * 输入：项目描述 + JD 分析结果 + 岗位分类 + 优化策略
 * 输出：优化后的描述和改进分析
 */

import type { JDAnalysisOutput } from "./jdAnalysisPrompt";
import type { RoleCategory } from "../utils/roleClassifier";
import type { OptimizationStrategy } from "../utils/projectOptimizationStrategies";

export interface ProjectOptimizeInput {
  projectDescription: string;
  targetRole?: string;
  jdAnalysis?: JDAnalysisOutput;
  roleCategory?: RoleCategory;
  strategy?: OptimizationStrategy;
  jdText?: string;
}

export interface ProjectOptimizeOutput {
  original: string;
  bulletVersion: string;
  jdMatchAnalysis: string;
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
  keywordSuggestions: string[];
  interviewerFollowUps: string[];
  dataSuggestions: string[];
  honestyWarnings: string[];
}

export function getProjectOptimizePrompt(input: ProjectOptimizeInput): string {
  // 构建 JD 上下文
  let jdContext = "";
  if (input.jdText) {
    jdContext += `\n原始 JD：\n${input.jdText}\n`;
  }
  if (input.jdAnalysis) {
    jdContext += `\nJD 解析结果：\n- 岗位：${input.jdAnalysis.jobTitle}\n- 公司：${input.jdAnalysis.company}\n- 必备技能：${input.jdAnalysis.requiredSkills.join("、")}\n- 关键词：${input.jdAnalysis.keywords.join("、")}\n- 面试关注点：${input.jdAnalysis.interviewFocus.join("、")}\n`;
  }

  // 构建策略上下文
  let strategyContext = "";
  if (input.strategy) {
    strategyContext += `\n岗位分类：${input.strategy.categoryName}\n`;
    strategyContext += `优化重点：\n${input.strategy.focusPoints.map((p) => "- " + p).join("\n")}\n`;
    strategyContext += `应突出的关键词：${input.strategy.keywordsToHighlight.join("、")}\n`;
    strategyContext += `bullet 风格：${input.strategy.bulletStyle}\n`;
    strategyContext += `评估重点：\n${input.strategy.evaluationFocus.map((e) => "- " + e).join("\n")}\n`;
  }

  return `你是一位简历优化专家，擅长把简单的项目描述改写成专业、有说服力的经历描述。

## 任务

根据目标岗位 JD 和优化策略，优化以下项目经历描述，使其更贴合岗位需求。

## 输入

项目经历描述：
${input.projectDescription}
${input.targetRole ? `\n目标岗位方向：${input.targetRole}` : ""}
${jdContext}
${strategyContext}

## 输出要求

请严格按照以下 JSON 格式输出，不要包含任何其他文字：

{
  "original": "原始描述",
  "bulletVersion": "简历 bullet 版本，适合直接写在简历上",
  "jdMatchAnalysis": "分析该经历与 JD 的匹配程度，指出匹配点和差距",
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
  "keywordsAdded": ["新增关键词1", "新增关键词2"],
  "keywordSuggestions": ["JD 中出现但项目描述中缺少的关键词，建议补充"],
  "interviewerFollowUps": ["面试官可能追问的问题1", "问题2"],
  "dataSuggestions": ["可以补充的量化数据或指标建议"],
  "honestyWarnings": ["不建议夸大或编造的经历内容、风险提示"]
}

## 规则

1. 所有字段必须输出，不能省略
2. bulletVersion 要简洁有力，适合直接写在简历上，并且要结合 JD 关键词
3. jdMatchAnalysis 要具体分析经历与 JD 的匹配点和不足
4. starVersion 要完整覆盖 STAR 四个要素
5. optimized 至少提供 2 个版本
6. improvements 每条都必须有 before 和 after 的对比
7. keywordSuggestions 列出 JD 中出现但项目描述中没有的关键词
8. interviewerFollowUps 列出 2-3 个面试官可能追问的问题
9. dataSuggestions 列出可以补充的量化数据建议
10. honestyWarnings 提醒不要夸大或编造经历
11. 不要编造用户没有提供的经历和数据
12. 不要使用 Markdown 格式，直接输出 JSON
13. 确保 JSON 格式正确，可以被 JSON.parse() 解析`;
}
