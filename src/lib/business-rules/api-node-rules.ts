import { CustomNode } from '@/types';
import { NodeBusinessRules, NodeValidationResult, NodeExecutionResult } from './index';
import { toast } from 'sonner';

const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateHttpMethod = (method: string): boolean => {
  const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  return validMethods.includes(method.toUpperCase());
};

export const apiNodeRules: NodeBusinessRules = {
  validate: (node: CustomNode): NodeValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const { url, method, headers, body } = node.data;
    
    // Required field validation
    if (!url || !url.trim()) {
      errors.push('editor.nodes.api.validation.urlRequired');
    } else if (!validateUrl(url)) {
      errors.push('editor.nodes.api.validation.invalidUrl');
    }
    
    if (!method || !method.trim()) {
      errors.push('HTTP method is required');
    } else if (!validateHttpMethod(method)) {
      errors.push('Invalid HTTP method');
    }
    
    // Optional warnings
    if (headers) {
      try {
        JSON.parse(headers);
      } catch {
        errors.push('Headers must be valid JSON');
      }
    }
    
    if (body && ['GET', 'HEAD'].includes(method?.toUpperCase())) {
      warnings.push('GET and HEAD requests typically do not have a body');
    }
    
    if (body) {
      try {
        JSON.parse(body);
      } catch {
        warnings.push('Request body should be valid JSON');
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
      const validation = apiNodeRules.validate(node);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(', '),
        };
      }
      
      const { url, method = 'GET', headers, body } = node.data;
      
      // Show loading state
      toast.loading(`Making ${method} request...`, {
        id: `api-${node.id}`,
      });
      
      const requestOptions: RequestInit = {
        method: method.toUpperCase(),
      };
      
      // Add headers if provided
      if (headers) {
        try {
          requestOptions.headers = JSON.parse(headers);
        } catch {
          // Invalid JSON headers, ignore
        }
      }
      
      // Add body if provided and method supports it
      if (body && !['GET', 'HEAD'].includes(method.toUpperCase())) {
        requestOptions.body = body;
      }
      
      const response = await fetch(url, requestOptions);
      const responseData = await response.text();
      
      let parsedData;
      try {
        parsedData = JSON.parse(responseData);
      } catch {
        parsedData = responseData;
      }
      
      const result = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: parsedData,
        url,
        method,
        timestamp: new Date().toISOString(),
        nodeId: node.id,
        inputData,
      };
      
      if (response.ok) {
        toast.success(`${method} request successful`, {
          id: `api-${node.id}`,
          description: `Status: ${response.status}`,
        });
        
        return {
          success: true,
          data: result,
          nextNodeIds: [],
        };
      } else {
        toast.error(`${method} request failed`, {
          id: `api-${node.id}`,
          description: `Status: ${response.status} ${response.statusText}`,
        });
        
        return {
          success: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
          data: result,
        };
      }
      
    } catch (error) {
      toast.error('API request failed', {
        id: `api-${node.id}`,
        description: error instanceof Error ? error.message : 'Network error',
      });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  },
  
  getRequiredFields: () => ['url', 'method'],
  getOptionalFields: () => ['headers', 'body', 'timeout'],
};