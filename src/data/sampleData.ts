
export const sampleBudgets = [
  {
    id: '1',
    title: 'Q1 Equipment Procurement',
    amount: 5000000,
    source: 'government_grant' as const,
    purpose: 'Purchase of wheelchairs and mobility aids for Q1 distribution',
    assigned_to: 'user-2',
    status: 'approved' as const,
    notes: 'Approved for immediate procurement. Priority on electric wheelchairs.',
    created_by: 'user-1',
    created_at: '2024-01-15',
    updated_at: '2024-01-20'
  },
  {
    id: '2',
    title: 'Emergency Medical Supplies',
    amount: 2500000,
    source: 'emergency_fund' as const,
    purpose: 'Emergency procurement of prosthetic limbs and medical equipment',
    assigned_to: 'user-3',
    status: 'pending_approval' as const,
    notes: 'Urgent requirement for Chennai region',
    created_by: 'user-2',
    created_at: '2024-01-20',
    updated_at: '2024-01-22'
  },
  {
    id: '3',
    title: 'Warehouse Infrastructure',
    amount: 3000000,
    source: 'internal_allocation' as const,
    purpose: 'Upgrade warehouse storage and tracking systems',
    assigned_to: 'user-4',
    status: 'active' as const,
    notes: 'Phase 1 of warehouse modernization project',
    created_by: 'user-1',
    created_at: '2024-01-10',
    updated_at: '2024-01-25'
  }
];

export const sampleAuditLogs = [
  {
    id: '1',
    action: 'CREATE_RFQ',
    entity: 'RFQ',
    entity_id: 'rfq-001',
    user_id: 'user-2',
    user_name: 'Sarah Wilson',
    details: 'Created RFQ for Electric Wheelchairs procurement',
    timestamp: '2024-01-25T10:30:00Z',
    ip_address: '192.168.1.100'
  },
  {
    id: '2',
    action: 'APPROVE_BUDGET',
    entity: 'BUDGET',
    entity_id: '1',
    user_id: 'user-1',
    user_name: 'Admin User',
    details: 'Approved budget for Q1 Equipment Procurement (₹50,00,000)',
    timestamp: '2024-01-24T14:15:00Z',
    ip_address: '192.168.1.101'
  },
  {
    id: '3',
    action: 'UPDATE_INVENTORY',
    entity: 'INVENTORY',
    entity_id: 'inv-123',
    user_id: 'user-4',
    user_name: 'Warehouse Manager',
    details: 'Updated stock levels for Prosthetic Limbs (Added 25 units)',
    timestamp: '2024-01-24T09:45:00Z',
    ip_address: '192.168.1.102'
  },
  {
    id: '4',
    action: 'SUBMIT_BID',
    entity: 'BID',
    entity_id: 'bid-456',
    user_id: 'contractor-1',
    user_name: 'MediTech Solutions',
    details: 'Submitted bid for Electric Wheelchairs RFQ (₹4,50,000)',
    timestamp: '2024-01-23T16:20:00Z',
    ip_address: '192.168.1.103'
  },
  {
    id: '5',
    action: 'CREATE_USER',
    entity: 'USER',
    entity_id: 'user-5',
    user_id: 'user-1',
    user_name: 'Admin User',
    details: 'Created new staff user account for Regional Office',
    timestamp: '2024-01-22T11:00:00Z',
    ip_address: '192.168.1.101'
  }
];

