
import React from 'react';
import { Button } from '@/components/ui/button';
import { Box, Eye } from 'lucide-react';
import { useDeviceCapabilities } from '../3d/hooks/useDeviceCapabilities';

interface Card3DToggleProps {
  is3D: boolean;
  onToggle: (is3D: boolean) => void;
  className?: string;
}

export const Card3DToggle: React.FC<Card3DToggleProps> = ({
  is3D,
  onToggle,
  className = ''
}) => {
  const capabilities = useDeviceCapabilities();

  // Don't show toggle for fallback devices
  if (capabilities.tier === 'fallback') {
    return null;
  }

  return (
    <Button
      variant={is3D ? 'default' : 'outline'}
      size="sm"
      onClick={() => onToggle(!is3D)}
      className={`${className} ${is3D ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
    >
      {is3D ? <Box className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
      {is3D ? '3D View' : '2D View'}
    </Button>
  );
};
