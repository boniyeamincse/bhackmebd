import Link from 'next/link';

interface Props {
  chapterId: string;
  lessons: { id: string; title: string }[];
  currentLessonId: string;
}

export default function ChapterNav({ chapterId, lessons, currentLessonId }: Props) {
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  const prev = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <nav className="p-4 border-t border-gray-800">
      <div className="flex items-center justify-between mb-3 gap-2">
        {prev ? (
          <Link href={`/learn/${chapterId}/${prev.id}`} className="text-xs px-3 py-1 rounded border border-gray-700 text-gray-300 hover:bg-gray-800">
            ← Previous
          </Link>
        ) : (
          <span className="text-xs px-3 py-1 rounded border border-gray-800 text-gray-600">← Previous</span>
        )}

        {next ? (
          <Link href={`/learn/${chapterId}/${next.id}`} className="text-xs px-3 py-1 rounded border border-gray-700 text-gray-300 hover:bg-gray-800">
            Next →
          </Link>
        ) : (
          <span className="text-xs px-3 py-1 rounded border border-gray-800 text-gray-600">Next →</span>
        )}
      </div>
      <ul className="space-y-1">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link href={`/learn/${chapterId}/${lesson.id}`}
              className={`block text-sm px-3 py-2 rounded ${lesson.id === currentLessonId ? 'text-terminal-green font-bold' : 'text-gray-400 hover:text-white'}`}>
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
