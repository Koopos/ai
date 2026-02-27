'use client';

import styled from '@emotion/styled';
import { useVideoEditorStore } from '@/store/video-editor-store';

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #1a1a1a;
  border-radius: 8px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export function TopBar() {
  const isProcessing = useVideoEditorStore((state) => state.isProcessing);
  const videoFile = useVideoEditorStore((state) => state.videoFile);
  const setExportModalOpen = useVideoEditorStore((state) => state.setExportModalOpen);
  const reset = useVideoEditorStore((state) => state.reset);

  const handleExport = () => {
    setExportModalOpen(true);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to close this video? All unsaved changes will be lost.')) {
      reset();
    }
  };

  return (
    <Container>
      <Title>Video Editor</Title>
      <Actions>
        <Button onClick={handleReset}>Close</Button>
        <Button variant="primary" onClick={handleExport} disabled={isProcessing}>
          Export
        </Button>
      </Actions>
    </Container>
  );
}
