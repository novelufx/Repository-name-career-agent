import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart3,
  ArrowRight,
  Loader2,
  AlertCircle,
  Star,
  Target,
  RefreshCw,
  CheckCircle,
  Copy,
} from "lucide-react";
import { mockJDAnalysis, type FeedbackReportResult } from "../../mock/data";
import {
  generateFeedbackReport,
  getErrorMessage,
} from "../../services/aiService";

export default function FeedbackReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<FeedbackReportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const mockHistory = [
        {
          question: "请介绍一下你的项目经历",
          answer: "我做了xx项目",
          score: 75,
        },
        { question: "你对AI产品的理解", answer: "AI产品是...", score: 80 },
      ];
      const data = await generateFeedbackReport(
        "",
        mockJDAnalysis,
        mockHistory
      );
      setResult(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">反馈报告</h1>
        <p className="text-gray-600">
          看看面试表现怎么样，哪里还能改进
        </p>

      </div>

      {!result ? (
        <div className="card">
          <div className="text-center py-12">
            {isLoading ? (
              <>
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                <p className="text-lg text-gray-700 mb-2">正在生成报告...</p>
                <p className="text-sm text-gray-500">综合分析面试表现</p>
              </>
            ) : (
              <>
                <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-lg text-gray-700 mb-2">
                  生成面试反馈报告
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  看看哪些答得好，哪些还能改进
                </p>

                {error && (
                  <div className="mb-4 max-w-md mx-auto p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGenerate}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <BarChart3 className="w-5 h-5" />
                  生成反馈报告
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 综合评分 */}
          <div className="card">
            <div className="text-center py-8">
              <div
                className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-5xl font-bold ${getScoreBg(result.overallScore)} ${getScoreColor(result.overallScore)}`}
              >
                {result.overallScore}
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mt-4">
                综合评分
              </h2>
              <p className="text-gray-600 mt-2 max-w-xl mx-auto">
                {result.summary}
              </p>
            </div>
          </div>

          {/* 分维度评分 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              分维度评分
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              评分仅作为求职准备参考，最终结果需要结合你的真实经历判断
            </p>
            <div className="space-y-4">
              {result.dimensionScores.map((dim) => (
                <div key={dim.dimension}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {dim.dimension}
                    </span>
                    <span className={`font-bold ${getScoreColor(dim.score)}`}>
                      {dim.score}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getScoreBarColor(dim.score)}`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{dim.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 亮点 */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                回答亮点
              </h3>
              <div className="space-y-4">
                {result.highlights.map((item, index) => (
                  <div key={index} className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      {item.question}
                    </p>
                    <p className="text-sm text-green-700 mb-2">
                      "{item.answer}"
                    </p>
                    <p className="text-xs text-green-600">
                      亮点：{item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 问题 */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                待改进
              </h3>
              <div className="space-y-4">
                {result.issues.map((item, index) => (
                  <div key={index} className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      {item.question}
                    </p>
                    <p className="text-sm text-red-700 mb-2">
                      "{item.answer}"
                    </p>
                    <p className="text-xs text-red-600 mb-1">
                      问题：{item.problem}
                    </p>
                    <p className="text-xs text-red-500">
                      建议：{item.suggestion}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 优化建议 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              优化建议
            </h3>
            <div className="space-y-4">
              {result.optimizationSuggestions.map((item, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full font-medium">
                    {item.category}
                  </span>
                  <p className="text-sm text-gray-700 mt-2 mb-2">
                    {item.suggestion}
                  </p>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">示例</p>
                    <p className="text-sm text-gray-600">{item.example}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 更优回答示例 */}
          {result.improvedAnswers.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                更优回答示例
              </h3>
              <div className="space-y-4">
                {result.improvedAnswers.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <p className="font-medium text-gray-900 mb-3">
                      {item.question}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-xs text-red-600 mb-1">原始回答</p>
                        <p className="text-sm text-gray-700">
                          {item.originalAnswer}
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-green-600">改进回答</p>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.improvedAnswer)}
                            className="text-xs text-green-600 hover:text-green-800 flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            复制
                          </button>
                        </div>
                        <p className="text-sm text-gray-700">
                          {item.improvedAnswer}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      改进：{item.improvement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex gap-4 justify-center">
            <button
              type="button"
              onClick={() => {
                setResult(null);
                setError(null);
              }}
              className="btn-secondary flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              重新生成
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-primary flex items-center gap-2"
            >
              返回首页
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
