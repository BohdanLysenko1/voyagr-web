import React, { useEffect, useState, useRef, ReactNode, forwardRef } from 'react';
import { X } from 'lucide-react';

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

interface SheetContentProps {
  side?: 'left' | 'right' | 'top' | 'bottom';
  className?: string;
  children: ReactNode;
  onClose?: () => void;
}

interface SheetTriggerProps {
  asChild?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

interface SheetHeaderProps {
  children: ReactNode;
  className?: string;
}

interface SheetTitleProps {
  children: ReactNode;
  className?: string;
}

interface SheetDescriptionProps {
  children: ReactNode;
  className?: string;
}

// Sheet Context
interface SheetContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType | null>(null);

const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error('Sheet components must be used within a Sheet');
  }
  return context;
};

// Main Sheet component
export const Sheet: React.FC<SheetProps> = ({ 
  open = false, 
  onOpenChange = () => {}, 
  children 
}) => {
  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetContext.Provider>
  );
};

// Sheet Trigger
export const SheetTrigger: React.FC<SheetTriggerProps> = ({ 
  asChild = false, 
  children, 
  onClick 
}) => {
  const { onOpenChange } = useSheet();

  const handleClick = () => {
    onClick?.();
    onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onClick: handleClick,
    });
  }

  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
};

// Sheet Content with swipe support
export const SheetContent = forwardRef<HTMLDivElement, SheetContentProps>(
  ({ side = 'left', className = '', children, onClose }, ref) => {
    const { open, onOpenChange } = useSheet();
    const [isVisible, setIsVisible] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState(0);
    const [dragOffset, setDragOffset] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Handle escape key
    useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && open) {
          onOpenChange(false);
          onClose?.();
        }
      };

      if (open) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
        setIsVisible(true);
      } else {
        document.body.style.overflow = '';
        const timer = setTimeout(() => setIsVisible(false), 300);
        return () => clearTimeout(timer);
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }, [open, onOpenChange, onClose]);

    // Handle swipe gestures for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart(side === 'left' ? touch.clientX : window.innerWidth - touch.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return;
      
      const touch = e.touches[0];
      let currentPosition = side === 'left' ? touch.clientX : window.innerWidth - touch.clientX;
      let offset = currentPosition - dragStart;
      
      // Only allow dragging in the close direction
      if (side === 'left' && offset < 0) {
        setDragOffset(offset);
      } else if (side === 'right' && offset < 0) {
        setDragOffset(offset);
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging) return;
      
      const threshold = -100; // 100px threshold to close
      
      if (dragOffset < threshold) {
        onOpenChange(false);
        onClose?.();
      }
      
      setIsDragging(false);
      setDragStart(0);
      setDragOffset(0);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onOpenChange(false);
        onClose?.();
      }
    };

    if (!isVisible) return null;

    const sideStyles = {
      left: {
        transform: open && !isDragging 
          ? 'translateX(0)' 
          : `translateX(${isDragging ? `calc(-100% + ${Math.abs(dragOffset)}px)` : '-100%'})`,
        left: '0',
        top: '0',
        bottom: '0',
        borderRadius: '0 1.5rem 1.5rem 0',
      },
      right: {
        transform: open && !isDragging 
          ? 'translateX(0)' 
          : `translateX(${isDragging ? `calc(100% - ${Math.abs(dragOffset)}px)` : '100%'})`,
        right: '0',
        top: '0',
        bottom: '0',
        borderRadius: '1.5rem 0 0 1.5rem',
      },
      top: {
        transform: open ? 'translateY(0)' : 'translateY(-100%)',
        top: '0',
        left: '0',
        right: '0',
        borderRadius: '0 0 1.5rem 1.5rem',
      },
      bottom: {
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        bottom: '0',
        left: '0',
        right: '0',
        borderRadius: '1.5rem 1.5rem 0 0',
      },
    };

    return (
      <div
        ref={overlayRef}
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          open ? 'backdrop-blur-md bg-black/30' : 'backdrop-blur-none bg-black/0'
        }`}
        onClick={handleBackdropClick}
        style={{ 
          visibility: open ? 'visible' : 'hidden',
          opacity: open ? 1 : 0,
        }}
      >
        <div
          ref={ref || contentRef}
          className={`fixed bg-white/95 backdrop-blur-xl backdrop-saturate-150 shadow-2xl transition-all duration-300 ease-out border border-white/40 ${
            side === 'left' || side === 'right' ? 'w-80 max-w-[85vw] h-full' : 'h-80 max-h-[85vh] w-full'
          } ${className}`}
          style={sideStyles[side]}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    );
  }
);

SheetContent.displayName = 'SheetContent';

// Sheet Header
export const SheetHeader: React.FC<SheetHeaderProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col space-y-1.5 text-center sm:text-left p-6 border-b border-white/20 ${className}`}>
      {children}
    </div>
  );
};

// Sheet Title
export const SheetTitle: React.FC<SheetTitleProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
};

// Sheet Description
export const SheetDescription: React.FC<SheetDescriptionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
  );
};

// Sheet Close Button
export const SheetClose: React.FC<{ 
  className?: string; 
  children?: ReactNode;
  onClick?: () => void;
}> = ({ 
  className = '', 
  children,
  onClick 
}) => {
  const { onOpenChange } = useSheet();

  const handleClose = () => {
    onClick?.();
    onOpenChange(false);
  };

  return (
    <button
      onClick={handleClose}
      className={`absolute top-4 right-4 p-2 rounded-full bg-white/60 hover:bg-white/80 transition-colors duration-200 ${className}`}
      aria-label="Close"
    >
      {children || <X className="w-4 h-4 text-gray-700" />}
    </button>
  );
};

export default Sheet;
