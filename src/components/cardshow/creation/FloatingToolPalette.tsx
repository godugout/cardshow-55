
import React, { useState, useRef } from 'react';
import { Move, ChevronDown, ChevronUp } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

interface FloatingToolPaletteProps {
  tools: Tool[];
  activeTool: string;
  onToolSelect: (toolId: string) => void;
  position: { x: number; y: number };
  onPositionChange: (position: { x: number; y: number }) => void;
  visible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

export const FloatingToolPalette: React.FC<FloatingToolPaletteProps> = ({
  tools,
  activeTool,
  onToolSelect,
  position,
  onPositionChange,
  visible,
  onVisibilityChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setIsDragging(true);
    dragRef.current = {
      startX: clientX,
      startY: clientY,
      startPosX: position.x,
      startPosY: position.y
    };
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !dragRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - dragRef.current.startX;
    const deltaY = clientY - dragRef.current.startY;
    
    const newX = Math.max(0, Math.min(window.innerWidth - 200, dragRef.current.startPosX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - 200, dragRef.current.startPosY + deltaY));
    
    onPositionChange({ x: newX, y: newY });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    dragRef.current = null;
  };

  if (!visible) return null;

  const groupedTools = tools.reduce((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {} as Record<string, Tool[]>);

  return (
    <div
      className={`fixed bg-[#2d2d2d] rounded-2xl shadow-2xl border border-gray-600 z-50 transition-all duration-300 ${
        isDragging ? 'scale-105' : ''
      }`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
      }}
      onTouchMove={handleDragMove}
      onMouseMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Drag Handle */}
      <div
        className="flex items-center justify-between p-3 border-b border-gray-600 cursor-move touch-manipulation"
        onTouchStart={handleDragStart}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-gray-400" />
          <span className="text-white text-sm font-medium">Tools</span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {/* Tool Grid */}
      {!isCollapsed && (
        <div className="p-3">
          {Object.entries(groupedTools).map(([category, categoryTools]) => (
            <div key={category} className="mb-3 last:mb-0">
              <div className="text-xs text-gray-400 uppercase tracking-wide mb-2 px-1">
                {category}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {categoryTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => onToolSelect(tool.id)}
                      className={`p-3 rounded-lg transition-all duration-200 touch-target flex flex-col items-center gap-1 ${
                        activeTool === tool.id
                          ? 'bg-[#00C851] text-black'
                          : 'bg-[#3d3d3d] text-white hover:bg-[#4d4d4d]'
                      }`}
                      title={tool.name}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs truncate max-w-full">{tool.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Minimize Button */}
      <div className="flex justify-center p-2 border-t border-gray-600">
        <button
          onClick={() => onVisibilityChange(false)}
          className="text-gray-400 hover:text-white transition-colors text-xs"
        >
          Hide
        </button>
      </div>
    </div>
  );
};