export const sampleReports = [
  {
    id: '1',
    title: 'Monthly Procurement Summary',
    type: 'procurement',
    period: 'January 2024',
    generated_by: 'user-1',
    generated_at: '2024-02-01T09:00:00Z',
    status: 'completed',
    file_url: '/reports/jan-2024-procurement.pdf',
    summary: {
      total_rfqs: 15,
      total_bids: 42,
      awarded_contracts: 12,
      total_value: 15000000
    }
  },
  {
    id: '2',
    title: 'Inventory Status Report',
    type: 'inventory',
    period: 'Q4 2023',
    generated_by: 'user-2',
    generated_at: '2024-01-31T15:30:00Z',
    status: 'completed',
    file_url: '/reports/q4-2023-inventory.pdf',
    summary: {
      total_items: 1250,
      low_stock_items: 8,
      value_in_stock: 8500000,
      distributions: 320
    }
  },
  {
    id: '3',
    title: 'Supplier Performance Analysis',
    type: 'suppliers',
    period: '2023 Annual',
    generated_by: 'user-1',
    generated_at: '2024-01-15T12:00:00Z',
    status: 'completed',
    file_url: '/reports/2023-supplier-performance.pdf',
    summary: {
      total_suppliers: 25,
      top_performers: 8,
      average_delivery_time: '12 days',
      quality_rating: '4.2/5'
    }
  }
];

export const sampleMessages = [
  {
    id: '1',
    sender_id: 'user-2',
    sender_name: 'Sarah Wilson',
    recipient_id: 'contractor-1',
    recipient_name: 'MediTech Solutions',
    content: 'Please provide additional specifications for the electric wheelchairs in your bid.',
    message_type: 'rfq_inquiry',
    rfq_id: 'rfq-001',
    created_at: '2024-01-25T14:30:00Z',
    is_read: false
  },
  {
    id: '2',
    sender_id: 'contractor-1',
    sender_name: 'MediTech Solutions',
    recipient_id: 'user-2',
    recipient_name: 'Sarah Wilson',
    content: 'Thank you for the inquiry. We will provide detailed specifications including battery life, weight capacity, and warranty terms by tomorrow.',
    message_type: 'rfq_response',
    rfq_id: 'rfq-001',
    created_at: '2024-01-25T15:45:00Z',
    is_read: true
  },
  {
    id: '3',
    sender_id: 'user-4',
    sender_name: 'Warehouse Manager',
    recipient_id: 'user-2',
    recipient_name: 'Sarah Wilson',
    content: 'Stock levels for prosthetic limbs are running low. Current inventory: 15 units. Recommend immediate procurement.',
    message_type: 'inventory_alert',
    created_at: '2024-01-24T10:15:00Z',
    is_read: true
  },
  {
    id: '4',
    sender_id: 'user-1',
    sender_name: 'Admin User',
    recipient_id: 'user-2',
    recipient_name: 'Sarah Wilson',
    content: 'Budget for Q1 Equipment Procurement has been approved. You can proceed with the RFQ process.',
    message_type: 'budget_approval',
    created_at: '2024-01-20T16:00:00Z',
    is_read: true
  }
];

export const sampleTransferRequests = [
  {
    id: 'tr-001',
    item_id: 'inv-123',
    item_name: 'Electric Wheelchairs',
    quantity: 10,
    from_warehouse: 'Central Warehouse - Chennai',
    to_warehouse: 'Regional Hub - Bangalore',
    requested_by: 'user-4',
    request_date: '2024-01-25',
    status: 'pending',
    priority: 'high',
    created_at: '2024-01-25T09:00:00Z',
    updated_at: '2024-01-25T09:00:00Z'
  },
  {
    id: 'tr-002',
    item_id: 'inv-456',
    item_name: 'Prosthetic Limbs',
    quantity: 5,
    from_warehouse: 'Regional Hub - Delhi',
    to_warehouse: 'District Center - Gurgaon',
    requested_by: 'user-5',
    request_date: '2024-01-24',
    status: 'approved',
    priority: 'medium',
    created_at: '2024-01-24T14:30:00Z',
    updated_at: '2024-01-25T08:15:00Z'
  },
  {
    id: 'tr-003',
    item_id: 'inv-789',
    item_name: 'Hearing Aids',
    quantity: 20,
    from_warehouse: 'Central Warehouse - Mumbai',
    to_warehouse: 'Regional Hub - Pune',
    requested_by: 'user-6',
    request_date: '2024-01-23',
    status: 'completed',
    priority: 'low',
    created_at: '2024-01-23T11:20:00Z',
    updated_at: '2024-01-24T16:45:00Z'
  }
];

