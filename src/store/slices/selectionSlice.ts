import { StateCreator } from 'zustand';

export interface SelectionSlice {
  selectedNodeIds: string[];
  selectedEdgeIds: string[];
  
  // Actions
  selectNode: (nodeId: string) => void;
  selectNodes: (nodeIds: string[]) => void;
  selectEdge: (edgeId: string) => void;
  selectEdges: (edgeIds: string[]) => void;
  clearSelection: () => void;
  toggleNodeSelection: (nodeId: string) => void;
  isNodeSelected: (nodeId: string) => boolean;
  isEdgeSelected: (edgeId: string) => boolean;
}

export const createSelectionSlice: StateCreator<SelectionSlice> = (set, get) => ({
  selectedNodeIds: [],
  selectedEdgeIds: [],

  selectNode: (nodeId) => {
    set({ selectedNodeIds: [nodeId], selectedEdgeIds: [] });
  },

  selectNodes: (nodeIds) => {
    set({ selectedNodeIds: nodeIds, selectedEdgeIds: [] });
  },

  selectEdge: (edgeId) => {
    set({ selectedEdgeIds: [edgeId], selectedNodeIds: [] });
  },

  selectEdges: (edgeIds) => {
    set({ selectedEdgeIds: edgeIds, selectedNodeIds: [] });
  },

  clearSelection: () => {
    set({ selectedNodeIds: [], selectedEdgeIds: [] });
  },

  toggleNodeSelection: (nodeId) => {
    const { selectedNodeIds } = get();
    const isSelected = selectedNodeIds.includes(nodeId);
    
    if (isSelected) {
      set({ selectedNodeIds: selectedNodeIds.filter(id => id !== nodeId) });
    } else {
      set({ selectedNodeIds: [...selectedNodeIds, nodeId] });
    }
  },

  isNodeSelected: (nodeId) => {
    return get().selectedNodeIds.includes(nodeId);
  },

  isEdgeSelected: (edgeId) => {
    return get().selectedEdgeIds.includes(edgeId);
  }
});