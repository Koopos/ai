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
`;

const InfoBox = styled.div`
  padding: 12px;
  background: #333;
  border-radius: 6px;
  color: #ccc;
  font-size: 13px;
  line-height: 1.5;
`;

const Row = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const Label = styled.label`
  font-size: 12px;
  color: #999;
  flex: 1;
`;

const TimeDisplay = styled.div`
  padding: 8px 12px;
  background: #333;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  font-family: monospace;
  min-width: 80px;
  text-align: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 10px 16px;
  background: ${(props) =>
    props.variant === 'primary'
      ? '#0070f3'
      : props.variant === 'danger'
      ? '#ff3b30'
      : '#333'};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  flex: 1;

  &:hover {
    background: ${(props) =>
      props.variant === 'primary'
        ? '#0051cc'
        : props.variant === 'danger'
        ? '#d32f2f'
        : '#444'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonSmall = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 6px 12px;
  background: ${(props) => (props.variant === 'primary' ? '#0070f3' : '#333')};
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.variant === 'primary' ? '#0051cc' : '#444')};
  }
`;

export function TrimPanel() {
  const currentTime = useVideoEditorStore((state) => state.currentTime);
  const duration = useVideoEditorStore((state) => state.duration);
  const selectionStart = useVideoEditorStore((state) => state.selectionStart);
  const selectionEnd = useVideoEditorStore((state) => state.selectionEnd);

  const setCurrentTime = useVideoEditorStore((state) => state.setCurrentTime);
  const setSelection = useVideoEditorStore((state) => state.setSelection);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSetStart = () => {
    setSelection(currentTime, selectionEnd);
  };

  const handleSetEnd = () => {
    setSelection(selectionStart, currentTime);
  };

  const handleClear = () => {
    setSelection(null, null);
  };

  const handlePreviewTrim = () => {
    if (selectionStart !== null && selectionEnd !== null) {
      setCurrentTime(selectionStart);
    }
  };

  const hasSelection = selectionStart !== null && selectionEnd !== null;
  const isStartSet = selectionStart !== null;
  const isEndSet = selectionEnd !== null;

  return (
    <Container>
      <Section>
        <SectionTitle>Trim Video</SectionTitle>
        <InfoBox>
          Set the start and end points to trim your video. Only the selected portion
          will be kept.
        </InfoBox>
      </Section>

      <Section>
        <SectionTitle>Current Position</SectionTitle>
        <TimeDisplay>{formatTime(currentTime)}</TimeDisplay>
      </Section>

      <Section>
        <SectionTitle>Selection</SectionTitle>
        <Row>
          <Label>Start:</Label>
          <TimeDisplay>{isStartSet ? formatTime(selectionStart!) : '--:--'}</TimeDisplay>
          <ButtonSmall variant="primary" onClick={handleSetStart}>
            Set
          </ButtonSmall>
        </Row>
        <Row>
          <Label>End:</Label>
          <TimeDisplay>{isEndSet ? formatTime(selectionEnd!) : '--:--'}</TimeDisplay>
          <ButtonSmall variant="primary" onClick={handleSetEnd}>
            Set
          </ButtonSmall>
        </Row>
      </Section>

      <Section>
        <Row>
          <Button variant="secondary" onClick={handleClear} disabled={!hasSelection}>
            Clear
          </Button>
          <Button variant="primary" onClick={handlePreviewTrim} disabled={!hasSelection}>
            Preview
          </Button>
        </Row>
      </Section>

      {hasSelection && (
        <Section>
          <InfoBox>
            Selected: {formatTime(selectionEnd! - selectionStart!)} (from{' '}
            {formatTime(selectionStart!)} to {formatTime(selectionEnd!)})
          </InfoBox>
        </Section>
      )}
    </Container>
  );
}
