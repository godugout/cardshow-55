
import { pipeline } from '@huggingface/transformers';

export class ModelPipeline {
  private classifier: any = null;
  private isInitializing = false;

  async initialize() {
    if (this.classifier || this.isInitializing) return;
    
    this.isInitializing = true;
    try {
      console.log('Initializing image classifier...');
      
      // Try multiple models with better fallback handling
      const models = [
        'microsoft/resnet-50',
        'google/vit-base-patch16-224',
        'microsoft/beit-base-patch16-224'
      ];
      
      for (const model of models) {
        try {
          console.log(`Trying model: ${model}`);
          this.classifier = await pipeline(
            'image-classification',
            model,
            { device: 'webgpu' }
          );
          console.log(`Successfully initialized ${model} on WebGPU!`);
          break;
        } catch (webgpuError) {
          console.warn(`WebGPU failed for ${model}, trying CPU:`, webgpuError);
          try {
            this.classifier = await pipeline(
              'image-classification',
              model
            );
            console.log(`Successfully initialized ${model} on CPU!`);
            break;
          } catch (cpuError) {
            console.warn(`CPU also failed for ${model}:`, cpuError);
            continue;
          }
        }
      }
      
      if (!this.classifier) {
        throw new Error('All models failed to initialize');
      }
    } catch (error) {
      console.error('Failed to initialize any classifier:', error);
      this.classifier = null;
    }
    this.isInitializing = false;
  }

  async classifyImage(imageUrl: string) {
    await this.initialize();
    
    if (!this.classifier) {
      throw new Error('Classifier not available');
    }

    try {
      const results = await this.classifier(imageUrl);
      console.log('Raw classification results:', results);
      
      return results
        .filter((result: any) => result.score > 0.01) // Lower threshold
        .slice(0, 10) // Get more results
        .map((result: any) => ({
          label: result.label.split(',')[0].trim().toLowerCase(),
          score: result.score
        }));
    } catch (error) {
      console.error('Classification failed:', error);
      return [];
    }
  }
}

export const modelPipeline = new ModelPipeline();
