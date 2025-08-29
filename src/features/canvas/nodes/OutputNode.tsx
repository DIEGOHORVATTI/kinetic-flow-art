import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Flag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import ExecuteNodeButton from '@/components/ExecuteNodeButton';

const OutputNode = memo(({ id, data, selected }: NodeProps) => {
  const { t } = useTranslation();
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
          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
            <Flag className="w-4 h-4 text-destructive" />
          </div>
          <input
            type="text"
            value={String(data.label || t('editor.nodes.output.defaultLabel'))}
            onChange={handleLabelChange}
            className="font-medium text-sm bg-transparent border-none outline-none flex-1 text-foreground"
            placeholder={t('editor.properties.name')}
          />
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground">{String(data.description)}</p>
        )}
        
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
          <ExecuteNodeButton node={{ 
            id, 
            type: 'output', 
            data: { ...data, label: String(data.label || t('editor.nodes.output.defaultLabel')) }, 
            position: { x: 0, y: 0 } 
          }} />
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-handle-bg border-2 border-handle-border"
      />
    </Card>
  );
});

OutputNode.displayName = 'OutputNode';

export default OutputNode;