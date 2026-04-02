import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';
import { useTerminalStore } from '@/store/terminal.store';

let socket: Socket | null = null;

export const useSocket = () => {
  const { token } = useAuthStore();
  const setConnected = useTerminalStore((s) => s.setConnected);
  const appendOutput = useTerminalStore((s) => s.appendOutput);

  useEffect(() => {
    if (!token || socket?.connected) return;

    socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000', {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('terminal:output', ({ data }: { data: string }) => appendOutput(data));

    return () => {
      socket?.off('connect');
      socket?.off('disconnect');
      socket?.off('terminal:output');
      setConnected(false);
      socket?.disconnect();
      socket = null;
    };
  }, [token, setConnected, appendOutput]);

  return { socket };
};
