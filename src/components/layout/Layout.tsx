import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {!isHomePage && <Sidebar />}
        <main
          className={`flex-1 ${isHomePage ? '' : 'p-8'}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
