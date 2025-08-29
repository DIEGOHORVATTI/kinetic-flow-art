import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Play, 
  Cpu, 
  GitBranch, 
  Flag, 
  Mail, 
  Clock, 
  Webhook 
} from 'lucide-react';

interface NodePaletteItem {
  type: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}

const nodeItems: NodePaletteItem[] = [
  {
    type: 'input',
    label: 'Input',
    description: 'Start your workflow',
    icon: Play,
    category: 'Basic'
  },
  {
    type: 'process',
    label: 'Process',
    description: 'Transform data',
    icon: Cpu,
    category: 'Basic'
  },
  {
    type: 'condition',
    label: 'Condition',
    description: 'Branch your flow',
    icon: GitBranch,
    category: 'Basic'
  },
  {
    type: 'output',
    label: 'Output',
    description: 'End point',
    icon: Flag,
    category: 'Basic'
  },
  {
    type: 'email',
    label: 'Email',
    description: 'Send emails',
    icon: Mail,
    category: 'Actions'
  },
  {
    type: 'delay',
    label: 'Delay',
    description: 'Wait for time',
    icon: Clock,
    category: 'Actions'
  },
  {
    type: 'api',
    label: 'API Call',
    description: 'HTTP requests',
    icon: Webhook,
    category: 'Actions'
  }
];

const NodePaletteItem = ({ item }: { item: NodePaletteItem }) => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const IconComponent = item.icon;

  return (
    <div
      className="cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={(e) => onDragStart(e, item.type)}
    >
      <Card className="p-3 hover:bg-muted/50 transition-colors border-dashed border-2 hover:border-primary/50">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-primary/10">
            <IconComponent className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium text-sm">{item.label}</span>
        </div>
        <p className="text-xs text-muted-foreground">{item.description}</p>
      </Card>
    </div>
  );
};

const NodePalette = () => {
  const categories = [...new Set(nodeItems.map(item => item.category))];

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-sidebar-foreground mb-1">Node Palette</h2>
        <p className="text-sm text-sidebar-foreground/70">Drag nodes to the canvas</p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-medium text-sidebar-foreground">{category}</h3>
              <Separator className="flex-1" />
            </div>
            
            <div className="space-y-2">
              {nodeItems
                .filter(item => item.category === category)
                .map((item) => (
                  <NodePaletteItem key={item.type} item={item} />
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gradient-subtle rounded-lg border">
        <h4 className="font-medium text-sm mb-2">Quick Start</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Drag nodes to the canvas</li>
          <li>• Connect nodes by dragging handles</li>
          <li>• Click nodes to edit properties</li>
          <li>• Use keyboard shortcuts</li>
        </ul>
      </div>
    </div>
  );
};

export default NodePalette;