/**
 * 岗位分类工具
 * 根据 JD 文本、岗位名称、关键词识别 roleCategory
 */

export type RoleCategory =
  | "ai_product"
  | "product"
  | "frontend"
  | "backend"
  | "general_dev"
  | "algorithm"
  | "testing"
  | "data"
  | "devops"
  | "security"
  | "embedded"
  | "other";

export interface RoleClassification {
  roleCategory: RoleCategory;
  detectedRole: string;
  confidence: number;
}

interface CategoryConfig {
  title: string[];
  keywords: string[];
  /** 岗位标题区域出现这些词时额外加分，用于区分相近岗位 */
  boostInTitle?: string[];
}

/**
 * 岗位分类关键词映射
 * 注意：keywords 中不要和 title 重复，否则会被去重跳过
 */
const CATEGORY_KEYWORDS: Record<RoleCategory, CategoryConfig> = {
  ai_product: {
    title: [
      "ai 产品", "ai产品", "人工智能产品", "大模型产品", "aigc产品",
      "ai产品经理", "ai 产品实习生", "ai产品实习生", "aigc产品经理", "大模型pm",
    ],
    keywords: [
      "prompt", "agent", "llm", "aigc", "chatgpt", "人工智能",
      "智能体", "rag", "fine-tune", "微调", "多模态", "大模型应用",
    ],
    boostInTitle: ["ai", "人工智能", "大模型", "aigc", "智能"],
  },
  product: {
    title: [
      "产品经理", "产品实习生", "产品运营",
      "c端产品", "b端产品", "策略产品", "数据产品",
    ],
    keywords: [
      "prd", "原型", "用户研究", "竞品分析", "用户画像",
      "用户场景", "abtest", "a/b test", "转化率", "留存",
      "需求分析", "产品设计",
    ],
  },
  frontend: {
    title: ["前端开发", "前端工程师", "web前端", "前端实习", "小程序开发", "h5开发", "页面开发"],
    keywords: ["react", "vue", "javascript", "typescript", "html", "css", "小程序", "h5", "组件", "webpack", "vite", "next.js", "nuxt"],
  },
  backend: {
    title: ["后端开发", "后端工程师", "服务端开发", "java开发", "python开发", "go开发", "后端实习"],
    keywords: ["java", "python", "go", "spring", "django", "flask", "node.js", "mysql", "redis", "微服务", "api", "接口", "数据库"],
  },
  general_dev: {
    title: ["软件开发", "软件工程师", "开发工程师", "全栈", "研发", "c++开发", "c开发"],
    keywords: ["软件开发", "全栈", "研发", "系统设计", "架构"],
  },
  algorithm: {
    title: ["算法工程师", "机器学习", "深度学习", "nlp", "cv", "算法实习", "ai算法"],
    keywords: ["机器学习", "深度学习", "pytorch", "tensorflow", "模型训练", "算法", "nlp", "cv", "transformer", "bert", "gpt"],
  },
  testing: {
    title: ["测试工程师", "测试开发", "qa", "质量保障", "测试实习"],
    keywords: ["测试用例", "自动化测试", "性能测试", "selenium", "pytest", "质量保障", "缺陷管理"],
  },
  data: {
    title: ["数据分析师", "数据工程师", "bi", "数据产品", "数据实习", "数仓"],
    keywords: ["sql", "数据分析", "数据仓库", "hive", "spark", "指标", "bi", "etl", "数仓"],
  },
  devops: {
    title: ["运维工程师", "devops", "sre", "运维实习", "云运维"],
    keywords: ["运维", "部署", "docker", "kubernetes", "k8s", "监控", "linux", "ci/cd", "稳定性"],
  },
  security: {
    title: ["安全工程师", "网络安全", "信息安全", "安全实习", "渗透测试"],
    keywords: ["安全", "漏洞", "渗透", "风控", "权限", "加密", "防火墙"],
  },
  embedded: {
    title: ["嵌入式", "嵌入式开发", "嵌入式工程师", "iot", "物联网", "嵌入式实习"],
    keywords: ["嵌入式", "单片机", "arm", "rtos", "硬件", "物联网", "iot", "驱动开发"],
  },
  other: {
    title: [],
    keywords: [],
  },
};

/**
 * 更具体的分类优先级（同分时排在前面的胜出）
 */
const SPECIFICITY_PRIORITY: RoleCategory[] = [
  "ai_product", "algorithm", "frontend", "backend", "embedded",
  "security", "devops", "testing", "data", "product", "general_dev", "other",
];

/**
 * 从 JD 文本中识别岗位分类
 */
export function classifyRole(jdText: string): RoleClassification {
  const text = jdText.toLowerCase();

  // 尝试从 JD 中提取岗位名称（通常在第一行或前几行）
  const detectedRole = extractJobTitle(jdText);

  // JD 前 200 字（通常是职位名称区域）
  const titleArea = text.substring(0, 200);

  // 计算每个分类的匹配分数
  const scores: Partial<Record<RoleCategory, number>> = {};

  for (const [category, config] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    const matchedTitles = new Set<string>();

    // 岗位名称匹配（权重更高）
    for (const title of config.title) {
      if (text.includes(title)) {
        score += 10;
        matchedTitles.add(title);
      }
    }

    // 关键词匹配（排除已作为 title 匹配过的词，避免重复计分）
    for (const keyword of config.keywords) {
      if (matchedTitles.has(keyword)) continue;
      if (text.includes(keyword)) {
        score += 2;
      }
    }

    // boost：岗位标题区域出现特定关键词时额外加分
    if (config.boostInTitle) {
      for (const bk of config.boostInTitle) {
        if (titleArea.includes(bk)) {
          score += 5;
        }
      }
    }

    if (score > 0) {
      scores[category as RoleCategory] = score;
    }
  }

  // 按优先级选择最高分（更具体的分类在同分时胜出）
  let bestCategory: RoleCategory = "other";
  let bestScore = 0;

  for (const category of SPECIFICITY_PRIORITY) {
    const score = scores[category] ?? 0;
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return {
    roleCategory: bestCategory,
    detectedRole: detectedRole || getCategoryDisplayName(bestCategory),
    confidence: Math.min(bestScore / 10, 1),
  };
}

/**
 * 从 JD 文本中提取岗位名称
 */
function extractJobTitle(jdText: string): string {
  const lines = jdText.split("\n").map((l) => l.trim()).filter(Boolean);

  // 常见的岗位名称模式
  const patterns = [
    /职位[：:]\s*(.+)/,
    /岗位[：:]\s*(.+)/,
    /岗位名称[：:]\s*(.+)/,
    /招聘[：:]\s*(.+)/,
  ];

  for (const line of lines.slice(0, 5)) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        return match[1].trim();
      }
    }
  }

  // 如果没有明确的标签，尝试从第一行提取
  if (lines.length > 0) {
    const firstLine = lines[0];
    // 如果第一行比较短且不像普通句子，可能是岗位名称
    if (firstLine.length < 30 && !firstLine.includes("。")) {
      return firstLine;
    }
  }

  return "";
}

/**
 * 获取岗位分类的中文显示名
 */
export function getCategoryDisplayName(category: RoleCategory): string {
  const names: Record<RoleCategory, string> = {
    ai_product: "AI 产品",
    product: "产品",
    frontend: "前端开发",
    backend: "后端开发",
    general_dev: "软件开发",
    algorithm: "算法",
    testing: "测试",
    data: "数据分析",
    devops: "运维",
    security: "安全",
    embedded: "嵌入式",
    other: "其他",
  };
  return names[category] || "其他";
}
