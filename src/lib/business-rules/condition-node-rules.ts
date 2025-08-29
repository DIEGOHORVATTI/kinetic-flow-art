import { CustomNode } from '@/types';
import { NodeBusinessRules, NodeValidationResult, NodeExecutionResult } from './index';

const evaluateCondition = (condition: string, inputData: any): boolean => {
  try {
    // Simple condition evaluation - in a real app, you'd want a more secure parser
    // This is a basic implementation for demo purposes
    
    if (!condition || !condition.trim()) {
      return false;
    }
    
    // Replace common variables with actual values
    let evaluableCondition = condition
      .replace(/\binput\b/g, JSON.stringify(inputData))
      .replace(/\bvalue\b/g, inputData?.value || 0)
      .replace(/\bcount\b/g, inputData?.count || 0)
      .replace(/\btrue\b/gi, 'true')
      .replace(/\bfalse\b/gi, 'false');
    
    // Basic safety check - only allow simple comparisons
    const allowedPattern = /^[0-9\s+\-*/.()><=!&|"'a-zA-Z_$\[\]{},:]+$/;
    if (!allowedPattern.test(evaluableCondition)) {
      throw new Error('Invalid condition syntax');
    }
    
    // eslint-disable-next-line no-eval
    return Boolean(eval(evaluableCondition));
  } catch (error) {
    console.error('Condition evaluation error:', error);
    return false;
  }
};

export const conditionNodeRules: NodeBusinessRules = {
  validate: (node: CustomNode): NodeValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const { condition } = node.data;
    
    // Required field validation
    if (!condition || !condition.trim()) {
      errors.push('Condition logic is required');
    } else {
      // Basic syntax validation
      const allowedPattern = /^[0-9\s+\-*/.()><=!&|"'a-zA-Z_$\[\]{},:]+$/;
      if (!allowedPattern.test(condition)) {
        errors.push('Condition contains invalid characters');
      }
      
      // Check for potentially dangerous functions
      const dangerousPatterns = [
        /\beval\b/,
        /\bFunction\b/,
        /\bsetTimeout\b/,
        /\bsetInterval\b/,
        /\brequire\b/,
        /\bimport\b/,
        /\bprocess\b/,
        /\bglobal\b/,
        /\bwindow\b/,
        /\bdocument\b/,
      ];
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(condition)) {
          errors.push('Condition contains potentially unsafe code');
          break;
        }
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  },
  
  execute: async (node: CustomNode, inputData?: any): Promise<NodeExecutionResult> => {
    try {
      // Validate before execution
      const validation = conditionNodeRules.validate(node);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
        };
      }
      
      const { condition } = node.data;
      const result = evaluateCondition(condition, inputData);
      
      console.log(`Condition "${condition}" evaluated to:`, result, 'with input:', inputData);
      
      return {
        success: true,
        data: {
          condition,
          result,
          inputData,
          timestamp: new Date().toISOString(),
          nodeId: node.id,
        },
        nextNodeIds: [], // Will be determined by the true/false paths
      };
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Condition evaluation failed',
      };
    }
  },
  
  getRequiredFields: () => ['condition'],
  getOptionalFields: () => ['description'],
};