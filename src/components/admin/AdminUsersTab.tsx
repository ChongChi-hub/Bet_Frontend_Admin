import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import type { User } from '../../types';
import { Plus, Trash2, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatVND } from '../../lib/format';

export default function AdminUsersTab() {
  const queryClient = useQueryClient();
  
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'USER'|'ADMIN'>('USER');
  const [totalBalance, setTotalBalance] = useState<string>('0');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: users } = useQuery<User[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const res = await api.get('/admin/users');
      return res.data;
    }
  });

  const createMutation = useMutation({
    mutationFn: (newUser: Omit<User, 'id'> & { password?: string }) => api.post('/admin/users', newUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Thêm người dùng thành công!');
      resetForm();
    },
    onError: () => toast.error('Lỗi khi thêm người dùng')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }: User & { password?: string }) => api.put(`/admin/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Cập nhật người dùng thành công!');
      resetForm();
    },
    onError: () => toast.error('Lỗi khi cập nhật người dùng')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Xóa người chơi thành công!');
    },
    onError: () => toast.error('Không thể xóa người chơi')
  });

  const resetForm = () => {
    setEmail('');
    setFullName('');
    setPhoneNumber('');
    setPassword('');
    setRole('USER');
    setTotalBalance('0');
    setEditingId(null);
  };

  const handleEdit = (user: User) => {
    setEmail(user.email);
    setFullName(user.fullName);
    setPhoneNumber(user.phoneNumber || '');
    setRole(user.role);
    setTotalBalance(user.totalBalance.toString());
    setEditingId(user.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !fullName) {
      toast.error('Vui lòng nhập Email và Tên');
      return;
    }

    const userData = { 
      email, 
      fullName, 
      phoneNumber,
      password: password || undefined,
      role,
      totalBalance: Number(totalBalance) 
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...userData });
    } else {
      createMutation.mutate(userData);
    }
  };

  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 mb-8 border border-primary/20 bg-primary/5"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
          <Plus className="w-5 h-5" /> {editingId ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="glass-input" placeholder="VD: nguyenvana@gmail.com" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Họ tên</label>
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="glass-input" placeholder="VD: Nguyễn Văn A" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Số điện thoại</label>
              <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="glass-input" placeholder="VD: 0987..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Quyền</label>
              <select value={role} onChange={e => setRole(e.target.value as 'USER'|'ADMIN')} className="glass-input">
                <option value="USER">Người chơi</option>
                <option value="ADMIN">Quản trị viên</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Mật khẩu {editingId && '(Bỏ trống nếu không đổi)'}</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="glass-input" placeholder="Mật khẩu..." />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-400 mb-1">Số dư tiền ($)</label>
            <input 
              type="number" 
              step="0.01" 
              value={totalBalance} 
              onChange={e => {
                const val = e.target.value;
                if (val.startsWith('0') && val.length > 1 && val[1] !== '.') {
                  setTotalBalance(val.replace(/^0+/, ''));
                } else {
                  setTotalBalance(val);
                }
              }} 
              className="glass-input w-full md:w-1/3" 
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="w-full btn-primary flex items-center justify-center gap-2">
              {editingId ? 'Cập nhật' : 'Thêm'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="btn-success bg-slate-600 hover:bg-slate-500">
                Hủy
              </button>
            )}
          </div>
        </form>
      </motion.div>

      <div className="glass overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700 text-slate-400">
                <th className="p-3">Email</th>
                <th className="p-3">Họ tên</th>
                <th className="p-3">SĐT</th>
                <th className="p-3">Quyền</th>
                <th className="p-3 text-right">Số dư (VND)</th>
                <th className="p-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users?.map(user => (
                <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 font-medium">{user.email}</td>
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.phoneNumber || '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'ADMIN' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3 text-right font-bold text-amber-400">{formatVND(user.totalBalance)}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button 
                      onClick={() => handleEdit(user)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/20 rounded-md transition-colors"
                      title="Sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmId(user.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/20 rounded-md transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users?.length === 0 && (
          <div className="p-8 text-center text-slate-400">Chưa có người chơi nào.</div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="glass p-6 max-w-sm w-full mx-4 relative shadow-2xl border border-red-500/20"
          >
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" /> Xác nhận xóa
            </h3>
            <p className="text-slate-300 mb-6 text-sm">
              Bạn có chắc chắn muốn xóa nhân viên này không? Toàn bộ dữ liệu của họ sẽ bị mất và không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors text-sm font-medium"
              >
                Hủy
              </button>
              <button 
                onClick={() => {
                  deleteMutation.mutate(deleteConfirmId);
                  setDeleteConfirmId(null);
                }} 
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium"
              >
                Xóa ngay
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
