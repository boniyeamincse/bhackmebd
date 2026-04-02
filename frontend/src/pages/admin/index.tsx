import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { withAdmin } from '@/components/auth/withAdmin';
import api from '@/lib/api';

function AdminDashboardPage() {
  const { data } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
    refetchInterval: 15000,
  });

  const stats = data?.stats;
  const chart = data?.charts?.userRegistrations7d || [];
  const max = Math.max(...chart.map((d: any) => d.count), 1);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs uppercase text-gray-500">Users</p>
          <p className="text-2xl text-white font-bold mt-1">{stats?.totalUsers ?? 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs uppercase text-gray-500">Active Containers</p>
          <p className="text-2xl text-white font-bold mt-1">{stats?.activeContainers ?? 0}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs uppercase text-gray-500">XP Distributed</p>
          <p className="text-2xl text-terminal-green font-bold mt-1">{stats?.xpDistributed ?? 0}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-sm text-gray-200 font-semibold mb-3">User Registrations (7 days)</p>
        <div className="grid grid-cols-7 gap-2 items-end h-48">
          {chart.map((d: any) => (
            <div key={d.day} className="flex flex-col items-center gap-2">
              <div className="w-full bg-gray-800 rounded-t relative overflow-hidden" style={{ height: '140px' }}>
                <div
                  className="absolute bottom-0 left-0 right-0 bg-terminal-green/80"
                  style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 8 : 0)}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500">{d.day.slice(5)}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminDashboardPage);
