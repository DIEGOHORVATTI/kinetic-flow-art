export type NodeType = 'input' | 'output' | 'process' | 'condition' | 'api' | 'email' | 'delay';

export interface NodeData {
  label: string;
  description?: string;
  config?: Record<string, any>;
  [key: string]: any;
}

export interface CustomNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
  selected?: boolean;
  dragging?: boolean;
}

export interface CustomEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  type?: string;
}

export interface WorkflowState {
  id?: string;
  name: string;
  description?: string;
  nodes: CustomNode[];
  edges: CustomEdge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface NodePlugin {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  paletteComponent: React.ComponentType<any>;
  propertiesComponent: React.ComponentType<any>;
  initialData: NodeData;
  category: 'input' | 'process' | 'output' | 'control';
}

export interface HistoryState {
  past: WorkflowState[];
  present: WorkflowState;
  future: WorkflowState[];
}