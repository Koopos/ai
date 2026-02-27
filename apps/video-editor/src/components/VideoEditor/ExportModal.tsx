'use client';

import styled from '@emotion/styled';
import { useVideoEditorStore } from '@/store/video-editor-store';
import { useEffect, useRef, useState } from 'react';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Container = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 24px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #fff;
  }
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 12px 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #333;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${(props) => props.progress}%;
  height: 100%;
  background: #0070f3;
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 13px;
  color: #999;
  text-align: center;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  width: 100%;
  padding: 12px 16px;
  background: ${(props) => (props.variant === 'primary' ? '#0070f3' : '#333')};
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${(props) => (props.variant === 'primary' ? '#0051cc' : '#444')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  margin-bottom: 12px;
`;

const Label = styled.label`
  font-size: 12px;
  color: #999;
  display: block;
  margin-bottom: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  background: #333;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #0070f3;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  background: #333;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-size: 14px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #0070f3;
  }
`;

const Summary = styled.div`
  background: #2a2a2a;
  border-radius: 6px;
  padding: 12px;
  margin-top: 16px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #ccc;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export function ExportModal() {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFormat, setOutputFormat] = useState('mp4');
  const [outputQuality, setOutputQuality] = useState('high');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const videoUrl = useVideoEditorStore((state) => state.videoUrl);
  const videoFile = useVideoEditorStore((state) => state.videoFile);
  const duration = useVideoEditorStore((state) => state.duration);
  const videoWidth = useVideoEditorStore((state) => state.videoWidth);
  const videoHeight = useVideoEditorStore((state) => state.videoHeight);
  const textOverlays = useVideoEditorStore((state) => state.textOverlays);
  const watermarkRegions = useVideoEditorStore((state) => state.watermarkRegions);
  const selectionStart = useVideoEditorStore((state) => state.selectionStart);
  const selectionEnd = useVideoEditorStore((state) => state.selectionEnd);
  const isExportModalOpen = useVideoEditorStore((state) => state.isExportModalOpen);
  const setExportModalOpen = useVideoEditorStore((state) => state.setExportModalOpen);
  const setProcessing = useVideoEditorStore((state) => state.setProcessing);

  const handleClose = () => {
    if (!isExporting) {
      setExportModalOpen(false);
    }
  };

  const handleExport = async () => {
    if (!videoFile || !videoUrl) return;

    setIsExporting(true);
    setProgress(0);
    setProcessing(true, 'Preparing export...', 0);

    try {
      // Create video element
      const video = document.createElement('video');
      video.src = videoUrl;
      video.muted = true;

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = resolve;
        video.onerror = reject;
      });

      // Calculate export range
      const startTime = selectionStart ?? 0;
      const endTime = selectionEnd ?? duration;
      const exportDuration = endTime - startTime;

      // Set video to start position
      video.currentTime = startTime;

      // Create canvas for rendering
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Setup MediaRecorder
      const stream = canvas.captureStream(30); // 30 FPS
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: outputQuality === 'high' ? 5000000 : 2500000,
      });

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `exported-video-${Date.now()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
        setIsExporting(false);
        setProgress(100);
        setProcessing(false, '', 0);
      };

      mediaRecorder.start();

      // Render frames
      video.play();
      const renderFrame = () => {
        if (video.currentTime >= endTime || video.paused) {
          mediaRecorder.stop();
          return;
        }

        // Draw video frame
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Draw text overlays
        textOverlays.forEach((overlay) => {
          if (video.currentTime >= overlay.start && video.currentTime <= overlay.end) {
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

        // Draw watermark blur regions
        watermarkRegions.forEach((region) => {
          if (video.currentTime >= region.start && video.currentTime <= region.end) {
            const x = (region.x / 100) * canvas.width;
            const y = (region.y / 100) * canvas.height;
            const w = (region.width / 100) * canvas.width;
            const h = (region.height / 100) * canvas.height;

            // Apply blur effect
            ctx.save();
            ctx.filter = 'blur(10px)';
            ctx.fillStyle = 'rgba(128, 128, 128, 0.5)';
            ctx.fillRect(x, y, w, h);
            ctx.restore();
          }
        });

        // Update progress
        const currentProgress = ((video.currentTime - startTime) / exportDuration) * 100;
        setProgress(currentProgress);
        setProcessing(true, 'Exporting...', currentProgress);

        requestAnimationFrame(renderFrame);
      };

      renderFrame();
    } catch (error) {
      console.error('Export error:', error);
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsExporting(false);
      setProcessing(false, '', 0);
    }
  };

  if (!isExportModalOpen) return null;

  const hasTrim = selectionStart !== null && selectionEnd !== null;
  const overlayCount = textOverlays.length + watermarkRegions.length;

  return (
    <Overlay onClick={handleClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>Export Video</Title>
          <CloseButton onClick={handleClose} disabled={isExporting}>
            ×
          </CloseButton>
        </Header>

        <Section>
          <SectionTitle>Export Settings</SectionTitle>
          <Row>
            <div style={{ flex: 1 }}>
              <Label>Format</Label>
              <Select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                disabled={isExporting}
              >
                <option value="webm">WebM</option>
                <option value="mp4">MP4</option>
              </Select>
            </div>
            <div style={{ flex: 1 }}>
              <Label>Quality</Label>
              <Select
                value={outputQuality}
                onChange={(e) => setOutputQuality(e.target.value)}
                disabled={isExporting}
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </Select>
            </div>
          </Row>
        </Section>

        <Section>
          <Summary>
            <SummaryItem>
              <span>Duration:</span>
              <span>{Math.floor(duration)}s</span>
            </SummaryItem>
            {hasTrim && (
              <SummaryItem>
                <span>Export range:</span>
                <span>
                  {Math.floor(selectionStart!)}s - {Math.floor(selectionEnd!)}s
                </span>
              </SummaryItem>
            )}
            <SummaryItem>
              <span>Resolution:</span>
              <span>
                {videoWidth}x{videoHeight}
              </span>
            </SummaryItem>
            <SummaryItem>
              <span>Overlays:</span>
              <span>
                {textOverlays.length} text, {watermarkRegions.length} watermarks
              </span>
            </SummaryItem>
          </Summary>
        </Section>

        {isExporting && (
          <Section>
            <SectionTitle>Exporting...</SectionTitle>
            <ProgressBar>
              <ProgressFill progress={progress} />
            </ProgressBar>
            <ProgressText>{Math.round(progress)}% complete</ProgressText>
          </Section>
        )}

        <Section>
          <InfoBox>
            {overlayCount > 0
              ? `Your video will include ${overlayCount} overlay${overlayCount > 1 ? 's' : ''}.`
              : 'No overlays applied. The video will be exported as-is.'}
          </InfoBox>
        </Section>

        <Button variant="primary" onClick={handleExport} disabled={isExporting}>
          {isExporting ? 'Exporting...' : 'Start Export'}
        </Button>
      </Container>
    </Overlay>
  );
}
