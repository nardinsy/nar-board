import { useEffect, useId } from 'react';
import { XIcon } from 'lucide-react';
import { createPortal } from 'react-dom';

const ModalBackdrop = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="absolute inset-0 bg-white/40 backdrop-blur-xs transition-all animate-in"
    />
  );
};

export const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const titleId = useId();
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center">
      <ModalBackdrop onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-3/4 md:w-1/2 bg-white rounded-md p-4 shadow-2xl"
      >
        <header className="flex justify-between pb-2">
          <h2 id={titleId} className="text-xl">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close dialog"
            className="text-gray-400 hover:text-gray-600 hover:bg-white rounded-full p-1 transition-colors cursor-pointer"
            onClick={onClose}
          >
            <XIcon />
          </button>
        </header>

        {children}
      </div>
    </div>,
    document.body
  );
};
