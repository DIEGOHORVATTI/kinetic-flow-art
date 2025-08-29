import { CustomNode } from '@/types';
import { NodeBusinessRules, NodeValidationResult, NodeExecutionResult } from './index';
import { toast } from 'sonner';

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const emailNodeRules: NodeBusinessRules = {
  validate: (node: CustomNode): NodeValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const { email, subject, body } = node.data;
    
    // Required field validation
    if (!email || !email.trim()) {
      errors.push('validation.required');
    } else if (!validateEmail(email)) {
      errors.push('validation.email');
    }
    
    if (!subject || !subject.trim()) {
      errors.push('editor.nodes.email.validation.subjectRequired');
    }
    
    // Optional warnings
    if (!body || !body.trim()) {
      warnings.push('Email body is empty');
    }
    
    if (subject && subject.length > 100) {
      warnings.push('Email subject is very long');
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
      const validation = emailNodeRules.validate(node);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
        };
      }
      
      const { email, subject, body } = node.data;
      
      // Show loading state
      toast.loading('editor.nodes.email.execution.sending', {
        id: `email-${node.id}`,
      });
      
      // Simulate email sending (in real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll simulate success
      const emailData = {
        to: email,
        subject: subject || 'No Subject',
        body: body || 'No content',
        timestamp: new Date().toISOString(),
        nodeId: node.id,
        inputData,
      };
      
      // Success notification
      toast.success('editor.nodes.email.execution.success', {
        id: `email-${node.id}`,
        description: `Email sent to ${email}`,
      });
      
      console.log('Email sent:', emailData);
      
      return {
        success: true,
        data: emailData,
        nextNodeIds: [], // Will be populated based on connections
      };
      
    } catch (error) {
      toast.error('editor.nodes.email.execution.error', {
        id: `email-${node.id}`,
        description: error instanceof Error ? error.message : 'Unknown error',
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },
  
  getRequiredFields: () => ['email', 'subject'],
  getOptionalFields: () => ['body', 'attachments', 'priority'],
};