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
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />
      {toast && (
        <div className="fixed top-20 right-4 z-40 w-80">
          <Alert type={toast.type} message={toast.message} />
        </div>
      )}
      <Modal open={!!badgeModal} onClose={() => setBadgeModal(null)} title="Badge Earned">
        <p className="text-terminal-green font-bold">{badgeModal}</p>
      </Modal>

      <div ref={splitRef} className="flex flex-1 overflow-hidden">
        <div style={{ width: `${leftWidth}%` }} className="flex flex-col overflow-y-auto border-r border-gray-800">
          <div className="px-6 pt-5">
            <ProgressBar completed={completedCount} total={lesson.tasks.length} />
          </div>
          <InstructionPanel lesson={lesson} />
          {lesson.tasks?.map((task, i) => (
            <div
              key={task.id}
              ref={(el) => {
                taskRefs.current[i] = el;
              }}
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

          {chapter?.chapter && lessonId && (
            <ChapterNav
              chapterId={String(chapterId)}
              lessons={chapter.chapter.lessons || []}
              currentLessonId={String(lessonId)}
            />
          )}
        </div>

        <div
          onMouseDown={() => setDragging(true)}
          className="w-2 cursor-col-resize bg-gray-900 hover:bg-terminal-green/50 transition"
          title="Resize panels"
        />

        <div className="flex-1 min-w-[320px] flex flex-col">
          <TerminalPanel lessonId={lesson.id} />
        </div>
      </div>
    </div>
  );
}

export default withAuth(LearnPage);
