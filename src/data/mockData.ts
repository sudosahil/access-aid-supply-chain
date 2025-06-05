// Mock data for SSEPD Procurement & Inventory Management System
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'contractor' | 'warehouse' | 'requester' | 'manager' | 'finance_director';
  profilePhoto: string;
  phone: string;
  address: string;
  organization: string;
  isActive: boolean;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  complianceDocuments: string[];
  specializations: string[];
  createdAt: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  currentStock: number;
  reorderLevel: number;
  unit: string;
  unitPrice: number;
  warehouseId: string;
  expiryDate?: string;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  managerId: string;
}

export interface RFQ {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  deadline: string;
  budget: number;
  status: 'draft' | 'published' | 'closed' | 'awarded';
  createdBy: string;
  createdAt: string;
  category: string;
}

export interface Bid {
  id: string;
  rfqId: string;
  contractorId: string;
  amount: number;
  proposal: string;
  documents: string[];
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'accepted' | 'rejected';
}

export interface PurchaseOrder {
  id: string;
  bidId?: string;
  supplierId: string;
  items: { itemId: string; quantity: number; unitPrice: number }[];
  totalAmount: number;
  status: 'draft' | 'approved' | 'delivered' | 'cancelled';
  createdBy: string;
  createdAt: string;
  deliveryDate: string;
}

export interface Contract {
  id: string;
  title: string;
  contractorId: string;
  rfqId?: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'draft' | 'active' | 'completed' | 'terminated';
  documents: string[];
  createdAt: string;
}

export interface Invoice {
  id: string;
  contractId: string;
  contractorId: string;
  amount: number;
  description: string;
  documents: string[];
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  submittedAt: string;
  dueDate: string;
}

export interface AssetDistribution {
  id: string;
  itemId: string;
  quantity: number;
  assignedTo: string;
  assignedBy: string;
  purpose: string;
  distributionDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'lost';
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  details: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  createdAt: string;
}

// Mock Users (including login credentials)
export const mockUsers: User[] = [
  // Admins
  { id: '1', name: 'Sarah Johnson', email: 'admin@ssepd.org', password: 'admin123', role: 'admin', phone: '+1-555-0101', address: '123 Admin St, City, State', isActive: true, createdAt: '2024-01-15' },
  { id: '2', name: 'Michael Chen', email: 'mike.chen@ssepd.org', password: 'admin123', role: 'admin', phone: '+1-555-0102', address: '456 Management Ave, City, State', isActive: true, createdAt: '2024-01-16' },
  { id: '3', name: 'Emily Rodriguez', email: 'emily.r@ssepd.org', password: 'admin123', role: 'admin', phone: '+1-555-0103', address: '789 Executive Blvd, City, State', isActive: true, createdAt: '2024-01-17' },
  
  // Staff
  { id: '4', name: 'David Wilson', email: 'staff@ssepd.org', password: 'staff123', role: 'staff', phone: '+1-555-0201', address: '321 Staff Rd, City, State', isActive: true, createdAt: '2024-01-18' },
  { id: '5', name: 'Lisa Thompson', email: 'lisa.t@ssepd.org', password: 'staff123', role: 'staff', phone: '+1-555-0202', address: '654 Worker St, City, State', isActive: true, createdAt: '2024-01-19' },
  { id: '6', name: 'James Brown', email: 'james.b@ssepd.org', password: 'staff123', role: 'staff', phone: '+1-555-0203', address: '987 Employee Ave, City, State', isActive: true, createdAt: '2024-01-20' },
  { id: '7', name: 'Maria Garcia', email: 'maria.g@ssepd.org', password: 'staff123', role: 'staff', phone: '+1-555-0204', address: '147 Team Blvd, City, State', isActive: true, createdAt: '2024-01-21' },
  { id: '8', name: 'Robert Taylor', email: 'robert.t@ssepd.org', password: 'staff123', role: 'staff', phone: '+1-555-0205', address: '258 Department St, City, State', isActive: true, createdAt: '2024-01-22' },
  
  // Contractors
  { id: '9', name: 'Amanda Foster', email: 'contractor@mobility.com', password: 'contractor123', role: 'contractor', phone: '+1-555-0301', address: '369 Contractor Way, City, State', organization: 'Mobility Solutions Inc', isActive: true, createdAt: '2024-01-23' },
  { id: '10', name: 'Christopher Lee', email: 'chris@assisttech.com', password: 'contractor123', role: 'contractor', phone: '+1-555-0302', address: '741 Business Rd, City, State', organization: 'AssistTech Solutions', isActive: true, createdAt: '2024-01-24' },
  { id: '11', name: 'Jennifer Kim', email: 'jen@accessequip.com', password: 'contractor123', role: 'contractor', phone: '+1-555-0303', address: '852 Vendor St, City, State', organization: 'Access Equipment Co', isActive: true, createdAt: '2024-01-25' },
  { id: '12', name: 'Daniel Martinez', email: 'dan@prostheticpro.com', password: 'contractor123', role: 'contractor', phone: '+1-555-0304', address: '963 Service Ave, City, State', organization: 'Prosthetic Professionals', isActive: true, createdAt: '2024-01-26' },
  { id: '13', name: 'Rachel Adams', email: 'rachel@hearingaid.com', password: 'contractor123', role: 'contractor', phone: '+1-555-0305', address: '159 Provider Blvd, City, State', organization: 'Hearing Aid Specialists', isActive: true, createdAt: '2024-01-27' },
  { id: '14', name: 'John Doe', email: 'john.doe@requester.com', password: 'requester123', role: 'requester', phone: '+1-555-0401', address: '789 Requester St, City, State', isActive: true, createdAt: '2024-01-28' },
  { id: '15', name: 'Jane Smith', email: 'jane.smith@manager.com', password: 'manager123', role: 'manager', phone: '+1-555-0402', address: '123 Manager Ave, City, State', isActive: true, createdAt: '2024-01-29' },
  { id: '16', name: 'Emily Johnson', email: 'emily.johnson@finance.com', password: 'finance123', role: 'finance_director', phone: '+1-555-0403', address: '456 Finance St, City, State', isActive: true, createdAt: '2024-01-30' }
];

