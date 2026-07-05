import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email: username, password });
      localStorage.setItem('adminToken', res.data.token);
      toast.success('Đăng nhập thành công!');
      navigate('/admin');
    } catch (err) {
      toast.error('Sai tên đăng nhập hoặc mật khẩu!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-8 w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Đăng nhập Admin</h2>
          <p className="text-slate-400 text-sm mt-1">Xác thực để quản trị các trận đấu</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Tài khoản</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="glass-input" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="glass-input" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-primary mt-4"
          >
            {isLoading ? 'Đang xác thực...' : 'Đăng nhập'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
