interface Props {
  type?: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

const styles = {
  success: 'bg-green-900 border-terminal-green text-terminal-green',
  error: 'bg-red-900 border-red-500 text-red-400',
  warning: 'bg-yellow-900 border-yellow-500 text-yellow-400',
  info: 'bg-blue-900 border-blue-500 text-blue-400',
};

export default function Alert({ type = 'info', message }: Props) {
  return (
    <div className={`border-l-4 px-4 py-3 rounded text-sm ${styles[type]}`}>
      {message}
    </div>
  );
}
