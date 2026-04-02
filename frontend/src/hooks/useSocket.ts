import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';
import { useTerminalStore } from '@/store/terminal.store';

let socket: Socket | null = null;
let consumers = 0;

export const useSocket = () => {
  const { token } = useAuthStore();
  const setConnected = useTerminalStore((s) => s.setConnected);
  const appendOutput = useTerminalStore((s) => s.appendOutput);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        socket = null;
        consumers = 0;
      }
      setConnected(false);
      return;
    }

    consumers += 1;

    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000', {
        auth: { token },
        transports: ['polling', 'websocket'],
      });

      socket.on('connect', () => useTerminalStore.getState().setConnected(true));
      socket.on('disconnect', () => useTerminalStore.getState().setConnected(false));
      socket.on('terminal:output', ({ data }: { data: string }) =>
        useTerminalStore.getState().appendOutput(data)
      );
    } else {
      // Keep auth in sync when token rotates.
      socket.auth = { token };
    }

    return () => {
      consumers = Math.max(0, consumers - 1);
      if (consumers === 0 && socket) {
        socket.removeAllListeners('connect');
        socket.removeAllListeners('disconnect');
        socket.removeAllListeners('terminal:output');
        socket.disconnect();
        socket = null;
        setConnected(false);
      }
    };
  }, [token, setConnected, appendOutput]);

  return { socket };
};
