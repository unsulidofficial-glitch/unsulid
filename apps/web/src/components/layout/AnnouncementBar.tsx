import React from 'react';
import { ChevronLeft, ChevronRight, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnnouncementBarProps {
  message?: string;
  className?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  message = 'Free Shipping on Orders Above ₹999 | 100% Authentic Fragrances',
  className,
}) => {
  return (
    <aside
      aria-label="Shipping Announcement"
      className={cn(
        'w-full max-w-full bg-[#460910] text-[#F8F1E7] py-2 px-3 sm:px-4 border-b border-white/10 relative z-40 select-none overflow-hidden',
        className
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-[13px] font-sans gap-2">
        <button
          type="button"
          aria-label="Previous announcement"
          className="text-white/70 hover:text-white transition-colors p-0.5 shrink-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 min-w-0 flex items-center justify-center gap-1.5 text-center overflow-hidden">
          <Truck className="w-3.5 h-3.5 text-[#F8F1E7] shrink-0" aria-hidden="true" />
          <span className="tracking-tight sm:tracking-wide truncate block text-[11px] sm:text-xs font-medium">
            <span className="sm:hidden">{message.includes('|') ? message.split('|')[0].trim() : message}</span>
            <span className="hidden sm:inline">{message}</span>
          </span>
        </div>

        <button
          type="button"
          aria-label="Next announcement"
          className="text-white/70 hover:text-white transition-colors p-0.5 shrink-0"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

export default AnnouncementBar;
