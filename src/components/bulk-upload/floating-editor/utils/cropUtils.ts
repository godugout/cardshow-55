
interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export const createCroppedImage = async (
  imageUrl: string,
  cropArea: CropArea,
  imagePosition: { x: number; y: number },
  imageDimensions: { width: number; height: number }
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 350;
    canvas.height = 490;

    const img = new Image();
    img.onload = () => {
      // Calculate the scale factor between display image and actual image
      const scaleX = img.naturalWidth / imageDimensions.width;
      const scaleY = img.naturalHeight / imageDimensions.height;

      // Calculate crop area relative to the image (not canvas)
      const relativeX = (cropArea.x - imagePosition.x) * scaleX;
      const relativeY = (cropArea.y - imagePosition.y) * scaleY;
      const relativeWidth = cropArea.width * scaleX;
      const relativeHeight = cropArea.height * scaleY;

      // Apply the crop with rotation
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((cropArea.rotation * Math.PI) / 180);
      
      ctx.drawImage(
        img,
        Math.max(0, relativeX), 
        Math.max(0, relativeY), 
        Math.min(relativeWidth, img.naturalWidth - Math.max(0, relativeX)), 
        Math.min(relativeHeight, img.naturalHeight - Math.max(0, relativeY)),
        -canvas.width / 2, 
        -canvas.height / 2, 
        canvas.width, 
        canvas.height
      );
      
      ctx.restore();

      const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(croppedImageUrl);
    };
    
    img.src = imageUrl;
  });
};

export const initializeCropArea = (
  containerWidth: number,
  containerHeight: number,
  displayWidth: number,
  displayHeight: number,
  imageX: number,
  imageY: number,
  aspectRatioMode: string,
  constrainToCanvas: (crop: CropArea) => CropArea
): CropArea => {
  const ASPECT_RATIOS = {
    card: 2.5 / 3.5,
    landscape: 3 / 2,
    portrait: 2 / 3,
    square: 1,
    free: null
  };

  const ratio = ASPECT_RATIOS[aspectRatioMode as keyof typeof ASPECT_RATIOS];
  const cropWidth = Math.min(200, displayWidth * 0.6);
  const cropHeight = ratio ? cropWidth / ratio : Math.min(280, displayHeight * 0.6);
  
  return constrainToCanvas({
    x: imageX + (displayWidth - cropWidth) / 2,
    y: imageY + (displayHeight - cropHeight) / 2,
    width: cropWidth,
    height: cropHeight,
    rotation: 0
  });
};