export const sampleContracts = [
  {
    id: 'contract-001',
    title: 'Electric Wheelchairs Supply Contract',
    contractor_name: 'MediTech Solutions',
    rfq_id: 'rfq-001',
    bid_id: 'bid-456',
    amount: 4500000,
    start_date: '2024-02-01',
    end_date: '2024-05-31',
    status: 'active',
    deliverables: [
      '50 Electric Wheelchairs with 2-year warranty',
      'Training for maintenance staff',
      'User manuals in regional languages'
    ],
    milestones: [
      { description: 'First batch delivery (20 units)', due_date: '2024-02-15', status: 'pending' },
      { description: 'Second batch delivery (20 units)', due_date: '2024-03-15', status: 'pending' },
      { description: 'Final batch delivery (10 units)', due_date: '2024-04-15', status: 'pending' }
    ],
    created_at: '2024-01-26T10:00:00Z'
  },
  {
    id: 'contract-002',
    title: 'Prosthetic Limbs Manufacturing',
    contractor_name: 'Advanced Prosthetics Ltd',
    rfq_id: 'rfq-002',
    bid_id: 'bid-789',
    amount: 6750000,
    start_date: '2024-01-15',
    end_date: '2024-06-30',
    status: 'active',
    deliverables: [
      '100 Upper limb prosthetics',
      '75 Lower limb prosthetics',
      'Fitting and customization services'
    ],
    milestones: [
      { description: 'Upper limb prosthetics delivery', due_date: '2024-03-31', status: 'in_progress' },
      { description: 'Lower limb prosthetics delivery', due_date: '2024-05-31', status: 'pending' }
    ],
    created_at: '2024-01-15T14:20:00Z'
  }
];

export const sampleInvoices = [
  {
    id: 'inv-2024-001',
    contract_id: 'contract-002',
    contractor_name: 'Advanced Prosthetics Ltd',
    amount: 2250000,
    description: 'First milestone payment - Upper limb prosthetics (partial)',
    due_date: '2024-02-15',
    status: 'pending',
    submitted_date: '2024-01-26',
    items: [
      { description: 'Upper limb prosthetics (30 units)', quantity: 30, unit_price: 75000, total: 2250000 }
    ]
  },
  {
    id: 'inv-2024-002',
    contract_id: 'contract-001',
    contractor_name: 'MediTech Solutions',
    amount: 900000,
    description: 'Advance payment for material procurement',
    due_date: '2024-02-01',
    status: 'paid',
    submitted_date: '2024-01-20',
    paid_date: '2024-01-25',
    items: [
      { description: 'Advance payment (20% of contract value)', quantity: 1, unit_price: 900000, total: 900000 }
    ]
  }
];

export const sampleNotifications = [
  {
    id: 'notif-001',
    user_id: 'contractor-1',
    title: 'RFQ Clarification Request',
    message: 'SSEPD has requested additional specifications for RFQ-001. Please respond within 24 hours.',
    type: 'rfq_inquiry',
    priority: 'high',
    read: false,
    created_at: '2024-01-25T14:30:00Z'
  },
  {
    id: 'notif-002',
    user_id: 'contractor-1',
    title: 'New RFQ Available',
    message: 'A new RFQ for Hearing Aids has been published. Bid submission deadline: Feb 15, 2024.',
    type: 'new_rfq',
    priority: 'medium',
    read: false,
    created_at: '2024-01-24T09:15:00Z'
  },
  {
    id: 'notif-003',
    user_id: 'contractor-1',
    title: 'Contract Awarded',
    message: 'Congratulations! Your bid for Electric Wheelchairs (RFQ-001) has been accepted.',
    type: 'contract_award',
    priority: 'high',
    read: true,
    created_at: '2024-01-26T11:00:00Z'
  }
];
