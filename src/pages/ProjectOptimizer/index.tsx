import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  Copy,
  Star,
  AlertCircle,
  Target,
  ChevronDown,
} from "lucide-react";
import { optimizeProject, getErrorMessage } from "../../services/aiService";
import { useAppContext } from "../../context/AppContext";
import { useWorkflow } from "../../context/WorkflowContext";
import { extractProjects } from "../../utils/extractProjects";
import { getOptimizationStrategy } from "../../utils/projectOptimizationStrategies";
import { getCategoryDisplayName, type RoleCategory } from "../../utils/roleClassifier";
import type { ProjectOptimizationResult } from "../../mock/data";
import WorkflowProgress from "../../components/WorkflowProgress";

const ALL_CATEGORIES: RoleCategory[] = [
  "ai_product", "product", "frontend", "backend", "general_dev",
  "algorithm", "testing", "data", "devops", "security", "embedded", "other",
];

export default function ProjectOptimizer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProjectOptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState(0);
  const [showCategoryOverride, setShowCategoryOverride] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const {
    state: wf,
    setExtractedProjects,
    setSelectedProjectText,
    setRoleCategory,
    setProjectOptimizationResult,
  } = useWorkflow();

  // 从 WorkflowContext 恢复结果（在 wf 声明之后）
  useEffect(() => {
    if (wf.projectOptimizationResult && !result) {
      setResult(wf.projectOptimizationResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projectDesc = wf.selectedProjectText;
  const strategy = getOptimizationStrategy(wf.roleCategory);

  // 从简历中提取项目经历
  useEffect(() => {
    if (wf.resumeText && wf.extractedProjects.length === 0) {
      const projects = extractProjects(wf.resumeText);
      if (projects.length > 0) {
        setExtractedProjects(projects);
      }
    }
  }, [wf.resumeText, wf.extractedProjects.length, setExtractedProjects]);

  const handleOptimize = async () => {
    if (!projectDesc.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await optimizeProject(projectDesc, wf.detectedRole || "目标岗位", {
        jdText: wf.jdText,
        jdAnalysis: wf.jdAnalysisResult || undefined,
        roleCategory: wf.roleCategory,
        strategy,
      });
      dispatch({ type: "SET_PROJECT_DATA", payload: data });
      setProjectOptimizationResult(data);
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
      <WorkflowProgress />

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
            {/* 识别到的岗位和策略信息 */}
            {wf.detectedRole && (
              <div className="p-3 bg-cyan-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-cyan-600" />
                  <span className="text-sm text-cyan-800 font-medium">
                    目标岗位：{wf.detectedRole}
                  </span>
                  <span className="text-xs text-cyan-600">
                    （{getCategoryDisplayName(wf.roleCategory)}）
                  </span>
                </div>
                <div>
                  <p className="text-xs text-cyan-700 font-medium mb-1">本次优化重点：</p>
                  <ul className="text-xs text-cyan-600 space-y-0.5">
                    {strategy.focusPoints.slice(0, 3).map((p, i) => (
                      <li key={i}>- {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 高级选项：手动调整岗位分类 */}
            <div>
              <button
                type="button"
                onClick={() => setShowCategoryOverride(!showCategoryOverride)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                <ChevronDown className={`w-3 h-3 transition-transform ${showCategoryOverride ? "rotate-180" : ""}`} />
                手动调整岗位分类
              </button>
              {showCategoryOverride && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setRoleCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                        wf.roleCategory === cat
                          ? "bg-cyan-100 text-cyan-700 font-medium"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {getCategoryDisplayName(cat)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 从简历提取的项目卡片 */}
            {wf.extractedProjects.length > 0 && !projectDesc && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  从简历中识别到以下项目，点击选择
                </label>
                <div className="space-y-2">
                  {wf.extractedProjects.map((proj, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedProjectText(proj)}
                      className="w-full text-left p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-200 transition-colors line-clamp-3"
                    >
                      {proj}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 项目经历输入框 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                项目经历描述
              </label>
              <textarea
                value={projectDesc}
                onChange={(e) => {
                  setSelectedProjectText(e.target.value);
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
                  结合 JD 分析，提炼亮点，补充量化数据
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

              {/* JD 匹配分析 */}
              {result.jdMatchAnalysis && (
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-indigo-600 mb-1">JD 匹配分析</p>
                  <p className="text-sm text-gray-700">{result.jdMatchAnalysis}</p>
                </div>
              )}

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
                    <p className="text-xs text-blue-600 font-medium">S 背景</p>
                    <p className="text-sm text-gray-700 mt-1">{result.starVersion.situation}</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-purple-600 font-medium">T 任务</p>
                    <p className="text-sm text-gray-700 mt-1">{result.starVersion.task}</p>
                  </div>
                  <div className="p-3 bg-cyan-50 rounded-lg">
                    <p className="text-xs text-cyan-600 font-medium">A 行动</p>
                    <p className="text-sm text-gray-700 mt-1">{result.starVersion.action}</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-green-600 font-medium">R 结果</p>
                    <p className="text-sm text-gray-700 mt-1">{result.starVersion.result}</p>
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
                    onClick={() => handleCopy(result.optimized[activeTab].description)}
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
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-2">{item.aspect}</p>
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
                      <p className="text-xs text-gray-500 mt-2">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 新增关键词 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">新增关键词</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywordsAdded.map((kw, i) => (
                    <span key={i} className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* JD 关键词强化建议 */}
              {result.keywordSuggestions && result.keywordSuggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">JD 关键词强化建议</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.keywordSuggestions.map((kw, i) => (
                      <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 面试官可能追问 */}
              {result.interviewerFollowUps && result.interviewerFollowUps.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">面试官可能追问</h4>
                  <ul className="space-y-1">
                    {result.interviewerFollowUps.map((q, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">?</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 可补充的数据或指标 */}
              {result.dataSuggestions && result.dataSuggestions.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">可补充的数据或指标</h4>
                  <ul className="space-y-1">
                    {result.dataSuggestions.map((d, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-blue-500 mt-0.5">+</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 不建议夸大的内容 */}
              {result.honestyWarnings && result.honestyWarnings.length > 0 && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2 text-sm">不建议夸大的内容</h4>
                  <ul className="space-y-1">
                    {result.honestyWarnings.map((w, i) => (
                      <li key={i} className="text-sm text-orange-700 flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">!</span>
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

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
