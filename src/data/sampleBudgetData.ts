
export const sampleBudgets = [
  {
    id: 'budget-001',
    title: 'Q1 2024 Medical Equipment Procurement',
    amount: 5000000,
    source: 'government_grant' as const,
    purpose: 'Purchase of wheelchairs, prosthetic limbs, and hearing aids for Q1 distribution',
    assigned_to: 'user-2',
    approved_by: 'user-1',
    status: 'approved' as const,
    notes: 'Approved for immediate procurement. Priority on electric wheelchairs and upper limb prosthetics.',
    created_by: 'user-1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    attachments: [
      { name: 'procurement_plan.pdf', url: '/docs/procurement_plan.pdf' },
      { name: 'vendor_quotes.xlsx', url: '/docs/vendor_quotes.xlsx' }
    ]
  },
  {
    id: 'budget-002',
    title: 'Emergency Medical Supplies Fund',
    amount: 2500000,
    source: 'emergency_fund' as const,
    purpose: 'Emergency procurement of prosthetic limbs and critical medical equipment',
    assigned_to: 'user-3',
    approved_by: null,
    status: 'pending_approval' as const,
    notes: 'Urgent requirement for Chennai and Bangalore regions. Awaiting director approval.',
    created_by: 'user-2',
    created_at: '2024-01-20T09:15:00Z',
    updated_at: '2024-01-22T11:45:00Z',
    attachments: []
  },
  {
    id: 'budget-003',
    title: 'Warehouse Infrastructure Upgrade',
    amount: 3000000,
    source: 'internal_allocation' as const,
    purpose: 'Upgrade warehouse storage systems and implement RFID tracking',
    assigned_to: 'user-4',
    approved_by: 'user-1',
    status: 'active' as const,
    notes: 'Phase 1 of warehouse modernization project. Focus on Delhi and Mumbai warehouses.',
    created_by: 'user-1',
    created_at: '2024-01-10T08:30:00Z',
    updated_at: '2024-01-25T16:20:00Z',
    attachments: [
      { name: 'infrastructure_plan.pdf', url: '/docs/infrastructure_plan.pdf' }
    ]
  },
  {
    id: 'budget-004',
    title: 'Training and Capacity Building',
    amount: 1200000,
    source: 'donor_funding' as const,
    purpose: 'Staff training programs and capacity building initiatives',
    assigned_to: 'user-5',
    approved_by: null,
    status: 'draft' as const,
    notes: 'Draft budget for annual training programs. Includes technical and soft skills training.',
    created_by: 'user-2',
    created_at: '2024-01-22T14:00:00Z',
    updated_at: '2024-01-22T14:00:00Z',
    attachments: []
  },
  {
    id: 'budget-005',
    title: 'Research and Development Initiative',
    amount: 4500000,
    source: 'project_specific' as const,
    purpose: 'R&D for next-generation assistive devices and technology integration',
    assigned_to: 'user-6',
    approved_by: 'user-1',
    status: 'completed' as const,
    notes: 'Successfully completed R&D phase. Results implemented in new product line.',
    created_by: 'user-1',
    created_at: '2023-10-01T10:00:00Z',
    updated_at: '2024-01-15T17:30:00Z',
    attachments: [
      { name: 'research_report.pdf', url: '/docs/research_report.pdf' },
      { name: 'patent_applications.pdf', url: '/docs/patent_applications.pdf' }
    ]
  },
  {
    id: 'budget-006',
    title: 'Digital Transformation Project',
    amount: 6000000,
    source: 'government_grant' as const,
    purpose: 'Implementation of digital systems and cloud infrastructure',
    assigned_to: 'user-3',
    approved_by: null,
    status: 'cancelled' as const,
    notes: 'Project cancelled due to vendor compliance issues. Funds reallocated to other initiatives.',
    created_by: 'user-2',
    created_at: '2024-01-05T12:00:00Z',
    updated_at: '2024-01-18T09:45:00Z',
    attachments: []
  },
  {
    id: 'budget-007',
    title: 'Community Outreach Program',
    amount: 1800000,
    source: 'donor_funding' as const,
    purpose: 'Community awareness and outreach programs in rural areas',
    assigned_to: 'user-4',
    approved_by: 'user-1',
    status: 'active' as const,
    notes: 'Ongoing program with excellent community response. Expanding to 5 new districts.',
    created_by: 'user-3',
    created_at: '2024-01-08T11:30:00Z',
    updated_at: '2024-01-20T13:15:00Z',
    attachments: [
      { name: 'outreach_plan.pdf', url: '/docs/outreach_plan.pdf' }
    ]
  },
  {
    id: 'budget-008',
    title: 'Quality Assurance Initiative',
    amount: 800000,
    source: 'internal_allocation' as const,
    purpose: 'Implementation of quality control measures and certification processes',
    assigned_to: 'user-5',
    approved_by: null,
    status: 'pending_approval' as const,
    notes: 'Awaiting budget committee review. Critical for maintaining service standards.',
    created_by: 'user-4',
    created_at: '2024-01-19T15:45:00Z',
    updated_at: '2024-01-21T10:30:00Z',
    attachments: []
  }
];

export const sampleBudgetApprovals = [
  {
    id: 'approval-001',
    budget_id: 'budget-001',
    approver_id: 'user-1',
    approved_at: '2024-01-20T14:30:00Z',
    comments: 'Approved with minor adjustments to procurement timeline. Priority on electric wheelchairs.',
    status: 'approved' as const,
    created_at: '2024-01-20T14:30:00Z'
  },
  {
    id: 'approval-002',
    budget_id: 'budget-003',
    approver_id: 'user-1',
    approved_at: '2024-01-25T16:20:00Z',
    comments: 'Approved for Phase 1 implementation. Monitor progress closely.',
    status: 'approved' as const,
    created_at: '2024-01-25T16:20:00Z'
  },
  {
    id: 'approval-003',
    budget_id: 'budget-002',
    approver_id: null,
    approved_at: null,
    comments: 'Under review. Need additional justification for emergency classification.',
    status: 'pending' as const,
    created_at: '2024-01-22T11:45:00Z'
  }
];
