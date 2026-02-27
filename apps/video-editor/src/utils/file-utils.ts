const MAX_VIDEO_SIZE_MB = 1000; // 1GB
const MAX_VIDEO_DURATION_SECONDS = 600; // 10 minutes
const SUPPORTED_FORMATS = ['video/mp4', 'video/webm', 'video/quicktime'];

export interface VideoValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate video file
 */
export function validateVideoFile(file: File): VideoValidationResult {
  // Check file type
  if (!SUPPORTED_FORMATS.includes(file.type)) {
    return {
      valid: false,
      error: `Unsupported format. Please use MP4, WebM, or MOV.`,
    };
  }

  // Check file size
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > MAX_VIDEO_SIZE_MB) {
    return {
      valid: false,
      error: `File too large (${sizeMB.toFixed(0)}MB). Maximum size is ${MAX_VIDEO_SIZE_MB}MB.`,
    };
  }

  return { valid: true };
}

/**
 * Get video duration from file
 */
export async function getVideoDuration(
  file: File
): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(video.duration);
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Get video dimensions
 */
export async function getVideoDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve({ width: video.videoWidth, height: video.videoHeight });
    };

    video.onerror = () => {
      window.URL.revokeObjectURL(video.src);
      reject(new Error('Failed to load video metadata'));
    };

    video.src = URL.createObjectURL(file);
  });
}

/**
 * Format file size to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
