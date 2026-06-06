# CareerAgent

AI 求职简历优化与模拟面试助手

## 项目背景

大学生求职时普遍面临几个问题：看不懂 JD 里到底要什么人，简历写得像流水账不知道怎么优化，面试前找不到人练习。

CareerAgent 用 AI 串联了从 JD 分析到面试反馈的完整链路，让求职准备更高效。

## 目标用户

- 准备找实习/工作的大学生（大三/大四/研究生）
- 投递产品、运营、软件开发、AI 产品等岗位的同学
- 不知道怎么优化简历和准备面试的同学

## 核心功能

| 功能 | 说明 |
|------|------|
| JD 解析 | 粘贴 JD，提取岗位核心要求、关键词、面试关注点，自动识别岗位分类 |
| 简历诊断 | 评估简历与 JD 的匹配度，给出优化方向，结果自动用于后续流程 |
| 项目优化 | 根据 JD 解析结果自动匹配岗位优化策略，用 STAR 法则重写项目经历 |
| 模拟面试 | AI 面试官根据 JD 和简历自动提问，支持追问和即时反馈 |
| 反馈报告 | 综合评估面试表现，给出改进方向 |

## 产品工作流

```
JD 解析 → 简历诊断 → 项目优化 → 模拟面试 → 反馈报告
```

五步串联，前一步的输出自动流转到后一步。用户只需在第一步输入 JD、第二步输入简历，后续步骤自动复用，无需重复填写。

## 工作流数据贯通

- **JD 贯穿全流程**：第一步输入的 JD 自动带入简历诊断、项目优化和模拟面试
- **简历自动流转**：第二步输入的简历自动用于项目优化（提取项目经历）和模拟面试（生成简历摘要）
- **智能岗位分类**：自动识别 JD 中的岗位类型（AI 产品、前端、后端、算法、数据等 12 类），匹配对应的优化策略
- **状态持久化**：所有数据保存在 localStorage，刷新页面不丢失
- **进度可视化**：顶部展示工作流完成进度，支持一键重新开始

## 岗位分类与优化策略

系统支持自动识别以下岗位类型，并匹配针对性的优化策略：

| 岗位分类 | 优化重点 |
|----------|----------|
| AI 产品 | 需求分析、Prompt 工程、Agent、模型评估 |
| 产品经理 | 用户场景、需求分析、PRD、数据指标 |
| 前端开发 | 组件化、交互体验、性能优化 |
| 后端开发 | 接口设计、数据库、服务架构 |
| 算法工程师 | 数据处理、模型训练、实验评估 |
| 测试工程师 | 测试用例、自动化测试、质量保障 |
| 数据分析 | SQL、数据指标、数仓建设 |
| 运维/DevOps | 部署、监控、稳定性保障 |
| 安全工程师 | 漏洞分析、权限控制、风控策略 |
| 嵌入式开发 | 硬件交互、系统资源、实时性 |

## 技术栈

- React 19 + TypeScript 6
- Vite 8
- Tailwind CSS 4
- React Router 7
- Lucide React（图标库）
- 小米 MiMo API（Anthropic Messages 格式）
- GitHub Pages 部署

## 小米 MiMo API 接入

使用小米 MiMo 大模型 API，兼容 Anthropic Messages 格式。

- 请求地址：`https://token-plan-cn.xiaomimimo.com/anthropic/v1/messages`
- 模型名称：`mimo-v2-pro`
- 请求格式：Anthropic Messages
- 响应格式：从 `content` 数组中提取 `type: "text"` 的内容

API Key 由用户在设置页填写，保存在 localStorage，不会写入代码。

## Mock 模式

如果用户没有填写 API Key，系统自动使用演示模式，返回预设的 mock 数据。

演示模式下可以体验完整功能，适合快速了解产品。

## 本地运行

```bash
# 克隆项目
git clone https://github.com/novelufx/Repository-name-career-agent.git
cd Repository-name-career-agent

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问终端中显示的本地地址（通常是 http://localhost:5173/）查看项目。

## 在线 Demo

[在线体验](https://novelufx.github.io/Repository-name-career-agent/)

## 部署到 GitHub Pages

```bash
# 构建并部署
npm run build
npm run deploy
```

部署后访问：https://novelufx.github.io/Repository-name-career-agent/

注意：使用 HashRouter 替代 BrowserRouter，避免 GitHub Pages 刷新 404 问题。

## 项目结构

```
src/
├── components/
│   └── WorkflowProgress.tsx    # 工作流进度组件
├── context/
│   └── WorkflowContext.tsx     # 全局工作流状态管理
├── pages/
│   ├── Home/                   # 首页
│   ├── JDAnalysis/             # JD 解析页
│   ├── ResumeDiagnosis/        # 简历诊断页
│   ├── ProjectOptimizer/       # 项目优化页
│   ├── MockInterview/          # 模拟面试页
│   └── FeedbackReport/         # 反馈报告页
├── prompts/                    # AI Prompt 模板
├── services/
│   └── aiService.ts            # AI 服务（API + Mock 双模式）
└── utils/
    ├── roleClassifier.ts       # 岗位分类器
    ├── projectOptimizationStrategies.ts  # 项目优化策略
    ├── extractProjects.ts      # 项目经历提取
    └── extractResumeSummary.ts # 简历摘要生成
```

## 项目文档

- [产品需求文档 (PRD)](./docs/PRD.md)
- [竞品分析](./docs/competitor-analysis.md)
- [用户调研](./docs/user-research.md)
- [Prompt 设计](./docs/prompt-design.md)
- [效果评估设计](./docs/evaluation-report.md)
- [API 设计](./docs/api-design.md)

## 我的职责

- 需求分析：调研大学生求职痛点，确定产品方向
- 竞品调研：分析超级简历、牛客网、ChatGPT 等产品
- PRD 撰写：编写产品需求文档，定义功能和指标
- Prompt 设计：针对每个场景设计 Prompt，优化输出质量
- 前端开发：使用 React + TypeScript + Tailwind CSS 开发
- API 接入：接入小米 MiMo API，实现 mock/API 双模式
- 工作流设计：实现数据贯通、岗位分类、策略匹配等智能流程
- 部署上线：部署到 GitHub Pages

## 效果评估指标

简历诊断维度：JD 匹配度、关键词覆盖率、项目相关性、表达专业度

面试反馈维度：回答完整度、逻辑结构、岗位相关性、表达清晰度

详细说明见 [效果评估设计](./docs/evaluation-report.md)。

## 后续迭代

- 支持文件上传（PDF/Word 简历）
- 增加历史记录功能
- 支持更多岗位类型
- 增加用户反馈机制
- 优化 Prompt，提升 AI 分析准确性

## 安全说明

- API Key 只保存在用户浏览器的 localStorage，不会写入代码
- 不收集用户数据
- 不上传用户简历内容
- 所有数据处理在前端完成
