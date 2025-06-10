
export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 60;
  private fpsHistory: number[] = [];
  private readonly maxHistoryLength = 30;

  update() {
    this.frameCount++;
    const currentTime = performance.now();
    
    if (currentTime - this.lastTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
      this.fpsHistory.push(this.fps);
      
      if (this.fpsHistory.length > this.maxHistoryLength) {
        this.fpsHistory.shift();
      }
      
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  getCurrentFPS(): number {
    return this.fps;
  }

  getAverageFPS(): number {
    if (this.fpsHistory.length === 0) return 60;
    return this.fpsHistory.reduce((sum, fps) => sum + fps, 0) / this.fpsHistory.length;
  }

  shouldDowngrade(): boolean {
    return this.getAverageFPS() < 30 && this.fpsHistory.length >= 10;
  }

  shouldUpgrade(): boolean {
    return this.getAverageFPS() > 50 && this.fpsHistory.length >= 10;
  }

  getPerformanceLevel(): 'low' | 'medium' | 'high' {
    const avgFps = this.getAverageFPS();
    if (avgFps < 30) return 'low';
    if (avgFps < 50) return 'medium';
    return 'high';
  }
}
