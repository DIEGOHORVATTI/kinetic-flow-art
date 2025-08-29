import { StateCreator } from 'zustand';
import { 
  Node, 
  Edge, 
  NodeChange, 
  EdgeChange, 
  Connection, 
  applyNodeChanges, 
  applyEdgeChanges, 
  addEdge as addReactFlowEdge 
} from '@xyflow/react';
import { nanoid } from 'nanoid';
import { CustomNode, CustomEdge, NodeType, NodeData } from '@/types';

export interface CanvasSlice {
  nodes: Node[];
  edges: Edge[];
  viewport: { x: number; y: number; zoom: number };
  
  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }, data?: Partial<NodeData>) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteEdge: (edgeId: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setViewport: (viewport: { x: number; y: number; zoom: number }) => void;
  clearCanvas: () => void;
}

export const createCanvasSlice: StateCreator<CanvasSlice> = (set, get) => ({
  nodes: [
    {
      id: 'start-node',
      type: 'input',
      position: { x: 100, y: 100 },
      data: { 
        label: 'Start', 
        description: 'Workflow starting point' 
      }
    },
    {
      id: 'process-node',
      type: 'process',
      position: { x: 300, y: 200 },
      data: { 
        label: 'Process Data', 
        description: 'Transform your data' 
      }
    }
  ],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },

  onNodesChange: (changes) => {
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes)
    }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges)
    }));
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addReactFlowEdge(
        {
          ...connection,
          id: nanoid(),
          animated: true,
          type: 'smoothstep'
        },
        state.edges
      )
    }));
  },

  addNode: (type, position, data = {}) => {
    const newNode: Node = {
      id: nanoid(),
      type,
      position,
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        ...data
      }
    };

    set((state) => ({
      nodes: [...state.nodes, newNode]
    }));
  },

  updateNodeData: (nodeId, newData) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    }));
  },

  deleteNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter((edge) => 
        edge.source !== nodeId && edge.target !== nodeId
      )
    }));
  },

  deleteEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId)
    }));
  },

  setNodes: (nodes) => {
    set({ nodes });
  },

  setEdges: (edges) => {
    set({ edges });
  },

  setViewport: (viewport) => {
    set({ viewport });
  },

  clearCanvas: () => {
    set({
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 }
    });
  }
});