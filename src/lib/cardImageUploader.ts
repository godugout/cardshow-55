
import { supabase } from '@/lib/supabase-client';

interface UploadCardImageParams {
  file: File;
  cardId: string;
  userId: string;
  onProgress?: (progress: number) => void;
}

interface UploadResult {
  url: string;
  thumbnailUrl?: string;
  error?: string;
}

export const uploadCardImage = async ({ 
  file, 
  cardId, 
  userId, 
  onProgress 
}: UploadCardImageParams): Promise<UploadResult | null> => {
  try {
    console.log('🖼️ Starting image upload:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      cardId,
      userId
    });

    // Validate file
    if (!file || file.size === 0) {
      console.error('❌ Invalid file provided');
      return { url: '', error: 'Invalid file provided' };
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      console.error('❌ File too large:', file.size);
      return { url: '', error: 'File size exceeds 10MB limit' };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error('❌ Invalid file type:', file.type);
      return { url: '', error: 'Invalid file type. Please use JPG, PNG, or WebP' };
    }

    // Create a unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${userId}/${cardId}-${Date.now()}.${fileExt}`;
    
    console.log('📁 Upload path:', fileName);

    // Report initial progress
    if (onProgress) onProgress(10);

    // Check if bucket exists, if not this will help us debug
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    if (bucketsError) {
      console.error('❌ Error checking buckets:', bucketsError);
    } else {
      console.log('📦 Available buckets:', buckets?.map(b => b.name));
    }

    if (onProgress) onProgress(25);

    // Upload to Supabase Storage
    console.log('⬆️ Uploading to Supabase Storage...');
    const { data, error } = await supabase.storage
      .from('card-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Supabase upload error:', error);
      
      // Try to create the bucket if it doesn't exist
      if (error.message.includes('The resource was not found')) {
        console.log('🔧 Bucket not found, attempting to create...');
        const { error: createBucketError } = await supabase.storage.createBucket('card-images', {
          public: true
        });
        
        if (createBucketError) {
          console.error('❌ Failed to create bucket:', createBucketError);
          return { url: '', error: `Storage error: ${error.message}` };
        }
        
        // Retry upload after creating bucket
        console.log('🔄 Retrying upload after bucket creation...');
        const { data: retryData, error: retryError } = await supabase.storage
          .from('card-images')
          .upload(fileName, file, {
            cacheControl: '3600', 
            upsert: false
          });
          
        if (retryError) {
          console.error('❌ Retry upload failed:', retryError);
          return { url: '', error: `Upload failed: ${retryError.message}` };
        }
        
        console.log('✅ Retry upload successful:', retryData);
      } else {
        return { url: '', error: `Upload error: ${error.message}` };
      }
    }

    if (onProgress) onProgress(75);

    console.log('✅ Upload successful, getting public URL...');

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('card-images')
      .getPublicUrl(fileName);

    if (!urlData?.publicUrl) {
      console.error('❌ Failed to get public URL');
      return { url: '', error: 'Failed to get public URL' };
    }

    console.log('✅ Public URL obtained:', urlData.publicUrl);

    if (onProgress) onProgress(100);

    return {
      url: urlData.publicUrl,
      thumbnailUrl: urlData.publicUrl // For now, use the same URL for thumbnail
    };
  } catch (error: any) {
    console.error('💥 Upload error:', error);
    return { url: '', error: error.message || 'Unknown upload error' };
  }
};
