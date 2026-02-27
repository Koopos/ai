/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Parse time string (MM:SS or HH:MM:SS) to seconds
 */
export function parseTime(timeString: string): number {
  const parts = timeString.split(':').map(Number);

  if (parts.length === 3) {
    // HH:MM:SS
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    // MM:SS
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  return 0;
}

/**
 * Convert pixels to timeline time based on zoom level
 */
export function pixelsToTime(
  pixels: number,
  containerWidth: number,
  duration: number
): number {
  const pixelsPerSecond = containerWidth / duration;
  return pixels / pixelsPerSecond;
}

/**
 * Convert timeline time to pixels based on zoom level
 */
export function timeToPixels(
  time: number,
  containerWidth: number,
  duration: number
): number {
  const pixelsPerSecond = containerWidth / duration;
  return time * pixelsPerSecond;
}
