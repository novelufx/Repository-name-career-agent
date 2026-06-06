/**
 * 工作流进度指示器
 * 展示各步骤完成状态，提供"重新开始"按钮
 */

import { useWorkflow } from "../context/WorkflowContext";
import { RefreshCw, CheckCircle, Circle } from "lucide-react";

export default function WorkflowProgress() {
  const { state, clearWorkflow } = useWorkflow();

  const steps = [
    {
      label: "JD 已填写",
      done: !!state.jdText.trim(),
    },
    {
      label: "JD 已解析",
      done: !!state.jdAnalysisResult,
    },
    {
      label: "岗位已识别",
      done: !!state.detectedRole,
    },
    {
      label: "简历已填写",
      done: !!state.resumeText.trim(),
    },
    {
      label: "项目已选择",
      done: !!state.selectedProjectText.trim(),
    },
    {
      label: "简历摘要已生成",
      done: !!state.resumeSummary.trim(),
    },
  ];

  const doneCount = steps.filter((s) => s.done).length;

  const handleReset = () => {
    if (window.confirm("确定要重新开始吗？所有已填写的数据将被清空。")) {
      clearWorkflow();
    }
  };

  return (
    <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">
          工作流进度 ({doneCount}/{steps.length})
        </h3>
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          重新开始
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
              step.done
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-gray-50 text-gray-500 border border-gray-200"
            }`}
          >
            {step.done ? (
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-gray-400" />
            )}
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
}
