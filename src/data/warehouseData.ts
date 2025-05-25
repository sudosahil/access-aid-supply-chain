
export const warehouseUsers = [
  {
    id: 'warehouse1',
    name: 'Warehouse Manager 1',
    email: 'warehouse1',
    password: 'demo123',
    role: 'warehouse' as const,
    phone: '+1-555-0401',
    address: '123 Warehouse District, Bhubaneswar, Odisha',
    isActive: true,
    createdAt: '2024-01-15',
    warehouseId: 'WH-001',
    warehouseName: 'Warehouse A - Bhubaneswar Central'
  },
  {
    id: 'warehouse2',
    name: 'Warehouse Manager 2',
    email: 'warehouse2',
    password: 'demo123',
    role: 'warehouse' as const,
    phone: '+1-555-0402',
    address: '456 Storage Avenue, Cuttack, Odisha',
    isActive: true,
    createdAt: '2024-01-16',
    warehouseId: 'WH-002',
    warehouseName: 'Warehouse B - Cuttack District'
  },
  {
    id: 'warehouse3',
    name: 'Test Warehouse User',
    email: 'warehouse_test',
    password: 'warehouse123',
    role: 'warehouse' as const,
    phone: '+91-9876543210',
    address: 'Test Warehouse Complex, Berhampur, Odisha',
    isActive: true,
    createdAt: '2024-01-20',
    warehouseId: 'WH-003',
    warehouseName: 'Test Warehouse - Berhampur South'
  }
];

// Sample warehouse login credentials for testing:
// Email: warehouse_test
// Password: warehouse123
