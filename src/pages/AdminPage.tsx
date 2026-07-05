import { useState } from 'react';
import { Settings, Users, Activity, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

import AdminMatchesTab from '../components/admin/AdminMatchesTab';
import AdminUsersTab from '../components/admin/AdminUsersTab';
import AdminLeaderboardTab from '../components/admin/AdminLeaderboardTab';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'matches' | 'users' | 'leaderboard'>('matches');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-4"
      >
        <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
          <Settings className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Quản trị viên</h1>
          <p className="text-slate-400">Hệ thống điều hành minigame của công ty.</p>
        </div>
      </motion.div>

      <div className="flex gap-4 border-b border-slate-700/50 mb-8 pb-4">
        <button
          onClick={() => setActiveTab('matches')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            activeTab === 'matches' 
              ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' 
              : 'glass text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-5 h-5" />
          Quản lý Trận đấu
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            activeTab === 'users' 
              ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' 
              : 'glass text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-5 h-5" />
          Quản lý Nhân viên
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
            activeTab === 'leaderboard' 
              ? 'bg-amber-500 text-white font-bold shadow-lg shadow-amber-500/20' 
              : 'glass text-slate-400 hover:text-slate-200'
          }`}
        >
          <Trophy className="w-5 h-5" />
          Bảng xếp hạng
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'matches' && <AdminMatchesTab />}
        {activeTab === 'users' && <AdminUsersTab />}
        {activeTab === 'leaderboard' && <AdminLeaderboardTab />}
      </motion.div>
    </div>
  );
}
