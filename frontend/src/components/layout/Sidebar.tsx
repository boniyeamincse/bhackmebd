import Link from 'next/link';

interface SidebarProps {
  chapters: { id: string; title: string }[];
  currentChapterId?: string;
}

export default function Sidebar({ chapters, currentChapterId }: SidebarProps) {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 h-full overflow-y-auto p-4">
      <h2 className="text-terminal-green font-mono font-bold mb-4">Chapters</h2>
      <ul className="space-y-1">
        {chapters.map((ch) => (
          <li key={ch.id}>
            <Link href={`/learn/${ch.id}`}
              className={`block px-3 py-2 rounded text-sm ${ch.id === currentChapterId ? 'bg-terminal-green text-black font-bold' : 'text-gray-300 hover:bg-gray-800'}`}>
              {ch.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
