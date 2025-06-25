import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface FullscreenModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const FullscreenModal: React.FC<FullscreenModalProps> = ({ isOpen, onClose, children, className = '' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center w-screen h-screen overflow-y-auto transition-all duration-300 ${className}`}
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[100000] bg-white/90 hover:bg-white rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Close modal"
        tabIndex={0}
      >
        <X className="w-7 h-7 text-gray-900" />
      </button>
      <div className="w-full h-full p-4 sm:p-8 flex flex-col justify-center overflow-y-auto">
        {children}
      </div>
      <style jsx global>{`
        body.modal-open #navbar,
        body.modal-open #sidebar,
        body.modal-open #main-content {
          filter: blur(8px) grayscale(0.5) brightness(0.7);
          pointer-events: none;
          user-select: none;
        }
      `}</style>
    </div>,
    typeof window !== 'undefined' && document.body ? document.body : document.createElement('div')
  );
};

export default FullscreenModal; 