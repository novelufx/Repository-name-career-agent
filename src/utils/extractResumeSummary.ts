/**
 * 从简历文本中提取摘要
 * 优先提取学校、专业、技能、项目标题、实习经历
 * 如果无法结构化提取，截取简历前 500 字
 * 不编造信息
 */

export function extractResumeSummary(resumeText: string): string {
  if (!resumeText || !resumeText.trim()) return "";

  const lines = resumeText.split("\n").map((l) => l.trim()).filter(Boolean);
  const parts: string[] = [];

  // 1. 提取姓名
  const name = extractField(lines, ["姓名", "名字", "Name"]);
  if (name) parts.push(name);

  // 2. 提取学校和专业
  const education = extractEducation(lines);
  if (education) parts.push(education);

  // 3. 提取技能
  const skills = extractSection(lines, ["技能", "技术栈", "Skills", "专业技能"]);
  if (skills) parts.push("技能：" + skills);

  // 4. 提取项目标题
  const projectTitles = extractProjectTitles(lines);
  if (projectTitles.length > 0) {
    parts.push("项目经历：" + projectTitles.join("；"));
  }

  // 5. 提取实习/工作经历
  const workInfo = extractSection(lines, ["实习", "工作经历", "实习经历", "实习经验", "Work"]);
  if (workInfo) parts.push("实习经历：" + workInfo);

  // 如果提取到了结构化信息，组装摘要
  if (parts.length >= 2) {
    return parts.join("\n");
  }

  // 否则截取前 500 字
  return resumeText.substring(0, 500).trim();
}

/**
 * 从简历中提取某个字段的值
 */
function extractField(lines: string[], fieldNames: string[]): string | null {
  for (const line of lines) {
    for (const field of fieldNames) {
      if (line.startsWith(field + "：") || line.startsWith(field + ":")) {
        return line.replace(new RegExp(`^${field}[：:]\\s*`), "").trim();
      }
    }
  }
  return null;
}

/**
 * 提取教育背景（学校 + 专业）
 */
function extractEducation(lines: string[]): string | null {
  // 方式1: 以"学校""大学""学院""学历""教育"开头的行，避免"大学生"等子串误匹配
  for (const line of lines) {
    const isEduLine = /^(学校|大学|学院|学历|教育|School|University|College)/i.test(line);
    if (isEduLine) {
      return line
        .replace(/^教育[经历]*[：:]\s*/i, "")
        .replace(/^学历[：:]\s*/i, "")
        .replace(/^学校[：:]\s*/i, "学校：")
        .trim();
    }
  }

  // 方式2: 教育背景段落
  let inEducation = false;
  const eduLines: string[] = [];
  for (const line of lines) {
    if (/^教育[经历背景]*[：:]/.test(line) || /^Education[：:]/i.test(line)) {
      inEducation = true;
      const content = line.replace(/^教育[经历背景]*[：:]\s*/i, "").replace(/^Education[：:]\s*/i, "");
      if (content) eduLines.push(content);
      continue;
    }
    if (inEducation) {
      if (/^(技能|项目|实习|工作|证书|荣誉|获奖|自我|个人|Skills|Projects|Experience)/i.test(line)) {
        break;
      }
      eduLines.push(line);
      if (eduLines.length >= 3) break;
    }
  }

  if (eduLines.length > 0) {
    return eduLines.join(" ").substring(0, 100);
  }

  return null;
}

/**
 * 判断一行是否是段落标题（用于 section 边界检测）
 */
function isSectionHeaderLine(trimmed: string): boolean {
  const headers = [
    "技能", "技术栈", "专业技能", "教育", "学历", "项目经历", "项目经验",
    "项目实践", "工作经历", "实习经历", "实习经验", "实习", "工作",
    "求职方向", "个人简介", "证书", "荣誉", "获奖", "自我评价",
    "兴趣", "Skills", "Education", "Projects", "Experience", "Summary", "About",
  ];
  return headers.some((h) =>
    trimmed === h ||
    trimmed === h + "：" ||
    trimmed === h + ":" ||
    trimmed.startsWith(h + "（") ||
    trimmed.startsWith(h + "(") ||
    trimmed.startsWith("## " + h) ||
    trimmed.startsWith("# " + h)
  );
}

/**
 * 提取某个段落的内容
 */
function extractSection(lines: string[], headers: string[]): string | null {
  let inSection = false;
  const sectionLines: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    let matchedHeader = false;

    for (const header of headers) {
      if (
        trimmed === header ||
        trimmed === header + "：" ||
        trimmed === header + ":" ||
        trimmed.startsWith(header + "（") ||
        trimmed.startsWith(header + "(") ||
        trimmed.startsWith("## " + header) ||
        trimmed.startsWith("# " + header)
      ) {
        inSection = true;
        matchedHeader = true;
        const content = trimmed.replace(new RegExp(`^#{0,2}\\s*${header}[（(]?[^）)]*[）)]?[：:]?\\s*`), "");
        if (content) sectionLines.push(content);
        break;
      }
    }

    // 跳过 header 行本身
    if (matchedHeader) continue;

    if (inSection) {
      // 遇到新的段落标题则停止
      if (isSectionHeaderLine(trimmed) && sectionLines.length > 0) break;

      if (!sectionLines.some((s) => s === trimmed)) {
        // 去掉行尾已有的分隔符，避免 join 时出现双分号
        const clean = trimmed.replace(/[；;]+$/, "");
        sectionLines.push(clean);
      }
      if (sectionLines.length >= 5) break;
    }
  }

  return sectionLines.length > 0 ? sectionLines.join("；").substring(0, 200) : null;
}

/**
 * 提取项目标题
 */
function extractProjectTitles(lines: string[]): string[] {
  const titles: string[] = [];
  const projectTitlePatterns = [
    /^\d+[\.\、\)）]\s*(.+)/,
    /^[\-\*]\s*(.+\S)\s*[（(]\d{4}/,
    /^(.+项目[^\s]{0,20})/,
    /^(.+系统[^\s]{0,20})/,
    /^(.+平台[^\s]{0,20})/,
    /^(.+应用[^\s]{0,20})/,
    /^(.+App[^\s]{0,20})/i,
    /^(.+工具[^\s]{0,20})/,
  ];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length > 60) continue;

    for (const pattern of projectTitlePatterns) {
      const match = trimmed.match(pattern);
      if (match && match[1] && match[1].length >= 3 && match[1].length <= 40) {
        const title = match[1].replace(/[（(].*[）)]/, "").trim();
        if (title.length >= 3 && !titles.includes(title)) {
          titles.push(title);
        }
      }
    }

    if (titles.length >= 5) break;
  }

  return titles;
}
