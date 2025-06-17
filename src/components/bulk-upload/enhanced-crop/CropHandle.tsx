
import React from 'react';
import { RotateCw, Move } from 'lucide-react';

interface CropHandleProps {
  type: 'corner' | 'edge' | 'rotation' | 'center';
  position: string;
  size: number;
  color: string;
  style: React.CSSProperties;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const CropHandle: React.FC<CropHandleProps> = ({
  type,
  position,
  size,
  color,
  style,
  onMouseDown
}) => {
  const getHandleClasses = () => {
    const baseClasses = "absolute border-2 border-white shadow-md hover:scale-110 transition-all";
    
    switch (type) {
      case 'corner':
        return `${baseClasses} bg-crd-green cursor-pointer`;
      case 'edge':
        return `${baseClasses} bg-crd-blue cursor-pointer`;
      case 'rotation':
        return `${baseClasses} bg-gradient-to-r from-crd-blue to-crd-green rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing`;
      case 'center':
        return `${baseClasses} bg-crd-green/90 rounded-md flex items-center justify-center cursor-move`;
      default:
        return baseClasses;
    }
  };

  const getHandleSize = () => {
    switch (type) {
      case 'corner':
        return { width: size, height: size };
      case 'edge':
        return position === 't' || position === 'b' 
          ? { width: size * 2, height: size - 2 }
          : { width: size, height: size * 2 };
      case 'rotation':
        return { width: size + 4, height: size + 4 };
      case 'center':
        return { width: size + 2, height: size + 2 };
      default:
        return { width: size, height: size };
    }
  };

  return (
    <div
      className={getHandleClasses()}
      style={{
        ...getHandleSize(),
        backgroundColor: type === 'edge' ? `${color}80` : type === 'rotation' ? color : type === 'center' ? `${color}90` : color,
        ...style
      }}
      onMouseDown={onMouseDown}
    >
      {type === 'rotation' && <RotateCw className="w-3 h-3 text-white" />}
      {type === 'center' && <Move className="w-3 h-3 text-white" />}
    </div>
  );
};
