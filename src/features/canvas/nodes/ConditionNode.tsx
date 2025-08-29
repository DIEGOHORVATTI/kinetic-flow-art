import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GitBranch } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import ExecuteNodeButton from '@/components/ExecuteNodeButton';
import { validateNode } from '@/lib/business-rules';

const ConditionNode = memo(({ id, data, selected }: NodeProps) => {
  const { t } = useTranslation();
  const updateNodeData = useAppStore((state) => state.updateNodeData);

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { label: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleConditionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { condition: e.target.value });
    },
    [id, updateNodeData]
  );

  const validation = validateNode({ 
    id, 
    type: 'condition', 
    data: { ...data, label: String(data.label || t('editor.nodes.condition.defaultLabel')) }, 
    position: { x: 0, y: 0 } 
  });

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
          <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
            <GitBranch className="w-4 h-4 text-warning" />
          </div>
          <input
            type="text"
            value={String(data.label || t('editor.nodes.condition.defaultLabel'))}
            onChange={handleLabelChange}
            className="font-medium text-sm bg-transparent border-none outline-none flex-1 text-foreground"
            placeholder={t('editor.properties.name')}
          />
        </div>
        {data.description && (
          <p className="text-xs text-muted-foreground">{String(data.description)}</p>
        )}
        <div className="flex justify-between mt-3 text-xs">
          <span className="text-success font-medium">True</span>
          <span className="text-destructive font-medium">False</span>
        </div>
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-handle-bg border-2 border-handle-border"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: '25%' }}
        className="w-3 h-3 bg-success border-2 border-success"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: '75%' }}
        className="w-3 h-3 bg-destructive border-2 border-destructive"
      />
    </Card>
  );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;