// Mock Suppliers
export const mockSuppliers: Supplier[] = [
  { id: 's1', name: 'Mobility Pro Equipment', contactPerson: 'John Smith', email: 'john@mobilitypro.com', phone: '+1-555-1001', address: '100 Mobility St, City, State', status: 'approved', complianceDocuments: ['ISO Certification', 'FDA Approval'], specializations: ['Wheelchairs', 'Mobility Scooters'], createdAt: '2024-01-10' },
  { id: 's2', name: 'Assistive Tech Solutions', contactPerson: 'Mary Johnson', email: 'mary@assistivetech.com', phone: '+1-555-1002', address: '200 Tech Ave, City, State', status: 'approved', complianceDocuments: ['CE Marking', 'Quality Assurance'], specializations: ['Hearing Aids', 'Communication Devices'], createdAt: '2024-01-11' },
  { id: 's3', name: 'Prosthetic Innovations', contactPerson: 'Dr. Williams', email: 'williams@prosthetic.com', phone: '+1-555-1003', address: '300 Innovation Blvd, City, State', status: 'approved', complianceDocuments: ['Medical Device License'], specializations: ['Prosthetic Limbs', 'Orthotic Devices'], createdAt: '2024-01-12' },
  { id: 's4', name: 'Vision Aid Specialists', contactPerson: 'Susan Davis', email: 'susan@visionaid.com', phone: '+1-555-1004', address: '400 Vision St, City, State', status: 'approved', complianceDocuments: ['Vision Care Certification'], specializations: ['Braille Books', 'Screen Readers'], createdAt: '2024-01-13' },
  { id: 's5', name: 'Therapy Equipment Co', contactPerson: 'Mark Wilson', email: 'mark@therapyequip.com', phone: '+1-555-1005', address: '500 Therapy Rd, City, State', status: 'approved', complianceDocuments: ['Therapy License'], specializations: ['Physical Therapy Equipment'], createdAt: '2024-01-14' },
  { id: 's6', name: 'Home Accessibility Plus', contactPerson: 'Linda Brown', email: 'linda@homeaccess.com', phone: '+1-555-1006', address: '600 Access Ave, City, State', status: 'pending', complianceDocuments: ['Construction License'], specializations: ['Ramps', 'Grab Bars'], createdAt: '2024-02-01' },
  { id: 's7', name: 'Medical Supply Direct', contactPerson: 'Robert Garcia', email: 'robert@medsupply.com', phone: '+1-555-1007', address: '700 Medical Way, City, State', status: 'approved', complianceDocuments: ['Medical Supply License'], specializations: ['Medical Supplies', 'Hospital Beds'], createdAt: '2024-01-15' },
  { id: 's8', name: 'Adaptive Sports Gear', contactPerson: 'Jessica Miller', email: 'jessica@adaptivesports.com', phone: '+1-555-1008', address: '800 Sports Blvd, City, State', status: 'approved', complianceDocuments: ['Sports Equipment Certification'], specializations: ['Adaptive Sports Equipment'], createdAt: '2024-01-16' }
];

