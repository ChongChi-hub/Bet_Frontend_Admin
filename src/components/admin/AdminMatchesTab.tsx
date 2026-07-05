import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import type { Match } from '../../types';
import { Lock, CheckCircle, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import AutocompleteInput from '../AutocompleteInput';
import { WORLD_CUP_TEAMS } from '../../lib/flags';

export default function AdminMatchesTab() {
  const queryClient = useQueryClient();
  const [results, setResults] = useState<Record<number, { finalResult: string, finalNote: string }>>({});
  
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [matchTime, setMatchTime] = useState('');
  const [matchStage, setMatchStage] = useState('Vòng bảng');
  const [prizePool, setPrizePool] = useState<string>('0');
  const [criterionLabel, setCriterionLabel] = useState('Đội thắng');

  const { data: matches } = useQuery<Match[]>({
    queryKey: ['admin-matches'],
    queryFn: async () => {
      const res = await api.get('/matches');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newMatch: Partial<Match>) => api.post('/admin/matches', newMatch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] });
      toast.success('Tạo trận đấu thành công!');
      setTeamA('');
      setTeamB('');
      setMatchTime('');
      setMatchStage('Vòng bảng');
      setPrizePool('0');
      setCriterionLabel('Đội thắng');
    },
    onError: () => toast.error('Không thể tạo trận đấu')
  });

  const lockMutation = useMutation({
    mutationFn: (id: number) => api.put(`/admin/matches/${id}/lock`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] });
      toast.success('Khóa trận đấu thành công!');
    },
    onError: () => toast.error('Không thể khóa trận đấu')
  });

  const settleMutation = useMutation({
    mutationFn: ({ id, finalResult, finalNote }: { id: number, finalResult: string, finalNote: string }) => 
      api.put(`/admin/matches/${id}/settle`, { finalResult, finalNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-matches'] });
      toast.success('Chốt kết quả trận đấu thành công!');
    },
    onError: () => toast.error('Lỗi khi chốt kết quả trận đấu')
  });

  const handleCreateMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamA || !teamB || !matchTime) {
      toast.error('Vui lòng điền đầy đủ thông tin trận đấu');
      return;
    }
    if (teamA === teamB) {
      toast.error('Đội nhà và Đội khách không được trùng nhau');
      return;
    }
    
    const prizeNum = parseFloat(prizePool) || 0;

    createMutation.mutate({
      teamA,
      teamB,
      matchTime,
      prizePool: prizeNum,
      matchStage,
      criterionLabel
    });
  };

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 mb-8"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-emerald-400" /> Tạo trận đấu mới
        </h2>
        <form onSubmit={handleCreateMatch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div className="z-50">
            <AutocompleteInput
              label="Đội nhà (Team A)"
              value={teamA}
              onChange={setTeamA}
              options={WORLD_CUP_TEAMS}
              placeholder="Gõ để tìm kiếm..."
            />
          </div>
          <div className="z-40">
            <AutocompleteInput
              label="Đội khách (Team B)"
              value={teamB}
              onChange={setTeamB}
              options={WORLD_CUP_TEAMS}
              placeholder="Gõ để tìm kiếm..."
            />
          </div>
          <div className="z-30">
            <label className="block text-xs font-medium text-slate-400 mb-1">Vòng đấu</label>
            <select 
              value={matchStage} 
              onChange={e => {
                const val = e.target.value;
                setMatchStage(val);
                if (val === 'Chung kết') {
                  setCriterionLabel('Đội vô địch');
                } else if (criterionLabel === 'Đội vô địch') {
                  setCriterionLabel('Đội thắng');
                }
              }} 
              className="glass-input"
            >
              <option value="Vòng loại">Vòng loại</option>
              <option value="Vòng bảng">Vòng bảng</option>
              <option value="Vòng 1/32">Vòng 1/32</option>
              <option value="Vòng 1/16">Vòng 1/16</option>
              <option value="Vòng 1/8">Vòng 1/8</option>
              <option value="Tứ kết">Tứ kết</option>
              <option value="Bán kết">Bán kết</option>
              <option value="Chung kết">Chung kết</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Thời gian thi đấu</label>
            <input type="datetime-local" value={matchTime} onChange={e => setMatchTime(e.target.value)} className="glass-input" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Tiền thưởng (VND)</label>
            <input 
              type="number" 
              min="0" 
              step="0.01" 
              value={prizePool} 
              onChange={e => {
                const val = e.target.value;
                if (val.startsWith('0') && val.length > 1 && val[1] !== '.') {
                  setPrizePool(val.replace(/^0+/, ''));
                } else {
                  setPrizePool(val);
                }
              }} 
              className="glass-input" 
              required 
            />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <label className="block text-xs font-medium text-slate-400 mb-1">Tiêu chí dự đoán cược</label>
            <select value={criterionLabel} onChange={e => setCriterionLabel(e.target.value)} className="glass-input">
              {matchStage === 'Chung kết' ? (
                <option value="Đội vô địch">Đội vô địch</option>
              ) : (
                <>
                  <option value="Đội thắng">Đội thắng</option>
                  <option value="Chênh lệch số lần bóng chạm khung thành">Chênh lệch số lần bóng chạm khung thành</option>
                  <option value="Đội có ít cú vô-lê hơn">Đội có ít cú vô-lê hơn</option>
                  <option value="Chênh lệch số thẻ vàng">Chênh lệch số thẻ vàng</option>
                  <option value="Chênh lệch số pha phạt góc">Chênh lệch số pha phạt góc</option>
                </>
              )}
            </select>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-2">
            <button type="submit" disabled={createMutation.isPending} className="w-full btn-success flex items-center justify-center gap-2">
              Thêm trận
            </button>
          </div>
        </form>
      </motion.div>

      <div className="space-y-4">
        {matches?.map((match, index) => (
          <motion.div 
            key={match.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${
                  match.status === 'OPEN' ? 'badge-open' : 
                  match.status === 'LOCKED' ? 'badge-locked' : 'badge-settled'
                }`}>
                  {match.status === 'OPEN' ? 'MỞ DỰ ĐOÁN' : match.status === 'LOCKED' ? 'ĐÃ KHÓA' : 'ĐÃ CHỐT'}
                </span>
                <span className="text-xs text-slate-400">{new Date(match.matchTime).toLocaleString('vi-VN')}</span>
              </div>
              <div className="text-xl font-bold">
                {match.teamA} <span className="text-slate-500 mx-2">vs</span> {match.teamB}
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              {match.status === 'OPEN' && (
                <button 
                  onClick={() => lockMutation.mutate(match.id)}
                  disabled={lockMutation.isPending}
                  className="btn-primary flex items-center gap-2 flex-1 md:flex-none justify-center"
                >
                  <Lock className="w-4 h-4" /> Khóa dự đoán
                </button>
              )}
              
              {match.status === 'LOCKED' && (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex gap-2">
                    {['Đội thắng', 'Đội có ít cú vô-lê hơn', 'Đội vô địch'].includes(match.criterionLabel || 'Đội thắng') ? (
                      <select 
                        value={results[match.id]?.finalResult || ''}
                        onChange={(e) => setResults({...results, [match.id]: { ...results[match.id], finalResult: e.target.value }})}
                        className="glass-input flex-1"
                      >
                        <option value="">-- Chọn đội --</option>
                        <option value={match.teamA}>{match.teamA}</option>
                        <option value={match.teamB}>{match.teamB}</option>
                      </select>
                    ) : (
                      <input 
                        type="number"
                        placeholder="Nhập con số (VD: 2)"
                        value={results[match.id]?.finalResult || ''}
                        onChange={(e) => setResults({...results, [match.id]: { ...results[match.id], finalResult: e.target.value }})}
                        className="glass-input flex-1"
                      />
                    )}
                    <button 
                      onClick={() => {
                        const result = results[match.id];
                        if (!result?.finalResult) {
                          toast.error('Vui lòng chọn đội thắng chung cuộc');
                          return;
                        }
                        settleMutation.mutate({ 
                          id: match.id, 
                          finalResult: result.finalResult,
                          finalNote: result.finalNote || ''
                        });
                      }}
                      disabled={settleMutation.isPending}
                      className="btn-success flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Chốt
                    </button>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Ghi chú (VD: Bỉ 3 thẻ, Senegal 5 thẻ)"
                    value={results[match.id]?.finalNote || ''}
                    onChange={(e) => setResults({...results, [match.id]: { ...results[match.id], finalNote: e.target.value }})}
                    className="glass-input w-full text-sm"
                  />
                </div>
              )}
              
              {match.status === 'SETTLED' && (
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <div className="text-emerald-400 font-bold px-4 py-2 border border-emerald-500/30 rounded-lg bg-emerald-500/10 text-center">
                    Kết quả: {match.finalResult}
                  </div>
                  {match.finalNote && (
                    <div className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded-lg text-center border border-slate-700/50">
                      Ghi chú: {match.finalNote}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
