import { Link } from "react-router-dom";
import {
  FileText,
  UserCheck,
  Sparkles,
  MessageSquare,
  BarChart3,
  ArrowRight,
  Bot,
  Key,
  BookOpen,
  Shield,
  GitBranch,
} from "lucide-react";

const workflowSteps = [
  {
    icon: FileText,
    title: "JD 解析",
    description: "提取岗位核心要求、关键词、面试关注点",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: UserCheck,
    title: "简历诊断",
    description: "评估简历与 JD 的匹配度，找出优化方向",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Sparkles,
    title: "项目优化",
    description: "用 STAR 法则重写项目经历，生成多视角版本",
    color: "bg-cyan-100 text-cyan-600",
  },
  {
    icon: MessageSquare,
    title: "模拟面试",
    description: "AI 面试官根据简历和 JD 提问，即时反馈",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: BarChart3,
    title: "反馈报告",
    description: "综合评估面试表现，给出改进方向",
    color: "bg-orange-100 text-orange-600",
  },
];

const highlights = [
  {
    icon: Bot,
    title: "小米 MiMo 大模型接入",
    description: "使用小米 MiMo API，兼容 Anthropic Messages 格式",
  },
  {
    icon: Key,
    title: "Prompt Engineering",
    description: "针对每个场景设计专业 Prompt，确保输出质量",
  },
  {
    icon: Shield,
    title: "mock/API 双模式",
    description: "无 API Key 自动使用演示模式，体验完整功能",
  },
  {
    icon: BookOpen,
    title: "产品文档完整",
    description: "PRD、竞品分析、用户调研、Prompt 设计文档齐全",
  },
  {
    icon: GitBranch,
    title: "效果评估指标",
    description: "设计了评分维度体系，可量化评估 AI 输出质量",
  },
];

const responsibilities = [
  "需求分析",
  "竞品调研",
  "PRD 撰写",
  "Prompt 设计",
  "前端开发",
  "API 接入",
  "部署上线",
];

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-73px)]">
      {/* Hero 区 */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-7 h-7" />
              </div>
              <h1 className="text-5xl font-bold">CareerAgent</h1>
            </div>
            <p className="text-xl text-blue-100 mb-4">
              AI 求职简历优化与模拟面试助手
            </p>
            <p className="text-lg text-blue-200 mb-8 leading-relaxed">
              面向大学生求职场景，提供 JD 解析、简历诊断、项目优化、
              模拟面试、反馈报告五个功能，帮你高效准备求职。
            </p>
            <div className="flex gap-4">
              <Link
                to="/workflow/jd-analysis"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                开始体验
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="https://github.com/your-username/career-agent"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20"
              >
                查看项目文档
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 产品背景 */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            为什么做这个产品
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            大学生求职时普遍面临这些问题
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              JD 看不懂
            </h3>
            <p className="text-gray-600 text-sm">
              不知道岗位到底要什么人，不知道自己够不够格，投简历全靠感觉
            </p>

          </div>

          <div className="card text-center">
            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserCheck className="w-7 h-7 text-yellow-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              简历不会写
            </h3>
            <p className="text-gray-600 text-sm">
              项目经历写得像流水账，不知道怎么突出亮点，不知道怎么匹配 JD
            </p>

          </div>

          <div className="card text-center">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              面试没准备
            </h3>
            <p className="text-gray-600 text-sm">
              看了面经但不知道怎么练，找不到人模拟面试，不知道自己的回答怎么样
            </p>

          </div>
        </div>
      </section>

      {/* 核心功能 */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              核心功能
            </h2>
            <p className="text-gray-600">
              五个功能覆盖求职准备的完整链路
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="relative bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {index < workflowSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300">
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  )}
                  <div
                    className={`w-12 h-12 rounded-lg ${step.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    步骤 {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Agent 工作流 */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Agent 工作流
          </h2>
          <p className="text-gray-600">
            五步串联，前一步的输出是后一步的输入
          </p>

        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-16 h-16 rounded-xl ${step.color} flex items-center justify-center mb-2`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {step.title}
                  </span>
                </div>
                {index < workflowSteps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gray-400 hidden md:block" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 项目亮点 */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              项目亮点
            </h2>
            <p className="text-gray-600">
              体现 AI 产品能力和工程实践
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="text-center p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 我的职责 */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">我的职责</h2>
          <p className="text-gray-600">从需求分析到部署上线，独立完成全流程</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {responsibilities.map((item) => (
            <span
              key={item}
              className="px-6 py-3 bg-blue-50 text-blue-700 rounded-full font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* 技术栈 */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">技术栈</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              "React",
              "TypeScript",
              "Vite",
              "Tailwind CSS",
              "React Router",
              "小米 MiMo API",
              "Anthropic Messages",
              "GitHub Pages",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">准备好体验了吗？</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            试试粘贴一个 JD，看看 AI 怎么帮你分析岗位要求和简历匹配度
          </p>
          <Link
            to="/workflow/jd-analysis"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            开始体验
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-sm">
            CareerAgent - AI 求职简历优化与模拟面试助手
          </p>
          <p className="text-xs mt-2">
            基于 React + TypeScript + Tailwind CSS + 小米 MiMo 构建
          </p>
        </div>
      </footer>
    </div>
  );
}