// Mock Inventory Categories
export const mockInventoryCategories: InventoryCategory[] = [
  { id: 'cat1', name: 'Mobility Equipment', description: 'Wheelchairs, scooters, walkers, and mobility aids' },
  { id: 'cat2', name: 'Hearing Assistance', description: 'Hearing aids, amplifiers, and communication devices' },
  { id: 'cat3', name: 'Vision Aids', description: 'Braille books, screen readers, magnifiers, and visual aids' },
  { id: 'cat4', name: 'Prosthetic & Orthotic', description: 'Prosthetic limbs, orthotic devices, and support equipment' },
  { id: 'cat5', name: 'Therapy Equipment', description: 'Physical and occupational therapy tools and equipment' },
  { id: 'cat6', name: 'Home Accessibility', description: 'Ramps, grab bars, and home modification equipment' },
  { id: 'cat7', name: 'Medical Supplies', description: 'Medical equipment and healthcare supplies' },
  { id: 'cat8', name: 'Educational Materials', description: 'Adaptive learning tools and educational resources' }
];

// Mock Warehouses
export const mockWarehouses: Warehouse[] = [
  { id: 'w1', name: 'Central Distribution Center', location: '1000 Distribution Way, City, State', capacity: 10000, managerId: '4' },
  { id: 'w2', name: 'North Region Warehouse', location: '2000 North Ave, City, State', capacity: 5000, managerId: '5' },
  { id: 'w3', name: 'Emergency Supply Storage', location: '3000 Emergency Rd, City, State', capacity: 2000, managerId: '6' }
];

// Mock Inventory Items
export const mockInventoryItems: InventoryItem[] = [
  { id: 'i1', name: 'Manual Wheelchair - Standard', categoryId: 'cat1', description: 'Standard manual wheelchair with adjustable features', currentStock: 45, reorderLevel: 10, unit: 'units', unitPrice: 350.00, warehouseId: 'w1', createdAt: '2024-01-01' },
  { id: 'i2', name: 'Electric Wheelchair - Heavy Duty', categoryId: 'cat1', description: 'Heavy duty electric wheelchair for outdoor use', currentStock: 12, reorderLevel: 5, unit: 'units', unitPrice: 2500.00, warehouseId: 'w1', createdAt: '2024-01-02' },
  { id: 'i3', name: 'Digital Hearing Aid - Behind Ear', categoryId: 'cat2', description: 'Digital hearing aid with Bluetooth connectivity', currentStock: 78, reorderLevel: 15, unit: 'pairs', unitPrice: 1200.00, warehouseId: 'w2', createdAt: '2024-01-03' },
  { id: 'i4', name: 'Braille Display - 40 Cell', categoryId: 'cat3', description: '40-cell refreshable Braille display', currentStock: 8, reorderLevel: 3, unit: 'units', unitPrice: 3500.00, warehouseId: 'w2', createdAt: '2024-01-04' },
  { id: 'i5', name: 'Prosthetic Leg - Below Knee', categoryId: 'cat4', description: 'Carbon fiber below-knee prosthetic leg', currentStock: 15, reorderLevel: 5, unit: 'units', unitPrice: 8000.00, warehouseId: 'w1', createdAt: '2024-01-05' },
  { id: 'i6', name: 'Walking Frame with Wheels', categoryId: 'cat1', description: 'Lightweight aluminum walking frame with wheels', currentStock: 67, reorderLevel: 20, unit: 'units', unitPrice: 85.00, warehouseId: 'w1', createdAt: '2024-01-06' },
  { id: 'i7', name: 'Voice Amplifier', categoryId: 'cat2', description: 'Personal voice amplifier for speech assistance', currentStock: 23, reorderLevel: 8, unit: 'units', unitPrice: 150.00, warehouseId: 'w2', createdAt: '2024-01-07' },
  { id: 'i8', name: 'Grab Bars - Stainless Steel', categoryId: 'cat6', description: 'Stainless steel grab bars for bathroom safety', currentStock: 156, reorderLevel: 30, unit: 'units', unitPrice: 45.00, warehouseId: 'w3', createdAt: '2024-01-08' },
  { id: 'i9', name: 'Hospital Bed - Adjustable', categoryId: 'cat7', description: 'Electric adjustable hospital bed with rails', currentStock: 18, reorderLevel: 5, unit: 'units', unitPrice: 1800.00, warehouseId: 'w1', createdAt: '2024-01-09' },
  { id: 'i10', name: 'Therapy Ball Set', categoryId: 'cat5', description: 'Set of therapy balls for physical rehabilitation', currentStock: 89, reorderLevel: 25, unit: 'sets', unitPrice: 65.00, warehouseId: 'w3', createdAt: '2024-01-10' },
  { id: 'i11', name: 'Screen Reader Software', categoryId: 'cat3', description: 'Professional screen reader software license', currentStock: 34, reorderLevel: 10, unit: 'licenses', unitPrice: 900.00, warehouseId: 'w2', createdAt: '2024-01-11' },
  { id: 'i12', name: 'Adaptive Keyboard', categoryId: 'cat8', description: 'Large key adaptive keyboard for limited dexterity', currentStock: 42, reorderLevel: 12, unit: 'units', unitPrice: 180.00, warehouseId: 'w2', createdAt: '2024-01-12' }
];

