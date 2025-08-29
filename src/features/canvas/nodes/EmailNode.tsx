import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import ExecuteNodeButton from '@/components/ExecuteNodeButton';
import { validateNode } from '@/lib/business-rules';

const EmailNode = memo(({ id, data, selected }: NodeProps) => {
  const { t } = useTranslation();
  const updateNodeData = useAppStore((state) => state.updateNodeData);

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { label: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleEmailChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { email: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleSubjectChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(id, { subject: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleBodyChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { body: e.target.value });
    },
    [id, updateNodeData]
  );

  const validation = validateNode({ 
    id, 
    type: 'email', 
    data: { ...data, label: String(data.label || t('editor.nodes.email.defaultLabel')) }, 
    position: { x: 0, y: 0 } 
  });

  return (
    <Card 
      className={`
        min-w-[280px] bg-gradient-node border-node-border shadow-node
        transition-all duration-200 hover:shadow-md
        ${selected ? 'ring-2 ring-primary shadow-node-selected' : ''}
        ${!validation.isValid ? 'border-destructive/50' : ''}
      `}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Mail className="w-4 h-4 text-blue-500" />
          </div>
          <input
            type="text"
            value={String(data.label || t('editor.nodes.email.defaultLabel'))}
            onChange={handleLabelChange}
            className="font-medium text-sm bg-transparent border-none outline-none flex-1 text-foreground"
            placeholder={t('editor.properties.name')}
          />
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor={`email-${id}`} className="text-xs font-medium">
              {t('editor.properties.emailTo')}
            </Label>
            <Input
              id={`email-${id}`}
              type="email"
              value={String(data.email || '')}
              onChange={handleEmailChange}
              placeholder="recipient@example.com"
              className="mt-1 h-8"
            />
          </div>

          <div>
            <Label htmlFor={`subject-${id}`} className="text-xs font-medium">
              {t('editor.properties.emailSubject')}
            </Label>
            <Input
              id={`subject-${id}`}
              value={String(data.subject || '')}
              onChange={handleSubjectChange}
              placeholder={t('editor.properties.emailSubject')}
              className="mt-1 h-8"
            />
          </div>

          <div>
            <Label htmlFor={`body-${id}`} className="text-xs font-medium">
              {t('editor.properties.emailBody')}
            </Label>
            <Textarea
              id={`body-${id}`}
              value={String(data.body || '')}
              onChange={handleBodyChange}
              placeholder="Email content..."
              className="mt-1 resize-none"
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
          <ExecuteNodeButton node={{ 
            id, 
            type: 'email', 
            data: { ...data, label: String(data.label || t('editor.nodes.email.defaultLabel')) }, 
            position: { x: 0, y: 0 } 
          }} />
          {!validation.isValid && (
            <span className="text-xs text-destructive">
              {validation.errors.length} error(s)
            </span>
          )}
        </div>
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

EmailNode.displayName = 'EmailNode';

export default EmailNode;