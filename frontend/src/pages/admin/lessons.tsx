import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AdminLayout from '@/components/admin/AdminLayout';
import { withAdmin } from '@/components/auth/withAdmin';
import api from '@/lib/api';

type Chapter = { id: string; title: string };
type Lesson = { id: string; chapter_id: string; title: string; content_md: string; order_index: number; xp_reward: number; is_published: boolean };

const blank = { chapter_id: '', title: '', content_md: '', order_index: 1, xp_reward: 50, is_published: false };

function AdminLessonsPage() {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(blank);

  const { data: chaptersData } = useQuery<{ chapters: Chapter[] }>({ queryKey: ['admin-chapters-basic'], queryFn: () => api.get('/admin/chapters').then((r) => r.data) });
  const { data: lessonsData } = useQuery<{ lessons: Lesson[] }>({ queryKey: ['admin-lessons'], queryFn: () => api.get('/admin/lessons').then((r) => r.data) });

  const chapters = chaptersData?.chapters || [];
  const lessons = lessonsData?.lessons || [];

  const selectedLesson = useMemo(() => lessons.find((l) => l.id === editingId) || null, [lessons, editingId]);

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-lessons'] });

  const submit = async () => {
    if (editingId) await api.put(`/admin/lessons/${editingId}`, form);
    else await api.post('/admin/lessons', form);
    setEditingId(null);
    setForm(blank);
    refresh();
  };

  const edit = (l: Lesson) => {
    setEditingId(l.id);
    setForm({
      chapter_id: l.chapter_id,
      title: l.title,
      content_md: l.content_md,
      order_index: l.order_index,
      xp_reward: l.xp_reward,
      is_published: l.is_published,
    });
  };

  const remove = async (id: string) => {
    await api.delete(`/admin/lessons/${id}`);
    refresh();
  };

  return (
    <AdminLayout title="Lesson Editor">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
          <p className="text-white font-semibold">{editingId ? 'Edit Lesson' : 'Create Lesson'}</p>
          <select className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm" value={form.chapter_id} onChange={(e) => setForm({ ...form, chapter_id: e.target.value })}>
            <option value="">Select chapter</option>
            {chapters.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
          <input className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm" placeholder="Lesson title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <textarea className="w-full h-64 bg-gray-800 text-white rounded px-3 py-2 text-sm font-mono" placeholder="Markdown content" value={form.content_md} onChange={(e) => setForm({ ...form, content_md: e.target.value })} />
          <div className="grid grid-cols-3 gap-3">
            <input className="bg-gray-800 text-white rounded px-3 py-2 text-sm" type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} />
            <input className="bg-gray-800 text-white rounded px-3 py-2 text-sm" type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: Number(e.target.value) })} />
            <label className="text-sm text-gray-300 flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />Published</label>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-terminal-green text-black text-sm font-semibold" onClick={submit}>{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button className="px-3 py-1 rounded border border-gray-700 text-sm text-gray-300" onClick={() => { setEditingId(null); setForm(blank); }}>Cancel</button>}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-white font-semibold mb-3">Live Preview</p>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content_md || selectedLesson?.content_md || ''}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-white font-semibold mb-3">Lessons</p>
        <div className="space-y-2">
          {lessons.map((l) => (
            <div key={l.id} className="flex items-center justify-between border border-gray-800 rounded px-3 py-2">
              <div>
                <p className="text-white text-sm">{l.title}</p>
                <p className="text-gray-500 text-xs">Order {l.order_index} · XP {l.xp_reward}</p>
              </div>
              <div className="flex gap-2">
                <button className="text-xs px-2 py-1 border border-gray-700 rounded text-gray-300" onClick={() => edit(l)}>Edit</button>
                <button className="text-xs px-2 py-1 border border-red-700 rounded text-red-300" onClick={() => remove(l.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminLessonsPage);
