
export interface ApprovalStep {
  id: string;
  step_number: number;
  approver_role: string;
  approver_name: string;
  approver_email: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_at: string | null;
  comments: string | null;
}

export interface ApprovalWorkflow {
  id: string;
  budget_id: string;
  workflow_name: string;
  current_step: number;
  status: 'pending' | 'approved' | 'rejected';
  budget: {
    title: string;
    amount: number;
  };
  steps: ApprovalStep[];
}

export interface WorkflowStep {
  id: string;
  workflow_id: string;
  step_order: number;
  approver_type: 'role' | 'user';
  approver_role?: string;
  approver_user_id?: string;
  created_at: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  workflow_type: string;
  is_active: boolean;
  created_at: string;
  steps?: WorkflowStep[];
}

// Shared approval workflows data for consistency across tabs
export const sharedApprovalWorkflows: ApprovalWorkflow[] = [
  {
    id: 'workflow-1',
    budget_id: 'budget-1',
    workflow_name: '3-Tier Approval Process',
    current_step: 1,
    status: 'pending',
    budget: {
      title: 'Q3 Marketing Campaign',
      amount: 45000
    },
    steps: [
      {
        id: 'step-1',
        step_number: 1,
        approver_role: 'manager',
        approver_name: 'Priya Rao',
        approver_email: 'priya@company.com',
        status: 'pending',
        approved_at: null,
        comments: null
      },
      {
        id: 'step-2',
        step_number: 2,
        approver_role: 'finance_lead',
        approver_name: 'Jordan Smith',
        approver_email: 'jordan@company.com',
        status: 'pending',
        approved_at: null,
        comments: null
      },
      {
        id: 'step-3',
        step_number: 3,
        approver_role: 'admin',
        approver_name: 'Alex Chen',
        approver_email: 'alex@company.com',
        status: 'pending',
        approved_at: null,
        comments: null
      }
    ]
  },
  {
    id: 'workflow-2',
    budget_id: 'budget-2',
    workflow_name: 'IT Equipment Approval',
    current_step: 2,
    status: 'pending',
    budget: {
      title: 'IT Equipment Purchase',
      amount: 25000
    },
    steps: [
      {
        id: 'step-4',
        step_number: 1,
        approver_role: 'manager',
        approver_name: 'Priya Rao',
        approver_email: 'priya@company.com',
        status: 'approved',
        approved_at: new Date().toISOString(),
        comments: 'Approved for IT infrastructure upgrade'
      },
      {
        id: 'step-5',
        step_number: 2,
        approver_role: 'finance_lead',
        approver_name: 'Jordan Smith',
        approver_email: 'jordan@company.com',
        status: 'pending',
        approved_at: null,
        comments: null
      },
      {
        id: 'step-6',
        step_number: 3,
        approver_role: 'admin',
        approver_name: 'Alex Chen',
        approver_email: 'alex@company.com',
        status: 'pending',
        approved_at: null,
        comments: null
      }
    ]
  }
];

// Shared workflow templates for consistency
export const sharedWorkflowTemplates: Workflow[] = [
  {
    id: '1',
    name: 'Standard Budget Approval',
    description: 'Default workflow for budget approvals',
    workflow_type: 'budget_approval',
    is_active: true,
    created_at: new Date().toISOString(),
    steps: [
      {
        id: '1',
        workflow_id: '1',
        step_order: 1,
        approver_type: 'role',
        approver_role: 'manager',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        workflow_id: '1',
        step_order: 2,
        approver_type: 'role',
        approver_role: 'finance_lead',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        workflow_id: '1',
        step_order: 3,
        approver_type: 'role',
        approver_role: 'admin',
        created_at: new Date().toISOString()
      }
    ]
  },
  {
    id: '2',
    name: 'RFQ Review Process',
    description: 'Workflow for RFQ approvals and reviews',
    workflow_type: 'rfq_approval',
    is_active: true,
    created_at: new Date().toISOString(),
    steps: [
      {
        id: '3',
        workflow_id: '2',
        step_order: 1,
        approver_type: 'role',
        approver_role: 'manager',
        created_at: new Date().toISOString()
      }
    ]
  }
];

// Shared contracts, RFQs, and bids data for real-time testing
export const sharedContractsData = [
  {
    id: 'contract-1',
    title: 'IT Equipment Supply Contract',
    contractor: 'TechBuild Solutions',
    value: 25000,
    status: 'active',
    start_date: '2024-01-15',
    end_date: '2024-12-15'
  },
  {
    id: 'contract-2',
    title: 'Marketing Services Agreement',
    contractor: 'Creative Agency Ltd',
    value: 45000,
    status: 'pending_approval',
    start_date: '2024-02-01',
    end_date: '2024-07-31'
  }
];

export const sharedRFQsData = [
  {
    id: 'rfq-2024-001',
    title: 'IT Equipment Procurement',
    description: 'Procurement of laptops, servers, and networking equipment',
    budget: 25000,
    deadline: '2024-07-15',
    status: 'active',
    category: 'IT Equipment'
  },
  {
    id: 'rfq-2024-002',
    title: 'Marketing Campaign Services',
    description: 'Digital marketing campaign for Q3',
    budget: 45000,
    deadline: '2024-08-01',
    status: 'pending_approval',
    category: 'Marketing Services'
  }
];

export const sharedBidsData = [
  {
    id: 'bid-1',
    rfq_id: 'rfq-2024-001',
    contractor_name: 'TechBuild Solutions',
    amount: 24500,
    status: 'submitted',
    submitted_date: '2024-06-01'
  },
  {
    id: 'bid-2',
    rfq_id: 'rfq-2024-001',
    contractor_name: 'Digital Corp',
    amount: 26000,
    status: 'under_review',
    submitted_date: '2024-06-02'
  },
  {
    id: 'bid-3',
    rfq_id: 'rfq-2024-002',
    contractor_name: 'Creative Agency Ltd',
    amount: 44000,
    status: 'submitted',
    submitted_date: '2024-06-03'
  }
];
