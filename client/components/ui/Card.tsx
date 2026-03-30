import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false,
  onClick 
}) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-card rounded-2xl p-6 border border-gray-200 dark:border-gray-800',
        hover && 'hover:bg-gray-50 dark:hover:bg-cardHover hover:border-gray-300 dark:hover:border-gray-700 cursor-pointer transition-all duration-200',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
