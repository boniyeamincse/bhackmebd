import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { useSocket } from './useSocket';

export const useTerminal = (containerRef: React.RefObject<HTMLDivElement>, lessonId: string) => {
  const { socket } = useSocket();
  const termRef = useRef<Terminal | null>(null);

  useEffect(() => {
    if (!containerRef.current || !socket) return;

    const term = new Terminal({
      theme: { background: '#0d1117', foreground: '#58d68d', cursor: '#58d68d' },
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(containerRef.current);
    fit.fit();
    termRef.current = term;

    term.onData((data) => socket.emit('terminal:input', { data }));
    socket.on('terminal:output', ({ data }: { data: string }) => term.write(data));
    socket.emit('terminal:connect', { lessonId });

    return () => {
      socket.emit('terminal:disconnect', {});
      term.dispose();
    };
  }, [containerRef, socket, lessonId]);

  return { terminal: termRef.current };
};
