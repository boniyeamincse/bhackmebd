import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from '@/components/ui/CodeBlock';

interface Props {
  lesson: { title: string; content_md: string };
}

export default function InstructionPanel({ lesson }: Props) {
  return (
    <div className="p-6 text-gray-200">
      <h2 className="text-xl font-bold text-terminal-green font-mono mb-4">{lesson.title}</h2>
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const { className, children, ...rest } = props;
              const match = /language-(\w+)/.exec(className || '');
              const code = String(children).replace(/\n$/, '');

              if (!className) {
                return (
                  <code className="px-1 py-0.5 rounded bg-gray-800 text-terminal-green" {...rest}>
                    {children}
                  </code>
                );
              }

              return <CodeBlock code={code} language={match?.[1]} />;
            },
          }}
        >
          {lesson.content_md}
        </ReactMarkdown>
      </div>
    </div>
  );
}
