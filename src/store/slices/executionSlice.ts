import { StateCreator } from 'zustand';
import { CustomNode } from '@/types';
import { executeNode, validateNode } from '@/lib/business-rules';
import { toast } from 'sonner';

export interface ExecutionSlice {
  executingNodes: Set<string>;
  nodeValidations: Record<string, { isValid: boolean; errors: string[]; warnings: string[] }>;
  
  // Actions
  executeNodeById: (nodeId: string) => Promise<void>;
  validateNodeById: (nodeId: string) => void;
  clearNodeValidation: (nodeId: string) => void;
  setNodeExecuting: (nodeId: string, executing: boolean) => void;
}

export const createExecutionSlice: StateCreator<
  any,
  [],
  [],
  ExecutionSlice
> = (set, get) => ({
  executingNodes: new Set<string>(),
  nodeValidations: {},
  
  executeNodeById: async (nodeId: string) => {
    const state = get();
    const node = state.nodes.find((n: CustomNode) => n.id === nodeId);
    
    if (!node) {
      toast.error('Node not found');
      return;
    }
    
    // Set executing state
    set((state: any) => ({
      executingNodes: new Set([...state.executingNodes, nodeId])
    }));
    
    try {
      // Validate first
      const validation = validateNode(node);
      if (!validation.isValid) {
        toast.error('Node validation failed', {
          description: validation.errors.join(', ')
        });
        return;
      }
      
      // Execute the node
      const result = await executeNode(node);
      
      if (result.success) {
        console.log(`Node ${nodeId} executed successfully:`, result);
        
        // Update node data with execution result
        state.updateNodeData(nodeId, {
          ...node.data,
          lastExecuted: new Date().toISOString(),
          lastExecutionResult: result,
        });
      } else {
        console.error(`Node ${nodeId} execution failed:`, result.error);
      }
      
    } catch (error) {
      console.error('Node execution error:', error);
      toast.error('Execution failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      // Remove from executing state
      set((state: any) => {
        const newExecutingNodes = new Set(state.executingNodes);
        newExecutingNodes.delete(nodeId);
        return { executingNodes: newExecutingNodes };
      });
    }
  },
  
  validateNodeById: (nodeId: string) => {
    const state = get();
    const node = state.nodes.find((n: CustomNode) => n.id === nodeId);
    
    if (!node) return;
    
    const validation = validateNode(node);
    
    set((state: any) => ({
      nodeValidations: {
        ...state.nodeValidations,
        [nodeId]: validation,
      },
    }));
  },
  
  clearNodeValidation: (nodeId: string) => {
    set((state: any) => {
      const { [nodeId]: removed, ...rest } = state.nodeValidations;
      return { nodeValidations: rest };
    });
  },
  
  setNodeExecuting: (nodeId: string, executing: boolean) => {
    set((state: any) => {
      const newExecutingNodes = new Set(state.executingNodes);
      if (executing) {
        newExecutingNodes.add(nodeId);
      } else {
        newExecutingNodes.delete(nodeId);
      }
      return { executingNodes: newExecutingNodes };
    });
  },
});