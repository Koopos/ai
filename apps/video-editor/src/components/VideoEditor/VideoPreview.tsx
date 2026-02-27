'use client';

import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import { useVideoEditorStore } from '@/store/video-editor-store';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
`;

const OverlayCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #1a1a1a;
`;

const PlayButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #0070f3;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  &:hover {
    background: #0051cc;
  }
`;

const TimeDisplay = styled.div`
  color: #fff;
  font-size: 14px;
  font-family: monospace;
  min-width: 100px;
  text-align: center;
`;

const ProgressBar = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 6px;
  border-radius: 3px;
  background: #333;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #0070f3;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #0070f3;
    cursor: pointer;
    border: none;
  }
`;

export function VideoPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const videoUrl = useVideoEditorStore((state) => state.videoUrl);
  const duration = useVideoEditorStore((state) => state.duration);
  const currentTime = useVideoEditorStore((state) => state.currentTime);
  const isPlaying = useVideoEditorStore((state) => state.isPlaying);
  const videoWidth = useVideoEditorStore((state) => state.videoWidth);
  const videoHeight = useVideoEditorStore((state) => state.videoHeight);
  const textOverlays = useVideoEditorStore((state) => state.textOverlays);
  const watermarkRegions = useVideoEditorStore((state) => state.watermarkRegions);

  const setCurrentTime = useVideoEditorStore((state) => state.setCurrentTime);
  const setIsPlaying = useVideoEditorStore((state) => state.setIsPlaying);

  // Sync video element with store
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play();
    } else {
      video.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const diff = Math.abs(video.currentTime - currentTime);
    if (diff > 0.1) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  // Setup video event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [setCurrentTime, setIsPlaying]);

  // Draw overlays
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw text overlays
    textOverlays.forEach((overlay) => {
      if (currentTime >= overlay.start && currentTime <= overlay.end) {
        ctx.save();
        ctx.font = `${overlay.fontSize}px ${overlay.fontFamily || 'Arial'}`;
        ctx.fillStyle = overlay.color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const x = (overlay.x / 100) * canvas.width;
        const y = (overlay.y / 100) * canvas.height;
        ctx.fillText(overlay.text, x, y);
        ctx.restore();
      }
    });

    // Draw watermark regions (semi-transparent blur effect)
    watermarkRegions.forEach((region) => {
      if (currentTime >= region.start && currentTime <= region.end) {
        ctx.save();
        ctx.fillStyle = 'rgba(128, 128, 128, 0.3)';
        ctx.strokeStyle = 'rgba(255, 59, 48, 0.8)';
        ctx.lineWidth = 2;
        const x = (region.x / 100) * canvas.width;
        const y = (region.y / 100) * canvas.height;
        const w = (region.width / 100) * canvas.width;
        const h = (region.height / 100) * canvas.height;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        ctx.restore();
      }
    });
  }, [currentTime, videoWidth, videoHeight, textOverlays, watermarkRegions]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(event.target.value);
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <Container>
      <VideoContainer>
        <Video ref={videoRef} src={videoUrl || undefined} />
        <OverlayCanvas ref={canvasRef} />
      </VideoContainer>
      <Controls>
        <PlayButton onClick={handleTogglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </PlayButton>
        <TimeDisplay>
          {formatTime(currentTime)} / {formatTime(duration)}
        </TimeDisplay>
        <ProgressBar
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          disabled={!duration}
        />
      </Controls>
    </Container>
  );
}
