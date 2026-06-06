/**
 * 从简历文本中提取项目经历
 * 根据"项目经历""项目经验""项目实践""Projects"等关键词定位，
 * 根据空行、项目标题、bullet 列表切分
 */

/**
 * 从简历文本中提取项目经历段落
 * @returns 项目经历字符串数组，每项为一个项目的完整描述
 */
export function extractProjects(resumeText: string): string[] {
  if (!resumeText || !resumeText.trim()) return [];

  const lines = resumeText.split("\n");
  const projectHeaders = [
    "项目经历",
    "项目经验",
    "项目实践",
    "工作经历",
    "实习经历",
    "实习经验",
    "工作项目",
    "个人项目",
    "Projects",
    "Experience",
    "Work Experience",
  ];

  let projectStart = -1;
  let projectEnd = lines.length;

  // 找到项目经历部分的起始行
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    for (const header of projectHeaders) {
      if (
        line === header ||
        line === header + "：" ||
        line === header + ":" ||
        line.startsWith(header + "（") ||
        line.startsWith(header + "(") ||
        line.startsWith("## " + header) ||
        line.startsWith("# " + header)
      ) {
        projectStart = i + 1;
        break;
      }
    }
    if (projectStart !== -1) break;
  }

  if (projectStart === -1) {
    // 没找到明确的项目标题，尝试从全文中按 bullet 列表提取
    return extractByBullets(lines);
  }

  // 找到项目经历部分的结束行（下一个大段落标题）
  const sectionHeaders = [
    "技能",
    "教育",
    "学历",
    "证书",
    "荣誉",
    "获奖",
    "自我评价",
    "个人简介",
    "兴趣",
    "Skills",
    "Education",
    "Summary",
    "About",
  ];

  for (let i = projectStart; i < lines.length; i++) {
    const line = lines[i].trim();
    for (const header of sectionHeaders) {
      if (
        line === header ||
        line === header + "：" ||
        line === header + ":" ||
        line.startsWith(header + "（") ||
        line.startsWith(header + "(") ||
        line.startsWith("## " + header) ||
        line.startsWith("# " + header)
      ) {
        projectEnd = i;
        break;
      }
    }
    if (projectEnd !== lines.length) break;
  }

  const projectLines = lines.slice(projectStart, projectEnd);
  return splitProjects(projectLines);
}

/**
 * 按项目标题和分隔符切分项目
 */
function splitProjects(lines: string[]): string[] {
  const projects: string[] = [];
  let current: string[] = [];

  // 项目标题模式：数字编号、日期范围等
  const projectTitlePatterns = [
    /^\d+[\.\、\)）]\s*\S+/, // "1. xxx项目"
    /^[\-\*]\s*\S+.*\d{4}/, // "- 项目名 2024"
    /^\*\*.*\*\*/, // "**项目名**"
    /项目[：:]?\s*.+/i, // "项目：xxx"
    /\d{4}\.\d{1,2}\s*[-–—~]\s*\d{4}\.\d{1,2}/, // "2024.01-2024.06"
    /\d{4}\.\d{1,2}\s*[-–—~]\s*(至今|现在|present)/i,
    /\d{4}\/\d{1,2}\s*[-–—~]\s*\d{4}\/\d{1,2}/,
  ];

  for (const line of lines) {
    const trimmed = line.trim();

    // 空行分隔
    if (!trimmed) {
      if (current.length > 0) {
        const text = current.join("\n").trim();
        if (text.length > 10) {
          projects.push(text);
        }
        current = [];
      }
      continue;
    }

    // 检查是否是新项目标题
    const isNewProject = projectTitlePatterns.some((p) => p.test(trimmed));
    if (isNewProject && current.length > 0) {
      const text = current.join("\n").trim();
      if (text.length > 10) {
        projects.push(text);
      }
      current = [];
    }

    current.push(trimmed);
  }

  // 最后一个项目
  if (current.length > 0) {
    const text = current.join("\n").trim();
    if (text.length > 10) {
      projects.push(text);
    }
  }

  return projects;
}

/**
 * 当没有明确的"项目经历"标题时，尝试从全文中按 bullet 列表提取
 */
function extractByBullets(lines: string[]): string[] {
  const projects: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (current.length >= 2) {
        projects.push(current.join("\n").trim());
      }
      current = [];
      continue;
    }
    current.push(trimmed);
  }

  if (current.length >= 2) {
    projects.push(current.join("\n").trim());
  }

  return projects.filter((p) => p.length > 20);
}
