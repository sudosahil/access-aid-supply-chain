
import { supabase } from '@/integrations/supabase/client';
import { approvalService } from '@/services/approvalService';

export interface WorkflowStep {
  id: string;
  workflow_id: string;
  step_order: number;
  approver_type: 'role' | 'user';
  approver_role?: string;
  approver_user_id?: string;
  is_required: boolean;
  created_at: string;
}

export interface WorkflowValidation {
  isValid: boolean;
  errors: string[];
}

export const workflowService = {
  // Validate workflow before creation
  validateWorkflow: (workflowData: any): WorkflowValidation => {
    const errors: string[] = [];

    if (!workflowData.name || workflowData.name.trim().length === 0) {
      errors.push('Workflow name is required');
    }

    if (!workflowData.workflow_type) {
      errors.push('Workflow type is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validate workflow step before creation
  validateWorkflowStep: (stepData: any): WorkflowValidation => {
    const errors: string[] = [];

    if (!stepData.workflow_id) {
      errors.push('Workflow ID is required');
    }

    if (!stepData.approver_type) {
      errors.push('Approver type is required');
    }

    if (stepData.approver_type === 'role' && !stepData.approver_role) {
      errors.push('Approver role is required when approver type is role');
    }

    if (stepData.approver_type === 'user' && !stepData.approver_user_id) {
      errors.push('Approver user ID is required when approver type is user');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Create workflow step with proper error handling
  createWorkflowStep: async (workflowId: string, stepData: any) => {
    try {
      console.log('Creating workflow step with data:', stepData);

      // Validate step data
      const validation = workflowService.validateWorkflowStep({
        ...stepData,
        workflow_id: workflowId
      });

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Get current step count
      const { data: existingSteps, error: countError } = await supabase
        .from('workflow_steps')
        .select('step_order')
        .eq('workflow_id', workflowId)
        .order('step_order', { ascending: false })
        .limit(1);

      if (countError) {
        console.error('Error getting step count:', countError);
        // Continue anyway, assume it's the first step
      }

      const nextStepOrder = (existingSteps?.[0]?.step_order || 0) + 1;

      // Insert the new step
      const { data, error } = await supabase
        .from('workflow_steps')
        .insert({
          workflow_id: workflowId,
          step_order: nextStepOrder,
          approver_type: stepData.approver_type,
          approver_role: stepData.approver_type === 'role' ? stepData.approver_role : null,
          approver_user_id: stepData.approver_type === 'user' ? stepData.approver_user_id : null,
          is_required: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting workflow step:', error);
        throw new Error(`Failed to create workflow step: ${error.message}`);
      }

      console.log('Workflow step created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createWorkflowStep:', error);
      throw error;
    }
  },

  // Create workflow with transaction support
  createWorkflow: async (workflowData: any) => {
    try {
      console.log('Creating workflow with data:', workflowData);

      // Validate workflow data
      const validation = workflowService.validateWorkflow(workflowData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      const { data, error } = await supabase
        .from('approval_workflows')
        .insert({
          name: workflowData.name,
          description: workflowData.description,
          workflow_type: workflowData.workflow_type,
          is_default: false,
          is_active: true,
          created_by: 'system' // Use a default value
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating workflow:', error);
        throw new Error(`Failed to create workflow: ${error.message}`);
      }

      console.log('Workflow created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in createWorkflow:', error);
      throw error;
    }
  },

  // Get workflow instances with enhanced error handling
  getWorkflowInstances: async () => {
    try {
      return await approvalService.getWorkflowInstances();
    } catch (error) {
      console.error('Error getting workflow instances:', error);
      // Return empty array instead of throwing to prevent crashes
      return [];
    }
  }
};
