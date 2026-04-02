'use client';
import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import 'xterm/css/xterm.css';
import { useSocket } from '@/hooks/useSocket';

interface Props {
  lessonId: string;
}

const TerminalEmulator = ({ lessonId }: Props) => {
  const termRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (!termRef.current || !socket) return;

    const term = new Terminal({
      theme: { background: '#0d1117', foreground: '#58d68d', cursor: '#58d68d' },
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: 14,
      cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(new WebLinksAddon());
    term.open(termRef.current);
    fitAddon.fit();

    term.onData((data) => socket.emit('terminal:input', { data }));

    const handleOutput = ({ data }: { data: string }) => term.write(data);
    socket.on('terminal:output', handleOutput);
    socket.emit('terminal:connect', { lessonId });

    const resizeObserver = new ResizeObserver(() => fitAddon.fit());
    resizeObserver.observe(termRef.current);

    return () => {
      socket.off('terminal:output', handleOutput);
      socket.emit('terminal:disconnect', {});
      term.dispose();
      resizeObserver.disconnect();
    };
  }, [socket, lessonId]);

  return <div ref={termRef} className="h-full w-full" />;
};

export default TerminalEmulator;
