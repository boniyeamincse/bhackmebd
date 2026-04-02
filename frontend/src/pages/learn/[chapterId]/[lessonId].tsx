import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useProgressStore } from '@/store/progress.store';
import Navbar from '@/components/layout/Navbar';
import InstructionPanel from '@/components/learn/InstructionPanel';
import TerminalPanel from '@/components/learn/TerminalPanel';
import TaskCard from '@/components/learn/TaskCard';
import ProgressBar from '@/components/learn/ProgressBar';
import ChapterNav from '@/components/learn/ChapterNav';
import Modal from '@/components/ui/Modal';
import Alert from '@/components/ui/Alert';
import { withAuth } from '@/components/auth/withAuth';
import { useSocket } from '@/hooks/useSocket';

type Lesson = {
  id: string;
  title: string;
  content_md: string;
  tasks: Array<{ id: string; description: string; hint?: string; xp_reward: number }>;
};

type Chapter = {
  id: string;
  lessons: Array<{ id: string; title: string }>;
};

type ProgressRow = {
  taskId: string;
  lessonId: string | null;
  status: string;
};

function LearnPage() {
  const router = useRouter();
  const { chapterId, lessonId } = router.query;
  const { token } = useAuthStore();
  const { socket } = useSocket();
  const markCompleted = useProgressStore((s) => s.markCompleted);
  const isCompleted = useProgressStore((s) => s.isCompleted);
  const [leftWidth, setLeftWidth] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [badgeModal, setBadgeModal] = useState<string | null>(null);
  const taskRefs = useRef<Array<HTMLDivElement | null>>([]);
  const splitRef = useRef<HTMLDivElement>(null);

  const { data: lesson } = useQuery<Lesson>({
    queryKey: ['lesson', lessonId],
    queryFn: () => api.get(`/lessons/${lessonId}`).then((r) => r.data.lesson),
    enabled: !!lessonId && !!token,
  });

  const { data: chapter } = useQuery<{ chapter: Chapter }>({
    queryKey: ['chapter', chapterId],
    queryFn: () => api.get(`/chapters/${chapterId}`).then((r) => r.data),
    enabled: !!chapterId && !!token,
  });

  const { data: progressData } = useQuery<{ progress: ProgressRow[] }>({
    queryKey: ['progress-map', lessonId],
    queryFn: () => api.get('/progress').then((r) => r.data),
    enabled: !!lessonId && !!token,
  });

  const completedTaskIds = useMemo(() => {
    const rows = progressData?.progress || [];
    return rows
      .filter((row) => row.lessonId === lessonId && row.status === 'completed')
      .map((row) => row.taskId);
  }, [progressData, lessonId]);

  useEffect(() => {
    completedTaskIds.forEach((taskId) => markCompleted(taskId));
  }, [completedTaskIds, markCompleted]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!socket) return;

    const onBadge = ({ badge }: { badge: string }) => {
      setBadgeModal(badge);
      setToast({ type: 'success', message: `Badge earned: ${badge}` });
    };

    socket.on('badge:earned', onBadge);
    return () => {
      socket.off('badge:earned', onBadge);
    };
  }, [socket]);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: MouseEvent) => {
      if (!splitRef.current) return;
      const rect = splitRef.current.getBoundingClientRect();
      const next = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.min(72, Math.max(28, next)));
    };

    const onUp = () => setDragging(false);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  const handleTaskComplete = (taskId: string, index: number, badges: string[] = []) => {
    markCompleted(taskId);
    setToast({ type: 'success', message: `+XP unlocked for Task ${index + 1}` });
    if (badges[0]) setBadgeModal(badges[0]);

    const nextEl = taskRefs.current[index + 1];
    if (nextEl) {
      nextEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!lesson) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading...</div>;

  const completedCount = lesson.tasks.filter((task) => isCompleted(task.id)).length;

  return (
    <div className="h-screen bg-[#05070a] flex flex-col overflow-hidden">
      <Navbar />
      {toast && (
        <div className="fixed top-20 right-4 z-50 w-80">
          <Alert type={toast.type} message={toast.message} />
        </div>
      )}
      <Modal open={!!badgeModal} onClose={() => setBadgeModal(null)} title="Achievement Unlocked">
        <div className="text-center py-4">
          <div className="w-20 h-20 bg-terminal-green/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-terminal-green/50 shadow-[0_0_20px_rgba(88,214,141,0.2)]">
             <span className="text-3xl text-terminal-green">🏆</span>
          </div>
          <p className="text-white font-black text-xl uppercase italic tracking-tighter mb-1">{badgeModal}</p>
          <p className="text-gray-500 text-sm font-mono">Rank increased. Special badge added to profile.</p>
        </div>
      </Modal>

      <div ref={splitRef} className="flex flex-1 overflow-hidden">
        {/* Left Side: Instructions and Tasks */}
        <div 
          style={{ width: `${leftWidth}%` }} 
          className="flex flex-col bg-white/[0.02] border-r border-white/5 relative group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-terminal-green/5 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
          
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="px-6 pt-8 pb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Operational Progress</span>
                <span className="text-[10px] font-mono text-terminal-green font-bold">{Math.round((completedCount/lesson.tasks.length)*100)}%</span>
              </div>
              <ProgressBar completed={completedCount} total={lesson.tasks.length} />
            </div>

            <div className="px-2">
              <InstructionPanel lesson={lesson} />
            </div>

            <div className="px-6 pb-20">
              <h3 className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                <span>Directives</span>
                <div className="h-px bg-white/5 flex-1" />
              </h3>
              {lesson.tasks?.map((task, i) => (
                <div
                  key={task.id}
                  ref={(el) => {
                    taskRefs.current[i] = el;
                  }}
                  className="mb-6"
                >
                  <TaskCard
                    task={task}
                    index={i}
                    isCompleted={isCompleted(task.id)}
                    onComplete={handleTaskComplete}
                    onToast={(message, type = 'info') => setToast({ message, type })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-black/40 backdrop-blur-md border-t border-white/5">
            {chapter?.chapter && lessonId && (
              <ChapterNav
                chapterId={String(chapterId)}
                lessons={chapter.chapter.lessons || []}
                currentLessonId={String(lessonId)}
              />
            )}
          </div>
        </div>

        {/* Resizer */}
        <div
          onMouseDown={() => setDragging(true)}
          className={`w-1 z-10 cursor-col-resize transition-all duration-300 hover:w-2
            ${dragging ? 'bg-terminal-green' : 'bg-white/5 hover:bg-terminal-green/30'}
          `}
        />

        {/* Right Side: Integrated Terminal */}
        <div className="flex-1 min-w-[320px] flex flex-col bg-black">
          <div className="px-4 py-2 bg-white/5 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
              </div>
              <div className="h-4 w-px bg-white/10 mx-1" />
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
                Terminal_Session.sh
              </span>
            </div>
            <span className="text-[10px] font-mono text-gray-600">SSH: root@bhackme_vps</span>
          </div>
          <div className="flex-1">
            <TerminalPanel lessonId={lesson.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(LearnPage);
