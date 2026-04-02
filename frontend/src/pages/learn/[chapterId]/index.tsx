import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { withAuth } from '@/components/auth/withAuth';

type ChapterResponse = {
  chapter: {
    lessons?: Array<{ id: string }>;
  };
};

function ChapterEntryPage() {
  const router = useRouter();
  const { chapterId } = router.query;

  const { data, isLoading } = useQuery<ChapterResponse>({
    queryKey: ['chapter-entry', chapterId],
    queryFn: () => api.get(`/chapters/${chapterId}`).then((r) => r.data),
    enabled: !!chapterId,
  });

  useEffect(() => {
    const firstLesson = data?.chapter?.lessons?.[0]?.id;
    if (chapterId && firstLesson) {
      router.replace(`/learn/${chapterId}/${firstLesson}`);
    }
  }, [chapterId, data, router]);

  if (isLoading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">Loading chapter...</div>;
  }

  return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-gray-400">No published lessons found for this chapter.</div>;
}

export default withAuth(ChapterEntryPage);
