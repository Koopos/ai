'use client';

import styled from '@emotion/styled';
import { useVideoEditorStore } from '@/store/video-editor-store';
import { useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const InfoBox = styled.div`
  padding: 12px;
  background: #333;
  border-radius: 6px;
  color: #ccc;
  font-size: 13px;
  line-height: 1.5;
`;

const TimeDisplay = styled.div`
  padding: 12px;
  background: #333;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  font-family: monospace;
  text-align: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 12px 16px;
  background: ${(props) => (props.variant === 'primary' ? '#0070f3' : '#333')};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.variant === 'primary' ? '#0051cc' : '#444')};
  }
`;

const ClipList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

const ClipItem = styled.div`
  padding: 10px 12px;
  background: #333;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #fff;
`;

const ClipTime = styled.span`
  font-family: monospace;
`;

export function SplitPanel() {
  const [splitCount, setSplitCount] = useState(0);

  const currentTime = useVideoEditorStore((state) => state.currentTime);
  const duration = useVideoEditorStore((state) => state.duration);
  const clips = useVideoEditorStore((state) => state.clips);

  const addClip = useVideoEditorStore((state) => state.addClip);
  const removeClip = useVideoEditorStore((state) => state.removeClip);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSplit = () => {
    const newClip = {
      id: `clip-${Date.now()}`,
      start: 0,
      end: currentTime,
      name: `Clip ${clips.length + 1}`,
    };

    addClip(newClip);
    setSplitCount(splitCount + 1);
  };

  const handleSplitAtCurrent = () => {
    if (clips.length === 0) {
      // First split - create initial clip from 0 to current
      addClip({
        id: `clip-${Date.now()}`,
        start: 0,
        end: currentTime,
        name: 'Part 1',
      });
    } else {
      // Subsequent splits
      const lastClip = clips[clips.length - 1];
      addClip({
        id: `clip-${Date.now()}`,
        start: lastClip.end,
        end: currentTime,
        name: `Part ${clips.length + 1}`,
      });
    }
    setSplitCount(splitCount + 1);
  };

  const handleReset = () => {
    clips.forEach((clip) => removeClip(clip.id));
    setSplitCount(0);
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Split Video</SectionTitle>
        <InfoBox>
          Split your video at the current playhead position. Move the timeline to where you
          want to split, then click &quot;Split at Current&quot;.
        </InfoBox>
      </Section>

      <Section>
        <SectionTitle>Current Position</SectionTitle>
        <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
      </Section>

      <Section>
        <Button variant="primary" onClick={handleSplitAtCurrent}>
          Split at Current Position
        </Button>
        {clips.length > 0 && (
          <Button variant="secondary" onClick={handleReset}>
            Reset All Clips
          </Button>
        )}
      </Section>

      <Section>
        <SectionTitle>Clips ({clips.length})</SectionTitle>
        <ClipList>
          {clips.length === 0 ? (
            <div
              style={{
                color: '#666',
                fontSize: '13px',
                textAlign: 'center',
                padding: '20px',
              }}
            >
              No clips yet. Split the video to create clips!
            </div>
          ) : (
            clips.map((clip) => (
              <ClipItem key={clip.id}>
                <span>{clip.name}</span>
                <ClipTime>
                  {formatTime(clip.start)} - {formatTime(clip.end)} (
                  {formatTime(clip.end - clip.start)})
                </ClipTime>
              </ClipItem>
            ))
          )}
        </ClipList>
      </Section>

      {clips.length > 0 && (
        <Section>
          <InfoBox>
            Total duration: {formatTime(clips.reduce((acc, clip) => acc + (clip.end - clip.start), 0))}
          </InfoBox>
        </Section>
      )}
    </Container>
  );
}
