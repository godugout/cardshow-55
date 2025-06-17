
export const processImageToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Standard card dimensions - portrait aspect ratio
      const cardWidth = 350;
      const cardHeight = 490;
      
      canvas.width = cardWidth;
      canvas.height = cardHeight;
      
      // Fill with white background
      ctx!.fillStyle = '#ffffff';
      ctx!.fillRect(0, 0, canvas.width, canvas.height);
      
      // Calculate scaling to FILL the canvas (crop if necessary)
      const scaleX = cardWidth / img.width;
      const scaleY = cardHeight / img.height;
      const scale = Math.max(scaleX, scaleY); // Use max to fill, not fit
      
      // Calculate dimensions and position to center the image
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const x = (cardWidth - scaledWidth) / 2;
      const y = (cardHeight - scaledHeight) / 2;
      
      // Draw the image to fill the entire card
      ctx!.drawImage(img, x, y, scaledWidth, scaledHeight);
      
      // Add subtle border for better card appearance
      ctx!.strokeStyle = '#e0e0e0';
      ctx!.lineWidth = 2;
      ctx!.strokeRect(1, 1, cardWidth - 2, cardHeight - 2);
      
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};
