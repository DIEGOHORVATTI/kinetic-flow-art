import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Play, Loader2, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store';
import { validateNode } from '@/lib/business-rules';
import { CustomNode } from '@/types';

interface ExecuteNodeButtonProps {
  node: CustomNode;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const ExecuteNodeButton = memo(({ node, size = 'sm', variant = 'outline' }: ExecuteNodeButtonProps) => {
  const { t } = useTranslation();
  const { executeNodeById, executingNodes } = useAppStore();
  
  const isExecuting = executingNodes.has(node.id);
  const validation = validateNode(node);
  const canExecute = validation.isValid;

  const handleExecute = () => {
    if (canExecute && !isExecuting) {
      executeNodeById(node.id);
    }
  };

  return (
    <Button
      onClick={handleExecute}
      disabled={!canExecute || isExecuting}
      size={size}
      variant={variant}
      className="gap-2"
    >
      {isExecuting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : !canExecute ? (
        <AlertCircle className="w-4 h-4" />
      ) : (
        <Play className="w-4 h-4" />
      )}
      {t('actions.execute')}
    </Button>
  );
});

ExecuteNodeButton.displayName = 'ExecuteNodeButton';

export default ExecuteNodeButton;