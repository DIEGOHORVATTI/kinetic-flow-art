import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Cpu } from 'lucide-react';
import { useAppStore } from '@/store';

const ProcessNode = memo(({ id, data, selected }: NodeProps) => {
  const updateNodeData = useAppStore((state) => state.updateNodeData);

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { label: e.target.value });
    },
    [id, updateNodeData]
  );

  return (
    <Card 
      className={`
        min-w-[180px] bg-gradient-node border-node-border shadow-node
        transition-all duration-200 hover:shadow-md
        ${selected ? 'ring-2 ring-primary shadow-node-selected' : ''}
      `}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <input
            type="text"
            value={String(data.label || 'Process')}
            onChange={handleLabelChange}
            className="font-medium text-sm bg-transparent border-none outline-none flex-1 text-foreground"
            placeholder="Node name"
          />
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground">{String(data.description)}</p>
        )}
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-handle-bg border-2 border-handle-border"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-handle-bg border-2 border-handle-border"
      />
    </Card>
  );
});

ProcessNode.displayName = 'ProcessNode';

export default ProcessNode;