/**
 * 项目优化策略
 * 根据 roleCategory 返回对应的优化策略
 */

import type { RoleCategory } from "./roleClassifier";

export interface OptimizationStrategy {
  categoryName: string;
  focusPoints: string[];
  keywordsToHighlight: string[];
  bulletStyle: string;
  evaluationFocus: string[];
}

/**
 * 各岗位分类的优化策略
 */
const STRATEGIES: Record<RoleCategory, OptimizationStrategy> = {
  ai_product: {
    categoryName: "AI 产品",
    focusPoints: [
      "需求分析与用户场景拆解",
      "Prompt Engineering 或 Agent 设计经验",
      "大模型能力边界理解",
      "AI 产品效果评估与迭代",
      "跨团队协作推动 AI 功能落地",
    ],
    keywordsToHighlight: [
      "需求分析", "Prompt", "Agent", "大模型", "AI产品",
      "效果评估", "用户场景", "PRD", "数据驱动", "模型优化",
    ],
    bulletStyle: "强调产品思维 + AI 技术理解 + 数据驱动决策",
    evaluationFocus: [
      "是否体现对 AI 技术的理解深度",
      "是否有数据驱动的决策过程",
      "是否展示了产品方法论",
      "是否量化了产品效果",
    ],
  },

  product: {
    categoryName: "产品",
    focusPoints: [
      "用户需求分析与场景拆解",
      "产品设计与 PRD 输出能力",
      "数据指标定义与分析",
      "跨团队协调推进能力",
      "竞品分析与行业洞察",
    ],
    keywordsToHighlight: [
      "需求分析", "用户研究", "PRD", "原型设计", "数据指标",
      "用户增长", "转化率", "留存", "竞品分析", "Figma", "Axure",
    ],
    bulletStyle: "强调用户洞察 + 产品方法论 + 可量化成果",
    evaluationFocus: [
      "是否展示了用户思维",
      "是否有完整的产品方法论",
      "成果是否可量化",
      "是否体现了跨团队协作",
    ],
  },

  frontend: {
    categoryName: "前端开发",
    focusPoints: [
      "组件化开发与架构设计",
      "交互体验优化",
      "性能优化与工程化",
      "跨端或响应式适配",
      "与后端接口联调经验",
    ],
    keywordsToHighlight: [
      "React", "Vue", "TypeScript", "组件", "性能优化",
      "Webpack", "Vite", "小程序", "响应式", "用户体验",
      "首屏加载", "懒加载", "SSR",
    ],
    bulletStyle: "强调技术选型 + 性能数据 + 用户体验提升",
    evaluationFocus: [
      "是否展示了技术深度",
      "是否有性能优化的具体数据",
      "是否体现了工程化思维",
      "项目是否有实际用户",
    ],
  },

  backend: {
    categoryName: "后端开发",
    focusPoints: [
      "系统架构设计能力",
      "接口设计与数据库优化",
      "高并发与高可用方案",
      "服务端性能优化",
      "微服务或分布式系统经验",
    ],
    keywordsToHighlight: [
      "接口设计", "数据库", "Redis", "缓存", "微服务",
      "高并发", "高可用", "分布式", "消息队列", "API",
      "SQL优化", "索引", "分库分表",
    ],
    bulletStyle: "强调架构设计 + 性能数据 + 系统稳定性",
    evaluationFocus: [
      "是否展示了系统设计能力",
      "是否有性能优化的具体数据",
      "是否考虑了高可用和扩展性",
      "是否体现了工程规范",
    ],
  },

  general_dev: {
    categoryName: "软件开发",
    focusPoints: [
      "项目架构与技术选型",
      "代码质量与工程规范",
      "问题分析与解决能力",
      "跨模块协作经验",
      "技术文档与知识沉淀",
    ],
    keywordsToHighlight: [
      "架构设计", "技术选型", "代码质量", "单元测试",
      "重构", "性能优化", "文档", "CI/CD",
    ],
    bulletStyle: "强调技术能力 + 工程实践 + 成果量化",
    evaluationFocus: [
      "是否展示了全面的技术能力",
      "是否有完整的项目经验",
      "是否体现了工程化思维",
    ],
  },

  algorithm: {
    categoryName: "算法",
    focusPoints: [
      "模型选择与调优经验",
      "数据处理与特征工程",
      "实验设计与效果评估",
      "论文阅读与技术调研",
      "模型部署与线上优化",
    ],
    keywordsToHighlight: [
      "模型训练", "PyTorch", "TensorFlow", "准确率", "召回率",
      "F1", "AUC", "特征工程", "数据增强", "超参调优",
      "Transformer", "BERT", "GPT",
    ],
    bulletStyle: "强调算法理解 + 实验数据 + 模型效果",
    evaluationFocus: [
      "是否展示了算法理解深度",
      "是否有实验对比数据",
      "是否考虑了实际应用场景",
    ],
  },

  testing: {
    categoryName: "测试",
    focusPoints: [
      "测试用例设计能力",
      "自动化测试框架使用",
      "性能测试与压力测试",
      "缺陷分析与质量保障",
      "测试流程优化",
    ],
    keywordsToHighlight: [
      "测试用例", "自动化测试", "Selenium", "Pytest",
      "性能测试", "压力测试", "缺陷管理", "质量保障",
      "回归测试", "接口测试",
    ],
    bulletStyle: "强调测试覆盖率 + 发现的问题 + 质量提升",
    evaluationFocus: [
      "是否展示了系统性的测试思维",
      "是否有自动化测试经验",
      "是否提升了产品质量",
    ],
  },

  data: {
    categoryName: "数据分析",
    focusPoints: [
      "数据提取与清洗能力",
      "指标体系设计",
      "数据可视化与报告",
      "业务洞察与建议",
      "数仓建设经验",
    ],
    keywordsToHighlight: [
      "SQL", "数据分析", "指标", "数据可视化", "Tableau",
      "数据仓库", "Hive", "Spark", "ETL", "BI",
      "漏斗分析", "留存分析", "A/B测试",
    ],
    bulletStyle: "强调数据洞察 + 业务影响 + 分析方法论",
    evaluationFocus: [
      "是否展示了数据分析能力",
      "是否提出了业务建议",
      "是否使用了合适的分析方法",
    ],
  },

  devops: {
    categoryName: "运维",
    focusPoints: [
      "部署与发布流程",
      "监控与告警体系",
      "系统稳定性保障",
      "自动化运维工具",
      "故障处理与复盘",
    ],
    keywordsToHighlight: [
      "Docker", "Kubernetes", "K8s", "CI/CD", "Jenkins",
      "监控", "告警", "Linux", "Nginx", "负载均衡",
      "灰度发布", "故障恢复",
    ],
    bulletStyle: "强调稳定性指标 + 自动化程度 + 故障处理",
    evaluationFocus: [
      "是否展示了系统稳定性保障能力",
      "是否有自动化运维经验",
      "是否有效处理过线上故障",
    ],
  },

  security: {
    categoryName: "安全",
    focusPoints: [
      "漏洞发现与修复",
      "安全审计与合规",
      "权限与访问控制",
      "安全防护方案设计",
      "应急响应能力",
    ],
    keywordsToHighlight: [
      "漏洞", "渗透测试", "XSS", "SQL注入", "CSRF",
      "权限控制", "加密", "安全审计", "风控", "WAF",
    ],
    bulletStyle: "强调安全发现 + 防护方案 + 风险降低",
    evaluationFocus: [
      "是否展示了安全技术深度",
      "是否有实际漏洞发现经验",
      "是否设计了有效的防护方案",
    ],
  },

  embedded: {
    categoryName: "嵌入式",
    focusPoints: [
      "硬件与软件协同开发",
      "系统资源优化",
      "实时性与可靠性保障",
      "驱动开发经验",
      "通信协议理解",
    ],
    keywordsToHighlight: [
      "嵌入式", "ARM", "RTOS", "单片机", "STM32",
      "驱动开发", "中断", "DMA", "SPI", "I2C", "UART",
      "物联网", "低功耗",
    ],
    bulletStyle: "强调硬件理解 + 资源优化 + 实时性保障",
    evaluationFocus: [
      "是否展示了硬件理解能力",
      "是否有资源优化经验",
      "是否考虑了实时性和可靠性",
    ],
  },

  other: {
    categoryName: "通用",
    focusPoints: [
      "项目完整度",
      "个人贡献与角色",
      "可量化的成果",
      "问题解决能力",
      "团队协作经验",
    ],
    keywordsToHighlight: [
      "项目经验", "团队协作", "问题解决", "成果量化",
    ],
    bulletStyle: "强调个人贡献 + 成果量化 + 方法论",
    evaluationFocus: [
      "是否展示了完整的项目经验",
      "是否有可量化的成果",
      "是否体现了个人价值",
    ],
  },
};

/**
 * 获取指定岗位分类的优化策略
 */
export function getOptimizationStrategy(roleCategory: RoleCategory): OptimizationStrategy {
  return STRATEGIES[roleCategory] || STRATEGIES.other;
}

/**
 * 获取所有策略列表（用于展示）
 */
export function getAllStrategies(): Array<{ category: RoleCategory; strategy: OptimizationStrategy }> {
  return Object.entries(STRATEGIES).map(([category, strategy]) => ({
    category: category as RoleCategory,
    strategy,
  }));
}
