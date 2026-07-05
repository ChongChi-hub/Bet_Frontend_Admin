import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import { Trophy, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatVND } from '../../lib/format';

interface LeaderboardEntry {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  correctPredictions: number;
  totalPrizeWon: number;
}

export default function AdminLeaderboardTab() {
  const { data: leaderboard } = useQuery<LeaderboardEntry[]>({
    queryKey: ['admin-leaderboard'],
    queryFn: async () => {
      const res = await api.get('/leaderboard');
      return res.data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="glass overflow-hidden border border-amber-500/20 bg-amber-500/5">
        <div className="p-6 border-b border-slate-700/50 flex items-center gap-3">
          <Trophy className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold text-amber-400">Bảng xếp hạng Người chơi</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400">
                <th className="p-4 w-16 text-center">Hạng</th>
                <th className="p-4">Người chơi</th>
                <th className="p-4 text-center">Số đoán đúng</th>
                <th className="p-4 text-right">Tổng tiền thưởng (VND)</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard?.map((entry, index) => (
                <motion.tr 
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors ${
                    index < 3 ? 'bg-amber-500/5' : ''
                  }`}
                >
                  <td className="p-4 text-center font-bold">
                    {index === 0 ? <Medal className="w-6 h-6 text-yellow-400 mx-auto" /> :
                     index === 1 ? <Medal className="w-6 h-6 text-slate-300 mx-auto" /> :
                     index === 2 ? <Medal className="w-6 h-6 text-amber-600 mx-auto" /> :
                     <span className="text-slate-500">{index + 1}</span>}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-200">{entry.fullName}</div>
                    <div className="text-xs text-slate-500">{entry.email}</div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                      {entry.correctPredictions}
                    </span>
                  </td>
                  <td className="p-4 text-right font-black text-amber-400 text-lg">
                    {formatVND(entry.totalPrizeWon)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {leaderboard?.length === 0 && (
          <div className="p-8 text-center text-slate-400">Chưa có dữ liệu bảng xếp hạng.</div>
        )}
      </div>
    </div>
  );
}
