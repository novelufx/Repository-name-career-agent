import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Save,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  loadConfig,
  saveConfig,
  clearConfig,
  getDefaultConfig,
} from "../../services/settingsService";
import { testConnection } from "../../services/aiService";
import type { ApiConfig } from "../../types/api";

export default function Settings() {
  const [config, setConfig] = useState<ApiConfig>(getDefaultConfig());
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    const loaded = loadConfig();
    setConfig(loaded);
  }, []);

  const handleSave = () => {
    saveConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);

    // 先临时保存配置以便测试
    const originalConfig = loadConfig();
    saveConfig(config);

    const result = await testConnection();
    setTestResult(result);
    setTesting(false);

    // 如果测试失败，恢复原配置
    if (!result.success) {
      saveConfig(originalConfig);
    }
  };

  const handleReset = () => {
    const defaultConfig = getDefaultConfig();
    setConfig(defaultConfig);
    clearConfig();
  };

  const handleInputChange = (field: keyof ApiConfig, value: string | boolean) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
    setTestResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">设置</h1>
        <p className="text-gray-600">配置 AI 模型 API 连接参数</p>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-gray-600" />
          API 配置
        </h2>

        <div className="space-y-6">
          {/* Mock 模式开关 */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">演示模式</p>
              <p className="text-sm text-gray-500">
                开启后使用预设数据，无需 API Key
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange("useMockMode", !config.useMockMode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.useMockMode ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.useMockMode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={config.apiKey}
                onChange={(e) => handleInputChange("apiKey", e.target.value)}
                placeholder="输入你的 API Key"
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                title={showApiKey ? "隐藏 API Key" : "显示 API Key"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              API Key 只会保存在本地浏览器 localStorage，不会上传到服务器
            </p>
          </div>

          {/* Base URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Base URL
            </label>
            <input
              type="text"
              value={config.baseUrl}
              onChange={(e) => handleInputChange("baseUrl", e.target.value)}
              placeholder="https://token-plan-cn.xiaomimimo.com/anthropic"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              小米 MiMo API 地址，默认：https://token-plan-cn.xiaomimimo.com/anthropic
            </p>
          </div>

          {/* 模型名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              模型名称
            </label>
            <input
              type="text"
              value={config.model}
              onChange={(e) => handleInputChange("model", e.target.value)}
              placeholder="mimo-v2-pro"
              className="input-field"
            />
            <p className="text-xs text-gray-500 mt-1">
              使用的 AI 模型标识，默认：mimo-v2-pro
            </p>
          </div>

          {/* 模式状态指示 */}
          <div
            className={`p-4 rounded-lg ${
              config.useMockMode || !config.apiKey
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                config.useMockMode || !config.apiKey
                  ? "text-yellow-800"
                  : "text-green-800"
              }`}
            >
              {config.useMockMode || !config.apiKey
                ? "当前模式：演示模式（使用预设数据）"
                : "当前模式：API 模式（连接小米 MiMo）"}
            </p>
          </div>

          {/* 测试连接 */}
          {!config.useMockMode && config.apiKey && (
            <div>
              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="btn-secondary flex items-center gap-2"
              >
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    测试中...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    测试连接
                  </>
                )}
              </button>

              {testResult && (
                <div
                  className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
                    testResult.success
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="text-sm">{testResult.message}</p>
                </div>
              )}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleSave}
              className="btn-primary flex items-center gap-2"
            >
              {saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  已保存
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  保存配置
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary"
            >
              恢复默认
            </button>
          </div>
        </div>
      </div>

      {/* 使用说明 */}
      <div className="card mt-6">
        <h3 className="font-medium text-gray-900 mb-3">使用说明</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>1. 开启演示模式可直接体验所有功能，无需 API Key</p>
          <p>2. 如需使用真实 AI 分析，请关闭演示模式并填写 API Key</p>
          <p>3. API Key 只保存在本地浏览器，不会上传到任何服务器</p>
          <p>4. 获取 API Key 请访问小米 MiMo 开放平台</p>
          <p>5. 如果遇到连接问题，请检查 Base URL 和网络连接</p>
        </div>
      </div>
    </div>
  );
}
