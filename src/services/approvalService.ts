
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
        const { data: defaultWorkflow } = await supabase
          .from('approval_workflows')
          .select('id')
          .eq('workflow_type', `${documentType}_approval`)
          .eq('is_default', true)
          .single();
        
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
          status: 'pending'
        })
        .select()
        .single();

      if (instanceError) throw instanceError;

      // Get workflow steps and create approval steps
      const { data: workflowSteps, error: stepsError } = await supabase
        .from('workflow_steps')
        .select('*')
        .eq('workflow_id', workflowId)
        .order('step_order');

      if (stepsError) throw stepsError;

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

      if (approvalStepsError) throw approvalStepsError;

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

      if (error) throw error;
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
          comments
        })
        .eq('id', stepId)
        .select('workflow_instance_id, step_number')
        .single();

      if (stepError) throw stepError;

      // Check if this was the last step in the workflow
      const { data: allSteps, error: allStepsError } = await supabase
        .from('approval_steps')
        .select('status')
        .eq('workflow_instance_id', step.workflow_instance_id);

      if (allStepsError) throw allStepsError;

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
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching workflows:', error);
      throw error;
    }
  }
};
