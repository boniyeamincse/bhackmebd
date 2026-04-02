import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { withAdmin } from '@/components/auth/withAdmin';
import api from '@/lib/api';

type Chapter = {
  id: string;
  title: string;
  level: string;
  order_index: number;
  is_published: boolean;
  description?: string;
  xp_reward: number;
};

const blank = { title: '', level: 'beginner', order_index: 1, is_published: false, description: '', xp_reward: 100 };

function AdminChaptersPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data } = useQuery<{ chapters: Chapter[] }>({
    queryKey: ['admin-chapters'],
    queryFn: () => api.get('/admin/chapters').then((r) => r.data),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-chapters'] });

  const submit = async () => {
    if (editingId) {
      await api.put(`/admin/chapters/${editingId}`, form);
    } else {
      await api.post('/admin/chapters', form);
    }
    setForm(blank);
    setEditingId(null);
    refresh();
  };

  const edit = (item: Chapter) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      level: item.level,
      order_index: item.order_index,
      is_published: item.is_published,
      description: item.description || '',
      xp_reward: item.xp_reward,
    });
  };

  const togglePublish = async (item: Chapter) => {
    await api.patch(`/admin/chapters/${item.id}/publish`, { is_published: !item.is_published });
    refresh();
  };

  const remove = async (id: string) => {
    await api.delete(`/admin/chapters/${id}`);
    refresh();
  };

  const move = async (idx: number, direction: -1 | 1) => {
    const list = [...(data?.chapters || [])];
    const next = idx + direction;
    if (next < 0 || next >= list.length) return;
    [list[idx], list[next]] = [list[next], list[idx]];
    await api.post('/admin/chapters/reorder', { chapterIds: list.map((c) => c.id) });
    refresh();
  };

  return (
    <AdminLayout title="Chapter Manager">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <p className="text-white font-semibold">{editingId ? 'Edit Chapter' : 'Create Chapter'}</p>
        <input className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <select className="bg-gray-800 text-white rounded px-3 py-2 text-sm" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
            <option value="beginner">beginner</option>
            <option value="intermediate">intermediate</option>
            <option value="advanced">advanced</option>
            <option value="hacker">hacker</option>
          </select>
          <input className="bg-gray-800 text-white rounded px-3 py-2 text-sm" type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} />
          <input className="bg-gray-800 text-white rounded px-3 py-2 text-sm" type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: Number(e.target.value) })} />
          <label className="text-sm text-gray-300 flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />Published</label>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded bg-terminal-green text-black text-sm font-semibold" onClick={submit}>{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button className="px-3 py-1 rounded border border-gray-700 text-sm text-gray-300" onClick={() => { setEditingId(null); setForm(blank); }}>Cancel</button>}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-300">
            <tr><th className="px-3 py-2 text-left">Order</th><th className="px-3 py-2 text-left">Title</th><th className="px-3 py-2 text-left">Level</th><th className="px-3 py-2 text-left">Published</th><th className="px-3 py-2 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {(data?.chapters || []).map((c, idx) => (
              <tr key={c.id} className="border-t border-gray-800">
                <td className="px-3 py-2 text-gray-400">{c.order_index}</td>
                <td className="px-3 py-2 text-white">{c.title}</td>
                <td className="px-3 py-2 text-gray-300 capitalize">{c.level}</td>
                <td className="px-3 py-2 text-gray-300">{c.is_published ? 'Yes' : 'No'}</td>
                <td className="px-3 py-2">
                  <div className="flex justify-end gap-2">
                    <button className="text-xs px-2 py-1 border border-gray-700 rounded text-gray-300" onClick={() => move(idx, -1)}>↑</button>
                    <button className="text-xs px-2 py-1 border border-gray-700 rounded text-gray-300" onClick={() => move(idx, 1)}>↓</button>
                    <button className="text-xs px-2 py-1 border border-gray-700 rounded text-gray-300" onClick={() => togglePublish(c)}>{c.is_published ? 'Unpublish' : 'Publish'}</button>
                    <button className="text-xs px-2 py-1 border border-gray-700 rounded text-gray-300" onClick={() => edit(c)}>Edit</button>
                    <button className="text-xs px-2 py-1 border border-red-700 rounded text-red-300" onClick={() => remove(c.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminChaptersPage);
