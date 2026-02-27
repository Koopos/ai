import { FFmpeg } from '@ffmpeg/ffmpeg';

/**
 * Cleanup FFmpeg instance
 */
export function cleanupFFmpeg(ffmpeg: FFmpeg | null) {
  if (ffmpeg) {
    try {
      ffmpeg.exit();
    } catch (e) {
      console.warn('FFmpeg cleanup failed', e);
    }
  }
}

/**
 * Revoke object URLs to free memory
 */
export function revokeObjectUrls(urls: string[]) {
  urls.forEach((url) => {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Failed to revoke URL:', e);
    }
  });
}

/**
 * Clear canvas content
 */
export function clearCanvas(canvas: HTMLCanvasElement | null) {
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
}

/**
 * Suggest garbage collection (if available)
 */
export function suggestGC() {
  if (typeof global !== 'undefined' && global.gc) {
    try {
      global.gc();
    } catch (e) {
      console.warn('GC suggestion failed:', e);
    }
  }
}

/**
 * Get current memory usage (if available)
 */
export function getMemoryUsage(): {
  used: number;
  total: number;
} | null {
  if (typeof performance !== 'undefined' && 'memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: memory.usedJSHeapSize,
      total: memory.totalJSHeapSize,
    };
  }
  return null;
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Check if memory usage is critical
 */
export function isMemoryCritical(thresholdMB: number = 3000): boolean {
  const memory = getMemoryUsage();
  if (!memory) return false;

  const usedMB = memory.used / (1024 * 1024);
  return usedMB > thresholdMB;
}
