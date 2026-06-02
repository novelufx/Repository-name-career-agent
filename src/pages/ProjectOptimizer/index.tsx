import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  Copy,
  Star,
  AlertCircle,
} from "lucide-react";
import { optimizeProject, getErrorMessage } from "../../services/aiService";
import type { ProjectOptimizationResult } from "../../mock/data";

const targetOptions = [
  { value: "aiProduct", label: "AI 产品实习生" },
  { value: "product", label: "产品实习生" },
  { value: "developer", label: "软件开发实习生" },
];

export default function ProjectOptimizer() {
  const [projectDesc, setProjectDesc] = useState("");
  const [targetRole, setTargetRole] = useState("aiProduct");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProjectOptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const handleOptimize = async () => {
    if (!projectDesc.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await optimizeProject(projectDesc, targetRole);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">项目优化</h1>
        <p className="text-gray-600">把流水账改成有说服力的经历描述</p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 输入区域 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-600" />
            输入项目经历
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标岗位方向
              </label>
              <div className="flex gap-2">
                {targetOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTargetRole(opt.value)}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      targetRole === opt.value
                        ? "bg-cyan-100 text-cyan-700 font-medium"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                项目经历描述
              </label>
              <textarea
                value={projectDesc}
                onChange={(e) => {
                  setProjectDesc(e.target.value);
                  setError(null);
                }}
                placeholder="请描述你的项目经历，包括你做了什么、怎么做的、结果如何..."
                className="input-field h-56 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                越详细越好，AI 会帮你提炼亮点和量化成果
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleOptimize}
            disabled={!projectDesc.trim() || isLoading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                正在优化...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                开始优化
              </>
            )}
          </button>
        </div>

        {/* 结果区域 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            优化结果
          </h2>

          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">正在优化...</p>
                <p className="text-sm text-gray-400 mt-1">
                  提炼亮点，补充量化数据
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2">
              {/* 原始描述 */}
              <div className="p-4 bg-red-50 rounded-lg">
                <p className="text-xs text-red-600 mb-1">原始描述</p>
                <p className="text-sm text-gray-700">{result.original}</p>
              </div>

              {/* 简历 bullet 版本 */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-green-600">简历 bullet 版本</p>
                  <button
                    type="button"
                    onClick={() => handleCopy(result.bulletVersion)}
                    className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    复制
                  </button>
                </div>
                <p className="text-sm text-gray-700">{result.bulletVersion}</p>
              </div>

              {/* STAR 版本 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  STAR 法则版本
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">
                      S 背景
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {result.starVersion.situation}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">
                      T 任务
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {result.starVersion.task}
                    </p>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-lg">
                    <p className="text-xs text-cyan-600 font-medium">
                      A 行动
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {result.starVersion.action}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">
                      R 结果
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {result.starVersion.result}
                    </p>
                  </div>
                </div>
              </div>

              {/* 多视角版本 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">多视角版本</h4>
                <div className="flex gap-2 mb-3">
                  {result.optimized.map((opt, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveTab(index)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                        activeTab === index
                          ? "bg-cyan-100 text-cyan-700 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {opt.version}
                    </button>
                  ))}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">
                    适合：{result.optimized[activeTab].suitableFor}
                  </p>
                  <p className="text-sm text-gray-700">
                    {result.optimized[activeTab].description}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(result.optimized[activeTab].description)
                    }
                    className="mt-2 text-xs text-cyan-600 hover:text-cyan-800 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    复制
                  </button>
                </div>
              </div>

              {/* 改进点分析 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">改进点分析</h4>
                <div className="space-y-3">
                  {result.improvements.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {item.aspect}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2 bg-red-50 rounded">
                          <p className="text-red-600 mb-1">优化前</p>
                          <p className="text-gray-700">{item.before}</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded">
                          <p className="text-green-600 mb-1">优化后</p>
                          <p className="text-gray-700">{item.after}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 新增关键词 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">新增关键词</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsAdded.map((kw, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate("/workflow/mock-interview")}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  下一步：模拟面试
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-2">输入项目经历开始优化</p>
                <p className="text-sm">
                  生成简历 bullet、STAR、多视角版本
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
