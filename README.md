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
| JD 解析 | 粘贴 JD，提取岗位核心要求、关键词、面试关注点 |
| 简历诊断 | 评估简历与 JD 的匹配度，给出优化方向 |
| 项目优化 | 用 STAR 法则重写项目经历，生成多视角版本 |
| 模拟面试 | AI 面试官根据简历和 JD 提问，即时反馈 |
| 反馈报告 | 综合评估面试表现，给出改进方向 |

## 产品工作流

```
JD 解析 → 简历诊断 → 项目优化 → 模拟面试 → 反馈报告
```

五步串联，前一步的输出是后一步的输入。

## 技术栈

- React + TypeScript
- Vite
- Tailwind CSS
- React Router
- 小米 MiMo API（Anthropic Messages 格式）
- GitHub Pages 部署

## 小米 MiMo API 接入

使用小米 MiMo 大模型 API，兼容 Anthropic Messages 格式。

- 请求地址：`https://token-plan-cn.xiaomimimo.com/anthropic/v1/messages`
- 请求格式：Anthropic Messages
- 响应格式：从 `content` 数组中提取 `type: "text"` 的内容

API Key 由用户在设置页填写，保存在 localStorage，不会写入代码。

## Mock 模式

如果用户没有填写 API Key，系统自动使用演示模式，返回预设的 mock 数据。

演示模式下可以体验完整功能，适合快速了解产品。

## 本地运行

```bash
# 克隆项目
git clone https://github.com/your-username/career-agent.git
cd career-agent

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:5173/ 查看项目。

## 在线 Demo

[在线体验](https://novelufx.github.io/career-agent/)

## 部署到 GitHub Pages

```bash
# 构建并部署
npm run build
npm run deploy
```

部署后访问：https://novelufx.github.io/career-agent/

注意：使用 HashRouter 替代 BrowserRouter，避免 GitHub Pages 刷新 404 问题。

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
- 部署上线：部署到 GitHub Pages

## 效果评估指标

简历诊断维度：JD 匹配度、关键词覆盖率、项目相关性、表达专业度

面试反馈维度：回答完整度、逻辑结构、岗位相关性、表达清晰度

详细说明见 [效果评估设计](./docs/evaluation-report.md)。

## 后续迭代

- 优化 Prompt，提升 AI 分析准确性
- 支持文件上传（PDF/Word 简历）
- 增加历史记录功能
- 支持更多岗位类型
- 增加用户反馈机制

## 安全说明

- API Key 只保存在用户浏览器的 localStorage，不会写入代码
- 不收集用户数据
- 不上传用户简历内容
- 所有数据处理在前端完成
