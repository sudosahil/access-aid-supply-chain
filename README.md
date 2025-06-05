
# SSEPD Procurement Management System

A comprehensive procurement and approval workflow management system built with React, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Quick Start

### Production Login Credentials
- **Admin**: admin1@ssepd.org / demo123
- **Staff**: staff1@ssepd.org / demo123
- **Contractor**: contractor1@mobility.com / demo123
- **Warehouse**: warehouse1@ssepd.org / demo123

### Workflow Testing Environment Users
Use these credentials to test the approval workflow system:

#### Approval Chain Test Users
- **Requester**: requester1@test.com / Requester@123 (Can submit up to $50k)
- **Manager**: manager1@test.com / Manager@123 (Can approve up to $25k)
- **Finance Director**: finance1@test.com / Finance@123 (Can approve up to $100k)

#### Additional Test Users
- **Requester 2**: req2@co.com / Test@123 (Can submit up to $30k)
- **Approver 1**: appr1@co.com / Test@123 (Can approve up to $25k)
- **Approver 2**: appr2@co.com / Test@123 (Can approve up to $50k)

## 📁 Project Structure

### 🔐 Authentication & Authorization
```
src/
├── hooks/
│   ├── useAuth.tsx            # Authentication hook with test user support
│   └── usePermissions.tsx     # Streamlined permission management
├── config/
│   └── rolePermissions.ts     # Role-based permission definitions
├── components/auth/
│   ├── LoginForm.tsx          # Basic login form component
│   └── EnhancedLoginForm.tsx  # Enhanced login with test environment
└── data/
    ├── testUsers.ts           # Test user credentials and scenarios
    └── testScenarios.ts       # Comprehensive test case scenarios
```

**Key Features:**
- Dual authentication system (production + test users)
- Role-based access control with granular permissions
- Test environment with predefined approval chains
- JWT-like token simulation for test users

### 🎯 Dashboard Components
```
src/components/dashboards/
├── AdminDashboard.tsx         # Administrator overview dashboard
├── StaffDashboard.tsx         # Staff member dashboard
├── ContractorDashboard.tsx    # Contractor-specific dashboard
└── WarehouseDashboard.tsx     # Warehouse management dashboard
```

**Role-Specific Features:**
- **Admin**: Full system access, user management, system configuration
- **Staff**: RFQ/Bid management, inventory, contracts
- **Contractor**: Available RFQs, bid submission, contract tracking
- **Warehouse**: Inventory management, transfer requests
- **Requester**: Request submission, status tracking (Workflow Testing)
- **Manager**: Approval workflows, budget oversight (Workflow Testing)
- **Finance Director**: High-value approvals, budget allocation (Workflow Testing)

### ✅ Approval Workflow System
```
src/
├── services/
│   ├── approvalService.ts     # Core approval workflow logic
│   └── workflowService.ts     # Enhanced workflow management with validation
├── components/admin/
│   ├── ApprovalWorkflows.tsx  # Workflow configuration interface
│   ├── ApprovalDashboard.tsx  # Real-time approval monitoring
│   └── ApprovalManagement.tsx # Legacy approval management
└── hooks/
    └── useRealtimeApprovals.tsx # Real-time workflow updates
```

**Workflow Features:**
- Multi-stage approval chains (Requester → Manager → Finance Director)
- Real-time status updates via Supabase subscriptions
- Budget threshold-based routing
- Emergency fast-track procedures
- Comprehensive audit trails
- Enhanced error handling and validation

### 💰 Budget Management
```
src/
├── services/
│   └── budgetService.ts       # Enhanced budget CRUD with validation
├── components/
│   ├── admin/
│   │   ├── BudgetManagement.tsx   # Budget overview and management
│   │   └── BudgetModal.tsx        # Refactored budget modal
│   ├── forms/
│   │   └── BudgetForm.tsx         # Extracted budget form component
│   └── admin/
│       └── BudgetCharts.tsx       # Budget visualization charts
├── hooks/
│   └── useBudgetTracking.tsx  # Real-time budget consumption tracking
└── contexts/
    └── BudgetContext.tsx      # Global budget state management
```