// Mock RFQs
export const mockRFQs: RFQ[] = [
  { id: 'rfq1', title: 'Electric Wheelchairs - Bulk Purchase', description: 'Procurement of 50 electric wheelchairs for regional distribution', requirements: ['FDA approved', 'Minimum 2-year warranty', 'Training included'], deadline: '2024-06-15', budget: 125000, status: 'published', createdBy: '4', createdAt: '2024-03-01', category: 'Mobility Equipment' },
  { id: 'rfq2', title: 'Hearing Aid Maintenance Contract', description: 'Annual maintenance contract for hearing aid services', requirements: ['24/7 support', 'On-site repairs', 'Certified technicians'], deadline: '2024-05-30', budget: 45000, status: 'published', createdBy: '5', createdAt: '2024-02-15', category: 'Hearing Assistance' },
  { id: 'rfq3', title: 'Braille Educational Materials', description: 'Production of Braille textbooks and educational materials', requirements: ['Grade 2 Braille', 'Durable binding', 'Age-appropriate content'], deadline: '2024-07-01', budget: 25000, status: 'published', createdBy: '6', createdAt: '2024-02-20', category: 'Educational Materials' },
  { id: 'rfq4', title: 'Prosthetic Limb Services', description: 'Custom prosthetic limb fabrication and fitting services', requirements: ['Licensed prosthetist', 'Custom fitting', 'Follow-up care'], deadline: '2024-06-30', budget: 200000, status: 'published', createdBy: '4', createdAt: '2024-03-05', category: 'Prosthetic & Orthotic' },
  { id: 'rfq5', title: 'Home Accessibility Modifications', description: 'Installation of ramps and accessibility features', requirements: ['ADA compliant', 'Licensed contractors', 'Material warranty'], deadline: '2024-08-15', budget: 75000, status: 'published', createdBy: '7', createdAt: '2024-03-10', category: 'Home Accessibility' },
  { id: 'rfq6', title: 'Therapy Equipment Rental', description: 'Short-term rental of physical therapy equipment', requirements: ['Sanitized equipment', 'Delivery service', 'Setup assistance'], deadline: '2024-05-15', budget: 15000, status: 'closed', createdBy: '5', createdAt: '2024-01-20', category: 'Therapy Equipment' },
  { id: 'rfq7', title: 'Vision Aid Technology', description: 'Latest vision assistance technology procurement', requirements: ['Latest technology', 'User training', 'Technical support'], deadline: '2024-09-01', budget: 60000, status: 'draft', createdBy: '6', createdAt: '2024-03-15', category: 'Vision Aids' },
  { id: 'rfq8', title: 'Medical Supply Delivery Services', description: 'Logistics and delivery services for medical supplies', requirements: ['Temperature control', 'Tracking system', 'Insurance coverage'], deadline: '2024-07-15', budget: 35000, status: 'published', createdBy: '8', createdAt: '2024-03-12', category: 'Medical Supplies' },
  { id: 'rfq9', title: 'Adaptive Sports Equipment', description: 'Sports equipment for disability sports programs', requirements: ['Competition grade', 'Safety certified', 'Maintenance plan'], deadline: '2024-06-01', budget: 40000, status: 'published', createdBy: '4', createdAt: '2024-02-28', category: 'Therapy Equipment' },
  { id: 'rfq10', title: 'Communication Device Support', description: 'Technical support for communication devices', requirements: ['Remote support', 'Response time SLA', 'Parts availability'], deadline: '2024-08-30', budget: 30000, status: 'published', createdBy: '7', createdAt: '2024-03-08', category: 'Hearing Assistance' }
];

