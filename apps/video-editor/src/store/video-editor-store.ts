'use client';

import { create } from 'zustand';
import type {
  Clip,
  TextOverlay,
  VideoEditorState,
  WatermarkRegion,
} from '@/types/video';

interface VideoEditorActions {
  // Video actions
  setVideoFile: (file: File, url: string) => void;
  setVideoMetadata: (duration: number, width: number, height: number) => void;
  setCurrentTime: (time: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;

  // Timeline actions
  setSelection: (start: number | null, end: number | null) => void;
  addClip: (clip: Clip) => void;
  removeClip: (id: string) => void;
  updateClip: (id: string, updates: Partial<Clip>) => void;

  // Text overlay actions
  addTextOverlay: (overlay: TextOverlay) => void;
  updateTextOverlay: (id: string, updates: Partial<TextOverlay>) => void;
  removeTextOverlay: (id: string) => void;
  setSelectedTextId: (id: string | null) => void;

  // Watermark actions
  addWatermarkRegion: (region: WatermarkRegion) => void;
  updateWatermarkRegion: (id: string, updates: Partial<WatermarkRegion>) => void;
  removeWatermarkRegion: (id: string) => void;
  setSelectedWatermarkId: (id: string | null) => void;

  // Processing actions
  setProcessing: (
    isProcessing: boolean,
    stage: string,
    progress: number,
    error?: string
  ) => void;

  // UI actions
  setActiveTool: (
    tool: 'select' | 'trim' | 'split' | 'text' | 'watermark'
  ) => void;
  setExportModalOpen: (isOpen: boolean) => void;

  // Reset
  reset: () => void;
}

type VideoEditorStore = VideoEditorState & VideoEditorActions;

const initialState: VideoEditorState = {
  videoFile: null,
  videoUrl: null,
  duration: 0,
  videoWidth: 0,
  videoHeight: 0,
  currentTime: 0,
  isPlaying: false,
  selectionStart: null,
  selectionEnd: null,
  clips: [],
  textOverlays: [],
  selectedTextId: null,
  watermarkRegions: [],
  selectedWatermarkId: null,
  isProcessing: false,
  processingProgress: 0,
  processingStage: '',
  processingError: null,
  activeTool: 'select',
  isExportModalOpen: false,
};

export const useVideoEditorStore = create<VideoEditorStore>((set) => ({
  ...initialState,

  // Video actions
  setVideoFile: (file, url) => {
    set({ videoFile: file, videoUrl: url });
  },

  setVideoMetadata: (duration, width, height) => {
    set({ duration, videoWidth: width, videoHeight: height });
  },

  setCurrentTime: (time) => {
    set({ currentTime: time });
  },

  setIsPlaying: (isPlaying) => {
    set({ isPlaying });
  },

  // Timeline actions
  setSelection: (start, end) => {
    set({ selectionStart: start, selectionEnd: end });
  },

  addClip: (clip) => {
    set((state) => ({ clips: [...state.clips, clip] }));
  },

  removeClip: (id) => {
    set((state) => ({
      clips: state.clips.filter((clip) => clip.id !== id),
    }));
  },

  updateClip: (id, updates) => {
    set((state) => ({
      clips: state.clips.map((clip) =>
        clip.id === id ? { ...clip, ...updates } : clip
      ),
    }));
  },

  // Text overlay actions
  addTextOverlay: (overlay) => {
    set((state) => ({
      textOverlays: [...state.textOverlays, overlay],
    }));
  },

  updateTextOverlay: (id, updates) => {
    set((state) => ({
      textOverlays: state.textOverlays.map((overlay) =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      ),
    }));
  },

  removeTextOverlay: (id) => {
    set((state) => ({
      textOverlays: state.textOverlays.filter((overlay) => overlay.id !== id),
      selectedTextId: state.selectedTextId === id ? null : state.selectedTextId,
    }));
  },

  setSelectedTextId: (id) => {
    set({ selectedTextId: id });
  },

  // Watermark actions
  addWatermarkRegion: (region) => {
    set((state) => ({
      watermarkRegions: [...state.watermarkRegions, region],
    }));
  },

  updateWatermarkRegion: (id, updates) => {
    set((state) => ({
      watermarkRegions: state.watermarkRegions.map((region) =>
        region.id === id ? { ...region, ...updates } : region
      ),
    }));
  },

  removeWatermarkRegion: (id) => {
    set((state) => ({
      watermarkRegions: state.watermarkRegions.filter(
        (region) => region.id !== id
      ),
      selectedWatermarkId:
        state.selectedWatermarkId === id ? null : state.selectedWatermarkId,
    }));
  },

  setSelectedWatermarkId: (id) => {
    set({ selectedWatermarkId: id });
  },

  // Processing actions
  setProcessing: (isProcessing, stage, progress, error) => {
    set({
      isProcessing,
      processingStage: stage,
      processingProgress: progress,
      processingError: error ?? null,
    });
  },

  // UI actions
  setActiveTool: (tool) => {
    set({ activeTool: tool });
  },

  setExportModalOpen: (isOpen) => {
    set({ isExportModalOpen: isOpen });
  },

  // Reset
  reset: () => {
    set(initialState);
  },
}));
