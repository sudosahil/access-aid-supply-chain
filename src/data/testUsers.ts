export interface TestUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'requester' | 'manager' | 'finance_director' | 'admin' | 'staff' | 'contractor' | 'warehouse';
  permissions: {
    budgetLimit?: number;
    canApprove?: boolean;
    approvalLimit?: number;
    canSubmitRequests?: boolean;
    requestLimit?: number;
  };
  tier?: number;
  department?: string;
}

export const testUsers: TestUser[] = [
  // Approval Chain 1 Test Users
  {
    id: 'req-001',
    email: 'requester1@test.com',
    password: 'Requester@123',
    name: 'John Requester',
    role: 'requester',
    permissions: {
      canSubmitRequests: true,
      requestLimit: 50000,
    },
    department: 'Operations'
  },
  {
    id: 'mgr-001',
    email: 'manager1@test.com',
    password: 'Manager@123',
    name: 'Sarah Manager',
    role: 'manager',
    permissions: {
      canApprove: true,
      approvalLimit: 25000,
      canSubmitRequests: true,
      requestLimit: 75000,
    },
    tier: 1,
    department: 'Operations'
  },
  {
    id: 'fin-001',
    email: 'finance1@test.com',
    password: 'Finance@123',
    name: 'David Finance Director',
    role: 'finance_director',
    permissions: {
      canApprove: true,
      approvalLimit: 100000,
      canSubmitRequests: true,
      requestLimit: 150000,
    },
    tier: 2,
    department: 'Finance'
  },
  // Additional Test Users
  {
    id: 'req-002',
    email: 'req2@co.com',
    password: 'Test@123',
    name: 'Emily Requester 2',
    role: 'requester',
    permissions: {
      canSubmitRequests: true,
      requestLimit: 30000,
    },
    department: 'Procurement'
  },
  {
    id: 'appr-001',
    email: 'appr1@co.com',
    password: 'Test@123',
    name: 'Mike Approver 1',
    role: 'manager',
    permissions: {
      canApprove: true,
      approvalLimit: 25000,
      canSubmitRequests: true,
      requestLimit: 50000,
    },
    tier: 1,
    department: 'Procurement'
  },
  {
    id: 'appr-002',
    email: 'appr2@co.com',
    password: 'Test@123',
    name: 'Lisa Approver 2',
    role: 'manager',
    permissions: {
      canApprove: true,
      approvalLimit: 50000,
      canSubmitRequests: true,
      requestLimit: 75000,
    },
    tier: 1,
    department: 'Operations'
  },
  // Keep existing production users
  {
    id: 'admin-001',
    email: 'admin1@ssepd.org',
    password: 'demo123',
    name: 'Admin User',
    role: 'admin',
    permissions: {
      canApprove: true,
      approvalLimit: 1000000,
      canSubmitRequests: true,
      requestLimit: 1000000,
    },
    department: 'Administration'
  },
  {
    id: 'staff-001',
    email: 'staff1@ssepd.org',
    password: 'demo123',
    name: 'Staff User',
    role: 'staff',
    permissions: {
      canSubmitRequests: true,
      requestLimit: 25000,
    },
    department: 'Operations'
  },
  {
    id: 'contractor-001',
    email: 'contractor1@mobility.com',
    password: 'demo123',
    name: 'Contractor User',
    role: 'contractor',
    permissions: {
      canSubmitRequests: false,
    },
    department: 'External'
  },
  {
    id: 'warehouse-001',
    email: 'warehouse1@ssepd.org',
    password: 'demo123',
    name: 'Warehouse User',
    role: 'warehouse',
    permissions: {
      canSubmitRequests: true,
      requestLimit: 15000,
    },
    department: 'Warehouse'
  }
];

export const testScenarios = [
  {
    id: 'scenario-1',
    name: 'Standard Approval Chain',
    description: 'Test multi-tier approval workflow with budget limits',
    users: ['req-001', 'mgr-001', 'fin-001'],
    testCases: [
      'Submit $15k request (should auto-approve at Manager level)',
      'Submit $35k request (requires Finance Director approval)',
      'Submit $125k request (exceeds all limits - should reject)'
    ]
  },
  {
    id: 'scenario-2',
    name: 'Budget Consumption Testing',
    description: 'Test budget tracking and threshold alerts',
    users: ['req-002', 'appr-001', 'appr-002'],
    testCases: [
      'Multiple small requests to reach 75% budget threshold',
      'Request that exceeds remaining budget',
      'Budget reallocation and approval limit updates'
    ]
  }
];

export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    'requester': 'Requester',
    'manager': 'Manager',
    'finance_director': 'Finance Director',
    'admin': 'Admin',
    'staff': 'Staff',
    'contractor': 'Contractor',
    'warehouse': 'Warehouse'
  };
  return roleMap[role] || role;
};

export const getRoleIcon = (role: string): string => {
  const iconMap: Record<string, string> = {
    'requester': '📝',
    'manager': '👔',
    'finance_director': '💼',
    'admin': '⚙️',
    'staff': '👤',
    'contractor': '🔧',
    'warehouse': '📦'
  };
  return iconMap[role] || '👤';
};
