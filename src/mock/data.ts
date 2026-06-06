/**
 * CareerAgent Mock 数据
 * 覆盖五个核心功能的演示数据
 */

// ==================== JD 分析 ====================

export interface JDAnalysisResult {
  jobTitle: string;
  company: string;
  location: string;
  salaryRange: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
  interviewFocus: string[];
  summary: string;
}

export const mockJDAnalysis: JDAnalysisResult = {
  jobTitle: "AI 产品实习生",
  company: "字节跳动",
  location: "北京",
  salaryRange: "200-300/天",
  responsibilities: [
    "参与 AI 产品需求分析和方案设计",
    "协助完成产品原型和 PRD 文档",
    "跟进 AI 模型效果评估和优化",
    "协调研发、设计、测试团队推进项目",
    "分析用户反馈，提出产品改进建议",
  ],
  requiredSkills: [
    "产品设计能力",
    "AI/大模型基础理解",
    "数据分析能力",
    "PRD 文档撰写",
  ],
  preferredSkills: ["原型设计工具", "Python/SQL"],
  keywords: ["AI 产品", "需求分析", "PRD", "数据分析", "大模型"],
  interviewFocus: [
    "对 AI 产品的理解和思考",
    "产品设计的方法论",
    "数据分析的实践经验",
    "团队协作和沟通能力",
  ],
  summary:
    "这是一个 AI 产品实习岗位，核心要求是理解 AI 技术、会做产品设计、能做数据分析。适合有产品基础、对 AI 感兴趣的同学。",
};

// ==================== 简历诊断 ====================

export interface ResumeDiagnosisResult {
  matchScore: number;
  keywordCoverage: {
    covered: string[];
    missing: string[];
  };
  dimensionScores: {
    dimension: string;
    score: number;
    feedback: string;
  }[];
  strengths: {
    area: string;
    detail: string;
    evidence: string;
  }[];
  weaknesses: {
    area: string;
    detail: string;
    suggestion: string;
  }[];
  optimizationSuggestions: {
    priority: "high" | "medium" | "low";
    category: string;
    suggestion: string;
    example: string;
  }[];
  summary: string;
}

export const mockResumeDiagnosis: ResumeDiagnosisResult = {
  matchScore: 68,
  keywordCoverage: {
    covered: ["需求分析", "数据分析", "用户增长"],
    missing: ["AI 产品", "大模型", "PRD", "效果评估"],
  },
  dimensionScores: [
    {
      dimension: "JD 匹配度",
      score: 62,
      feedback: "简历与 JD 的核心要求匹配度一般，缺少 AI 产品相关关键词",
    },
    {
      dimension: "关键词覆盖率",
      score: 58,
      feedback: "覆盖了 3/7 个关键词，缺少 AI 产品、大模型、PRD 等关键词",
    },
    {
      dimension: "项目相关性",
      score: 72,
      feedback: "项目经历与产品岗位相关，但需要补充 AI 项目经验",
    },
    {
      dimension: "表达专业度",
      score: 70,
      feedback: "表达清晰，但部分描述可以更专业，建议使用 STAR 法则",
    },
  ],
  strengths: [
    {
      area: "产品设计能力",
      detail: "有小程序产品设计经验，参与过需求分析和原型设计",
      evidence: "负责 xx 小程序用户增长，通过裂变活动实现用户从 100 到 1000",
    },
    {
      area: "数据分析意识",
      detail: "有数据驱动的意识，会关注核心指标",
      evidence: "提到'日活提升 300%'、'转化率提升 15%'",
    },
  ],
  weaknesses: [
    {
      area: "AI 技术理解",
      detail: "简历中没有体现对 AI/大模型的理解",
      suggestion:
        "补充 AI 相关的学习经历或项目经验，如使用过 ChatGPT、了解 prompt 工程",
    },
    {
      area: "PRD 文档能力",
      detail: "没有提到 PRD 撰写经验",
      suggestion:
        "补充 PRD 文档撰写经历，或说明使用过哪些产品工具（如 Axure、Figma）",
    },
  ],
  optimizationSuggestions: [
    {
      priority: "high",
      category: "补充 AI 相关经历",
      suggestion: "在简历中补充 AI 相关的学习或实践经历",
      example: "自学 ChatGPT prompt 工程，完成 10+ 个 AI 产品案例分析",
    },
    {
      priority: "high",
      category: "优化项目描述",
      suggestion: "使用 STAR 法则重写项目经历，突出量化成果",
      example:
        "主导 xx 小程序用户增长策略，通过裂变活动和社群运营，3 个月内实现用户从 100 到 1000 的增长，日活提升 300%",
    },
  ],
  summary:
    "简历整体匹配度 68 分，主要优势是产品设计和数据分析意识，主要短板是缺乏 AI 相关经历和 PRD 文档能力。",
};

