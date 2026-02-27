import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { Clip, TextOverlay, WatermarkRegion } from '@/types/video';

export interface VideoProcessOptions {
  onStart?: () => void;
  onProgress?: (progress: number) => void;
  onComplete?: (outputUrl: string) => void;
  onError?: (error: Error) => void;
}

/**
 * Trim video to specified duration
 */
export async function trimVideo(
  ffmpeg: FFmpeg,
  inputFile: File,
  startTime: number,
  endTime: number,
  options: VideoProcessOptions = {}
): Promise<string> {
  const { onStart, onProgress, onComplete, onError } = options;

  try {
    onStart?.();

    const inputName = 'input.mp4';
    const outputName = 'output.mp4';

    // Write input file
    await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

    // Build FFmpeg command for trimming
    // -ss: start time
    // -to: end time
    // -c copy: copy streams without re-encoding (faster)
    await ffmpeg.exec([
      '-i',
      inputName,
      '-ss',
      startTime.toString(),
      '-to',
      endTime.toString(),
      '-c',
      'copy',
      outputName,
    ]);

    onProgress?.(100);

    // Read output file
    const data = await ffmpeg.readFile(outputName);
    const outputBlob = new Blob([data], { type: 'video/mp4' });
    const outputUrl = URL.createObjectURL(outputBlob);

    onComplete?.(outputUrl);

    return outputUrl;
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Trim failed');
    onError?.(err);
    throw err;
  }
}

/**
 * Split video at specific timestamp
 */
export async function splitVideo(
  ffmpeg: FFmpeg,
  inputFile: File,
  splitTime: number,
  options: VideoProcessOptions = {}
): Promise<{ part1: string; part2: string }> {
  const { onStart, onProgress, onComplete, onError } = options;

  try {
    onStart?.();

    const inputName = 'input.mp4';
    const part1Name = 'part1.mp4';
    const part2Name = 'part2.mp4';

    await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

    // Get video duration
    const duration = await getVideoDuration(ffmpeg, inputName);

    // Part 1: from start to split time
    await ffmpeg.exec([
      '-i',
      inputName,
      '-ss',
      '0',
      '-to',
      splitTime.toString(),
      '-c',
      'copy',
      part1Name,
    ]);

    onProgress?.(50);

    // Part 2: from split time to end
    await ffmpeg.exec([
      '-i',
      inputName,
      '-ss',
      splitTime.toString(),
      '-to',
      duration.toString(),
      '-c',
      'copy',
      part2Name,
    ]);

    onProgress?.(100);

    // Read output files
    const data1 = await ffmpeg.readFile(part1Name);
    const data2 = await ffmpeg.readFile(part2Name);

    const part1Blob = new Blob([data1], { type: 'video/mp4' });
    const part2Blob = new Blob([data2], { type: 'video/mp4' });

    const part1Url = URL.createObjectURL(part1Blob);
    const part2Url = URL.createObjectURL(part2Blob);

    onComplete?.(part1Url);

    return { part1: part1Url, part2: part2Url };
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Split failed');
    onError?.(err);
    throw err;
  }
}

/**
 * Export video with all edits applied
 */
export async function exportVideo(
  ffmpeg: FFmpeg,
  inputFile: File,
  options: {
    trimStart?: number;
    trimEnd?: number;
    textOverlays?: TextOverlay[];
    watermarkRegions?: WatermarkRegion[];
    outputFormat?: 'mp4' | 'webm';
    quality?: 'high' | 'medium' | 'low';
  },
  callbacks: VideoProcessOptions = {}
): Promise<string> {
  const { trimStart, trimEnd, textOverlays, watermarkRegions } = options;
  const { onStart, onProgress, onComplete, onError } = callbacks;

  return new Promise(async (resolve, reject) => {
    try {
      onStart?.();

      const inputName = 'input.mp4';
      const outputName = 'output.mp4';

      await ffmpeg.writeFile(inputName, await fetchFile(inputFile));

      // Build complex filter graph
      const filters: string[] = [];

      // Add text overlays
      if (textOverlays && textOverlays.length > 0) {
        textOverlays.forEach((overlay, index) => {
          const filter = buildTextFilter(overlay, index);
          filters.push(filter);
        });
      }

      // Add watermark blur regions
      if (watermarkRegions && watermarkRegions.length > 0) {
        watermarkRegions.forEach((region) => {
          const filter = buildBlurFilter(region);
          filters.push(filter);
        });
      }

      // Build command
      const command: string[] = ['-i', inputName];

      // Add trim points if specified
      if (trimStart !== undefined) {
        command.push('-ss', trimStart.toString());
      }
      if (trimEnd !== undefined) {
        command.push('-to', trimEnd.toString());
      }

      // Add video filter if any
      if (filters.length > 0) {
        command.push('-vf', filters.join(','));
      }

      // Add codec settings
      command.push('-c:v', 'libx264', '-preset', 'medium', '-crf', '23');
      command.push('-c:a', 'aac', '-b:a', '128k');
      command.push(outputName);

      // Execute command
      await ffmpeg.exec(command);

      onProgress?.(100);

      // Read output file
      const data = await ffmpeg.readFile(outputName);
      const outputBlob = new Blob([data], { type: 'video/mp4' });
      const outputUrl = URL.createObjectURL(outputBlob);

      onComplete?.(outputUrl);
      resolve(outputUrl);
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Export failed');
      onError?.(err);
      reject(err);
    }
  });
}

/**
 * Build FFmpeg drawtext filter for text overlay
 */
function buildTextFilter(overlay: TextOverlay, index: number): string {
  const {
    text,
    position: { x, y },
    start,
    end,
    style,
  } = overlay;

  const parts = [
    `text=${text.replace(/:/g, '\\:')}`, // Escape colons
    `x=${x}`,
    `y=${y}`,
    `fontsize=${style.fontSize}`,
    `fontcolor=${style.color}`,
    `fontfile=/fonts/${style.fontFamily}.ttf`,
    `enable='between(t,${start},${end})'`,
  ];

  return `drawtext=${parts.join(':')}`;
}

/**
 * Build FFmpeg filter for blur region
 */
function buildBlurFilter(region: WatermarkRegion): string {
  const { x, y, width, height, blurIntensity, start, end } = region;

  // Crop the region, blur it, and overlay it back
  return (
    `crop=${width}:${height}:${x}:${y},boxblur=${blurIntensity}[blur${region.id}];` +
    `[in][blur${region.id}]overlay=${x}:${y}:enable='between(t,${start},${end})'`
  );
}

/**
 * Get video duration using ffprobe
 */
async function getVideoDuration(
  ffmpeg: FFmpeg,
  filename: string
): Promise<number> {
  // This is a simplified version
  // In production, you'd parse ffprobe output
  return 0;
}