**Budget Features:**
- Real-time budget consumption tracking
- Visual progress indicators with threshold alerts
- Multi-source budget allocation (grants, internal, donor funding)
- Budget approval workflows
- Automatic budget validation for requests
- Enhanced error handling and validation

### 📋 RFQ (Request for Quotation) Management
```
src/components/
├── rfq/
│   ├── RFQManagement.tsx      # RFQ creation and management
│   └── RFQDetailModal.tsx     # Detailed RFQ view and editing
└── staff/
    └── RFQManagement.tsx      # Staff-specific RFQ interface
```

**RFQ Features:**
- Multi-category procurement requests
- Automatic approval routing based on amount
- Vendor notification system
- Requirement specification templates
- Integration with bid management

### 🏷️ Bid Management System
```
src/components/staff/
├── BidManagement.tsx          # Bid overview and processing
├── BidDetailModal.tsx         # Detailed bid evaluation
├── BidEvaluation.tsx          # Bid comparison and scoring
└── ContractManagement.tsx     # Post-award contract management
```

**Bid Features:**
- Sealed bid submission system
- Automated bid comparison tables
- Multi-criteria evaluation (price, quality, delivery)
- Award notification automation
- Contract generation workflow

### 👥 User & Permission Management
```
src/components/admin/
├── UserManagement.tsx         # User CRUD operations
└── PermissionManagement.tsx   # Role and permission configuration
```

**User Features:**
- Role-based user creation
- Granular permission management
- User activation/deactivation
- Profile photo management
- Organization assignment

### 📦 Inventory & Warehouse Management
```
src/components/
├── staff/
│   ├── InventoryManagement.tsx    # Inventory overview and management
│   ├── InventoryItemModal.tsx     # Item creation/editing
│   └── WarehouseManagement.tsx    # Warehouse configuration
└── warehouse/
    ├── WarehouseInventory.tsx     # Warehouse-specific inventory view
    ├── TransferRequests.tsx       # Inter-warehouse transfers
    └── EnhancedTransferRequests.tsx # Enhanced transfer workflow
```

### 🔄 Real-time Features
```
src/
├── hooks/
│   ├── useRealtimeNotifications.tsx # Real-time notification system
│   ├── useRealtimeApprovals.tsx     # Live approval updates
│   └── useBudgetTracking.tsx        # Live budget monitoring
└── components/common/
    ├── NotificationBell.tsx         # Notification UI component
    └── RealtimeBudgetIndicator.tsx  # Live budget display
```

**Real-time Capabilities:**
- WebSocket connections via Supabase
- Live approval status updates
- Budget consumption notifications
- User presence indicators
- Automatic dashboard refreshes

### 💬 Messaging System
```
src/components/messaging/
├── MessagingSystem.tsx            # Basic messaging interface
├── EnhancedMessagingSystem.tsx    # Advanced messaging with attachments
└── RealtimeMessaging.tsx          # Real-time chat functionality
```

### 📊 Reports & Analytics
```
src/components/
├── admin/
│   └── AdminReports.tsx           # Comprehensive system reports
└── staff/
    └── StaffReports.tsx           # Operational reports
```

### 🎨 UI Components (shadcn/ui)
```
src/components/ui/
├── button.tsx                     # Customizable button component
├── card.tsx                       # Card layout component
├── dialog.tsx                     # Modal dialog component
├── table.tsx                      # Data table component
├── badge.tsx                      # Status badge component
├── select.tsx                     # Dropdown select component
├── input.tsx                      # Form input component
├── sidebar.tsx                    # Sidebar navigation component
└── [28 additional UI components]  # Complete shadcn/ui library
```

### 🔧 Configuration & Services
```
src/
├── config/
│   └── rolePermissions.ts         # Centralized permission configuration
├── services/
│   ├── approvalService.ts         # Approval workflow logic
│   ├── workflowService.ts         # Enhanced workflow management
│   └── budgetService.ts           # Budget operations with validation
├── forms/
│   └── BudgetForm.tsx             # Reusable budget form component
└── integrations/supabase/
    ├── client.ts                  # Supabase client configuration
    └── types.ts                   # Auto-generated database types
```

