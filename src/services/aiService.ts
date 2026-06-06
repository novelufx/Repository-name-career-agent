/**
 * AI 服务核心逻辑
 * 封装小米 MiMo API 调用，支持 mock 模式
 * 使用 Anthropic Messages 格式
 */

import type { ChatMessage } from "../types/api";
import type {
  JDAnalysisResult,
  ResumeDiagnosisResult,
  ProjectOptimizationResult,
  InterviewQuestion,
  FeedbackReportResult,
} from "../mock/data";
import type { RoleCategory } from "../utils/roleClassifier";
import type { OptimizationStrategy } from "../utils/projectOptimizationStrategies";
import { loadConfig } from "./settingsService";
import {
  getJDAnalysisPrompt,
  getResumeMatchPrompt,
  getProjectOptimizePrompt,
  getInterviewPrompt,
  getFeedbackPrompt,
} from "../prompts";

/**
 * MiMo 是 thinking 模型，thinking 块会消耗大量 token 预算，需要更大的 max_tokens
 */
const DEFAULT_MAX_TOKENS = 20000;

/**
 * Anthropic Messages API 响应格式
 */
interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  model: string;
  stop_reason: string;
  content: Array<{
    type: "text" | "thinking";
    text?: string;
    thinking?: string;
  }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * 调用小米 MiMo API (Anthropic Messages 格式)
 */
export async function callMiMoChat(
  messages: ChatMessage[],
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  const config = loadConfig();

  if (!config.apiKey) {
    throw new Error("NO_API_KEY");
  }

  // 小米 MiMo API 使用 Anthropic Messages 格式，路径为 /v1/messages
  const url = `${config.baseUrl}/v1/messages`;

  // 转换消息格式：提取 system 消息
  const systemMessage = messages.find((m) => m.role === "system");
  const userMessages = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const requestBody: Record<string, unknown> = {
    model: config.model,
    messages: userMessages,
    max_tokens: options?.maxTokens ?? DEFAULT_MAX_TOKENS,
  };

  // 如果有 system 消息，添加到请求中
  if (systemMessage) {
    requestBody.system = systemMessage.content;
  }

  // 如果有 temperature，添加到请求中
  if (options?.temperature !== undefined) {
    requestBody.temperature = options.temperature;
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "未知错误");
    throw new Error(`API_REQUEST_FAILED:${response.status}:${errorText}`);
  }

  const data: AnthropicResponse = await response.json();

  // 从响应中提取文本内容；MiMo 是 thinking 模型，可能只有 thinking 块
  const textContent = data.content?.find((c) => c.type === "text");
  if (!textContent || !textContent.text) {
    const hasThinking = data.content?.some((c) => c.type === "thinking");
    if (hasThinking) {
      throw new Error("AI_THINKING_TOO_LONG");
    }
    throw new Error("API_NO_TEXT_CONTENT");
  }

  // 检查是否因 token 限制被截断
  if (data.stop_reason === "max_tokens") {
    throw new Error("OUTPUT_TRUNCATED");
  }

  return textContent.text;
}

/**
 * 测试 API 连接
 */
export async function testConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const messages: ChatMessage[] = [
      { role: "user", content: "你好，请回复'连接成功'" },
    ];
    const result = await callMiMoChat(messages, { maxTokens: 500 });
    return {
      success: true,
      message: `连接成功：${result.substring(0, 50)}`,
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("401")) {
        return { success: false, message: "API Key 无效，请检查" };
      }
      if (error.message.includes("404")) {
        return {
          success: false,
          message: "API 地址错误，请检查 Base URL",
        };
      }
      if (error.message.includes("Failed to fetch")) {
        return {
          success: false,
          message: "网络错误，请检查网络连接或 Base URL",
        };
      }
      return { success: false, message: `连接失败：${error.message}` };
    }
    return { success: false, message: "连接失败：未知错误" };
  }
}

/**
 * 解析 JSON 响应，处理可能的格式问题
 * 支持去除 Markdown 代码块、尾部逗号、BOM 字符等常见 LLM 输出问题
 */
