
export interface EdgeVisibility {
  rightOpacity: number;
  leftOpacity: number;
  isVisible: boolean;
}

export const calculateEdgeVisibility = (rotation: { x: number; y: number }): EdgeVisibility => {
  const normalizedRotation = ((rotation.y % 360) + 360) % 360;
  
  // Determine which edges are visible based on rotation
  const rightEdgeVisible = normalizedRotation >= 45 && normalizedRotation <= 135;
  const leftEdgeVisible = normalizedRotation >= 225 && normalizedRotation <= 315;
  
  let rightOpacity = 0;
  let leftOpacity = 0;
  
  if (rightEdgeVisible) {
    // Peak visibility at 90° for right edge
    const angleFromPeak = Math.abs(normalizedRotation - 90);
    rightOpacity = Math.max(0, 1 - (angleFromPeak / 45));
  }
  
  if (leftEdgeVisible) {
    // Peak visibility at 270° for left edge
    const angleFromPeak = Math.abs(normalizedRotation - 270);
    leftOpacity = Math.max(0, 1 - (angleFromPeak / 45));
  }
  
  return { 
    rightOpacity: Math.max(0.1, rightOpacity),
    leftOpacity: Math.max(0.1, leftOpacity),
    isVisible: rightOpacity > 0.1 || leftOpacity > 0.1
  };
};
