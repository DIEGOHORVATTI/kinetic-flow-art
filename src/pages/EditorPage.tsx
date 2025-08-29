import { ReactFlowProvider } from '@xyflow/react';
import Canvas from '@/features/canvas/Canvas';
import NodePalette from '@/features/node-palette/NodePalette';
import PropertiesPanel from '@/features/properties-panel/PropertiesPanel';
import Toolbar from '@/features/toolbar/Toolbar';
import { useAppStore } from '@/store';
import { useEffect, useRef } from 'react';

const EditorPage = () => {
  const { selectNode, clearSelection, markDirty, nodes } = useAppStore();
  const previousNodesLength = useRef(nodes.length);

  // Mark project as dirty when nodes change
  useEffect(() => {
    if (nodes.length !== previousNodesLength.current) {
      markDirty();
      previousNodesLength.current = nodes.length;
    }
  }, [nodes, markDirty]);

  // Handle canvas click to clear selection
  const handleCanvasClick = () => {
    clearSelection();
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <ReactFlowProvider>
        <Toolbar />
        
        <div className="flex-1 flex">
          <NodePalette />
          
          <div className="flex-1 relative">
            <div 
              className="absolute inset-0"
              onClick={handleCanvasClick}
            >
              <Canvas />
            </div>
          </div>
          
          <PropertiesPanel />
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default EditorPage;