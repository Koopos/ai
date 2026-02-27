'use client';

import styled from '@emotion/styled';
import { useVideoEditorStore } from '@/store/video-editor-store';
import { useEffect, useState } from 'react';

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

const Input = styled.input`
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

const Row = styled.div`
  display: flex;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
  display: block;
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
`;

const Select = styled.select`
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

const OverlayList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
`;

const OverlayItem = styled.div<{ selected: boolean }>`
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

const PositionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-top: 8px;
`;

const PositionButton = styled.button<{ active?: boolean }>`
  padding: 8px;
  background: ${(props) => (props.active ? '#0070f3' : '#333')};
  border: 1px solid #444;
  border-radius: 4px;
  color: #fff;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.active ? '#0051cc' : '#444')};
  }
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #333;
  outline: none;
  -webkit-appearance: none;

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

export function TextOverlayPanel() {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState('48');
  const [color, setColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [posX, setPosX] = useState('50');
  const [posY, setPosY] = useState('50');
  const [startVal, setStartVal] = useState('0');
  const [endVal, setEndVal] = useState('5');

  const textOverlays = useVideoEditorStore((state) => state.textOverlays);
  const selectedTextId = useVideoEditorStore((state) => state.selectedTextId);
  const currentTime = useVideoEditorStore((state) => state.currentTime);
  const duration = useVideoEditorStore((state) => state.duration);

  const addTextOverlay = useVideoEditorStore((state) => state.addTextOverlay);
  const updateTextOverlay = useVideoEditorStore((state) => state.updateTextOverlay);
  const removeTextOverlay = useVideoEditorStore((state) => state.removeTextOverlay);
  const setSelectedTextId = useVideoEditorStore((state) => state.setSelectedTextId);

  const fontOptions = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Comic Sans MS',
    'Impact',
    'Trebuchet MS',
    'Arial Black',
  ];

  const handleAddText = () => {
    if (!text.trim()) return;

    const start = parseFloat(startVal);
    const end = parseFloat(endVal);

    const newOverlay = {
      id: `text-${Date.now()}`,
      text,
      x: parseFloat(posX),
      y: parseFloat(posY),
      fontSize: parseInt(fontSize),
      color,
      fontFamily,
      start,
      end: end > start ? end : start + 5,
    };

    addTextOverlay(newOverlay);
    setText('');
  };

  const handleUpdateSelected = () => {
    if (!selectedTextId) return;
    updateTextOverlay(selectedTextId, {
      text: text || undefined,
      fontSize: parseInt(fontSize),
      color,
      fontFamily,
      x: parseFloat(posX),
      y: parseFloat(posY),
    });
    setText('');
  };

  const handleSelectOverlay = (id: string) => {
    setSelectedTextId(id);
    const overlay = textOverlays.find((o) => o.id === id);
    if (overlay) {
      setText(overlay.text);
      setFontSize(String(overlay.fontSize));
      setColor(overlay.color);
      setFontFamily(overlay.fontFamily || 'Arial');
      setPosX(String(overlay.x));
      setPosY(String(overlay.y));
      setStartVal(String(overlay.start));
      setEndVal(String(overlay.end));
    }
  };

  const setPosition = (x: number, y: number) => {
    setPosX(String(x));
    setPosY(String(y));
    if (selectedTextId) {
      updateTextOverlay(selectedTextId, { x, y });
    }
  };

  return (
    <Container>
      <Section>
        <SectionTitle>Add Text</SectionTitle>
        <div>
          <Label>Text Content</Label>
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
          />
        </div>
        <Row>
          <div style={{ flex: 1 }}>
            <Label>Font Size</Label>
            <Input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              min="12"
              max="200"
            />
          </div>
          <div style={{ flex: 1 }}>
            <Label>Color</Label>
            <Input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ height: '40px', padding: '4px' }}
            />
          </div>
        </Row>

        <div>
          <Label>Font Family</Label>
          <Select
            value={fontFamily}
            onChange={(e) => {
              const val = e.target.value;
              setFontFamily(val);
              if (selectedTextId) {
                updateTextOverlay(selectedTextId, { fontFamily: val });
              }
            }}
          >
            {fontOptions.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </Select>
        </div>

        <Row>
          <div style={{ flex: 1 }}>
            <Label>Start Time (seconds)</Label>
            <Input
              type="number"
              value={startVal}
              onChange={(e) => {
                const val = e.target.value;
                setStartVal(val);
                if (selectedTextId) {
                  updateTextOverlay(selectedTextId, {
                    start: parseFloat(val) || 0,
                  });
                }
              }}
              min="0"
              step="0.1"
            />
          </div>
          <div style={{ flex: 1 }}>
            <Label>End Time (seconds)</Label>
            <Input
              type="number"
              value={endVal}
              onChange={(e) => {
                const val = e.target.value;
                setEndVal(val);
                if (selectedTextId) {
                  updateTextOverlay(selectedTextId, {
                    end: parseFloat(val) || 0,
                  });
                }
              }}
              min="0"
              step="0.1"
            />
          </div>
        </Row>

        {selectedTextId && (
          <>
            <div>
              <Label>Position</Label>
              <SliderContainer>
                <Row>
                  <span style={{ color: '#999', fontSize: '11px', width: '30px' }}>X:</span>
                  <Slider
                    type="range"
                    min="0"
                    max="100"
                    value={posX}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPosX(val);
                      updateTextOverlay(selectedTextId, { x: parseFloat(val) });
                    }}
                  />
                  <span style={{ color: '#fff', fontSize: '12px', minWidth: '35px', textAlign: 'right' }}>
                    {Math.round(parseFloat(posX))}%
                  </span>
                </Row>
                <Row>
                  <span style={{ color: '#999', fontSize: '11px', width: '30px' }}>Y:</span>
                  <Slider
                    type="range"
                    min="0"
                    max="100"
                    value={posY}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPosY(val);
                      updateTextOverlay(selectedTextId, { y: parseFloat(val) });
                    }}
                  />
                  <span style={{ color: '#fff', fontSize: '12px', minWidth: '35px', textAlign: 'right' }}>
                    {Math.round(parseFloat(posY))}%
                  </span>
                </Row>
              </SliderContainer>
            </div>

            <div>
              <Label>Quick Position</Label>
              <PositionGrid>
                <PositionButton onClick={() => setPosition(10, 10)}>↖ Top Left</PositionButton>
                <PositionButton onClick={() => setPosition(50, 10)}>↑ Top</PositionButton>
                <PositionButton onClick={() => setPosition(90, 10)}>↗ Top Right</PositionButton>
                <PositionButton onClick={() => setPosition(10, 50)}>← Left</PositionButton>
                <PositionButton onClick={() => setPosition(50, 50)}>⊙ Center</PositionButton>
                <PositionButton onClick={() => setPosition(90, 50)}>→ Right</PositionButton>
                <PositionButton onClick={() => setPosition(10, 90)}>↙ Bot Left</PositionButton>
                <PositionButton onClick={() => setPosition(50, 90)}>↓ Bottom</PositionButton>
                <PositionButton onClick={() => setPosition(90, 90)}>↘ Bot Right</PositionButton>
              </PositionGrid>
            </div>
          </>
        )}
        <Row>
          <Button variant="primary" onClick={handleAddText}>
            Add New
          </Button>
          {selectedTextId && (
            <Button variant="secondary" onClick={handleUpdateSelected}>
              Update
            </Button>
          )}
        </Row>
      </Section>

      <Section>
        <SectionTitle>Text Overlays ({textOverlays.length})</SectionTitle>
        <OverlayList>
          {textOverlays.length === 0 ? (
            <div style={{ color: '#666', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              No text overlays yet. Add one above!
            </div>
          ) : (
            textOverlays.map((overlay) => (
              <OverlayItem
                key={overlay.id}
                selected={selectedTextId === overlay.id}
                onClick={() => handleSelectOverlay(overlay.id)}
              >
                <span>{overlay.text}</span>
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTextOverlay(overlay.id);
                  }}
                >
                  Delete
                </DeleteButton>
              </OverlayItem>
            ))
          )}
        </OverlayList>
      </Section>
    </Container>
  );
}
