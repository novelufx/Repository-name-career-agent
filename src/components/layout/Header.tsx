import { Link } from 'react-router-dom';
import { Bot, Settings } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Header() {
  const { state } = useAppContext();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CareerAgent</h1>
            <p className="text-xs text-gray-500">AI 求职助手</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {state.isMockMode && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              演示模式
            </span>
          )}
          <Link
            to="/settings"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
