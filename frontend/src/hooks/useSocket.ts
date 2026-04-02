import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';
import { useTerminalStore } from '@/store/terminal.store';

let socket: Socket | null = null;
let consumers = 0;
let refreshInFlight: Promise<string | null> | null = null;

const requestTokenRefresh = async (): Promise<string | null> => {
  const { refreshToken, setToken } = useAuthStore.getState();
  if (!refreshToken) return null;

  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const res = await fetch(`${apiBase}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const nextAccessToken = data?.accessToken || null;
  if (nextAccessToken) setToken(nextAccessToken);
  return nextAccessToken;
};

export const useSocket = () => {
  const { token } = useAuthStore();
  const [currentSocket, setCurrentSocket] = useState<Socket | null>(socket);

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect();
        socket = null;
        consumers = 0;
      }
      setCurrentSocket(null);
      useTerminalStore.getState().setConnected(false);
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
      socket.on('connect_error', async (err: Error) => {
        const msg = err?.message || '';
        if (!/invalid token|authentication required|jwt expired/i.test(msg)) return;

        try {
          if (!refreshInFlight) {
            refreshInFlight = requestTokenRefresh().finally(() => {
              refreshInFlight = null;
            });
          }

          const nextAccessToken = await refreshInFlight;
          if (!nextAccessToken || !socket) {
            useAuthStore.getState().clearAuth();
            return;
          }

          socket.auth = { token: nextAccessToken };
          if (!socket.connected) socket.connect();
        } catch {
          useAuthStore.getState().clearAuth();
        }
      });
      socket.on('terminal:output', ({ data }: { data: string }) =>
        useTerminalStore.getState().appendOutput(data)
      );
      setCurrentSocket(socket);
    } else {
      // Keep auth in sync when token rotates.
      socket.auth = { token };
      setCurrentSocket(socket);
    }

    return () => {
      consumers = Math.max(0, consumers - 1);
      if (consumers === 0 && socket) {
        socket.removeAllListeners('connect');
        socket.removeAllListeners('disconnect');
        socket.removeAllListeners('connect_error');
        socket.removeAllListeners('terminal:output');
        socket.disconnect();
        socket = null;
        setCurrentSocket(null);
        useTerminalStore.getState().setConnected(false);
      }
    };
  }, [token]);

  return { socket: currentSocket };
};
