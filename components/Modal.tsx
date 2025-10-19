import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity duration-300 ease-in-out" 
      onClick={onClose}
    >
      <div 
        className={`bg-surface rounded-xl shadow-2xl p-6 w-full ${sizeClasses[size]} transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale`} 
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fade-in-scale 0.3s forwards' }}
      >
        <div className="flex justify-between items-center pb-4 border-b border-slate-600">
          <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
          <button onClick={onClose} className="text-text-secondary hover:text-text-primary transition-colors p-1 rounded-full hover:bg-surface-light">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-5">
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in-scale {
            animation: fade-in-scale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