// Mock Bids
export const mockBids: Bid[] = [
  { id: 'bid1', rfqId: 'rfq1', contractorId: '9', amount: 120000, proposal: 'We propose high-quality electric wheelchairs with extended warranty and comprehensive training program.', documents: ['technical_specs.pdf', 'warranty_details.pdf'], submittedAt: '2024-03-15', status: 'under_review' },
  { id: 'bid2', rfqId: 'rfq1', contractorId: '11', amount: 118000, proposal: 'Premium electric wheelchairs with advanced features and 3-year warranty package.', documents: ['product_catalog.pdf', 'certification.pdf'], submittedAt: '2024-03-16', status: 'under_review' },
  { id: 'bid3', rfqId: 'rfq2', contractorId: '13', amount: 42000, proposal: 'Comprehensive hearing aid maintenance with 24/7 support and certified technicians.', documents: ['service_agreement.pdf', 'technician_certifications.pdf'], submittedAt: '2024-03-01', status: 'accepted' },
  { id: 'bid4', rfqId: 'rfq3', contractorId: '10', amount: 23500, proposal: 'High-quality Braille educational materials with durable binding and age-appropriate content.', documents: ['sample_materials.pdf', 'production_timeline.pdf'], submittedAt: '2024-02-25', status: 'under_review' },
  { id: 'bid5', rfqId: 'rfq4', contractorId: '12', amount: 195000, proposal: 'Custom prosthetic services with licensed prosthetists and comprehensive follow-up care.', documents: ['license_certificates.pdf', 'case_studies.pdf'], submittedAt: '2024-03-18', status: 'submitted' },
  { id: 'bid6', rfqId: 'rfq5', contractorId: '9', amount: 72000, proposal: 'ADA compliant accessibility modifications with licensed contractors and material warranties.', documents: ['contractor_licenses.pdf', 'previous_work.pdf'], submittedAt: '2024-03-20', status: 'submitted' },
  { id: 'bid7', rfqId: 'rfq6', contractorId: '11', amount: 14200, proposal: 'Sanitized therapy equipment rental with delivery and setup services.', documents: ['equipment_list.pdf', 'sanitization_protocols.pdf'], submittedAt: '2024-02-01', status: 'accepted' },
  { id: 'bid8', rfqId: 'rfq8', contractorId: '10', amount: 33000, proposal: 'Professional medical supply delivery with temperature control and tracking.', documents: ['delivery_capabilities.pdf', 'insurance_documents.pdf'], submittedAt: '2024-03-25', status: 'submitted' },
  { id: 'bid9', rfqId: 'rfq9', contractorId: '9', amount: 38500, proposal: 'Competition-grade adaptive sports equipment with safety certification.', documents: ['equipment_specs.pdf', 'safety_certifications.pdf'], submittedAt: '2024-03-10', status: 'under_review' },
  { id: 'bid10', rfqId: 'rfq10', contractorId: '13', amount: 28500, proposal: 'Technical support for communication devices with guaranteed response times.', documents: ['support_plan.pdf', 'sla_agreement.pdf'], submittedAt: '2024-03-22', status: 'submitted' }
];

