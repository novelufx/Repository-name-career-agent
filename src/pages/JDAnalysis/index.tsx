import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  ArrowRight,
  Loader2,
  CheckCircle,
  Copy,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { sampleJDs, type JDAnalysisResult } from "../../mock/data";
import { analyzeJD, getErrorMessage } from "../../services/aiService";
import { useAppContext } from "../../context/AppContext";
import { useWorkflow } from "../../context/WorkflowContext";
import { classifyRole, getCategoryDisplayName } from "../../utils/roleClassifier";
import WorkflowProgress from "../../components/WorkflowProgress";

export default function JDAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<JDAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { dispatch } = useAppContext();
  const {
    state: wf,
    setJdText,
    setJdAnalysisResult,
    setDetectedRole,
    setRoleCategory,
  } = useWorkflow();

  // 从 WorkflowContext 恢复结果（在 wf 声明之后）
  useEffect(() => {
    if (wf.jdAnalysisResult && !result) {
      setResult(wf.jdAnalysisResult);
    }
    // 恢复时重新运行分类，确保使用最新的分类逻辑
    if (wf.jdText && wf.roleCategory) {
      const fresh = classifyRole(wf.jdText);
      if (fresh.roleCategory !== wf.roleCategory) {
        setDetectedRole(fresh.detectedRole);
        setRoleCategory(fresh.roleCategory);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jdText = wf.jdText;

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeJD(jdText);

      // 使用 roleClassifier 识别岗位
      const classification = classifyRole(jdText);

      dispatch({ type: "SET_JD_DATA", payload: data });
      setJdAnalysisResult(data);
      setDetectedRole(classification.detectedRole || data.jobTitle);
      setRoleCategory(classification.roleCategory);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillSample = (type: keyof typeof sampleJDs) => {
    setJdText(sampleJDs[type]);
    setError(null);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <WorkflowProgress />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">JD 解析</h1>
        <p className="text-gray-600">
          粘贴 JD，看看这个岗位到底要什么人
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 输入区域 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              输入职位描述
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleFillSample("aiProduct")}
                className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
              >
                AI 产品实习
              </button>
              <button
                type="button"
                onClick={() => handleFillSample("frontend")}
                className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
              >
                前端开发实习
              </button>
              <button
                type="button"
                onClick={() => handleFillSample("product")}
                className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
              >
                产品实习
              </button>
            </div>
          </div>

          <textarea
            value={jdText}
            onChange={(e) => {
              setJdText(e.target.value);
              setError(null);
            }}
            placeholder="请粘贴完整的职位描述（JD）..."
            className="input-field h-80 resize-none"
          />

          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!jdText.trim() || isLoading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                正在解析...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                开始解析
              </>
            )}
          </button>
        </div>

        {/* 结果区域 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            解析结果
          </h2>

          {isLoading ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">正在解析...</p>
                <p className="text-sm text-gray-400 mt-1">
                  提取岗位要求、关键词
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
              {/* 岗位概述 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 text-lg">
                  {result.jobTitle}
                </h3>
                <p className="text-blue-700">
                  {result.company} · {result.location}
                </p>
                <p className="text-blue-600 text-sm mt-1">
                  {result.salaryRange}
                </p>
              </div>

              {/* 识别结果 */}
              {wf.detectedRole && (
                <div className="bg-indigo-50 p-3 rounded-lg flex items-center gap-3">
                  <span className="text-sm text-indigo-600 font-medium">识别岗位：</span>
                  <span className="text-sm text-indigo-900 font-semibold">{wf.detectedRole}</span>
                  <span className="text-xs text-indigo-500">
                    分类：{getCategoryDisplayName(wf.roleCategory)}
                  </span>
                </div>
              )}

              {/* 提示信息 */}
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-green-700">
                  这份 JD 解析结果会自动用于后续简历诊断、项目优化和模拟面试。
                </p>
              </div>

              {/* 一句话总结 */}
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 text-sm">{result.summary}</p>
              </div>

              {/* 核心职责 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">核心职责</h4>
                <ul className="space-y-2">
                  {result.responsibilities.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-blue-500 mt-1">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 必备技能 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">必备技能</h4>
                <div className="flex flex-wrap gap-2">
                  {result.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 加分技能 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">加分技能</h4>
                <div className="flex flex-wrap gap-2">
                  {result.preferredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 关键词 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">高频关键词</h4>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* 面试关注点 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">面试关注点</h4>
                <ul className="space-y-2">
                  {result.interviewFocus.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-orange-500 mt-1">!</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(result, null, 2))}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <Copy className="w-4 h-4" />
                  复制结果
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/workflow/resume-diagnosis")}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  下一步：简历诊断
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-2">粘贴 JD 开始分析</p>
                <p className="text-sm">支持任意格式，直接粘贴就行</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
