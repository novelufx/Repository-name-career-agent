/**
 * AI 响应解析工具
 * 支持 JSON 解析，失败时返回兜底数据
 */

export interface ParseResult<T> {
  success: boolean;
  data?: T;
  rawText?: string;
  error?: string;
}

/**
 * 解析 AI 响应，支持三级降级
 */
export function parseAIResponse<T>(
  response: string,
  fallback: T
): ParseResult<T> {
  // 第一级：直接解析
  try {
    const data = JSON.parse(response);
    return { success: true, data };
  } catch {}

  // 第二级：提取 JSON 块
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return { success: true, data };
    }
  } catch {}

  // 第三级：返回兜底数据
  return {
    success: false,
    data: fallback,
    rawText: response,
    error: "AI 返回格式异常，已使用默认数据",
  };
}

/**
 * 检查字符串是否为有效 JSON
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * 从文本中提取 JSON 块
 */
export function extractJSON(text: string): string | null {
  // 尝试匹配完整的 JSON 对象
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : null;
}
