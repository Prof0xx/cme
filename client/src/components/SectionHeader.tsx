import React from 'react';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  icon = <Flame className="h-5 w-5 text-brand" />,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <div className="flex items-center gap-3">
        <span className="bg-brand/10 p-2 rounded-md shadow-glow animate-pulse-brand">
          {icon}
        </span>
        <h2 className="section-header">
          {title}
        </h2>
      </div>
      {description && (
        <p className="mt-3 text-gray-400 max-w-2xl pl-12">
          {description}
        </p>
      )}
    </div>
  );
} 