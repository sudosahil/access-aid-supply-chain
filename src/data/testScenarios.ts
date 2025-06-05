
export interface TestScenario {
  id: string;
  title: string;
  description: string;
  type: 'rfq' | 'bid' | 'budget' | 'approval';
  steps: TestStep[];
  expectedResults: string[];
  testData: any;
}

export interface TestStep {
  step: number;
  actor: string;
  action: string;
  description: string;
  expectedOutcome: string;
}

export const rfqTestScenarios: TestScenario[] = [
  {
    id: 'RFQ-001',
    title: 'Standard Procurement Workflow',
    description: 'Test standard procurement process for office equipment under $50k',
    type: 'rfq',
    steps: [
      {
        step: 1,
        actor: 'Requester',
        action: 'Submit RFQ',
        description: 'Create RFQ for $25,000 office equipment procurement',
        expectedOutcome: 'RFQ created with status "pending_approval"'
      },
      {
        step: 2,
        actor: 'Manager',
        action: 'Review & Approve',
        description: 'Manager reviews RFQ (under $50k limit)',
        expectedOutcome: 'RFQ approved automatically, moves to procurement team'
      },
      {
        step: 3,
        actor: 'Finance',
        action: 'Budget Validation',
        description: 'Finance team validates budget availability',
        expectedOutcome: 'Budget confirmed, RFQ status updated to "active"'
      },
      {
        step: 4,
        actor: 'Procurement',
        action: 'Initiate Bidding',
        description: 'Procurement team publishes RFQ for bidding',
        expectedOutcome: 'RFQ published, vendors can submit bids'
      }
    ],
    expectedResults: [
      'RFQ workflow completes within 2 business days',
      'All approval notifications sent in real-time',
      'Budget allocation tracked and updated',
      'Audit trail maintained for all actions'
    ],
    testData: {
      title: 'Office Equipment Procurement - Q2 2024',
      description: 'Procurement of ergonomic office chairs and standing desks',
      budget: 25000,
      category: 'Office Equipment',
      requirements: [
        'Ergonomic office chairs (20 units)',
        'Height-adjustable standing desks (15 units)',
        'Cable management accessories',
        '2-year warranty minimum'
      ],
      deadline: '2024-03-15'
    }
  },
  {
    id: 'RFQ-002',
    title: 'High-Value Procurement',
    description: 'Test escalation workflow for software licenses over $50k',
    type: 'rfq',
    steps: [
      {
        step: 1,
        actor: 'Requester',
        action: 'Submit RFQ',
        description: 'Create RFQ for $150,000 software licenses',
        expectedOutcome: 'RFQ created, escalation triggered due to amount'
      },
      {
        step: 2,
        actor: 'Manager',
        action: 'Initial Review',
        description: 'Manager escalates (exceeds $50k limit)',
        expectedOutcome: 'RFQ forwarded to Finance Director'
      },
      {
        step: 3,
        actor: 'Finance Director',
        action: 'Financial Approval',
        description: 'Finance Director reviews and approves',
        expectedOutcome: 'Financial approval granted, legal review triggered'
      },
      {
        step: 4,
        actor: 'Legal Team',
        action: 'Legal Review',
        description: 'Legal team reviews contract terms',
        expectedOutcome: 'Legal approval, RFQ moves to procurement'
      }
    ],
    expectedResults: [
      'Multi-tier approval workflow executed correctly',
      'Escalation rules enforced based on amount',
      'Legal review automatically triggered',
      'All stakeholders notified at each stage'
    ],
    testData: {
      title: 'Enterprise Software Licensing - ERP System',
      description: 'Annual licensing for enterprise resource planning system',
      budget: 150000,
      category: 'Software',
      requirements: [
        'ERP system licenses for 500 users',
        'Implementation and migration services',
        'Training and documentation',
        '24/7 technical support',
        'Data migration from legacy system'
      ],
      deadline: '2024-04-30'
    }
  },
  {
    id: 'RFQ-003',
    title: 'Emergency Procurement',
    description: 'Test fast-track approval for urgent server replacement',
    type: 'rfq',
    steps: [
      {
        step: 1,
        actor: 'IT Manager',
        action: 'Emergency Request',
        description: 'Submit emergency RFQ for server replacement',
        expectedOutcome: 'Emergency flag set, fast-track workflow activated'
      },
      {
        step: 2,
        actor: 'Finance Director',
        action: 'Emergency Approval',
        description: 'Direct approval without full workflow',
        expectedOutcome: 'Emergency procurement approved'
      },
      {
        step: 3,
        actor: 'Procurement',
        action: 'Immediate Sourcing',
        description: 'Source replacement server immediately',
        expectedOutcome: 'Vendor identified, purchase order created'
      },
      {
        step: 4,
        actor: 'Finance',
        action: 'Post-Approval Reconciliation',
        description: 'Budget reconciliation after emergency purchase',
        expectedOutcome: 'Budget updated, compliance documentation completed'
      }
    ],
    expectedResults: [
      'Emergency procurement completed within 4 hours',
      'Fast-track approval workflow bypasses standard steps',
      'Post-approval budget reconciliation',
      'Compliance audit trail maintained'
    ],
    testData: {
      title: 'Emergency Server Replacement - Production Critical',
      description: 'Immediate replacement of failed production server',
      budget: 75000,
      category: 'IT Infrastructure',
      requirements: [
        'High-performance server (specifications attached)',
        'Same-day delivery and installation',
        'Data migration services',
        'Extended warranty coverage'
      ],
      deadline: '2024-02-01',
      emergency: true
    }
  }
];