// ==================== 项目优化 ====================

export interface ProjectOptimizationResult {
  original: string;
  bulletVersion: string;
    jdMatchAnalysis?: string;
  starVersion: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  optimized: {
    version: string;
    description: string;
    suitableFor: string;
  }[];
  improvements: {
    aspect: string;
    before: string;
    after: string;
    reason: string;
  }[];
  keywordsAdded: string[];
  keywordSuggestions?: string[];
  interviewerFollowUps?: string[];
  dataSuggestions?: string[];
  honestyWarnings?: string[];
}

export const mockProjectOptimization: ProjectOptimizationResult = {
  original: "负责 xx 小程序的用户增长，通过活动实现用户从 100 到 1000。",
  bulletVersion:
    "主导 xx 小程序用户增长策略，通过裂变活动和社群运营，3 个月内实现用户从 100 到 1000 的增长，日活提升 300%，用户留存率提升至 45%。",
  starVersion: {
    situation:
      "xx 小程序上线初期，用户基数小（100 人），增长缓慢，需要快速提升用户规模",
    task: "负责制定用户增长策略，设计裂变活动方案，目标是 3 个月内实现用户 10 倍增长",
    action:
      "1. 分析目标用户画像，发现核心需求；2. 设计裂变活动机制，降低分享门槛；3. 协调研发团队开发分享功能；4. 通过社群运营激活种子用户",
    result:
      "3 个月内实现用户从 100 到 1000 的增长，日活提升 300%，用户留存率提升至 45%，活动成本控制在 500 元以内",
  },
  optimized: [
    {
      version: "产品视角",
      description:
        "主导 xx 小程序用户增长策略，通过用户调研发现核心需求，设计裂变活动方案，协调研发团队落地实现，3 个月内实现用户从 100 到 1000 的增长，日活提升 300%，用户留存率提升至 45%。",
      suitableFor: "AI 产品实习生、产品实习生",
    },
    {
      version: "技术视角",
      description:
        "参与 xx 小程序开发，负责用户增长模块的技术实现，设计并开发裂变分享功能，优化分享链路的转化效率，实现用户从 100 到 1000 的增长，分享转化率提升至 15%。",
      suitableFor: "软件开发实习生、前端开发实习生",
    },
  ],
  improvements: [
    {
      aspect: "量化成果",
      before: "实现用户从 100 到 1000",
      after: "3 个月内实现用户从 100 到 1000 的增长，日活提升 300%",
      reason: "加入时间维度和日活数据，让成果更有说服力",
    },
    {
      aspect: "方法论",
      before: "通过活动实现",
      after: "通过用户调研发现核心需求，设计裂变活动方案",
      reason: "体现产品思维和方法论，而不是简单的执行",
    },
    {
      aspect: "角色定位",
      before: "负责",
      after: "主导",
      reason: "体现 ownership 和主导能力",
    },
  ],
  keywordsAdded: ["用户调研", "裂变活动", "用户增长", "留存率", "日活"],
};

// ==================== 模拟面试 ====================

export interface InterviewQuestion {
  question: string;
  type: "technical" | "behavioral" | "situational";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  intent: string;
  keyPoints: string[];
  sampleAnswer: string;
  followUp: string[];
}

