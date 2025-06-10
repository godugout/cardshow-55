
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private fpsHistory: number[] = [];
  private readonly maxHistoryLength = 30;
  private isRunning = false;

  update() {
    try {
      if (!this.isRunning) return;
      
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        
        // Ensure fps is a valid number
        if (isNaN(this.fps) || !isFinite(this.fps)) {
          this.fps = 60;
        }
        
        this.fpsHistory.push(this.fps);
        
        if (this.fpsHistory.length > this.maxHistoryLength) {
          this.fpsHistory.shift();
        }
        
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
    } catch (error) {
      console.warn('Performance monitor update error:', error);
      // Reset to safe defaults on error
      this.fps = 60;
      this.frameCount = 0;
      this.lastTime = performance.now();
    }
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
  }

  getCurrentFPS(): number {
    return Math.max(1, this.fps);
  }

  getAverageFPS(): number {
    if (!this.fpsHistory.length) return 60;
    
    try {
      const validFps = this.fpsHistory.filter(fps => !isNaN(fps) && isFinite(fps));
      if (!validFps.length) return 60;
      
      return validFps.reduce((sum, fps) => sum + fps, 0) / validFps.length;
    } catch (error) {
      console.warn('Error calculating average FPS:', error);
      return 60;
    }
  }

  shouldDowngrade(): boolean {
    try {
      return this.getAverageFPS() < 30 && this.fpsHistory.length >= 5;
    } catch (error) {
      return false;
    }
  }

  shouldUpgrade(): boolean {
    try {
      return this.getAverageFPS() > 50 && this.fpsHistory.length >= 5;
    } catch (error) {
      return false;
    }
  }

  getPerformanceLevel(): 'low' | 'medium' | 'high' {
    try {
      const avgFps = this.getAverageFPS();
      if (avgFps < 30) return 'low';
      if (avgFps < 50) return 'medium';
      return 'high';
    } catch (error) {
      console.warn('Error getting performance level:', error);
      return 'medium';
    }
  }
}
