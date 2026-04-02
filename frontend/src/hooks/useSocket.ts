import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/auth.store';

let socket: Socket | null = null;

export const useSocket = () => {
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token || socket?.connected) return;

    socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
      transports: ['websocket'],
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [token]);

  return { socket };
};
