import { NodeType, CustomNode } from '@/types';
import { emailNodeRules } from './email-node-rules';
import { apiNodeRules } from './api-node-rules';
import { conditionNodeRules } from './condition-node-rules';

export interface NodeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface NodeExecutionResult {
  success: boolean;
  data?: any;
  error?: string;
  nextNodeIds?: string[];
}

export interface NodeBusinessRules {
  validate: (node: CustomNode) => NodeValidationResult;
  execute: (node: CustomNode, inputData?: any) => Promise<NodeExecutionResult>;
  getRequiredFields: () => string[];
  getOptionalFields: () => string[];
}

const businessRulesRegistry: Record<NodeType, NodeBusinessRules> = {
  input: {
    validate: (node: CustomNode) => ({ isValid: true, errors: [], warnings: [] }),
    execute: async (node: CustomNode) => ({ success: true, nextNodeIds: [] }),
    getRequiredFields: () => ['label'],
    getOptionalFields: () => ['description'],
  },
  output: {
    validate: (node: CustomNode) => ({ isValid: true, errors: [], warnings: [] }),
    execute: async (node: CustomNode, inputData?: any) => ({ 
      success: true, 
      data: inputData,
      nextNodeIds: [] 
    }),
    getRequiredFields: () => ['label'],
    getOptionalFields: () => ['description'],
  },
  process: {
    validate: (node: CustomNode) => ({ isValid: true, errors: [], warnings: [] }),
    execute: async (node: CustomNode, inputData?: any) => ({ 
      success: true, 
      data: inputData,
      nextNodeIds: [] 
    }),
    getRequiredFields: () => ['label'],
    getOptionalFields: () => ['description'],
  },
  condition: conditionNodeRules,
  email: emailNodeRules,
  api: apiNodeRules,
  delay: {
    validate: (node: CustomNode) => ({ isValid: true, errors: [], warnings: [] }),
    execute: async (node: CustomNode, inputData?: any) => ({ 
      success: true, 
      data: inputData,
      nextNodeIds: [] 
    }),
    getRequiredFields: () => ['label', 'duration'],
    getOptionalFields: () => ['description'],
  },
};

export const getNodeBusinessRules = (nodeType: NodeType): NodeBusinessRules => {
  return businessRulesRegistry[nodeType];
};

export const validateNode = (node: CustomNode): NodeValidationResult => {
  const rules = getNodeBusinessRules(node.type);
  return rules.validate(node);
};

export const executeNode = async (node: CustomNode, inputData?: any): Promise<NodeExecutionResult> => {
  const rules = getNodeBusinessRules(node.type);
  return rules.execute(node, inputData);
};

export const getNodeRequiredFields = (nodeType: NodeType): string[] => {
  const rules = getNodeBusinessRules(nodeType);
  return rules.getRequiredFields();
};

export const getNodeOptionalFields = (nodeType: NodeType): string[] => {
  const rules = getNodeBusinessRules(nodeType);
  return rules.getOptionalFields();
};