// Mock Purchase Orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  { id: 'po1', bidId: 'bid3', supplierId: 's2', items: [{ itemId: 'i3', quantity: 50, unitPrice: 1200.00 }], totalAmount: 60000, status: 'approved', createdBy: '4', createdAt: '2024-03-20', deliveryDate: '2024-04-15' },
  { id: 'po2', bidId: 'bid7', supplierId: 's5', items: [{ itemId: 'i10', quantity: 20, unitPrice: 65.00 }], totalAmount: 1300, status: 'delivered', createdBy: '5', createdAt: '2024-02-10', deliveryDate: '2024-02-25' },
  { id: 'po3', supplierId: 's1', items: [{ itemId: 'i1', quantity: 25, unitPrice: 350.00 }, { itemId: 'i6', quantity: 30, unitPrice: 85.00 }], totalAmount: 11250, status: 'approved', createdBy: '6', createdAt: '2024-03-25', deliveryDate: '2024-04-20' },
  { id: 'po4', supplierId: 's3', items: [{ itemId: 'i5', quantity: 5, unitPrice: 8000.00 }], totalAmount: 40000, status: 'draft', createdBy: '4', createdAt: '2024-03-28', deliveryDate: '2024-05-01' },
  { id: 'po5', supplierId: 's4', items: [{ itemId: 'i4', quantity: 3, unitPrice: 3500.00 }, { itemId: 'i11', quantity: 10, unitPrice: 900.00 }], totalAmount: 19500, status: 'approved', createdBy: '7', createdAt: '2024-03-22', deliveryDate: '2024-04-30' },
  { id: 'po6', supplierId: 's7', items: [{ itemId: 'i9', quantity: 8, unitPrice: 1800.00 }], totalAmount: 14400, status: 'delivered', createdBy: '5', createdAt: '2024-02-15', deliveryDate: '2024-03-10' },
  { id: 'po7', supplierId: 's6', items: [{ itemId: 'i8', quantity: 100, unitPrice: 45.00 }], totalAmount: 4500, status: 'approved', createdBy: '8', createdAt: '2024-03-30', deliveryDate: '2024-04-25' },
  { id: 'po8', supplierId: 's8', items: [{ itemId: 'i10', quantity: 15, unitPrice: 65.00 }], totalAmount: 975, status: 'draft', createdBy: '6', createdAt: '2024-04-01', deliveryDate: '2024-04-28' },
  { id: 'po9', supplierId: 's2', items: [{ itemId: 'i7', quantity: 20, unitPrice: 150.00 }, { itemId: 'i12', quantity: 25, unitPrice: 180.00 }], totalAmount: 7500, status: 'approved', createdBy: '4', createdAt: '2024-03-26', deliveryDate: '2024-04-22' },
  { id: 'po10', supplierId: 's1', items: [{ itemId: 'i2', quantity: 3, unitPrice: 2500.00 }], totalAmount: 7500, status: 'approved', createdBy: '7', createdAt: '2024-03-29', deliveryDate: '2024-05-05' }
];

// Mock Contracts
export const mockContracts: Contract[] = [
  { id: 'con1', title: 'Hearing Aid Maintenance Services Contract', contractorId: '13', rfqId: 'rfq2', startDate: '2024-04-01', endDate: '2025-03-31', value: 42000, status: 'active', documents: ['maintenance_contract.pdf', 'sla_document.pdf'], createdAt: '2024-03-25' },
  { id: 'con2', title: 'Therapy Equipment Rental Agreement', contractorId: '11', rfqId: 'rfq6', startDate: '2024-03-01', endDate: '2024-08-31', value: 14200, status: 'active', documents: ['rental_agreement.pdf', 'equipment_list.pdf'], createdAt: '2024-02-20' },
  { id: 'con3', title: 'Prosthetic Services Agreement', contractorId: '12', rfqId: 'rfq4', startDate: '2024-05-01', endDate: '2025-04-30', value: 195000, status: 'draft', documents: ['service_contract.pdf', 'liability_insurance.pdf'], createdAt: '2024-04-02' },
  { id: 'con4', title: 'Mobility Equipment Supply Contract', contractorId: '9', startDate: '2024-02-01', endDate: '2024-12-31', value: 75000, status: 'active', documents: ['supply_contract.pdf', 'quality_standards.pdf'], createdAt: '2024-01-25' },
  { id: 'con5', title: 'Vision Technology Support Services', contractorId: '10', startDate: '2024-03-15', endDate: '2025-03-14', value: 35000, status: 'active', documents: ['support_contract.pdf', 'technical_specs.pdf'], createdAt: '2024-03-10' },
  { id: 'con6', title: 'Home Accessibility Modification Services', contractorId: '9', startDate: '2024-06-01', endDate: '2024-11-30', value: 72000, status: 'draft', documents: ['modification_contract.pdf', 'ada_compliance.pdf'], createdAt: '2024-04-01' }
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  { id: 'inv1', contractId: 'con1', contractorId: '13', amount: 3500, description: 'Monthly hearing aid maintenance services - March 2024', documents: ['march_invoice.pdf', 'service_report.pdf'], status: 'approved', submittedAt: '2024-04-01', dueDate: '2024-04-30' },
  { id: 'inv2', contractId: 'con2', contractorId: '11', amount: 2840, description: 'Therapy equipment rental - March 2024', documents: ['rental_invoice.pdf', 'equipment_usage.pdf'], status: 'paid', submittedAt: '2024-03-25', dueDate: '2024-04-15' },
  { id: 'inv3', contractId: 'con4', contractorId: '9', amount: 12500, description: 'Mobility equipment delivery - February batch', documents: ['delivery_invoice.pdf', 'equipment_manifest.pdf'], status: 'paid', submittedAt: '2024-03-01', dueDate: '2024-03-31' },
  { id: 'inv4', contractId: 'con5', contractorId: '10', amount: 2800, description: 'Vision technology support - March 2024', documents: ['support_invoice.pdf', 'technical_log.pdf'], status: 'approved', submittedAt: '2024-04-02', dueDate: '2024-05-02' },
  { id: 'inv5', contractId: 'con1', contractorId: '13', amount: 3500, description: 'Monthly hearing aid maintenance services - April 2024', documents: ['april_invoice.pdf', 'maintenance_log.pdf'], status: 'pending', submittedAt: '2024-05-01', dueDate: '2024-05-31' },
  { id: 'inv6', contractId: 'con2', contractorId: '11', amount: 2840, description: 'Therapy equipment rental - April 2024', documents: ['april_rental.pdf', 'usage_statistics.pdf'], status: 'pending', submittedAt: '2024-04-30', dueDate: '2024-05-30' },
  { id: 'inv7', contractId: 'con4', contractorId: '9', amount: 8750, description: 'Mobility equipment delivery - March batch', documents: ['march_delivery.pdf', 'quality_check.pdf'], status: 'approved', submittedAt: '2024-04-05', dueDate: '2024-05-05' },
  { id: 'inv8', contractId: 'con5', contractorId: '10', amount: 2800, description: 'Vision technology support - April 2024', documents: ['april_support.pdf', 'incident_reports.pdf'], status: 'pending', submittedAt: '2024-05-03', dueDate: '2024-06-02' },
  { id: 'inv9', contractId: 'con1', contractorId: '13', amount: 4200, description: 'Emergency hearing aid repairs - April 2024', documents: ['emergency_invoice.pdf', 'repair_details.pdf'], status: 'approved', submittedAt: '2024-04-20', dueDate: '2024-05-20' },
  { id: 'inv10', contractId: 'con4', contractorId: '9', amount: 15600, description: 'Special order mobility equipment', documents: ['special_order.pdf', 'custom_specifications.pdf'], status: 'pending', submittedAt: '2024-05-02', dueDate: '2024-06-01' }
];