function parseJsonResponse<T>(text: string): T {
  // 第一步：清理文本，去除 Markdown 代码块等干扰内容
  let cleaned = text.trim();

  // 去除 BOM 和零宽字符
  cleaned = cleaned.replace(/^\uFEFF/, "");
  cleaned = cleaned.replace(/[\u200B\u200C\u200D\uFEFF]/g, "");

  // 去除 ```json ... ``` 或 ``` ... ``` 代码块包裹
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    cleaned = fenceMatch[1].trim();
  }

  // 第二步：直接尝试解析
  try {
    return JSON.parse(cleaned);
  } catch {
    // 继续尝试修复
  }

  // 第三步：从文本中提取最外层 JSON 对象（括号平衡匹配）
  const extracted = extractOutermostJSON(cleaned);
  if (extracted) {
    try {
      return JSON.parse(extracted);
    } catch {
      // 尝试修复常见问题后再解析
      const fixed = fixCommonJSONIssues(extracted);
      try {
        return JSON.parse(fixed);
      } catch {
        // 修复后仍然失败
      }
    }
  }

  throw new Error("JSON_PARSE_FAILED");
}

/**
 * 从文本中提取最外层的 JSON 对象，通过括号平衡找到完整的 {...} 块
 */
function extractOutermostJSON(text: string): string | null {
  const start = text.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (escape) {
      escape = false;
      continue;
    }

    if (ch === "\\") {
      escape = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        return text.substring(start, i + 1);
      }
    }
  }

  return null;
}

/**
 * 修复 LLM 输出的常见 JSON 问题
 */
function fixCommonJSONIssues(text: string): string {
  let fixed = text;
  // 去除 BOM 和零宽字符
  fixed = fixed.replace(/^\uFEFF/, "");
  fixed = fixed.replace(/[\u200B\u200C\u200D\uFEFF]/g, "");
  // 去除尾部逗号：,] 或 ,}
  fixed = fixed.replace(/,\s*([}\]])/g, "$1");
  // 注意：不替换智能引号（U+201C U+201D U+2018 U+2019），
  // 因为它们在 JSON 字符串值中是合法的，替换为 ASCII 引号会破坏 JSON
  return fixed;
}

/**
 * 带重试的 API 调用 + JSON 解析
 * 第一次使用默认参数，若 JSON 解析失败则用 temperature=0 重试一次
 */
async function callAndParse<T>(
  messages: ChatMessage[],
  parseFn: (text: string) => T,
  options?: { temperature?: number; maxTokens?: number }
): Promise<T> {
  try {
    const result = await callMiMoChat(messages, options);
    return parseFn(result);
  } catch (firstError) {
    if (firstError instanceof Error) {
      // 情况1: 输出被截断，提高 token 重试
      if (firstError.message === "OUTPUT_TRUNCATED") {
        const currentMax = options?.maxTokens ?? DEFAULT_MAX_TOKENS;
        const retryResult = await callMiMoChat(messages, {
          ...options,
          maxTokens: currentMax * 2,
        });
        return parseFn(retryResult);
      }
      // 情况2: 思考块过长（无 text 输出），提高 token 重试
      if (firstError.message === "AI_THINKING_TOO_LONG") {
        const currentMax = options?.maxTokens ?? DEFAULT_MAX_TOKENS;
        const retryResult = await callMiMoChat(messages, {
          ...options,
          maxTokens: currentMax * 2,
        });
        return parseFn(retryResult);
      }
      // 情况3: JSON 解析失败，用 temperature=0 重试一次
      if (firstError.message === "JSON_PARSE_FAILED") {
        const retryResult = await callMiMoChat(messages, {
          ...options,
          temperature: 0,
        });
        return parseFn(retryResult);
      }
    }
    throw firstError;
  }
}

/**
 * JD 分析
 */
