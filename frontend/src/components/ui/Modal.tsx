import { ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        {title && <h3 className="text-white font-bold text-lg mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
}
