import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  lesson: { title: string; content_md: string };
}

export default function InstructionPanel({ lesson }: Props) {
  return (
    <div className="p-6 text-gray-200">
      <h2 className="text-xl font-bold text-terminal-green font-mono mb-4">{lesson.title}</h2>
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.content_md}</ReactMarkdown>
      </div>
    </div>
  );
}
