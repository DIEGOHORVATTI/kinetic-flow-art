import { StateCreator } from 'zustand';
import { Node, Edge } from '@xyflow/react';

interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export interface HistorySlice {
  past: HistoryState[];
  future: HistoryState[];
  
  // Actions
  pushToHistory: (state: HistoryState) => void;
  undo: () => HistoryState | null;
  redo: () => HistoryState | null;
  clearHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

export const createHistorySlice: StateCreator<HistorySlice> = (set, get) => ({
  past: [],
  future: [],

  pushToHistory: (state) => {
    set((current) => ({
      past: [...current.past, state],
      future: [] // Clear future when new action is performed
    }));
  },

  undo: () => {
    const { past } = get();
    if (past.length === 0) return null;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);

    set((current) => ({
      past: newPast,
      future: [{ nodes: [], edges: [] }, ...current.future] // Current state will be set by caller
    }));

    return previous;
  },

  redo: () => {
    const { future } = get();
    if (future.length === 0) return null;

    const next = future[0];
    const newFuture = future.slice(1);

    set((current) => ({
      future: newFuture,
      past: [...current.past, { nodes: [], edges: [] }] // Current state will be set by caller
    }));

    return next;
  },

  clearHistory: () => {
    set({ past: [], future: [] });
  },

  canUndo: () => {
    return get().past.length > 0;
  },

  canRedo: () => {
    return get().future.length > 0;
  }
});