export const mockInterviewQuestions: InterviewQuestion[] = [
  {
    question: "请介绍一下你做的 xx 小程序项目，你在其中扮演什么角色？",
    type: "behavioral",
    difficulty: "easy",
    category: "项目经历",
    intent: "考察候选人的项目经历真实性和角色定位",
    keyPoints: [
      "清晰描述项目背景和目标",
      "说明自己的具体职责",
      "体现主导能力和 ownership",
    ],
    sampleAnswer:
      "xx 小程序是一个校园社交产品，我在其中担任产品经理角色，负责用户增长模块。我主导了用户增长策略的制定，通过用户调研发现核心需求，设计了裂变活动方案，协调研发团队落地实现。3 个月内实现用户从 100 到 1000 的增长。",
    followUp: [
      "你是怎么想到用裂变活动来实现用户增长的？",
      "在项目中遇到的最大挑战是什么？",
    ],
  },
  {
    question: "你是怎么想到用裂变活动来实现用户增长的？有没有考虑过其他方案？",
    type: "behavioral",
    difficulty: "medium",
    category: "产品思维",
    intent: "考察候选人的产品思维和决策过程",
    keyPoints: [
      "说明决策的依据和思考过程",
      "提到对比分析其他方案",
      "体现数据驱动的决策方式",
    ],
    sampleAnswer:
      "我首先分析了目标用户画像，发现主要是大学生，社交需求强，但对新产品的信任度低。我对比了三种方案：广告投放、KOL 合作、裂变活动。广告投放成本高，KOL 合作周期长，裂变活动成本低、见效快，更适合我们这个阶段。我设计了'邀请好友得积分'的机制，降低了分享门槛。",
    followUp: [
      "裂变活动的具体机制是怎么设计的？",
      "如何衡量裂变活动的效果？",
    ],
  },
  {
    question: "如果让你设计一个 AI 产品的用户增长策略，你会怎么做？",
    type: "situational",
    difficulty: "hard",
    category: "AI 产品",
    intent: "考察候选人对 AI 产品的理解和产品设计能力",
    keyPoints: [
      "体现对 AI 产品特点的理解",
      "说明 AI 产品与传统产品的区别",
      "给出具体的策略和方法",
    ],
    sampleAnswer:
      "AI 产品和传统产品最大的区别是，AI 产品的核心价值是'智能'，用户增长的关键是让用户感受到 AI 的价值。我会从三个方面入手：1. 设计'AI 体验点'，让用户第一次使用就能感受到 AI 的价值；2. 设计'AI 成长机制'，让 AI 随着使用越来越懂用户；3. 设计'AI 分享场景'，让用户愿意分享 AI 的使用体验。",
    followUp: [
      "你能举一个具体的 AI 产品增长案例吗？",
      "如何平衡 AI 的能力和成本？",
    ],
  },
  {
    question: "你认为 AI 产品经理和传统产品经理最大的区别是什么？",
    type: "technical",
    difficulty: "medium",
    category: "岗位理解",
    intent: "考察候选人对 AI 产品岗位的理解深度",
    keyPoints: [
      "理解 AI 技术的特点和限制",
      "知道 AI 产品的设计原则",
      "体现对 AI 产品的思考",
    ],
    sampleAnswer:
      "我认为最大的区别是对技术的理解深度。传统产品经理主要关注用户体验和商业价值，AI 产品经理还需要理解 AI 技术的能力边界。比如，AI 模型的准确率、响应速度、成本等因素都会影响产品设计。AI 产品经理需要在技术限制和用户体验之间找到平衡点。",
    followUp: [
      "你对大模型技术有了解吗？",
      "如何评估 AI 功能的效果？",
    ],
  },
  {
    question: "你最近关注到哪些 AI 产品？有什么观察和思考？",
    type: "behavioral",
    difficulty: "easy",
    category: "行业认知",
    intent: "考察候选人对行业的关注度和思考深度",
    keyPoints: [
      "展示对行业的持续关注",
      "有自己独立的观察和思考",
      "能联系到自己的产品工作",
    ],
    sampleAnswer:
      "我最近在关注 Kimi 和豆包这两个产品。Kimi 的长文本处理能力很强，但用户体验上还有优化空间，比如对话历史的管理。豆包的多模态能力不错，但 AI 的回答有时候太'安全'，缺乏个性。我觉得 AI 产品的一个挑战是，如何在'安全'和'有用'之间找到平衡。",
    followUp: [
      "你觉得这两个产品的目标用户有什么区别？",
      "如果你来改进 Kimi，你会怎么做？",
    ],
  },
];

