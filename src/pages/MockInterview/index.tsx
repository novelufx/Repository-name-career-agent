import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  ArrowRight,
  Loader2,
  Send,
  Bot,
  User,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { sampleJDs, sampleResumes, mockJDAnalysis } from "../../mock/data";
import {
  generateInterviewQuestions,
  getErrorMessage,
} from "../../services/aiService";
import type { InterviewQuestion } from "../../mock/data";

export default function MockInterview() {
  const [jdText, setJdText] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!jdText.trim() || !resumeText.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const data = await generateInterviewQuestions(
        resumeText,
        mockJDAnalysis
      );
      setQuestions(data);
      setIsStarted(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) return;
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIndex].question]: currentAnswer,
    }));
    setCurrentAnswer("");
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowHint(false);
    }
  };

  const handleFillSample = () => {
    setJdText(sampleJDs.aiProduct);
    setResumeText(sampleResumes.product);
    setError(null);
  };

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === questions.length;

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      technical: "技术问题",
      behavioral: "行为问题",
      situational: "情景问题",
    };
    return labels[type] || type;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      hard: "bg-red-100 text-red-700",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">模拟面试</h1>
        <p className="text-gray-600">
          根据你的简历和 JD，模拟真实面试
        </p>
      </div>

      {!isStarted ? (
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-green-600" />
                面试准备
              </h2>
              <button
                type="button"
                onClick={handleFillSample}
                className="text-xs px-3 py-1 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
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
                  你的简历摘要
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    setError(null);
                  }}
                  placeholder="粘贴你的简历内容或关键经历..."
                  className="input-field h-32 resize-none"
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
              onClick={handleStart}
              disabled={!jdText.trim() || !resumeText.trim() || isLoading}
              className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  正在生成面试问题...
                </>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5" />
                  生成面试问题
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：问题列表 */}
          <div className="card">
            <h3 className="font-medium text-gray-900 mb-4">
              面试问题 ({answeredCount}/{questions.length})
            </h3>
            <div className="space-y-2">
              {questions.map((q, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(index);
                    setShowHint(false);
                    setCurrentAnswer(answers[q.question] || "");
                  }}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                    index === currentIndex
                      ? "bg-blue-50 border border-blue-200"
                      : answers[q.question]
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        answers[q.question]
                          ? "bg-green-500 text-white"
                          : index === currentIndex
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="line-clamp-2">{q.question}</span>
                  </div>
                </button>
              ))}
            </div>

            {isAllAnswered && (
              <button
                type="button"
                onClick={() => navigate("/workflow/feedback-report")}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
              >
                查看反馈报告
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 右侧：当前问题和回答 */}
          <div className="lg:col-span-2 card">
            {currentQuestion && (
              <div className="space-y-4">
                {/* 问题标签 */}
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700">
                    {getTypeLabel(currentQuestion.type)}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${getDifficultyColor(currentQuestion.difficulty)}`}
                  >
                    {currentQuestion.difficulty === "easy"
                      ? "简单"
                      : currentQuestion.difficulty === "medium"
                        ? "中等"
                        : "困难"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {currentQuestion.category}
                  </span>
                </div>

                {/* 问题 */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 font-medium">
                        {currentQuestion.question}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      这题考察：{currentQuestion.intent}
                    </p>
                  </div>
                </div>

                {/* 提示按钮 */}
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Lightbulb className="w-4 h-4" />
                  {showHint ? "收起提示" : "查看回答要点"}
                  {showHint ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* 提示内容 */}
                {showHint && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 mb-2">
                      回答要点：
                    </p>
                    <ul className="space-y-1 mb-3">
                      {currentQuestion.keyPoints.map((point, i) => (
                        <li
                          key={i}
                          className="text-sm text-blue-700 flex items-start gap-2"
                        >
                          <span className="text-blue-500 mt-1">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-blue-200">
                      <p className="text-sm font-medium text-blue-800 mb-1">
                        参考答案：
                      </p>
                      <p className="text-sm text-blue-700">
                        {currentQuestion.sampleAnswer}
                      </p>
                    </div>
                    {currentQuestion.followUp.length > 0 && (
                      <div className="pt-3 border-t border-blue-200 mt-3">
                        <p className="text-sm font-medium text-blue-800 mb-1">
                          可能的追问：
                        </p>
                        <ul className="space-y-1">
                          {currentQuestion.followUp.map((q, i) => (
                            <li
                              key={i}
                              className="text-sm text-blue-700 flex items-start gap-2"
                            >
                              <span className="text-blue-500 mt-1">?</span>
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* 回答区域 */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                      placeholder="输入你的回答..."
                      className="input-field h-32 resize-none"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={handleSubmitAnswer}
                        disabled={!currentAnswer.trim()}
                        className="btn-primary flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        {currentIndex < questions.length - 1
                          ? "提交并下一题"
                          : "提交回答"}
                      </button>
                      {answers[currentQuestion.question] && (
                        <span className="text-sm text-green-600 flex items-center gap-1">
                          ✓ 已回答
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
