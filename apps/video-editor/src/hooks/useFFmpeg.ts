import { useEffect, useRef, useState } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;
let loadPromise: Promise<FFmpeg> | null = null;

export function useFFmpeg() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't cleanup FFmpeg instance - keep it for the session
      // Only cleanup if explicitly requested via cleanupFFmpeg()
    };
  }, []);

  const loadFFmpeg = async (): Promise<FFmpeg> => {
    // Return existing instance if already loaded
    if (ffmpegInstance) {
      setIsLoaded(true);
      return ffmpegInstance;
    }

    // Return existing promise if loading is in progress
    if (isLoading && loadPromise) {
      return loadPromise;
    }

    // Start loading
    isLoading = true;
    setError(null);

    loadPromise = (async () => {
      try {
        const ffmpeg = new FFmpeg();

        // Set up log listeners
        ffmpeg.on('log', ({ message }) => {
          console.log('[FFmpeg]', message);
        });

        // Load FFmpeg from CDN
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';

        await ffmpeg.load({
          coreURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.js`,
            'text/javascript'
          ),
          wasmURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.wasm`,
            'application/wasm'
          ),
          workerURL: await toBlobURL(
            `${baseURL}/ffmpeg-core.worker.js`,
            'text/javascript'
          ),
        });

        ffmpegInstance = ffmpeg;
        setIsLoaded(true);
        isLoading = false;

        return ffmpeg;
      } catch (err) {
        isLoading = false;
        const error =
          err instanceof Error ? err : new Error('Failed to load FFmpeg');
        setError(error);
        throw error;
      }
    })();

    return loadPromise;
  };

  const cleanupFFmpeg = () => {
    if (ffmpegInstance) {
      try {
        ffmpegInstance.exit();
      } catch (e) {
        console.warn('FFmpeg cleanup failed:', e);
      }
      ffmpegInstance = null;
      setIsLoaded(false);
    }
    loadPromise = null;
    isLoading = false;
  };

  const getFFmpeg = () => ffmpegInstance;

  return {
    isLoaded,
    error,
    loadFFmpeg,
    getFFmpeg,
    cleanupFFmpeg,
  };
}

export function useFFmpegLoaded() {
  const { isLoaded, loadFFmpeg } = useFFmpeg();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded && !isLoading) {
      setIsLoading(true);
      loadFFmpeg()
        .then(() => {
          setIsLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load FFmpeg:', err);
          setIsLoading(false);
        });
    }
  }, [isLoaded, isLoading, loadFFmpeg]);

  return { isLoaded, isLoading };
}
