import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserCheck,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { sampleJDs, sampleResumes, mockJDAnalysis } from "../../mock/data";
import { diagnoseResume, getErrorMessage } from "../../services/aiService";
import type { ResumeDiagnosisResult } from "../../mock/data";

export default function ResumeDiagnosis() {
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResumeDiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleDiagnose = async () => {
    if (!jdText.trim() || !resumeText.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await diagnoseResume(resumeText, mockJDAnalysis);
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillSample = () => {
    setJdText(sampleJDs.aiProduct);
    setResumeText(sampleResumes.product);
    setError(null);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">简历诊断</h1>
        <p className="text-gray-600">看看你的简历和目标岗位有多匹配</p>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 输入区域 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-600" />
              输入信息
            </h2>
            <button
              type="button"
              onClick={handleFillSample}
              className="text-xs px-3 py-1 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-100 transition-colors"
            >
              填充示例
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                目标岗位 JD
              </label>
              <textarea
                value={jdText}
                onChange={(e) => {
                  setJdText(e.target.value);
                  setError(null);
                }}
                placeholder="粘贴目标岗位的职位描述..."
                className="input-field h-32 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                你的简历内容
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => {
                  setResumeText(e.target.value);
                  setError(null);
                }}
                placeholder="粘贴你的简历内容..."
                className="input-field h-40 resize-none"
              />
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
            onClick={handleDiagnose}
            disabled={!jdText.trim() || !resumeText.trim() || isLoading}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                正在诊断...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                开始诊断
              </>
            )}
          </button>
        </div>

        {/* 结果区域 */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            诊断结果
          </h2>

          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">正在分析...</p>
                <p className="text-sm text-gray-400 mt-1">
                  对比简历和 JD，找出差距
                </p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-5 max-h-[600px] overflow-y-auto pr-2">
              {/* 匹配度评分 */}
              <div className="text-center p-6 bg-gray-50 rounded-xl">
                <div
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getScoreColor(result.matchScore)}`}
                >
                  {result.matchScore}
                </div>
                <p className="mt-2 text-gray-600 font-medium">匹配度评分</p>
                <p className="text-sm text-gray-500 mt-1">{result.summary}</p>
              </div>

              {/* 分维度评分 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                  分维度评分
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  评分仅作为求职准备参考，最终结果需要结合你的真实经历判断
                </p>
                <div className="space-y-3">
                  {result.dimensionScores.map((dim) => (
                    <div key={dim.dimension}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">
                          {dim.dimension}
                        </span>
                        <span
                          className={`text-sm font-bold ${getScoreColor(dim.score).split(" ")[0]}`}
                        >
                          {dim.score}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreBarColor(dim.score)}`}
                          style={{ width: `${dim.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {dim.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 关键词覆盖 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">关键词覆盖</h4>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">已覆盖</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keywordCoverage.covered.map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">缺失</p>
                    <div className="flex flex-wrap gap-2">
                      {result.keywordCoverage.missing.map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 优势 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  你的优势
                </h4>
                <div className="space-y-3">
                  {result.strengths.map((item, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-800 text-sm">
                        {item.area}
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        {item.detail}
                      </p>
                      <p className="text-xs text-green-600 mt-1 italic">
                        证据：{item.evidence}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 短板 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  待提升
                </h4>
                <div className="space-y-3">
                  {result.weaknesses.map((item, index) => (
                    <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                      <p className="font-medium text-yellow-800 text-sm">
                        {item.area}
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {item.detail}
                      </p>
                      <p className="text-xs text-yellow-600 mt-1">
                        建议：{item.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 优化建议 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">优化建议</h4>
                <div className="space-y-3">
                  {result.optimizationSuggestions.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            item.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : item.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.priority === "high"
                            ? "高优先级"
                            : item.priority === "medium"
                              ? "中优先级"
                              : "低优先级"}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{item.suggestion}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        示例：{item.example}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate("/workflow/project-optimization")}
                  className="btn-primary flex items-center gap-2 text-sm"
                >
                  下一步：项目优化
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <UserCheck className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg mb-2">输入 JD 和简历开始诊断</p>
                <p className="text-sm">看看简历和岗位的匹配度</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
