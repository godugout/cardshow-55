
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface UploadOptions {
  bucket?: 'card-images' | 'user-uploads';
  folder?: string;
  generateThumbnail?: boolean;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export interface UploadResult {
  id: string;
  url: string;
  path: string;
  thumbnailUrl?: string;
  metadata: {
    size: number;
    type: string;
    width?: number;
    height?: number;
  };
}

export class UploadService {
  static async uploadFile(
    file: File, 
    options: UploadOptions = {}
  ): Promise<UploadResult> {
    const {
      bucket = 'user-uploads',
      folder = 'general',
      generateThumbnail = false,
      maxWidth = 2048,
      maxHeight = 2048,
      quality = 0.9
    } = options;

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Authentication required for file upload');
      }

      // Process image if needed
      const processedFile = await this.processImage(file, { maxWidth, maxHeight, quality });
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, processedFile, {
          contentType: file.type,
          upsert: false,
          cacheControl: '31536000' // 1 year cache
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      // Generate thumbnail if requested
      let thumbnailUrl: string | undefined;
      if (generateThumbnail && file.type.startsWith('image/')) {
        try {
          const thumbnail = await this.generateThumbnail(processedFile);
          const thumbPath = `${user.id}/${folder}/thumbs/${fileName}`;
          
          const { error: thumbError } = await supabase.storage
            .from(bucket)
            .upload(thumbPath, thumbnail, {
              contentType: 'image/jpeg',
              upsert: false
            });

          if (!thumbError) {
            const { data: thumbUrlData } = supabase.storage
              .from(bucket)
              .getPublicUrl(thumbPath);
            thumbnailUrl = thumbUrlData.publicUrl;
          }
        } catch (thumbError) {
          console.warn('Thumbnail generation failed:', thumbError);
        }
      }

      // Get image dimensions
      const dimensions = await this.getImageDimensions(processedFile);

      // Save to media table
      const mediaRecord = {
        id: uuidv4(),
        owner_id: user.id,
        file_name: file.name,
        file_url: urlData.publicUrl,
        thumbnail_url: thumbnailUrl,
        file_size: processedFile.size,
        mime_type: file.type,
        width: dimensions.width,
        height: dimensions.height,
        bucket_id: bucket,
        storage_path: filePath,
        metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString()
        }
      };

      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert(mediaRecord)
        .select()
        .single();

      if (mediaError) {
        console.error('Failed to save media record:', mediaError);
        // Don't throw here, file is already uploaded
      }

      return {
        id: mediaRecord.id,
        url: urlData.publicUrl,
        path: filePath,
        thumbnailUrl,
        metadata: {
          size: processedFile.size,
          type: file.type,
          width: dimensions.width,
          height: dimensions.height
        }
      };

    } catch (error) {
      console.error('Upload service error:', error);
      throw error instanceof Error ? error : new Error('Upload failed');
    }
  }

  private static async processImage(
    file: File,
    options: { maxWidth: number; maxHeight: number; quality: number }
  ): Promise<File> {
    if (!file.type.startsWith('image/')) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(file);
        return;
      }

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const { maxWidth, maxHeight } = options;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // Set canvas size
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const processedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(processedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          options.quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = URL.createObjectURL(file);
    });
  }

  private static async generateThumbnail(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      img.onload = () => {
        // Thumbnail size
        const maxSize = 200;
        let { width, height } = img;
        
        if (width > height) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Thumbnail generation failed'));
            }
          },
          'image/jpeg',
          0.8
        );
      };

      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });
  }

  private static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    if (!file.type.startsWith('image/')) {
      return { width: 0, height: 0 };
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = URL.createObjectURL(file);
    });
  }
}