### 📊 Data Management
```
src/data/
├── mockData.ts                    # Sample data for development/testing
├── testUsers.ts                   # Test user accounts and scenarios
├── testScenarios.ts               # Comprehensive test case scenarios
├── sampleBudgetData.ts            # Sample budget allocations
├── sampleData.ts                  # General sample data
└── warehouseData.ts               # Warehouse and inventory samples
```

## 🧪 Test Scenarios

### RFQ Test Scenarios

#### RFQ-001: Standard Procurement Workflow ($25,000)
```
1. Requester submits RFQ for office equipment
2. Manager approves (under $50k limit)
3. Finance validates budget availability
4. Procurement initiates bidding process
```

#### RFQ-002: High-Value Procurement ($150,000)
```
1. Requester submits RFQ for software licenses
2. Manager escalates (exceeds $50k limit)
3. Finance Director provides financial approval
4. Legal Team reviews contract terms
```

#### RFQ-003: Emergency Procurement ($75,000)
```
1. IT Manager submits emergency server replacement
2. Finance Director provides emergency approval
3. Procurement sources replacement immediately
4. Finance handles post-approval reconciliation
```

### Bid Management Test Scenarios

#### BID-001: Multi-Vendor Competitive Bidding
- 5 vendors submit sealed bids
- Automated bid comparison and ranking
- Lowest qualified bidder selection
- Award notification system

#### BID-002: Single Vendor Negotiation
- Sole source justification documentation
- Price negotiation workflow
- Contract terms approval
- Award documentation

### Approval Workflow Test Cases

#### Budget Threshold Testing
- $15k request → Manager approval only
- $35k request → Manager + Finance Director
- $125k request → Exceeds limits, automatic rejection

## 🔧 Technical Implementation

### Database Schema (Supabase)
```sql
-- Core Tables
users                    # User accounts and profiles
approval_workflows       # Workflow definitions
workflow_instances       # Active workflow processes
approval_steps          # Individual approval steps
budgets                 # Budget allocations
rfqs                    # Request for quotations
bids                    # Vendor bid submissions
inventory               # Inventory items
transfer_requests       # Inter-warehouse transfers
messages                # Internal messaging
```

### Real-time Subscriptions
```typescript
// Example: Real-time approval updates
const channel = supabase
  .channel('approval_updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'approval_steps'
  }, (payload) => {
    // Handle real-time approval updates
  })
  .subscribe();
```

### Role-Based Access Control
```typescript
// Permission matrix by role
export const rolePermissions: Record<string, UserPermissions> = {
  admin: { /* full access */ },
  staff: { rfqs: true, bids: true, inventory: true },
  requester: { rfqs: true, budgets: true },
  manager: { approvals: true, budgets: true },
  finance_director: { approvals: true, budgets: true, reports: true }
};
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Failed to add workflow step" Error
**Cause**: Validation failure or database constraint violation
**Solution**: Enhanced validation in workflowService.ts now prevents this error

#### 2. "Failed to save budget" Error  
**Cause**: Type mismatch in budget source field
**Solution**: Fixed in budgetService.ts with proper type handling

#### 3. Missing Navigation Menu After Login
**Cause**: Permission system not loading properly for test users
**Solution**: Enhanced AppSidebar.tsx to show workflow tabs for test users

#### 4. Test Users Cannot See Workflow Tabs
**Cause**: Restrictive permission filtering
**Solution**: Special handling added for workflow testing roles (requester, manager, finance_director)

### Performance Optimization

#### Database Queries
- Use select() to limit returned columns
- Implement proper indexing for frequently queried fields
- Use maybeSingle() instead of single() when record might not exist

#### React Performance
- Extracted large components into smaller, focused ones
- Implemented proper dependency arrays in useEffect hooks
- Use React.memo for expensive components

#### Code Organization
- Separated configuration from business logic
- Created reusable form components
- Centralized permission management

## 🚀 Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.io/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)

## 🤝 Contributing

1. Follow the established file structure
2. Create small, focused components
3. Implement proper error handling
4. Add comprehensive test scenarios
5. Update documentation for new features
6. Ensure real-time functionality works correctly

## 📄 License

This project is licensed under the MIT License.
