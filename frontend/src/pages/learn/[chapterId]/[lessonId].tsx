import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import Navbar from '@/components/layout/Navbar';
import InstructionPanel from '@/components/learn/InstructionPanel';
import TerminalPanel from '@/components/learn/TerminalPanel';
import TaskCard from '@/components/learn/TaskCard';
import { withAuth } from '@/components/auth/withAuth';

function LearnPage() {
  const router = useRouter();
  const { lessonId } = router.query;
  const { token } = useAuthStore();

  const { data: lesson } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => api.get(`/lessons/${lessonId}`).then((r) => r.data.lesson),
    enabled: !!lessonId && !!token,
  });

  if (!lesson) return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 flex flex-col overflow-y-auto border-r border-gray-800">
          <InstructionPanel lesson={lesson} />
          {lesson.tasks?.map((task: any, i: number) => (
            <TaskCard key={task.id} task={task} index={i} />
          ))}
        </div>
        <div className="w-1/2 flex flex-col">
          <TerminalPanel lessonId={lesson.id} />
        </div>
      </div>
    </div>
  );
}

export default withAuth(LearnPage);
