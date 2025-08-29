import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Trash2, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore, useSelectedNode } from '@/store';
import { useCallback } from 'react';

const PropertiesPanel = () => {
  const { t } = useTranslation();
  const selectedNode = useSelectedNode();
  const { updateNodeData, deleteNode, clearSelection } = useAppStore();

  const handleLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (selectedNode) {
        updateNodeData(selectedNode.id, { label: e.target.value });
      }
    },
    [selectedNode, updateNodeData]
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (selectedNode) {
        updateNodeData(selectedNode.id, { description: e.target.value });
      }
    },
    [selectedNode, updateNodeData]
  );

  const handleDeleteNode = useCallback(() => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
      clearSelection();
    }
  }, [selectedNode, deleteNode, clearSelection]);

  if (!selectedNode) {
    return (
      <div className="w-80 bg-sidebar border-l border-sidebar-border p-4">
        <div className="text-center py-8">
          <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-medium text-sidebar-foreground mb-2">No Selection</h3>
          <p className="text-sm text-sidebar-foreground/70">
            Select a node to view and edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-sidebar border-l border-sidebar-border p-4 overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-sidebar-foreground">Properties</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteNode}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {selectedNode.type}
          </Badge>
          <span className="text-xs text-sidebar-foreground/70">
            ID: {selectedNode.id.slice(0, 8)}...
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-4">
          <h3 className="font-medium mb-4">Basic Settings</h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="node-label">Name</Label>
              <Input
                id="node-label"
                value={String(selectedNode.data.label || '')}
                onChange={handleLabelChange}
                placeholder="Enter node name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="node-description">Description</Label>
              <Textarea
                id="node-description"
                value={String(selectedNode.data.description || '')}
                onChange={handleDescriptionChange}
                placeholder="Enter node description"
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-4">Position & Size</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">X Position</Label>
              <Input 
                value={Math.round(selectedNode.position.x)} 
                readOnly 
                className="text-xs mt-1" 
              />
            </div>
            <div>
              <Label className="text-xs">Y Position</Label>
              <Input 
                value={Math.round(selectedNode.position.y)} 
                readOnly 
                className="text-xs mt-1" 
              />
            </div>
          </div>
        </Card>

        {/* Node-specific configurations */}
        {selectedNode.type === 'condition' && (
          <Card className="p-4">
            <h3 className="font-medium mb-4">Condition Settings</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="condition-logic">Condition Logic</Label>
                <Input
                  id="condition-logic"
                  placeholder="e.g., value > 100"
                  className="mt-1"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Define the condition that determines which path to take
              </div>
            </div>
          </Card>
        )}

        {selectedNode.type === 'email' && (
          <Card className="p-4">
            <h3 className="font-medium mb-4">Email Settings</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="email-to">To</Label>
                <Input
                  id="email-to"
                  placeholder="recipient@example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  placeholder="Email subject"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        )}

        {selectedNode.type === 'api' && (
          <Card className="p-4">
            <h3 className="font-medium mb-4">API Settings</h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="api-url">URL</Label>
                <Input
                  id="api-url"
                  placeholder="https://api.example.com"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="api-method">Method</Label>
                <Input
                  id="api-method"
                  placeholder="GET, POST, PUT, DELETE"
                  className="mt-1"
                />
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PropertiesPanel;