// Mock Asset Distribution
export const mockAssetDistribution: AssetDistribution[] = [
  { id: 'ad1', itemId: 'i1', quantity: 2, assignedTo: 'Regional Office North', assignedBy: '4', purpose: 'Client loan program', distributionDate: '2024-03-15', status: 'active' },
  { id: 'ad2', itemId: 'i3', quantity: 5, assignedTo: 'Community Center East', assignedBy: '5', purpose: 'Hearing assistance program', distributionDate: '2024-03-20', status: 'active' },
  { id: 'ad3', itemId: 'i6', quantity: 8, assignedTo: 'Rehabilitation Center', assignedBy: '6', purpose: 'Physical therapy sessions', distributionDate: '2024-03-10', status: 'active' },
  { id: 'ad4', itemId: 'i7', quantity: 3, assignedTo: 'Education Department', assignedBy: '7', purpose: 'Classroom assistance', distributionDate: '2024-02-28', status: 'returned', returnDate: '2024-04-30' },
  { id: 'ad5', itemId: 'i8', quantity: 15, assignedTo: 'Home Modification Program', assignedBy: '8', purpose: 'Bathroom safety installations', distributionDate: '2024-03-25', status: 'active' },
  { id: 'ad6', itemId: 'i9', quantity: 1, assignedTo: 'Emergency Response Unit', assignedBy: '4', purpose: 'Temporary medical facility', distributionDate: '2024-03-12', status: 'active' },
  { id: 'ad7', itemId: 'i10', quantity: 10, assignedTo: 'Youth Therapy Program', assignedBy: '5', purpose: 'Pediatric therapy sessions', distributionDate: '2024-02-15', status: 'active' },
  { id: 'ad8', itemId: 'i11', quantity: 2, assignedTo: 'Library Services', assignedBy: '6', purpose: 'Public access computers', distributionDate: '2024-03-18', status: 'active' },
  { id: 'ad9', itemId: 'i12', quantity: 6, assignedTo: 'Vocational Training Center', assignedBy: '7', purpose: 'Computer skills training', distributionDate: '2024-03-22', status: 'active' },
  { id: 'ad10', itemId: 'i2', quantity: 1, assignedTo: 'Outdoor Activity Program', assignedBy: '8', purpose: 'Recreational activities', distributionDate: '2024-03-05', status: 'active' }
];

