
// ML Processing Web Worker
// This worker handles heavy ML computations off the main thread

importScripts('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0/dist/transformers.min.js');

class MLProcessor {
  constructor() {
    this.models = {};
    this.isInitialized = false;
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('🔧 Worker: Initializing ML models...');
      
      // Configure transformers for worker environment
      if (typeof transformers !== 'undefined') {
        transformers.env.allowLocalModels = false;
        transformers.env.useBrowserCache = true;
      }
      
      this.isInitialized = true;
      console.log('✅ Worker: ML processor initialized');
    } catch (error) {
      console.error('❌ Worker: Failed to initialize:', error);
      throw error;
    }
  }

  async processImage(imageData, options = {}) {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const {
        enableObjectDetection = true,
        enableSegmentation = false,
        enableOCR = false
      } = options;

      const results = {
        regions: [],
        segments: [],
        text: [],
        processingTime: 0
      };

      const startTime = Date.now();

      // Object detection
      if (enableObjectDetection) {
        console.log('🔍 Worker: Running object detection...');
        results.regions = await this.detectObjects(imageData);
      }

      // Image segmentation
      if (enableSegmentation) {
        console.log('🎯 Worker: Running segmentation...');
        results.segments = await this.segmentImage(imageData);
      }

      // OCR
      if (enableOCR) {
        console.log('📝 Worker: Running OCR...');
        results.text = await this.extractText(imageData);
      }

      results.processingTime = Date.now() - startTime;
      
      return results;
    } catch (error) {
      console.error('❌ Worker: Processing failed:', error);
      throw error;
    }
  }

  async detectObjects(imageData) {
    try {
      // Load object detection model if not already loaded
      if (!this.models.objectDetector) {
        console.log('📦 Worker: Loading object detection model...');
        this.models.objectDetector = await transformers.pipeline(
          'object-detection',
          'Xenova/detr-resnet-50'
        );
      }

      const detections = await this.models.objectDetector(imageData);
      
      return detections.map((detection, index) => ({
        id: `worker-obj-${Date.now()}-${index}`,
        type: this.mapLabelToType(detection.label),
        bounds: {
          x: detection.box.xmin,
          y: detection.box.ymin,
          width: detection.box.xmax - detection.box.xmin,
          height: detection.box.ymax - detection.box.ymin
        },
        confidence: detection.score,
        label: detection.label
      }));
    } catch (error) {
      console.error('Worker: Object detection failed:', error);
      return [];
    }
  }

  async segmentImage(imageData) {
    try {
      // Load segmentation model if not already loaded
      if (!this.models.segmenter) {
        console.log('📦 Worker: Loading segmentation model...');
        this.models.segmenter = await transformers.pipeline(
          'image-segmentation',
          'Xenova/segformer-b0-finetuned-ade-512-512'
        );
      }

      const segments = await this.models.segmenter(imageData);
      
      return segments.map((segment, index) => ({
        id: `worker-seg-${Date.now()}-${index}`,
        label: segment.label,
        mask: segment.mask,
        score: segment.score || 0.5
      }));
    } catch (error) {
      console.error('Worker: Segmentation failed:', error);
      return [];
    }
  }

  async extractText(imageData) {
    try {
      // For now, return empty array as OCR models are very large
      // This could be implemented with TrOCR or similar models
      console.log('📝 Worker: OCR not implemented yet');
      return [];
    } catch (error) {
      console.error('Worker: OCR failed:', error);
      return [];
    }
  }

  mapLabelToType(label) {
    const lowerLabel = label.toLowerCase();
    
    if (lowerLabel.includes('person') || lowerLabel.includes('face')) {
      return 'photo';
    }
    if (lowerLabel.includes('text') || lowerLabel.includes('book')) {
      return 'text';
    }
    if (lowerLabel.includes('logo') || lowerLabel.includes('sign')) {
      return 'logo';
    }
    if (lowerLabel.includes('frame') || lowerLabel.includes('border')) {
      return 'border';
    }
    
    return 'decoration';
  }

  dispose() {
    this.models = {};
    this.isInitialized = false;
  }
}

// Create processor instance
const processor = new MLProcessor();

// Handle messages from main thread
self.onmessage = async function(e) {
  const { type, data, id } = e.data;

  try {
    switch (type) {
      case 'initialize':
        await processor.initialize();
        self.postMessage({ type: 'initialized', id });
        break;

      case 'process':
        const result = await processor.processImage(data.imageData, data.options);
        self.postMessage({ type: 'result', data: result, id });
        break;

      case 'dispose':
        processor.dispose();
        self.postMessage({ type: 'disposed', id });
        break;

      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  } catch (error) {
    self.postMessage({ 
      type: 'error', 
      error: error.message, 
      id 
    });
  }
};

// Handle uncaught errors
self.onerror = function(error) {
  console.error('Worker error:', error);
  self.postMessage({ 
    type: 'error', 
    error: error.message || 'Unknown worker error' 
  });
};
