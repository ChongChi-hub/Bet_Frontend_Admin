import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Trophy, Settings, LogOut, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const links = [
    { path: '/admin', label: 'Quản trị viên', icon: Settings }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 glass rounded-none border-t-0 border-l-0 border-r-0 border-b border-slate-700/50 mb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 text-primary">
            <Trophy className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-white">LongHoang88<span className="text-primary">Bet</span></span>
          </div>
          
          <div className="flex gap-1 items-center">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-primary/20 border border-primary/30 rounded-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </span>
                </Link>
              );
            })}
            
            {token ? (
              <button 
                onClick={handleLogout}
                className="ml-4 p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <Link 
                to="/login"
                className="ml-4 p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="Đăng nhập Admin"
              >
                <KeyRound className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark text-slate-200">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 pb-12">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/" element={<AdminPage />} />
            </Route>
          </Routes>
        </main>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid rgba(51, 65, 85, 0.5)'
          }
        }} />
      </div>
    </BrowserRouter>
  )
}

export default App;
