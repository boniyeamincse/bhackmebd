import { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useAuthStore } from '@/store/auth.store';
import { useGamificationStore } from '@/store/gamification.store';

export default function GamificationEvents() {
  const { socket } = useSocket();
  const setAuth = useAuthStore((s) => s.setAuth);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const refreshToken = useAuthStore((s) => s.refreshToken);

  const showBadge = useGamificationStore((s) => s.showBadge);
  const showLevelUp = useGamificationStore((s) => s.showLevelUp);
  const showToast = useGamificationStore((s) => s.showToast);

  useEffect(() => {
    if (!socket || !user || !token) return;

    const onBadge = ({ badge }: { badge: string }) => {
      const hasBadge = user.badges.includes(badge);
      if (!hasBadge) {
        setAuth({ ...user, badges: [...user.badges, badge] }, token, refreshToken);
      }
      showBadge(badge);
      showToast(`Badge earned: ${badge}`, 'success');
    };

    const onTaskResult = (payload: { success?: boolean; levelUp?: boolean; level?: string; totalXp?: number }) => {
      if (!payload?.success) return;

      const nextXp = typeof payload.totalXp === 'number' ? payload.totalXp : user.total_xp;
      const nextLevel = payload.level || user.level;

      if (nextXp !== user.total_xp || nextLevel !== user.level) {
        setAuth({ ...user, total_xp: nextXp, level: nextLevel }, token, refreshToken);
      }

      if (payload.levelUp && payload.level) {
        showLevelUp(payload.level);
      }
    };

    socket.on('badge:earned', onBadge);
    socket.on('task:result', onTaskResult);

    return () => {
      socket.off('badge:earned', onBadge);
      socket.off('task:result', onTaskResult);
    };
  }, [socket, user, token, refreshToken, setAuth, showBadge, showLevelUp, showToast]);

  return null;
}
