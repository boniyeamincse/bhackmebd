import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { withAdmin } from '@/components/auth/withAdmin';
import api from '@/lib/api';

function bytesToMb(value: number) {
  return Math.round((value / 1024 / 1024) * 10) / 10;
}

function Gauge({ value, color = 'bg-terminal-green' }: { value: number; color?: string }) {
  const pct = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-full h-2 bg-gray-800 rounded overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function AdminContainersPage() {
  const { data } = useQuery({
    queryKey: ['admin-containers'],
    queryFn: () => api.get('/admin/containers').then((r) => r.data.containers),
    refetchInterval: 10000,
  });

  return (
    <AdminLayout title="Container Monitor">
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr><th className="px-3 py-2 text-left">Container</th><th className="px-3 py-2 text-left">User</th><th className="px-3 py-2 text-left">CPU</th><th className="px-3 py-2 text-left">Memory</th><th className="px-3 py-2 text-left">Status</th></tr>
          </thead>
          <tbody>
            {(data || []).map((c: any) => {
              const memPct = c.memoryLimit > 0 ? (c.memoryUsage / c.memoryLimit) * 100 : 0;
              return (
                <tr key={c.id} className="border-t border-gray-800">
                  <td className="px-3 py-2 text-white font-mono text-xs">{c.name}</td>
                  <td className="px-3 py-2 text-gray-300 font-mono text-xs">{c.userId || '-'}</td>
                  <td className="px-3 py-2">
                    <p className="text-xs text-gray-400 mb-1">{c.cpuPercent}%</p>
                    <Gauge value={c.cpuPercent} />
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-xs text-gray-400 mb-1">{bytesToMb(c.memoryUsage)} / {bytesToMb(c.memoryLimit)} MB</p>
                    <Gauge value={memPct} color="bg-blue-400" />
                  </td>
                  <td className="px-3 py-2 text-gray-300">{c.status}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminContainersPage);
