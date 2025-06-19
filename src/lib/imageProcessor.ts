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

    // Enhanced file validation with detailed debugging
    try {
      await this.validateImageFile(file);
      console.log('✅ File validation passed');
    } catch (error) {
      console.error('❌ File validation failed:', error);
      throw error;
    }

    // Try multiple file reading strategies
    let dataUrl: string;
    try {
      console.log('📖 Attempting to read file...');
      dataUrl = await this.readFileWithMultipleFallbacks(file);
      console.log('✅ File read successfully, data URL length:', dataUrl.length);
    } catch (error) {
      console.error('❌ All file reading methods failed:', error);
      throw new Error('Unable to read the selected file. The file may be corrupted or in an unsupported format.');
    }

    // Process the image
    try {
      console.log('🔄 Processing image data...');
      const result = await this.processImageData(dataUrl, options);
      console.log('✅ Image processing complete:', result.dimensions);
      return result;
    } catch (error) {
      console.error('❌ Image processing failed:', error);
      throw new Error('Failed to process the image. Please try a different file.');
    }
  }

  private static async readFileWithMultipleFallbacks(file: File): Promise<string> {
    const methods = [
      () => this.readFileWithArrayBuffer(file),
      () => this.readFileStandard(file),
      () => this.readFileWithObjectURL(file),
      () => this.readFileWithBlobReader(file)
    ];

    let lastError: Error | null = null;

    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`📖 Trying method ${i + 1}/${methods.length}...`);
        const result = await methods[i]();
        console.log(`✅ Method ${i + 1} succeeded`);
        return result;
      } catch (error) {
        console.warn(`⚠️ Method ${i + 1} failed:`, error);
        lastError = error as Error;
        continue;
      }
    }

    throw new Error(`All file reading methods failed. Last error: ${lastError?.message}`);
  }

  // Method 1: ArrayBuffer approach (most reliable)
  private static async readFileWithArrayBuffer(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('📖 Using ArrayBuffer method...');
      const reader = new FileReader();
      
      const timeout = setTimeout(() => {
        reader.abort();
        reject(new Error('ArrayBuffer reading timed out'));
      }, 30000);
      
      reader.onload = (event) => {
        clearTimeout(timeout);
        if (event.target?.result) {
          const arrayBuffer = event.target.result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: file.type });
          const url = URL.createObjectURL(blob);
          
          // Convert to data URL
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            URL.revokeObjectURL(url);
            resolve(canvas.toDataURL('image/jpeg', 0.9));
          };
          
          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image from ArrayBuffer'));
          };
          
          img.src = url;
        } else {
          reject(new Error('ArrayBuffer result is null'));
        }
      };
      
      reader.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('ArrayBuffer reading failed'));
      };
      
      try {
        reader.readAsArrayBuffer(file);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  // Method 2: Standard FileReader (original method)
  private static readFileStandard(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('📖 Using standard FileReader method...');
      const reader = new FileReader();
      
      const timeout = setTimeout(() => {
        reader.abort();
        reject(new Error('Standard FileReader timed out'));
      }, 30000);
      
      reader.onload = (event) => {
        clearTimeout(timeout);
        const result = event.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('FileReader returned invalid data type'));
        }
      };
      
      reader.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Standard FileReader error'));
      };
      
      reader.onabort = () => {
        clearTimeout(timeout);
        reject(new Error('Standard FileReader aborted'));
      };
      
      try {
        reader.readAsDataURL(file);
      } catch (error) {
        clearTimeout(timeout);
        reject(error);
      }
    });
  }

  // Method 3: Object URL approach
  private static readFileWithObjectURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      console.log('📖 Using Object URL method...');
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

  // Method 4: Blob reader approach
  private static async readFileWithBlobReader(file: File): Promise<string> {
    console.log('📖 Using Blob reader method...');
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          if (!arrayBuffer) {
            reject(new Error('No array buffer result'));
            return;
          }
          
          const uint8Array = new Uint8Array(arrayBuffer);
          const blob = new Blob([uint8Array], { type: file.type });
          
          const blobReader = new FileReader();
          blobReader.onload = (e) => {
            const result = e.target?.result;
            if (typeof result === 'string') {
              resolve(result);
            } else {
              reject(new Error('Blob reader returned invalid result'));
            }
          };
          
          blobReader.onerror = () => reject(new Error('Blob reader failed'));
          blobReader.readAsDataURL(blob);
          
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Initial blob read failed'));
      reader.readAsArrayBuffer(file);
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
    console.log('🔍 Validating file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    if (!file) {
      throw new Error('No file provided');
    }

    if (!file.type) {
      console.warn('⚠️ File has no MIME type, checking extension...');
      const extension = file.name.split('.').pop()?.toLowerCase();
      const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
      if (!extension || !validExtensions.includes(extension)) {
        throw new Error('Invalid file type. Please select an image file.');
      }
    } else if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please select an image file.');
    }

    if (file.size === 0) {
      throw new Error('File is empty. Please select a valid image file.');
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
