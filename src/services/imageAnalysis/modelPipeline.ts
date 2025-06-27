
import { pipeline } from '@huggingface/transformers';

export class ModelPipeline {
  private classifier: any = null;
  private isInitializing = false;

  async initialize() {
    if (this.classifier || this.isInitializing) return;
    
    this.isInitializing = true;
    try {
      console.log('Initializing image classifier...');
      
      try {
        this.classifier = await pipeline(
          'image-classification',
          'google/vit-base-patch16-224',
          { device: 'webgpu' }
        );
        console.log('Image classifier ready on WebGPU!');
      } catch (webgpuError) {
        console.warn('WebGPU failed, falling back to CPU:', webgpuError);
        this.classifier = await pipeline(
          'image-classification',
          'google/vit-base-patch16-224'
        );
        console.log('Image classifier ready on CPU!');
      }
    } catch (error) {
      console.error('Failed to initialize classifier:', error);
      this.classifier = null;
    }
    this.isInitializing = false;
  }

  async classifyImage(imageUrl: string) {
    await this.initialize();
    
    if (!this.classifier) {
      throw new Error('Classifier not available');
    }

    const results = await this.classifier(imageUrl);
    
    return results
      .filter((result: any) => result.score > 0.05)
      .slice(0, 8)
      .map((result: any) => ({
        label: result.label.split(',')[0].trim().toLowerCase(),
        score: result.score
      }));
  }
}

export const modelPipeline = new ModelPipeline();