export async function analyzeJD(
  jdText: string
): Promise<JDAnalysisResult> {
  const prompt = getJDAnalysisPrompt({ jdText });
  const messages: ChatMessage[] = [{ role: "user", content: prompt }];
  return callAndParse(messages, parseJsonResponse<JDAnalysisResult>);
}

/**
 * 简历诊断
 */
export async function diagnoseResume(
  resumeText: string,
  jdAnalysis: JDAnalysisResult
): Promise<ResumeDiagnosisResult> {
  const prompt = getResumeMatchPrompt({ resumeText, jdAnalysis: jdAnalysis as any });
  const messages: ChatMessage[] = [{ role: "user", content: prompt }];
  return callAndParse(messages, parseJsonResponse<ResumeDiagnosisResult>);
}

/**
 * 项目优化
 */
export async function optimizeProject(
  projectDescription: string,
  targetRole: string,
  options?: {
    jdText?: string;
    jdAnalysis?: JDAnalysisResult;
    roleCategory?: RoleCategory;
    strategy?: OptimizationStrategy;
  }
): Promise<ProjectOptimizationResult> {
  const prompt = getProjectOptimizePrompt({
    projectDescription,
    targetRole,
    jdText: options?.jdText,
    jdAnalysis: options?.jdAnalysis as any,
    roleCategory: options?.roleCategory,
    strategy: options?.strategy,
  });
  const messages: ChatMessage[] = [{ role: "user", content: prompt }];
  return callAndParse(messages, parseJsonResponse<ProjectOptimizationResult>);
}

/**
 * 生成面试问题
 */
export async function generateInterviewQuestions(
  resumeText: string,
  jdAnalysis: JDAnalysisResult
): Promise<InterviewQuestion[]> {
  const prompt = getInterviewPrompt({ resumeText, jdAnalysis: jdAnalysis as any });
  const messages: ChatMessage[] = [{ role: "user", content: prompt }];
  return callAndParse(messages, (text) => {
    const parsed = parseJsonResponse<{ questions: InterviewQuestion[] }>(text);
    return parsed.questions || [];
  });
}

/**
 * 生成反馈报告
 */
export async function generateFeedbackReport(
  resumeText: string,
  jdAnalysis: JDAnalysisResult,
  resumeDiagnosis: unknown,
  projectOptimization: unknown,
  interviewHistory: Array<{
    question: string;
    answer: string;
    score: number;
  }>
): Promise<FeedbackReportResult> {
  const prompt = getFeedbackPrompt({
    resumeText,
    jdAnalysis: jdAnalysis as any,
    resumeDiagnosis: resumeDiagnosis as any,
    projectOptimization: projectOptimization as any,
    interviewHistory: interviewHistory.map((h) => ({
      ...h,
      feedback: "",
    })),
  });
  const messages: ChatMessage[] = [{ role: "user", content: prompt }];
  return callAndParse(messages, parseJsonResponse<FeedbackReportResult>);
}

/**
 * 获取错误提示信息
 */
export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      if (error.message === "NO_API_KEY") return "请先配置 API Key";
      if (error.message.includes("401"))
        return "API Key 无效，请检查设置";
      if (error.message.includes("403"))
        return "API 访问被拒绝，请检查权限";
      if (error.message.includes("404"))
        return "API 地址错误，请检查 Base URL";
      if (error.message.includes("429"))
        return "请求过于频繁，请稍后重试";
      if (error.message.includes("500"))
        return "服务器错误，请稍后重试";
      if (error.message.includes("Failed to fetch"))
        return "网络错误，请检查网络连接";
      if (error.message === "JSON_PARSE_FAILED")
        return "AI 返回格式异常，请重试";
      if (error.message === "AI_THINKING_TOO_LONG")
        return "AI 思考过长导致输出不完整，系统已自动提高 token 限制重试";
      if (error.message === "OUTPUT_TRUNCATED")
        return "AI 输出被截断，系统已自动提高 token 限制重试";
      if (error.message === "API_NO_TEXT_CONTENT")
        return "AI 未返回有效内容，请重试";
      return error.message;
    }
    return "未知错误，请重试";
  }
