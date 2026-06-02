/**
 * 配置服务
 * 负责读取和保存用户配置，使用 localStorage
 */

import type { ApiConfig } from "../types/api";

const STORAGE_KEYS = {
  API_KEY: "career_agent_api_key",
  BASE_URL: "career_agent_base_url",
  MODEL: "career_agent_model",
  USE_MOCK_MODE: "career_agent_use_mock_mode",
} as const;

const DEFAULT_CONFIG: ApiConfig = {
  apiKey: "",
  baseUrl: "https://token-plan-cn.xiaomimimo.com/anthropic",
  model: "mimo-v2-pro",
  useMockMode: true,
};

/**
 * 从 localStorage 加载配置
 */
export function loadConfig(): ApiConfig {
  const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY) || DEFAULT_CONFIG.apiKey;
  const baseUrl = localStorage.getItem(STORAGE_KEYS.BASE_URL) || DEFAULT_CONFIG.baseUrl;
  const model = localStorage.getItem(STORAGE_KEYS.MODEL) || DEFAULT_CONFIG.model;
  const useMockModeStr = localStorage.getItem(STORAGE_KEYS.USE_MOCK_MODE);

  let useMockMode = DEFAULT_CONFIG.useMockMode;
  if (useMockModeStr !== null) {
    useMockMode = useMockModeStr === "true";
  }

  // 如果没有 apiKey，强制使用 mock 模式
  if (!apiKey) {
    useMockMode = true;
  }

  return { apiKey, baseUrl, model, useMockMode };
}

/**
 * 保存配置到 localStorage
 */
export function saveConfig(config: ApiConfig): void {
  localStorage.setItem(STORAGE_KEYS.API_KEY, config.apiKey);
  localStorage.setItem(STORAGE_KEYS.BASE_URL, config.baseUrl);
  localStorage.setItem(STORAGE_KEYS.MODEL, config.model);
  localStorage.setItem(STORAGE_KEYS.USE_MOCK_MODE, String(config.useMockMode));
}

/**
 * 清除所有配置
 */
export function clearConfig(): void {
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
  localStorage.removeItem(STORAGE_KEYS.BASE_URL);
  localStorage.removeItem(STORAGE_KEYS.MODEL);
  localStorage.removeItem(STORAGE_KEYS.USE_MOCK_MODE);
}

/**
 * 检查是否使用 mock 模式
 */
export function isMockMode(): boolean {
  const config = loadConfig();
  return config.useMockMode || !config.apiKey;
}

/**
 * 获取默认配置
 */
export function getDefaultConfig(): ApiConfig {
  return { ...DEFAULT_CONFIG };
}
