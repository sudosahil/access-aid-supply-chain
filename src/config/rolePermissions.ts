
export interface UserPermissions {
  dashboard: boolean;
  rfqs: boolean;
  bids: boolean;
  suppliers: boolean;
  inventory: boolean;
  warehouses: boolean;
  messaging: boolean;
  audit: boolean;
  users: boolean;
  settings: boolean;
  budgets: boolean;
  reports: boolean;
  approvals: boolean;
  contracts: boolean;
  transfers: boolean;
}

// Define role-based permissions including new roles
export const rolePermissions: Record<string, UserPermissions> = {
  admin: {
    dashboard: true,
    rfqs: true,
    bids: true,
    suppliers: true,
    inventory: true,
    warehouses: true,
    messaging: true,
    audit: true,
    users: true,
    settings: true,
    budgets: true,
    reports: true,
    approvals: true,
    contracts: true,
    transfers: true,
  },
  staff: {
    dashboard: true,
    rfqs: true,
    bids: true,
    suppliers: true,
    inventory: true,
    warehouses: true,
    messaging: true,
    audit: false,
    users: false,
    settings: false,
    budgets: true,
    reports: true,
    approvals: false,
    contracts: true,
    transfers: true,
  },
  requester: {
    dashboard: true,
    rfqs: true,
    bids: false,
    suppliers: false,
    inventory: true,
    warehouses: false,
    messaging: true,
    audit: false,
    users: false,
    settings: false,
    budgets: true,
    reports: false,
    approvals: false,
    contracts: false,
    transfers: false,
  },
  manager: {
    dashboard: true,
    rfqs: true,
    bids: true,
    suppliers: true,
    inventory: true,
    warehouses: true,
    messaging: true,
    audit: true,
    users: false,
    settings: false,
    budgets: true,
    reports: true,
    approvals: true,
    contracts: true,
    transfers: true,
  },
  finance_director: {
    dashboard: true,
    rfqs: true,
    bids: true,
    suppliers: true,
    inventory: true,
    warehouses: true,
    messaging: true,
    audit: true,
    users: false,
    settings: true,
    budgets: true,
    reports: true,
    approvals: true,
    contracts: true,
    transfers: true,
  },
  contractor: {
    dashboard: true,
    rfqs: true,
    bids: true,
    suppliers: false,
    inventory: false,
    warehouses: false,
    messaging: true,
    audit: false,
    users: false,
    settings: false,
    budgets: false,
    reports: false,
    approvals: false,
    contracts: true,
    transfers: false,
  },
  warehouse: {
    dashboard: true,
    rfqs: false,
    bids: false,
    suppliers: false,
    inventory: true,
    warehouses: true,
    messaging: true,
    audit: false,
    users: false,
    settings: false,
    budgets: false,
    reports: false,
    approvals: false,
    contracts: false,
    transfers: true,
  },
};

export const getDefaultPermissions = (): UserPermissions => ({
  dashboard: true,
  rfqs: false,
  bids: false,
  suppliers: false,
  inventory: false,
  warehouses: false,
  messaging: true,
  audit: false,
  users: false,
  settings: false,
  budgets: false,
  reports: false,
  approvals: false,
  contracts: false,
  transfers: false,
});
