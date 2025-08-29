import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Undo, 
  Redo, 
  Play, 
  Square, 
  ZoomIn, 
  ZoomOut, 
  Maximize,
  Download,
  Upload
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '@/store';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';

const Toolbar = () => {
  const { t } = useTranslation();
  const { 
    canUndo, 
    canRedo, 
    undo, 
    redo, 
    pushToHistory, 
    nodes, 
    edges,
    setNodes,
    setEdges,
    markClean,
    updateLastSaved 
  } = useAppStore();
  
  const projectName = useAppStore((state) => state.projectName);
  const isDirty = useAppStore((state) => state.isDirty);
  const isLoading = useAppStore((state) => state.isLoading);
  const { zoomIn, zoomOut, fitView, toObject } = useReactFlow();

  const handleUndo = useCallback(() => {
    if (canUndo()) {
      // Push current state to history before undoing
      pushToHistory({ nodes, edges });
      const previousState = undo();
      if (previousState) {
        setNodes(previousState.nodes);
        setEdges(previousState.edges);
      }
    }
  }, [canUndo, pushToHistory, nodes, edges, undo, setNodes, setEdges]);

  const handleRedo = useCallback(() => {
    if (canRedo()) {
      pushToHistory({ nodes, edges });
      const nextState = redo();
      if (nextState) {
        setNodes(nextState.nodes);
        setEdges(nextState.edges);
      }
    }
  }, [canRedo, pushToHistory, nodes, edges, redo, setNodes, setEdges]);

  const handleSave = useCallback(() => {
    const flowData = toObject();
    console.log('Saving workflow:', flowData);
    updateLastSaved();
    // Here you would typically send to backend
  }, [toObject, updateLastSaved]);

  const handleExport = useCallback(() => {
    const flowData = toObject();
    const dataStr = JSON.stringify(flowData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [toObject, projectName]);

  return (
    <div className="h-14 bg-card border-b border-border px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold text-foreground">{projectName}</h1>
          {isDirty && (
            <Badge variant="outline" className="text-xs">
              Unsaved
            </Badge>
          )}
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            disabled={!canUndo()}
          >
            <Undo className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRedo}
            disabled={!canRedo()}
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={() => zoomOut()}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => fitView()}>
            <Maximize className="w-4 h-4" />
          </Button>
          
          <Button variant="outline" size="sm" onClick={() => zoomIn()}>
            <ZoomIn className="w-4 h-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>

          <Button variant="default" size="sm" className="bg-gradient-primary">
            <Play className="w-4 h-4 mr-1" />
            Run Workflow
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;