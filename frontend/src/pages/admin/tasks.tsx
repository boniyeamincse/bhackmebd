import { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { withAdmin } from '@/components/auth/withAdmin';
import api from '@/lib/api';

type Lesson = { id: string; title: string };

type TaskForm = {
  lesson_id: string;
  description: string;
  expected_output: string;
  validation_type: 'exact' | 'contains' | 'regex' | 'custom';
  validation_rule: string;
  hint: string;
  xp_reward: number;
  order_index: number;
};

const blank: TaskForm = {
  lesson_id: '',
  description: '',
  expected_output: '',
  validation_type: 'contains',
  validation_rule: '',
  hint: '',
  xp_reward: 25,
  order_index: 1,
};

function AdminTasksPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<TaskForm>(blank);
  const [testOutput, setTestOutput] = useState('');
  const [testResult, setTestResult] = useState<null | boolean>(null);

  const { data: lessonsData } = useQuery<{ lessons: Lesson[] }>({
    queryKey: ['admin-lessons-for-tasks'],
    queryFn: () => api.get('/admin/lessons').then((r) => r.data),
  });

  const { data: tasksData } = useQuery({
    queryKey: ['admin-tasks', form.lesson_id],
    queryFn: () => api.get(`/admin/tasks?lessonId=${form.lesson_id}`).then((r) => r.data.tasks),
    enabled: !!form.lesson_id,
  });

  const lessons = lessonsData?.lessons || [];

  const canUseRule = useMemo(() => form.validation_type === 'regex' || form.validation_type === 'custom', [form.validation_type]);

  const createTask = async () => {
    await api.post('/admin/tasks', form);
    qc.invalidateQueries({ queryKey: ['admin-tasks'] });
    setForm({ ...blank, lesson_id: form.lesson_id });
  };

  const testRule = async () => {
    const { data } = await api.post('/admin/tasks/test-validation', {
      validation_type: form.validation_type,
      expected_output: form.expected_output,
      validation_rule: form.validation_rule,
      output: testOutput,
    });
    setTestResult(data.passed);
  };

  return (
    <AdminLayout title="Task Builder">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <p className="text-white font-semibold">Create Task</p>
        <select className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm" value={form.lesson_id} onChange={(e) => setForm({ ...form, lesson_id: e.target.value })}>
          <option value="">Select lesson</option>
          {lessons.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
        </select>
        <textarea className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm" placeholder="Task description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="bg-gray-800 text-white rounded px-3 py-2 text-sm" placeholder="Expected output" value={form.expected_output} onChange={(e) => setForm({ ...form, expected_output: e.target.value })} />
          <select className="bg-gray-800 text-white rounded px-3 py-2 text-sm" value={form.validation_type} onChange={(e) => setForm({ ...form, validation_type: e.target.value as TaskForm['validation_type'] })}>
            <option value="exact">exact</option>
            <option value="contains">contains</option>
            <option value="regex">regex</option>
            <option value="custom">custom</option>
          </select>
          <input disabled={!canUseRule} className="bg-gray-800 text-white rounded px-3 py-2 text-sm disabled:opacity-50" placeholder="Validation rule" value={form.validation_rule} onChange={(e) => setForm({ ...form, validation_rule: e.target.value })} />
          <input className="bg-gray-800 text-white rounded px-3 py-2 text-sm" placeholder="Hint" value={form.hint} onChange={(e) => setForm({ ...form, hint: e.target.value })} />
          <input className="bg-gray-800 text-white rounded px-3 py-2 text-sm" type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: Number(e.target.value) })} />
          <input className="bg-gray-800 text-white rounded px-3 py-2 text-sm" type="number" value={form.order_index} onChange={(e) => setForm({ ...form, order_index: Number(e.target.value) })} />
        </div>
        <button className="px-3 py-1 rounded bg-terminal-green text-black text-sm font-semibold" onClick={createTask}>Create Task</button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
        <p className="text-white font-semibold">Validation Rule Tester</p>
        <textarea className="w-full bg-gray-800 text-white rounded px-3 py-2 text-sm font-mono" placeholder="Paste terminal output" value={testOutput} onChange={(e) => setTestOutput(e.target.value)} />
        <div className="flex items-center gap-3">
          <button className="px-3 py-1 rounded border border-gray-700 text-gray-300 text-sm" onClick={testRule}>Run Test</button>
          {testResult !== null && (
            <span className={`text-sm ${testResult ? 'text-terminal-green' : 'text-red-400'}`}>
              {testResult ? 'Passed' : 'Failed'}
            </span>
          )}
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <p className="text-white font-semibold mb-3">Tasks</p>
        <div className="space-y-2">
          {(tasksData || []).map((t: any) => (
            <div key={t.id} className="border border-gray-800 rounded px-3 py-2">
              <p className="text-sm text-white">{t.description}</p>
              <p className="text-xs text-gray-500 mt-1">{t.validation_type} · XP {t.xp_reward} · order {t.order_index}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAdmin(AdminTasksPage);
