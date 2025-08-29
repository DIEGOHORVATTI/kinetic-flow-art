import { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Connection,
  ConnectionLineType,
} from '@xyflow/react';
import { useAppStore } from '@/store';
import { nodeTypes } from './nodes';
import '@xyflow/react/dist/style.css';
import './canvas.css';

const defaultEdgeOptions = {
  animated: true,
  type: 'smoothstep',
  style: {
    stroke: 'hsl(var(--primary))',
    strokeWidth: 2,
  },
};

const connectionLineStyle = {
  stroke: 'hsl(var(--primary))',
  strokeWidth: 2,
};

const CanvasContent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();

  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect,
    addNode 
  } = useAppStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type as any, position);
    },
    [screenToFlowPosition, addNode]
  );

  const isValidConnection = useCallback((connection: Connection) => {
    // Prevent self-connections
    return connection.source !== connection.target;
  }, []);

  return (
    <div className="w-full h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        isValidConnection={isValidConnection}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionLineStyle={connectionLineStyle}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        className="bg-canvas-background"
      >
        <Background 
          color="hsl(var(--muted-foreground))" 
          gap={20} 
          size={1}
        />
        <Controls className="bg-card border-border shadow-md" />
        <MiniMap 
          className="bg-card border-border shadow-md"
          nodeColor={(node) => {
            switch (node.type) {
              case 'input': return 'hsl(var(--success))';
              case 'output': return 'hsl(var(--destructive))';
              case 'condition': return 'hsl(var(--warning))';
              default: return 'hsl(var(--primary))';
            }
          }}
        />
        <Panel position="top-left" className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2">
          <div className="text-sm font-medium text-foreground">Visual No-Code Editor</div>
          <div className="text-xs text-muted-foreground">Drag nodes from the palette to build your workflow</div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

const Canvas = () => {
  return (
    <ReactFlowProvider>
      <CanvasContent />
    </ReactFlowProvider>
  );
};

export default Canvas;