interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language }: Props) {
  return (
    <pre className="bg-gray-950 rounded-lg p-4 overflow-x-auto text-sm text-terminal-green font-mono border border-gray-800">
      <code>{code}</code>
    </pre>
  );
}
