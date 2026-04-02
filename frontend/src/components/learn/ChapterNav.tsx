import Link from 'next/link';

interface Props {
  chapterId: string;
  lessons: { id: string; title: string }[];
  currentLessonId: string;
}

export default function ChapterNav({ chapterId, lessons, currentLessonId }: Props) {
  return (
    <nav className="p-4 border-t border-gray-800">
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
