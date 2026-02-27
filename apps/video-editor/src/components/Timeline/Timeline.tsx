'use client';

import styled from '@emotion/styled';
import { useVideoEditorStore } from '@/store/video-editor-store';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
`;

const TimeRuler = styled.div`
  position: relative;
  height: 24px;
  border-bottom: 1px solid #333;
`;

const TracksContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const Track = styled.div`
  position: relative;
  height: 40px;
  background: #2a2a2a;
  border-radius: 4px;
  overflow: hidden;
`;

const TrackLabel = styled.div`
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 11px;
  color: #999;
  font-weight: 500;
  pointer-events: none;
`;

const Clip = styled.div<{ left: number; width: number; color: string }>`
  position: absolute;
  top: 4px;
  height: 32px;
  left: ${(props) => props.left}%;
  width: ${(props) => props.width}%;
  background: ${(props) => props.color};
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

const Playhead = styled.div<{ position: number }>`
  position: absolute;
  top: 0;
  left: ${(props) => props.position}%;
  width: 2px;
  height: 100%;
  background: #ff3b30;
  z-index: 10;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -5px;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 8px solid #ff3b30;
  }
`;

const TimeMarker = styled.div`
  position: absolute;
  bottom: 0;
  font-size: 10px;
  color: #666;
  transform: translateX(-50%);
`;

export function Timeline() {
  const duration = useVideoEditorStore((state) => state.duration);
  const currentTime = useVideoEditorStore((state) => state.currentTime);
  const clips = useVideoEditorStore((state) => state.clips);
  const textOverlays = useVideoEditorStore((state) => state.textOverlays);
  const watermarkRegions = useVideoEditorStore((state) => state.watermarkRegions);

  const setCurrentTime = useVideoEditorStore((state) => state.setCurrentTime);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const generateTimeMarkers = () => {
    if (!duration) return null;

    const markers = [];
    const interval = duration > 300 ? 60 : duration > 60 ? 10 : 5; // 1min, 10s, or 5s

    for (let time = 0; time <= duration; time += interval) {
      const percentage = (time / duration) * 100;
      markers.push(
        <TimeMarker key={time} style={{ left: `${percentage}%` }}>
          {formatTime(time)}
        </TimeMarker>
      );
    }

    return markers;
  };

  const clipsToRender = clips.map((clip) => ({
    left: (clip.start / duration) * 100,
    width: ((clip.end - clip.start) / duration) * 100,
    color: '#0070f3',
  }));

  const textOverlaysToRender = textOverlays.map((overlay) => ({
    left: (overlay.start / duration) * 100,
    width: ((overlay.end - overlay.start) / duration) * 100,
    color: '#34c759',
  }));

  const watermarksToRender = watermarkRegions.map((region) => ({
    left: (region.start / duration) * 100,
    width: ((region.end - region.start) / duration) * 100,
    color: '#ff9500',
  }));

  return (
    <Container onClick={handleClick}>
      <TimeRuler>{generateTimeMarkers()}</TimeRuler>
      <TracksContainer>
        <Track>
          <TrackLabel>Video</TrackLabel>
          {clipsToRender.map((clip, index) => (
            <Clip
              key={`clip-${index}`}
              left={clip.left}
              width={clip.width}
              color={clip.color}
            />
          ))}
        </Track>
        <Track>
          <TrackLabel>Text</TrackLabel>
          {textOverlaysToRender.map((overlay, index) => (
            <Clip
              key={`text-${index}`}
              left={overlay.left}
              width={overlay.width}
              color={overlay.color}
            />
          ))}
        </Track>
        <Track>
          <TrackLabel>Watermarks</TrackLabel>
          {watermarksToRender.map((watermark, index) => (
            <Clip
              key={`watermark-${index}`}
              left={watermark.left}
              width={watermark.width}
              color={watermark.color}
            />
          ))}
        </Track>
      </TracksContainer>
      <Playhead position={(currentTime / duration) * 100 || 0} />
    </Container>
  );
}
