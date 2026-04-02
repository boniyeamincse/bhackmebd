'use client';
import { useEffect, useRef } from 'react';
import 'xterm/css/xterm.css';
import { useSocket } from '@/hooks/useSocket';
import { useTerminalStore } from '@/store/terminal.store';

interface Props {
  lessonId: string;
}

const TerminalEmulator = ({ lessonId }: Props) => {
  const termRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const startSession = useTerminalStore((s) => s.startSession);
  const setConnected = useTerminalStore((s) => s.setConnected);

  useEffect(() => {
    if (!termRef.current || !socket) return;

    let term: any;
    let fitAddon: any;
    let resizeObserver: ResizeObserver | undefined;
    let isDisposed = false;

    const setup = async () => {
      const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all([
        import('xterm'),
        import('xterm-addon-fit'),
        import('xterm-addon-web-links'),
      ]);

      if (isDisposed || !termRef.current) return;

      term = new Terminal({
        theme: { background: '#0d1117', foreground: '#58d68d', cursor: '#58d68d' },
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 14,
        cursorBlink: true,
      });

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());
      term.open(termRef.current);
      fitAddon.fit();

      term.onData((data: string) => socket.emit('terminal:input', { data }));
      socket.on('terminal:output', handleOutput);
      socket.emit('terminal:connect', { lessonId });
      startSession(lessonId);
      setConnected(true);

      resizeObserver = new ResizeObserver(() => fitAddon.fit());
      resizeObserver.observe(termRef.current);
    };

    const handleOutput = ({ data }: { data: string }) => {
      if (term) term.write(data);
    };

    setup();

    return () => {
      isDisposed = true;
      socket.off('terminal:output', handleOutput);
      socket.emit('terminal:disconnect', {});
      setConnected(false);
      if (term) term.dispose();
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [socket, lessonId, startSession, setConnected]);

  return <div ref={termRef} className="h-full w-full" />;
};

export default TerminalEmulator;