// ==================== 反馈报告 ====================

export interface FeedbackReportResult {
  overallScore: number;
  dimensionScores: {
    dimension: string;
    score: number;
    feedback: string;
  }[];
  highlights: {
    question: string;
    answer: string;
    reason: string;
  }[];
  issues: {
    question: string;
    answer: string;
    problem: string;
    suggestion: string;
  }[];
  optimizationSuggestions: {
    category: string;
    suggestion: string;
    example: string;
  }[];
  improvedAnswers: {
    question: string;
    originalAnswer: string;
    improvedAnswer: string;
    improvement: string;
  }[];
  summary: string;
}

export const mockFeedbackReport: FeedbackReportResult = {
  overallScore: 72,
  dimensionScores: [
    {
      dimension: "回答完整度",
      score: 75,
      feedback: "覆盖了问题的核心要点，但部分细节可以补充",
    },
    {
      dimension: "逻辑结构",
      score: 70,
      feedback: "有基本的逻辑框架，但部分回答缺乏层次感，建议使用 STAR 法则",
    },
    {
      dimension: "岗位相关性",
      score: 68,
      feedback: "对 AI 产品岗位有基本理解，但深度不够，需要补充 AI 技术相关知识",
    },
    {
      dimension: "表达清晰度",
      score: 78,
      feedback: "整体表达清晰，逻辑连贯，但部分回答可以更简洁",
    },
  ],
  highlights: [
    {
      question: "请介绍一下你做的 xx 小程序项目",
      answer: "主导了用户增长策略的制定，通过用户调研发现核心需求",
      reason: "体现了产品思维和方法论，不是简单的执行",
    },
    {
      question: "你认为 AI 产品经理和传统产品经理最大的区别是什么？",
      answer: "AI 产品经理还需要理解 AI 技术的能力边界",
      reason: "对 AI 产品岗位有深入理解，不是泛泛而谈",
    },
  ],
  issues: [
    {
      question: "你是怎么想到用裂变活动来实现用户增长的？",
      answer: "我觉得裂变活动成本低、见效快",
      problem: "缺乏决策依据的详细说明，没有展示思考过程",
      suggestion: "补充对比分析其他方案的过程，说明为什么裂变活动是最优选择",
    },
    {
      question: "如果让你设计一个 AI 产品的用户增长策略",
      answer: "设计 AI 体验点、AI 成长机制、AI 分享场景",
      problem: "回答偏理论，缺乏具体案例支撑",
      suggestion: "结合具体的 AI 产品案例，说明这些策略如何落地",
    },
  ],
  optimizationSuggestions: [
    {
      category: "回答结构",
      suggestion: "使用 STAR 法则组织回答，让回答更有层次感",
      example:
        "先说背景（Situation），再说任务（Task），然后说行动（Action），最后说结果（Result）",
    },
    {
      category: "案例支撑",
      suggestion: "为每个观点准备具体案例，增强说服力",
      example:
        "提到'数据驱动'时，说明具体用了哪些数据、怎么分析的、得出了什么结论",
    },
    {
      category: "AI 产品理解",
      suggestion: "补充对 AI 技术的理解，展示 AI 产品思维",
      example:
        "提到 AI 产品时，说明对大模型、prompt 工程、效果评估的理解",
    },
  ],
  improvedAnswers: [
    {
      question: "你是怎么想到用裂变活动来实现用户增长的？",
      originalAnswer: "我觉得裂变活动成本低、见效快",
      improvedAnswer:
        "我首先分析了目标用户画像，发现主要是大学生，社交需求强，但对新产品的信任度低。我对比了三种方案：广告投放成本高、KOL 合作周期长、裂变活动成本低见效快。最终选择了裂变活动，并设计了'邀请好友得积分'的机制。",
      improvement: "补充了决策过程和对比分析，体现了产品思维",
    },
  ],
  summary:
    "整体表现中等偏上，表达清晰度和回答完整度较好，主要短板是逻辑结构和案例支撑。建议使用 STAR 法则组织回答，为每个观点准备具体案例。",
};