// Mock Audit Logs
export const mockAuditLogs: AuditLog[] = [
  { id: 'log1', action: 'CREATE', entityType: 'RFQ', entityId: 'rfq10', userId: '7', details: 'Created new RFQ for Communication Device Support', timestamp: '2024-03-08T10:30:00Z' },
  { id: 'log2', action: 'UPDATE', entityType: 'Supplier', entityId: 's6', userId: '1', details: 'Updated supplier status from pending to approved', timestamp: '2024-03-07T14:15:00Z' },
  { id: 'log3', action: 'CREATE', entityType: 'Purchase Order', entityId: 'po10', userId: '7', details: 'Created purchase order for electric wheelchairs', timestamp: '2024-03-29T09:45:00Z' },
  { id: 'log4', action: 'UPDATE', entityType: 'Inventory', entityId: 'i3', userId: '5', details: 'Updated stock quantity from 80 to 78 units', timestamp: '2024-04-01T11:20:00Z' },
  { id: 'log5', action: 'CREATE', entityType: 'Asset Distribution', entityId: 'ad10', userId: '8', details: 'Allocated electric wheelchair to Outdoor Activity Program', timestamp: '2024-03-05T16:00:00Z' },
  { id: 'log6', action: 'UPDATE', entityType: 'Contract', entityId: 'con3', userId: '4', details: 'Updated contract status to active', timestamp: '2024-04-02T13:30:00Z' },
  { id: 'log7', action: 'CREATE', entityType: 'Invoice', entityId: 'inv10', userId: '9', details: 'Submitted invoice for special order mobility equipment', timestamp: '2024-05-02T08:15:00Z' },
  { id: 'log8', action: 'UPDATE', entityType: 'Bid', entityId: 'bid5', userId: '4', details: 'Updated bid status to under review', timestamp: '2024-03-19T15:45:00Z' },
  { id: 'log9', action: 'DELETE', entityType: 'User', entityId: 'u_deleted', userId: '1', details: 'Deactivated user account for inactive contractor', timestamp: '2024-03-15T12:00:00Z' },
  { id: 'log10', action: 'CREATE', entityType: 'Notification', entityId: 'not10', userId: 'system', details: 'Generated low stock alert for prosthetic legs', timestamp: '2024-04-03T07:30:00Z' }
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  { id: 'not1', userId: '9', title: 'New RFQ Available', message: 'Electric Wheelchairs - Bulk Purchase RFQ is now open for bidding', type: 'info', isRead: false, createdAt: '2024-03-01T08:00:00Z' },
  { id: 'not2', userId: '10', title: 'Bid Status Update', message: 'Your bid for Braille Educational Materials has been marked as under review', type: 'info', isRead: true, createdAt: '2024-02-26T14:30:00Z' },
  { id: 'not3', userId: '11', title: 'Contract Awarded', message: 'Congratulations! You have been awarded the Therapy Equipment Rental contract', type: 'success', isRead: false, createdAt: '2024-02-18T10:15:00Z' },
  { id: 'not4', userId: '12', title: 'Invoice Approved', message: 'Your invoice INV-2024-003 has been approved for payment', type: 'success', isRead: true, createdAt: '2024-03-20T16:45:00Z' },
  { id: 'not5', userId: '13', title: 'Payment Processed', message: 'Payment for invoice INV-2024-001 has been processed', type: 'success', isRead: false, createdAt: '2024-04-15T11:00:00Z' },
  { id: 'not6', userId: '4', title: 'Low Stock Alert', message: 'Prosthetic Leg - Below Knee stock is below reorder level', type: 'warning', isRead: false, createdAt: '2024-04-03T07:30:00Z' },
  { id: 'not7', userId: '5', title: 'Supplier Registration', message: 'New supplier Home Accessibility Plus has submitted registration', type: 'info', isRead: true, createdAt: '2024-02-01T09:20:00Z' },
  { id: 'not8', userId: '6', title: 'RFQ Deadline Approaching', message: 'Braille Educational Materials RFQ deadline is in 7 days', type: 'warning', isRead: false, createdAt: '2024-06-24T08:00:00Z' },
  { id: 'not9', userId: '7', title: 'Purchase Order Delivered', message: 'Purchase Order PO-2024-006 has been delivered successfully', type: 'success', isRead: true, createdAt: '2024-03-10T13:30:00Z' },
  { id: 'not10', userId: '8', title: 'Audit Schedule', message: 'Quarterly inventory audit scheduled for next week', type: 'info', isRead: false, createdAt: '2024-04-01T10:00:00Z' }
];
