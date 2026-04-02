import Link from 'next/link';
import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Navbar from '@/components/layout/Navbar';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/chapters', label: 'Chapters' },
  { href: '/admin/lessons', label: 'Lessons' },
  { href: '/admin/tasks', label: 'Tasks' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/containers', label: 'Containers' },
];

interface Props {
  title: string;
  children: ReactNode;
}

export default function AdminLayout({ title, children }: Props) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-5">Admin · {title}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          <aside className="bg-gray-900 border border-gray-800 rounded-xl p-3 h-fit">
            <nav className="space-y-1">
              {links.map((item) => {
                const active = router.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 rounded text-sm ${active ? 'bg-terminal-green text-black font-semibold' : 'text-gray-300 hover:bg-gray-800'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
          <section className="space-y-4">{children}</section>
        </div>
      </div>
    </div>
  );
}
