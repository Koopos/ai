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

  &:hover {
    background: ${(props) =>
      props.variant === 'primary'
        ? '#0051cc'
        : props.variant === 'danger'
        ? '#d32f2f'
        : '#444'};
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

const RegionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

const RegionItem = styled.div<{ selected: boolean }>`
  padding: 10px 12px;
  background: ${(props) => (props.selected ? '#0070f3' : '#333')};
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: #fff;

  &:hover {
    background: ${(props) => (props.selected ? '#0051cc' : '#444')};
  }
`;

const DeleteButton = styled.button`
  padding: 4px 8px;
  background: #ff3b30;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  cursor: pointer;

  &:hover {
    background: #d32f2f;
  }
`;

export function WatermarkRegionPanel() {
  const [isSelecting, setIsSelecting] = useState(false);

  const watermarkRegions = useVideoEditorStore((state) => state.watermarkRegions);
  const selectedWatermarkId = useVideoEditorStore((state) => state.selectedWatermarkId);
  const currentTime = useVideoEditorStore((state) => state.currentTime);
  const duration = useVideoEditorStore((state) => state.duration);

  const addWatermarkRegion = useVideoEditorStore((state) => state.addWatermarkRegion);
  const removeWatermarkRegion = useVideoEditorStore((state) => state.removeWatermarkRegion);
  const setSelectedWatermarkId = useVideoEditorStore((state) => state.setSelectedWatermarkId);

  const handleStartSelection = () => {
    setIsSelecting(true);
    // This will be handled by video preview interaction
    // For now, add a default region
    const newRegion = {
      id: `watermark-${Date.now()}`,
      x: 30,
      y: 30,
      width: 20,
      height: 20,
      start: currentTime,
      end: duration || currentTime + 5,
    };
    addWatermarkRegion(newRegion);
    setIsSelecting(false);
  };

  const handleSelectRegion = (id: string) => {
    setSelectedWatermarkId(id);
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Watermark Removal</SectionTitle>
        <InfoBox>
          Click &quot;Add Region&quot; to add a watermark region. The region will be blurred
          in the exported video.
        </InfoBox>
        <Button variant="primary" onClick={handleStartSelection}>
          Add Region
        </Button>
      </Section>

      <Section>
        <SectionTitle>Regions ({watermarkRegions.length})</SectionTitle>
        <RegionList>
          {watermarkRegions.length === 0 ? (
            <div style={{ color: '#666', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              No watermark regions. Add one above!
            </div>
          ) : (
            watermarkRegions.map((region) => (
              <RegionItem
                key={region.id}
                selected={selectedWatermarkId === region.id}
                onClick={() => handleSelectRegion(region.id)}
              >
                <span>
                  {region.x}%, {region.y}% - {region.width}x{region.height}
                </span>
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeWatermarkRegion(region.id);
                  }}
                >
                  Delete
                </DeleteButton>
              </RegionItem>
            ))
          )}
        </RegionList>
      </Section>
    </Container>
  );
}
