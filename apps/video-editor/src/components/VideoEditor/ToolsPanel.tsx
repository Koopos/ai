'use client';

import styled from '@emotion/styled';
import { useVideoEditorStore } from '@/store/video-editor-store';

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
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ToolButton = styled.button<{ active?: boolean }>`
  padding: 12px 16px;
  background: ${(props) => (props.active ? '#0070f3' : '#333')};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  text-align: left;

  &:hover {
    background: ${(props) => (props.active ? '#0051cc' : '#444')};
  }
`;

const InfoBox = styled.div`
  padding: 12px;
  background: #333;
  border-radius: 6px;
  color: #999;
  font-size: 13px;
  line-height: 1.5;
`;

export function ToolsPanel() {
  const activeTool = useVideoEditorStore((state) => state.activeTool);
  const setActiveTool = useVideoEditorStore((state) => state.setActiveTool);

  const getToolDescription = () => {
    switch (activeTool) {
      case 'select':
        return 'Select and move elements on the timeline';
      case 'trim':
        return 'Select a portion of the video to keep';
      case 'split':
        return 'Split the video at the playhead position';
      case 'text':
        return 'Add text overlays to your video';
      case 'watermark':
        return 'Select regions to blur and remove watermarks';
      default:
        return '';
    }
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Tools</SectionTitle>
        <ToolButton
          active={activeTool === 'select'}
          onClick={() => setActiveTool('select')}
        >
          🖱️ Select
        </ToolButton>
        <ToolButton
          active={activeTool === 'trim'}
          onClick={() => setActiveTool('trim')}
        >
          ✂️ Trim
        </ToolButton>
        <ToolButton
          active={activeTool === 'split'}
          onClick={() => setActiveTool('split')}
        >
          🔪 Split
        </ToolButton>
        <ToolButton
          active={activeTool === 'text'}
          onClick={() => setActiveTool('text')}
        >
          📝 Text
        </ToolButton>
        <ToolButton
          active={activeTool === 'watermark'}
          onClick={() => setActiveTool('watermark')}
        >
          🚫 Watermark
        </ToolButton>
      </Section>

      <Section>
        <SectionTitle>Info</SectionTitle>
        <InfoBox>{getToolDescription()}</InfoBox>
      </Section>
    </Container>
  );
}