// ==================== 辅助函数 ====================

/** 模拟延迟 */
export const mockDelay = (ms: number = 1500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** 预设的 JD 示例 */
export const sampleJDs = {
  aiProduct: `职位：AI 产品实习生
公司：字节跳动
部门：AI 产品部
工作地点：北京

岗位职责：
1. 参与 AI 产品需求分析和方案设计
2. 协助完成产品原型和 PRD 文档
3. 跟进 AI 模型效果评估和优化
4. 协调研发、设计、测试团队推进项目
5. 分析用户反馈，提出产品改进建议

任职要求：
1. 本科及以上学历，计算机、产品设计等相关专业优先
2. 有产品实习经验优先
3. 了解 AI/大模型基础知识
4. 熟练使用 Figma、Axure 等原型设计工具
5. 有数据分析能力，熟悉 SQL、Excel
6. 良好的沟通能力和团队协作能力

薪资：200-300/天`,

  frontend: `职位：前端开发实习生
公司：腾讯
部门：微信事业群
工作地点：广州

岗位职责：
1. 负责微信小程序前端开发
2. 参与前端架构设计和优化
3. 编写技术文档和单元测试
4. 协助解决线上问题

任职要求：
1. 本科及以上学历，计算机相关专业
2. 熟悉 React/Vue 等前端框架
3. 了解 TypeScript
4. 有小程序开发经验优先
5. 良好的编码习惯和团队协作能力

薪资：250-350/天`,

  product: `职位：产品实习生
公司：阿里巴巴
部门：淘宝事业群
工作地点：杭州

岗位职责：
1. 参与电商产品的需求分析和方案设计
2. 协助完成产品原型和 PRD 文档
3. 跟进产品开发进度，协调团队资源
4. 分析用户数据，提出产品优化建议

任职要求：
1. 本科及以上学历
2. 有产品实习经验优先
3. 熟练使用 Axure、Figma 等工具
4. 有数据分析能力
5. 对电商行业有了解
6. 良好的沟通能力和执行力

薪资：200-300/天`,
};

/** 预设的简历示例 */
export const sampleResumes = {
  product: `姓名：张三
学校：北京大学 | 专业：信息管理 | 年级：大三

项目经历：
1. xx 小程序用户增长项目（2025.03-2025.06）
   - 负责 xx 小程序的用户增长，通过活动实现用户从 100 到 1000
   - 协调研发、设计团队完成项目上线

2. 校园公众号运营（2024.09-2025.02）
   - 负责公众号内容策划和运营
   - 粉丝从 500 增长到 2000

技能：
- 产品工具：Figma、Axure
- 数据分析：Excel、SQL
- 其他：Python、英语六级`,

  developer: `姓名：李四
学校：清华大学 | 专业：计算机科学 | 年级：大三

项目经历：
1. 个人博客系统（2025.01-2025.03）
   - 使用 React + Node.js 开发个人博客系统
   - 实现文章发布、评论、点赞等功能

2. Todo List 应用（2024.09-2024.12）
   - 使用 Vue.js 开发 Todo List 应用
   - 实现任务管理、分类、搜索等功能

技能：
- 前端：React、Vue、TypeScript
- 后端：Node.js、Python
- 数据库：MySQL、MongoDB`,
};
