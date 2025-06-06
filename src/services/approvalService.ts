
import { supabase } from "@/integrations/supabase/client";

export interface WorkflowInstance {
  id: string;
  workflow_id: string;
  document_type: 'rfq' | 'bid' | 'budget';
  document_id: string;
  current_step: number;
  status: 'pending' | 'approved' | 'rejected';
  created_by: string;
  created_at: string;
  completed_at?: string;
  workflow?: {
    name: string;
    workflow_type: string;
  };
  approval_steps?: ApprovalStep[];
}

export interface ApprovalStep {
  id: string;
  workflow_instance_id: string;
  step_number: number;
  approver_role?: string;
  approver_user_id?: string;
  approver_name?: string;
  approver_email?: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_at?: string;
  comments?: string;
  created_at: string;
}

export const approvalService = {
  // Create a new workflow instance when RFQ/Bid is created
  async createWorkflowInstance(documentType: 'rfq' | 'bid' | 'budget', documentId: string, customWorkflowId?: string) {
    try {
      // Get default workflow if no custom workflow specified
      let workflowId = customWorkflowId;
      if (!workflowId) {
        const { data: defaultWorkflow, error } = await supabase
          .from('approval_workflows')
          .select('id')
          .eq('workflow_type', `${documentType}_approval`)
          .eq('is_default', true)
          .maybeSingle();
        
        if (error) {
          console.error('Error finding default workflow:', error);
          throw new Error(`No default workflow found for ${documentType}: ${error.message}`);
        }
        
        workflowId = defaultWorkflow?.id;
      }

      if (!workflowId) {
        throw new Error(`No default workflow found for ${documentType}`);
      }

      // Create workflow instance
      const { data: instance, error: instanceError } = await supabase
        .from('workflow_instances')
        .insert({
          workflow_id: workflowId,
          document_type: documentType,
          document_id: documentId,
          current_step: 1,
          status: 'pending',
          created_by: 'system' // Use a default value since auth might not be available
        })
        .select()
        .single();

      if (instanceError) {
        console.error('Error creating workflow instance:', instanceError);
        throw new Error(`Failed to create workflow instance: ${instanceError.message}`);
      }

      // Get workflow steps and create approval steps
      const { data: workflowSteps, error: stepsError } = await supabase
        .from('workflow_steps')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('step_order');

      if (stepsError) {
        console.error('Error getting workflow steps:', stepsError);
        throw new Error(`Failed to get workflow steps: ${stepsError.message}`);
      }

      if (!workflowSteps || workflowSteps.length === 0) {
        console.warn('No workflow steps found for workflow:', workflowId);
        return instance;
      }

      // Create approval steps for each workflow step
      const approvalSteps = workflowSteps.map((step) => ({
        workflow_instance_id: instance.id,
        step_number: step.step_order,
        approver_role: step.approver_role,
        approver_user_id: step.approver_user_id,
        status: 'pending' as const
      }));

      const { error: approvalStepsError } = await supabase
        .from('approval_steps')
        .insert(approvalSteps);

      if (approvalStepsError) {
        console.error('Error creating approval steps:', approvalStepsError);
        // Don't throw here as the workflow instance was created successfully
        console.warn('Workflow instance created but approval steps failed:', approvalStepsError.message);
      }

      return instance;
    } catch (error) {
      console.error('Error creating workflow instance:', error);
      throw error;
    }
  },

  // Get all workflow instances with their steps
  async getWorkflowInstances() {
    try {
      const { data, error } = await supabase
        .from('workflow_instances')
        .select(`
          *,
          workflow:approval_workflows(name, workflow_type),
          approval_steps(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching workflow instances:', error);
        throw new Error(`Failed to fetch workflow instances: ${error.message}`);
      }
      
      return data as WorkflowInstance[];
    } catch (error) {
      console.error('Error fetching workflow instances:', error);
      throw error;
    }
  },

  // Approve or reject a specific step
  async updateApprovalStep(stepId: string, status: 'approved' | 'rejected', comments?: string) {
    try {
      const { data: step, error: stepError } = await supabase
        .from('approval_steps')
        .update({
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
          comments,
          approver_name: 'System User' // Default approver name
        })
        .eq('id', stepId)
        .select('workflow_instance_id, step_number')
        .single();

      if (stepError) {
        console.error('Error updating approval step:', stepError);
        throw new Error(`Failed to update approval step: ${stepError.message}`);
      }

      // Check if this was the last step in the workflow
      const { data: allSteps, error: allStepsError } = await supabase
        .from('approval_steps')
        .select('status')
        .eq('workflow_instance_id', step.workflow_instance_id);

      if (allStepsError) {
        console.error('Error getting all steps:', allStepsError);
        throw new Error(`Failed to get workflow steps: ${allStepsError.message}`);
      }

      // Update workflow instance status if all steps are complete
      const allApproved = allSteps.every(s => s.status === 'approved');
      const anyRejected = allSteps.some(s => s.status === 'rejected');

      if (allApproved || anyRejected) {
        await supabase
          .from('workflow_instances')
          .update({
            status: allApproved ? 'approved' : 'rejected',
            completed_at: new Date().toISOString()
          })
          .eq('id', step.workflow_instance_id);
      } else {
        // Update current step
        const nextStep = Math.max(...allSteps.map((_, index) => index + 1).filter(stepNum => 
          allSteps[stepNum - 1]?.status === 'approved'
        )) + 1;
        
        await supabase
          .from('workflow_instances')
          .update({ current_step: nextStep })
          .eq('id', step.workflow_instance_id);
      }

      return step;
    } catch (error) {
      console.error('Error updating approval step:', error);
      throw error;
    }
  },

  // Get workflows for dropdown selection
  async getWorkflows(workflowType?: string) {
    try {
      let query = supabase
        .from('approval_workflows')
        .select('*')
        .eq('is_active', true);

      if (workflowType) {
        query = query.eq('workflow_type', workflowType);
      }

      const { data, error } = await query.order('name');
      if (error) {
        console.error('Error fetching workflows:', error);
        throw new Error(`Failed to fetch workflows: ${error.message}`);
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  }
};
