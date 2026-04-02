import { useEffect } from 'react';
import Alert from '@/components/ui/Alert';
import Modal from '@/components/ui/Modal';
import LevelUpOverlay from '@/components/gamification/LevelUpOverlay';
import { useGamificationStore } from '@/store/gamification.store';

export default function GamificationHUD() {
  const toast = useGamificationStore((s) => s.toast);
  const clearToast = useGamificationStore((s) => s.clearToast);
  const liveBadge = useGamificationStore((s) => s.liveBadge);
  const clearBadge = useGamificationStore((s) => s.clearBadge);
  const levelUp = useGamificationStore((s) => s.levelUp);
  const clearLevelUp = useGamificationStore((s) => s.clearLevelUp);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => clearToast(), 2500);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  return (
    <>
      {toast && (
        <div className="fixed top-20 right-4 z-[60] w-80">
          <Alert type={toast.type} message={toast.message} />
        </div>
      )}

      <Modal open={!!liveBadge} onClose={clearBadge} title="Badge Earned">
        <p className="text-terminal-green font-bold text-lg">{liveBadge}</p>
      </Modal>

      <LevelUpOverlay open={!!levelUp} level={levelUp || 'beginner'} onClose={clearLevelUp} />
    </>
  );
}
