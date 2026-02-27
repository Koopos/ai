'use client';

import styled from '@emotion/styled';
import { useVideoEditorStore } from '@/store/video-editor-store';
import { TopBar } from './TopBar';
import { VideoPreview } from './VideoPreview';
import { ToolsPanel } from './ToolsPanel';
import { TextOverlayPanel } from './TextOverlayPanel';
import { WatermarkRegionPanel } from './WatermarkRegionPanel';
import { TrimPanel } from './TrimPanel';
import { SplitPanel } from './SplitPanel';
import { ExportModal } from './ExportModal';
import { Timeline } from '../Timeline/Timeline';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 16px;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  gap: 16px;
  min-height: 0;
`;

const LeftPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
`;

const RightPanel = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export function VideoEditor() {
  const videoUrl = useVideoEditorStore((state) => state.videoUrl);
  const activeTool = useVideoEditorStore((state) => state.activeTool);

  if (!videoUrl) {
    return <UploadPrompt />;
  }

  const renderToolPanel = () => {
    switch (activeTool) {
      case 'text':
        return <TextOverlayPanel />;
      case 'watermark':
        return <WatermarkRegionPanel />;
      case 'trim':
        return <TrimPanel />;
      case 'split':
        return <SplitPanel />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <TopBar />
      <MainContent>
        <LeftPanel>
          <VideoPreview />
          <Timeline />
        </LeftPanel>
        <RightPanel>
          <ToolsPanel />
          {renderToolPanel()}
        </RightPanel>
      </MainContent>
      <ExportModal />
    </Container>
  );
}

const UploadPromptContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 24px;
`;

const UploadPromptTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #333;
`;

const UploadPromptText = styled.p`
  font-size: 16px;
  color: #666;
  max-width: 400px;
  text-align: center;
  line-height: 1.6;
`;

const UploadButton = styled.label`
  padding: 16px 32px;
  background: #0070f3;
  color: white;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #0051cc;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

function UploadPrompt() {
  const setVideoFile = useVideoEditorStore((state) => state.setVideoFile);
  const setVideoMetadata = useVideoEditorStore((state) => state.setVideoMetadata);
  const setProcessing = useVideoEditorStore((state) => state.setProcessing);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    try {
      setProcessing(true, 'Validating video...', 0);

      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setVideoFile(file, url);

      // Get video metadata
      const video = document.createElement('video');
      video.preload = 'metadata';

      video.onloadedmetadata = () => {
        setVideoMetadata(
          video.duration,
          video.videoWidth,
          video.videoHeight
        );
        setProcessing(false, '', 0);
      };

      video.onerror = () => {
        setProcessing(false, '', 0);
        alert('Failed to load video. Please try a different file.');
        URL.revokeObjectURL(url);
      };

      video.src = url;
    } catch (error) {
      setProcessing(false, '', 0);
      alert(error instanceof Error ? error.message : 'Failed to load video');
    }
  };

  return (
    <UploadPromptContainer>
      <UploadPromptTitle>Video Editor</UploadPromptTitle>
      <UploadPromptText>
        Upload a video to get started. Supports MP4, WebM, and MOV formats up to 10 minutes.
      </UploadPromptText>
      <UploadButton>
        Choose Video File
        <HiddenInput
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
        />
      </UploadButton>
    </UploadPromptContainer>
  );
}
