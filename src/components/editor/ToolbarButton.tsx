
import React, { ReactNode } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

interface ToolbarButtonProps {
  icon: ReactNode;
  tooltip: string;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  badge?: string | number;
}

export const ToolbarButton = ({ 
  icon, 
  tooltip, 
  active = false, 
  onClick, 
  disabled = false,
  badge
}: ToolbarButtonProps) => {
  return (
    <div className="relative">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className={`h-8 w-8 p-1.5 ${
              active 
                ? 'bg-crd-blue border-crd-blue text-white hover:bg-crd-blue/90' 
                : 'border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray/40 hover:text-white'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onClick}
            disabled={disabled}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="py-1 px-2 text-xs">
          {tooltip}
        </TooltipContent>
      </Tooltip>
      {badge !== undefined && (
        <span className="absolute -top-1 -right-1 bg-crd-orange text-white text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </div>
  );
};
