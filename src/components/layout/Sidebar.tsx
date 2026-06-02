import { Link, useLocation } from 'react-router-dom';
import {
  FileText,
  UserCheck,
  Sparkles,
  MessageSquare,
  BarChart3,
} from 'lucide-react';

const workflowSteps = [
  {
    path: '/workflow/jd-analysis',
    label: 'JD 解析',
    icon: FileText,
    description: '分析职位要求',
  },
  {
    path: '/workflow/resume-diagnosis',
    label: '简历诊断',
    icon: UserCheck,
    description: '匹配度评估',
  },
  {
    path: '/workflow/project-optimization',
    label: '项目优化',
    icon: Sparkles,
    description: '经历优化建议',
  },
  {
    path: '/workflow/mock-interview',
    label: '模拟面试',
    icon: MessageSquare,
    description: 'AI 面试练习',
  },
  {
    path: '/workflow/feedback-report',
    label: '反馈报告',
    icon: BarChart3,
    description: '综合评估报告',
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
      <nav className="p-4">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
            工作流程
          </h2>
        </div>
        <ul className="space-y-1">
          {workflowSteps.map((step) => {
            const isActive = location.pathname === step.path;
            const Icon = step.icon;

            return (
              <li key={step.path}>
                <Link
                  to={step.path}
                  className={
                    isActive ? 'sidebar-link-active' : 'sidebar-link'
                  }
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <div className="text-sm">{step.label}</div>
                    <div className="text-xs text-gray-400">
                      {step.description}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
