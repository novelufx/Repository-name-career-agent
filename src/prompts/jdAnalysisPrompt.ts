/**
 * JD 分析 Prompt
 * 用途：分析职位描述，提取关键信息
 * 输入：JD 文本
 * 输出：结构化的 JD 分析结果
 */

export interface JDAnalysisInput {
  jdText: string;
}

export interface JDAnalysisOutput {
  jobTitle: string;
  company: string;
  location: string;
  salaryRange: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
  interviewFocus: string[];
  summary: string;
}

export function getJDAnalysisPrompt(input: JDAnalysisInput): string {
  return `你是一位资深的招聘顾问，擅长分析职位描述。

## 任务

分析以下职位描述，提取关键信息。

## 输入

${input.jdText}

## 输出要求

请严格按照以下 JSON 格式输出，不要包含任何其他文字：

{
  "jobTitle": "岗位名称",
  "company": "公司名称",
  "location": "工作地点",
  "salaryRange": "薪资范围",
  "responsibilities": ["职责1", "职责2", "职责3"],
  "requiredSkills": ["必备技能1", "必备技能2"],
  "preferredSkills": ["加分技能1", "加分技能2"],
  "keywords": ["关键词1", "关键词2", "关键词3"],
  "interviewFocus": ["面试关注点1", "面试关注点2"],
  "summary": "一句话总结这个岗位的核心要求"
}

## 规则

1. 所有字段必须输出，不能省略
2. 如果某些信息无法判断，使用空字符串或空数组
3. responsibilities 每条不超过 20 字
4. requiredSkills 和 preferredSkills 必须是 JD 中明确提到的
5. keywords 提取 3-5 个高频关键词
6. interviewFocus 提取 2-4 个面试可能考察的点
7. 不要使用 Markdown 格式，直接输出 JSON
8. 确保 JSON 格式正确，可以被 JSON.parse() 解析`;
}
