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
import { loadConfig, isMockMode } from "./settingsService";
import {
  getJDAnalysisPrompt,
  getResumeMatchPrompt,
  getProjectOptimizePrompt,
  getInterviewPrompt,
  getFeedbackPrompt,
} from "../prompts";
import {
  mockJDAnalysis,
  mockResumeDiagnosis,
  mockProjectOptimization,
  mockInterviewQuestions,
  mockFeedbackReport,
  mockDelay,
} from "../mock/data";

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
    max_tokens: options?.maxTokens ?? 2000,
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

  // 从 Anthropic 响应中提取文本内容
  const textContent = data.content?.find((c) => c.type === "text");
  if (!textContent || !textContent.text) {
    throw new Error("API_NO_TEXT_CONTENT");
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
    const result = await callMiMoChat(messages, { maxTokens: 100 });
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
 */
function parseJsonResponse<T>(text: string): T {
  try {
    return JSON.parse(text);
  } catch {
    // 尝试提取 JSON 块
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("JSON_PARSE_FAILED");
  }
}

/**
 * JD 分析
 */
export async function analyzeJD(
  jdText: string
): Promise<JDAnalysisResult> {
  if (isMockMode()) {
    await mockDelay(1500);
    return mockJDAnalysis;
  }

  try {
    const prompt = getJDAnalysisPrompt({ jdText });
    const messages: ChatMessage[] = [{ role: "user", content: prompt }];
    const result = await callMiMoChat(messages);
    return parseJsonResponse<JDAnalysisResult>(result);
  } catch (error) {
    console.error("JD 分析失败，降级到 mock:", error);
    await mockDelay(1500);
    return mockJDAnalysis;
  }
}

/**
 * 简历诊断
 */
export async function diagnoseResume(
  resumeText: string,
  jdAnalysis: JDAnalysisResult
): Promise<ResumeDiagnosisResult> {
  if (isMockMode()) {
    await mockDelay(2000);
    return mockResumeDiagnosis;
  }

  try {
    const prompt = getResumeMatchPrompt({
      resumeText,
      jdAnalysis: jdAnalysis as any,
    });
    const messages: ChatMessage[] = [{ role: "user", content: prompt }];
    const result = await callMiMoChat(messages);
    return parseJsonResponse<ResumeDiagnosisResult>(result);
  } catch (error) {
    console.error("简历诊断失败，降级到 mock:", error);
    await mockDelay(2000);
    return mockResumeDiagnosis;
  }
}

/**
 * 项目优化
 */
export async function optimizeProject(
  projectDescription: string,
  _targetRole: string
): Promise<ProjectOptimizationResult> {
  if (isMockMode()) {
    await mockDelay(1800);
    return mockProjectOptimization;
  }

  try {
    const prompt = getProjectOptimizePrompt({ projectDescription });
    const messages: ChatMessage[] = [{ role: "user", content: prompt }];
    const result = await callMiMoChat(messages);
    return parseJsonResponse<ProjectOptimizationResult>(result);
  } catch (error) {
    console.error("项目优化失败，降级到 mock:", error);
    await mockDelay(1800);
    return mockProjectOptimization;
  }
}

/**
 * 生成面试问题
 */
export async function generateInterviewQuestions(
  resumeText: string,
  jdAnalysis: JDAnalysisResult
): Promise<InterviewQuestion[]> {
  if (isMockMode()) {
    await mockDelay(1500);
    return mockInterviewQuestions;
  }

  try {
    const prompt = getInterviewPrompt({
      resumeText,
      jdAnalysis: jdAnalysis as any,
    });
    const messages: ChatMessage[] = [{ role: "user", content: prompt }];
    const result = await callMiMoChat(messages);
    const parsed = parseJsonResponse<{ questions: InterviewQuestion[] }>(
      result
    );
    return parsed.questions || mockInterviewQuestions;
  } catch (error) {
    console.error("生成面试问题失败，降级到 mock:", error);
    await mockDelay(1500);
    return mockInterviewQuestions;
  }
}

/**
 * 生成反馈报告
 */
export async function generateFeedbackReport(
  resumeText: string,
  jdAnalysis: JDAnalysisResult,
  interviewHistory: Array<{
    question: string;
    answer: string;
    score: number;
  }>
): Promise<FeedbackReportResult> {
  if (isMockMode()) {
    await mockDelay(2000);
    return mockFeedbackReport;
  }

  try {
    const prompt = getFeedbackPrompt({
      resumeText,
      jdAnalysis: jdAnalysis as any,
      resumeDiagnosis: mockResumeDiagnosis as any,
      projectOptimization: mockProjectOptimization as any,
      interviewHistory: interviewHistory.map((h) => ({
        ...h,
        feedback: "",
      })),
    });
    const messages: ChatMessage[] = [{ role: "user", content: prompt }];
    const result = await callMiMoChat(messages);
    return parseJsonResponse<FeedbackReportResult>(result);
  } catch (error) {
    console.error("生成反馈报告失败，降级到 mock:", error);
    await mockDelay(2000);
    return mockFeedbackReport;
  }
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
    return error.message;
  }
  return "未知错误，请重试";
}
