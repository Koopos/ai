export interface Clip {
  id: string;
  start: number;
  end: number;
  sourceFile: File;
  sourceUrl: string;
}

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  start: number;
  end: number;
  fontSize: number;
  color: string;
  fontFamily: string;
}

export interface WatermarkRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  blurIntensity: number;
  start: number;
  end: number;
}

export interface VideoEditorState {
  // Video data
  videoFile: File | null;
  videoUrl: string | null;
  duration: number;
  videoWidth: number;
  videoHeight: number;

  // Timeline
  currentTime: number;
  isPlaying: boolean;
  selectionStart: number | null;
  selectionEnd: number | null;
  clips: Clip[];

  // Text overlays
  textOverlays: TextOverlay[];
  selectedTextId: string | null;

  // Watermarks
  watermarkRegions: WatermarkRegion[];
  selectedWatermarkId: string | null;

  // Processing
  isProcessing: boolean;
  processingProgress: number;
  processingStage: string;
  processingError: string | null;

  // UI state
  activeTool: 'select' | 'trim' | 'split' | 'text' | 'watermark';
  isExportModalOpen: boolean;
}
