import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { withAdmin } from '@/components/auth/withAdmin';
import api from '@/lib/api';

type User = {
  id: string;
  username: string;
  email: string;
  level: string;
  total_xp: number;
  is_active: boolean;
  _count?: { progress?: number };
};

function AdminUsersPage() {
  const qc = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { data } = useQuery<{ users: User[] }>({
    queryKey: ['admin-users'],
    queryFn: () => api.get('/admin/users').then((r) => r.data),
  });

  const { data: progressData } = useQuery({
    queryKey: ['admin-user-progress', selectedUserId],
    queryFn: () => api.get(`/admin/users/${selectedUserId}/progress`).then((r) => r.data.progress),
    enabled: !!selectedUserId,
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-users'] });

  const toggleActive = async (u: User) => {
    await api.patch(`/admin/users/${u.id}/status`, { is_active: !u.is_active });
    refresh();
  };

  const killSession = async (u: User) => {
    await api.delete(`/admin/users/${u.id}/session`);
  };

  return (
    <AdminLayout title="User Manager">
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr><th className="px-3 py-2 text-left">User</th><th className="px-3 py-2 text-left">Level</th><th className="px-3 py-2 text-left">XP</th><th className="px-3 py-2 text-left">Progress</th><th className="px-3 py-2 text-left">Status</th><th className="px-3 py-2 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {(data?.users || []).map((u) => (
              <tr key={u.id} className="border-t border-gray-800">
                <td className="px-3 py-2 text-white">{u.username}</td>
                <td className="px-3 py-2 text-gray-300 capitalize">{u.level}</td>
                <td className="px-3 py-2 text-terminal-green">{u.total_xp}</td>
                <td className="px-3 py-2 text-gray-300">{u._count?.progress || 0}</td>
                <td className="px-3 py-2 text-gray-300">{u.is_active ? 'Active' : 'Banned'}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <button className="text-xs px-2 py-1 border border-gray-700 rounded text-gray-300" onClick={() => setSelectedUserId(u.id)}>View Progress</button>
                    <button className="text-xs px-2 py-1 border border-gray-700 rounded text-gray-300" onClick={() => toggleActive(u)}>{u.is_active ? 'Ban' : 'Unban'}</button>
                    <button className="text-xs px-2 py-1 border border-red-700 rounded text-red-300" onClick={() => killSession(u)}>Kill Session</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUserId && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-white font-semibold mb-3">User Progress</p>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {(progressData || []).map((p: any) => (
              <div key={p.id} className="border border-gray-800 rounded px-3 py-2">
                <p className="text-sm text-white">{p.task?.description || p.task_id}</p>
                <p className="text-xs text-gray-500 mt-1">{p.status} · attempts {p.attempts} · XP {p.xp_earned}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default withAdmin(AdminUsersPage);