export const bidTestScenarios: TestScenario[] = [
  {
    id: 'BID-001',
    title: 'Multi-Vendor Competitive Bidding',
    description: 'Test competitive bidding process with multiple vendors',
    type: 'bid',
    steps: [
      {
        step: 1,
        actor: 'Vendor A',
        action: 'Submit Sealed Bid',
        description: 'Submit competitive bid with pricing and specifications',
        expectedOutcome: 'Bid recorded, remains sealed until deadline'
      },
      {
        step: 2,
        actor: 'Vendors B-E',
        action: 'Submit Competing Bids',
        description: 'Multiple vendors submit sealed bids',
        expectedOutcome: 'All bids recorded and sealed'
      },
      {
        step: 3,
        actor: 'Procurement Team',
        action: 'Bid Opening',
        description: 'Open all sealed bids simultaneously',
        expectedOutcome: 'Automated comparison table generated'
      },
      {
        step: 4,
        actor: 'Evaluation Committee',
        action: 'Bid Evaluation',
        description: 'Evaluate bids based on price and qualifications',
        expectedOutcome: 'Lowest qualified bidder identified'
      },
      {
        step: 5,
        actor: 'Procurement Team',
        action: 'Award Notification',
        description: 'Notify winning vendor and update losers',
        expectedOutcome: 'Award notifications sent automatically'
      }
    ],
    expectedResults: [
      'Fair and transparent bidding process',
      'Automated bid comparison and ranking',
      'Audit trail for all bid submissions',
      'Notification system for all participants'
    ],
    testData: {
      rfqId: 'RFQ-001',
      vendors: [
        {
          name: 'Office Solutions Ltd',
          bidAmount: 23500,
          qualificationScore: 95,
          deliveryTime: '2 weeks'
        },
        {
          name: 'Workspace Innovations',
          bidAmount: 24800,
          qualificationScore: 90,
          deliveryTime: '3 weeks'
        },
        {
          name: 'Premium Office Supply',
          bidAmount: 22900,
          qualificationScore: 85,
          deliveryTime: '4 weeks'
        }
      ]
    }
  },
  {
    id: 'BID-002',
    title: 'Single Vendor Negotiation',
    description: 'Test sole source justification and price negotiation',
    type: 'bid',
    steps: [
      {
        step: 1,
        actor: 'Procurement Team',
        action: 'Sole Source Justification',
        description: 'Document justification for single vendor selection',
        expectedOutcome: 'Sole source documentation approved'
      },
      {
        step: 2,
        actor: 'Vendor',
        action: 'Initial Proposal',
        description: 'Vendor submits initial pricing proposal',
        expectedOutcome: 'Proposal received and logged'
      },
      {
        step: 3,
        actor: 'Procurement Team',
        action: 'Price Negotiation',
        description: 'Negotiate pricing and contract terms',
        expectedOutcome: 'Revised pricing agreement reached'
      },
      {
        step: 4,
        actor: 'Contract Team',
        action: 'Contract Terms Review',
        description: 'Review and approve final contract terms',
        expectedOutcome: 'Contract terms finalized'
      },
      {
        step: 5,
        actor: 'Finance Director',
        action: 'Final Approval',
        description: 'Approve negotiated contract and pricing',
        expectedOutcome: 'Contract approved and award documented'
      }
    ],
    expectedResults: [
      'Sole source justification properly documented',
      'Price negotiation process tracked',
      'Contract terms properly reviewed',
      'Final approval workflow completed'
    ],
    testData: {
      rfqId: 'RFQ-002',
      vendor: {
        name: 'Specialized Software Corp',
        initialBid: 150000,
        negotiatedBid: 140000,
        justification: 'Only vendor certified for required ERP system integration'
      }
    }
  }
];

export const approvalTestScenarios: TestScenario[] = [
  {
    id: 'APPROVAL-001',
    title: 'Budget Threshold Testing',
    description: 'Test approval routing based on budget thresholds',
    type: 'approval',
    steps: [
      {
        step: 1,
        actor: 'Requester',
        action: 'Submit $15k Request',
        description: 'Submit request under manager approval limit',
        expectedOutcome: 'Routes to manager only'
      },
      {
        step: 2,
        actor: 'Manager',
        action: 'Approve Request',
        description: 'Manager approves (within $25k limit)',
        expectedOutcome: 'Request fully approved, no further approvals needed'
      }
    ],
    expectedResults: [
      'Approval routing based on amount thresholds',
      'Single-tier approval for amounts under manager limit',
      'Automatic approval notifications'
    ],
    testData: {
      requests: [
        { amount: 15000, expectedApprovers: ['manager'] },
        { amount: 35000, expectedApprovers: ['manager', 'finance_director'] },
        { amount: 125000, expectedApprovers: ['rejection_due_to_limit'] }
      ]
    }
  }
];

export const getAllTestScenarios = (): TestScenario[] => {
  return [...rfqTestScenarios, ...bidTestScenarios, ...approvalTestScenarios];
};

export const getScenariosByType = (type: TestScenario['type']): TestScenario[] => {
  return getAllTestScenarios().filter(scenario => scenario.type === type);
};
