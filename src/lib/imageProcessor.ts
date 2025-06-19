
export interface ImageProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  maintainAspectRatio?: boolean;
}

export interface ProcessedImageResult {
  dataUrl: string;
  blob: Blob;
  dimensions: {
    width: number;
    height: number;
    originalWidth: number;
    originalHeight: number;
  };
  fileSize: number;
}

export class ImageProcessor {
  static async processFile(
    file: File, 
    options: ImageProcessingOptions = {}
  ): Promise<ProcessedImageResult> {
    const {
      maxWidth = 1024,
      maxHeight = 1024,
      quality = 0.9,
      format = 'jpeg',
      maintainAspectRatio = true
    } = options;

    return new Promise((resolve, reject) => {
      // Validate file
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please select an image.'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('File size too large. Please select an image under 10MB.'));
        return;
      }

      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas not supported in this browser'));
        return;
      }

      img.onload = () => {
        try {
          const originalWidth = img.naturalWidth;
          const originalHeight = img.naturalHeight;
          
          let { width, height } = img;

          // Calculate new dimensions
          if (maintainAspectRatio) {
            const scale = Math.min(maxWidth / width, maxHeight / height);
            if (scale < 1) {
              width = Math.round(width * scale);
              height = Math.round(height * scale);
            }
          } else {
            width = Math.min(width, maxWidth);
            height = Math.min(height, maxHeight);
          }

          // Set canvas dimensions
          canvas.width = width;
          canvas.height = height;

          // Draw image
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Create outputs
          const mimeType = `image/${format}`;
          const dataUrl = canvas.toDataURL(mimeType, quality);
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create image blob'));
                return;
              }

              resolve({
                dataUrl,
                blob,
                dimensions: {
                  width,
                  height,
                  originalWidth,
                  originalHeight
                },
                fileSize: blob.size
              });
            },
            mimeType,
            quality
          );
        } catch (error) {
          reject(new Error(`Image processing failed: ${error}`));
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image. Please try a different file.'));
      };

      // Load image
      try {
        img.src = URL.createObjectURL(file);
      } catch (error) {
        reject(new Error('Failed to read file'));
      }
    });
  }

  static async validateImageFile(file: File): Promise<void> {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please select an image.');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size too large. Please select an image under 10MB.');
    }

    // Additional validation: try to load the image
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve();
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Invalid image format or corrupted file'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
