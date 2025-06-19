
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

    console.log('🔍 ImageProcessor.processFile called with:', {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      options
    });

    return new Promise((resolve, reject) => {
      // Basic file validation
      if (!file || !file.type.startsWith('image/')) {
        console.error('❌ Invalid file type:', file?.type);
        reject(new Error('Invalid file type. Please select an image.'));
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        console.error('❌ File too large:', file.size);
        reject(new Error('File size too large. Please select an image under 10MB.'));
        return;
      }

      console.log('✅ File validation passed, starting FileReader...');

      // Try multiple approaches for reading the file
      this.readFileWithFallback(file)
        .then((dataUrl) => {
          console.log('✅ File read successfully, processing image...');
          return this.processImageData(dataUrl, options);
        })
        .then((result) => {
          console.log('✅ Image processing complete:', result.dimensions);
          resolve(result);
        })
        .catch((error) => {
          console.error('❌ Image processing failed:', error);
          reject(error);
        });
    });
  }

  private static async readFileWithFallback(file: File): Promise<string> {
    // First try: Standard FileReader
    try {
      console.log('📖 Attempting standard FileReader...');
      return await this.readFileStandard(file);
    } catch (error) {
      console.warn('⚠️ Standard FileReader failed, trying alternative method:', error);
      
      // Second try: Alternative approach using URL.createObjectURL
      try {
        console.log('📖 Attempting URL.createObjectURL method...');
        return await this.readFileWithObjectURL(file);
      } catch (error2) {
        console.error('❌ All file reading methods failed:', error2);
        throw new Error('Unable to read the selected file. Please try a different image.');
      }
    }
  }

  private static readFileStandard(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          console.log('✅ FileReader standard method succeeded');
          resolve(result);
        } else {
          reject(new Error('FileReader returned invalid data type'));
        }
      };
      
      reader.onerror = (error) => {
        console.error('❌ FileReader error event:', error);
        reject(new Error('FileReader error occurred'));
      };
      
      reader.onabort = () => {
        console.error('❌ FileReader was aborted');
        reject(new Error('File reading was aborted'));
      };
      
      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        reader.abort();
        reject(new Error('File reading timed out'));
      }, 30000); // 30 second timeout
      
      reader.onload = (event) => {
        clearTimeout(timeout);
        const result = event.target?.result;
        if (typeof result === 'string') {
          console.log('✅ FileReader standard method succeeded');
          resolve(result);
        } else {
          reject(new Error('FileReader returned invalid data type'));
        }
      };
      
      try {
        reader.readAsDataURL(file);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  private static readFileWithObjectURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            if (!ctx) {
              URL.revokeObjectURL(objectUrl);
              reject(new Error('Canvas context not available'));
              return;
            }
            
            canvas.width = img.width;
            canvas.height = img.height;
            
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            
            URL.revokeObjectURL(objectUrl);
            console.log('✅ URL.createObjectURL method succeeded');
            resolve(dataUrl);
          } catch (error) {
            URL.revokeObjectURL(objectUrl);
            reject(error);
          }
        };
        
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Failed to load image from object URL'));
        };
        
        img.src = objectUrl;
      } catch (error) {
        reject(error);
      }
    });
  }

  private static async processImageData(
    dataUrl: string, 
    options: ImageProcessingOptions
  ): Promise<ProcessedImageResult> {
    const {
      maxWidth = 1024,
      maxHeight = 1024,
      quality = 0.9,
      format = 'jpeg',
      maintainAspectRatio = true
    } = options;

    return new Promise((resolve, reject) => {
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
          const processedDataUrl = canvas.toDataURL(mimeType, quality);
          
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to create image blob'));
                return;
              }

              console.log('✅ Image processed successfully:', width, 'x', height);

              resolve({
                dataUrl: processedDataUrl,
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
      img.src = dataUrl;
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
