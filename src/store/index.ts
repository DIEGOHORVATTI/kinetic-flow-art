import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createCanvasSlice, CanvasSlice } from './slices/canvasSlice';
import { createSelectionSlice, SelectionSlice } from './slices/selectionSlice';
import { createHistorySlice, HistorySlice } from './slices/historySlice';
import { createProjectSlice, ProjectSlice } from './slices/projectSlice';

export type AppStore = CanvasSlice & SelectionSlice & HistorySlice & ProjectSlice;

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get, api) => ({
      ...createCanvasSlice(set, get, api),
      ...createSelectionSlice(set, get, api),
      ...createHistorySlice(set, get, api),
      ...createProjectSlice(set, get, api),
    }),
    {
      name: 'no-code-editor-store',
    }
  )
);

// Convenience selectors for better performance
export const useNodes = () => useAppStore((state) => state.nodes);
export const useEdges = () => useAppStore((state) => state.edges);
export const useSelectedNodeIds = () => useAppStore((state) => state.selectedNodeIds);
export const useSelectedNode = () => {
  return useAppStore((state) => {
    const selectedId = state.selectedNodeIds[0];
    return selectedId ? state.nodes.find(node => node.id === selectedId) : null;
  });
};