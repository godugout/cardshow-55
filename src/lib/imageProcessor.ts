
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
      // Basic file validation
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Invalid file type. Please select an image.'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('File size too large. Please select an image under 10MB.'));
        return;
      }

      console.log('📸 Processing file:', file.name, file.type, file.size);

      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result;
        if (!result || typeof result !== 'string') {
          reject(new Error('Failed to read file'));
          return;
        }

        const img = new Image();
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              reject(new Error('Canvas not supported in this browser'));
              return;
            }

            const originalWidth = img.naturalWidth || img.width;
            const originalHeight = img.naturalHeight || img.height;
            
            let { width, height } = { width: originalWidth, height: originalHeight };

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

            // Clear canvas with white background for JPEG
            if (format === 'jpeg') {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, width, height);
            }

            // Draw image
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

                console.log('✅ Image processed successfully:', width, 'x', height);

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
            console.error('❌ Canvas processing error:', error);
            reject(new Error(`Image processing failed: ${error}`));
          }
        };

        img.onerror = (error) => {
          console.error('❌ Image load error:', error);
          reject(new Error('Unable to load image. Please try a different file.'));
        };

        // Set image source
        img.src = result;
      };

      reader.onerror = (error) => {
        console.error('❌ FileReader error:', error);
        reject(new Error('Failed to read file. Please try again.'));
      };

      // Start reading the file
      reader.readAsDataURL(file);
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

    // Remove the complex image loading validation that was causing issues
    // The actual processing will handle invalid images gracefully
    console.log('✅ File validation passed:', file.name);
  }

  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
