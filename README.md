
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

## 📋 Detailed Feature Documentation by Component

### 🏠 Dashboard Components

#### Admin Dashboard (`src/components/dashboards/AdminDashboard.tsx`)
**Features:**
- **System Overview**: Displays key metrics (active users, pending RFQs, low stock items, monthly savings)
- **Quick Actions Grid**: Direct access to all admin functions
- **System Alerts**: Real-time notifications for critical issues (low stock, pending approvals)
- **Activity Feed**: Recent system activities with status indicators
- **Budget Management Access**: Direct link to budget oversight
- **Approval Dashboard Access**: Real-time approval monitoring

**Available Tabs for Admin:**
- Dashboard, RFQs, Bids, Suppliers, Inventory, Warehouses, Messaging, Audit Logs, User Management, Settings, Budget Management, Approval Workflows, Approval Dashboard, Reports, Profile

#### Staff Dashboard (`src/components/dashboards/StaffDashboard.tsx`)
**Features:**
- **Operational Metrics**: Active RFQs, pending bids, inventory counts, budget utilization
- **Quick Action Buttons**: Manage RFQs, review bids, inventory management, supplier oversight
- **Activity Timeline**: Recent staff activities and updates
- **Budget Overview Access**: Staff-level budget monitoring
- **Performance Indicators**: Success rates and completion metrics

**Available Tabs for Staff:**
- Dashboard, RFQs, Bids, Suppliers, Inventory, Warehouses, Messaging, Budget Overview, Reports, Profile

#### Contractor Dashboard (`src/components/dashboards/ContractorDashboard.tsx`)
**Features:**
- **Bid Statistics**: Available RFQs, submitted bids, won bids, success rate
- **Earnings Tracking**: Total earnings and contract values
- **Pending Bids Overview**: Bids awaiting review with status
- **Quick Actions**: Access to available RFQs, bid management, live status
- **Activity History**: Recent bidding activities and outcomes

**Available Tabs for Contractor:**
- Dashboard, Available RFQs, My Bids, Live Bid Status, Messaging, Contracts, Profile

#### Warehouse Dashboard (`src/components/dashboards/WarehouseDashboard.tsx`)
**Features:**
- **Inventory Overview**: Current stock levels, low stock alerts
- **Transfer Management**: Pending and completed transfers
- **Capacity Monitoring**: Warehouse utilization metrics
- **Quick Actions**: Inventory management, transfer requests
- **Recent Activities**: Stock movements and updates

**Available Tabs for Warehouse:**
- Dashboard, Warehouse Inventory, Transfer Requests, Messaging, Profile

### 📋 Request for Quotation (RFQ) Management

#### RFQ Management (`src/components/staff/RFQManagement.tsx`)
**Features:**
- **RFQ Creation**: Detailed form for creating procurement requests
- **Category Management**: Organized by procurement categories
- **Budget Integration**: Automatic budget validation and allocation
- **Deadline Tracking**: Due date management and alerts
- **Status Workflows**: Draft → Published → Closed lifecycle
- **Vendor Notifications**: Automatic contractor notifications
- **Requirement Templates**: Predefined specification templates

#### Available RFQs (`src/components/contractor/AvailableRFQs.tsx`)
**Features:**
- **Active RFQ Browsing**: View all published RFQs
- **Category Filtering**: Filter by procurement type
- **Bid Submission**: Direct bid submission interface
- **Deadline Awareness**: Clear deadline indicators
- **Requirement Review**: Detailed specification viewing
- **Document Downloads**: Access to RFQ documents

### 🏷️ Bid Management System

#### Bid Management (`src/components/staff/BidManagement.tsx`)
**Features:**
- **Bid Evaluation**: Comprehensive bid comparison tools
- **Scoring Matrix**: Multi-criteria evaluation (price, quality, delivery)
- **Award Process**: Streamlined bid award workflow
- **Vendor Communication**: Direct messaging with contractors
- **Document Management**: Bid document storage and review
- **Contract Generation**: Automatic contract creation post-award

#### My Bids (`src/components/contractor/MyBids.tsx`)
**Features:**
- **Bid Portfolio**: All submitted bids with status
- **Status Tracking**: Real-time bid status updates
- **Amendment Capability**: Modify bids before deadline
- **Award Notifications**: Instant win/loss notifications
- **Performance History**: Bid success analytics
- **Document Uploads**: Supporting document management

#### Live Bid Viewing (`src/components/contractor/LiveBidViewing.tsx`)
**Features:**
- **Real-time Updates**: Live bid status monitoring
- **Competitive Intelligence**: Anonymous bid count viewing
- **Deadline Countdown**: Real-time deadline tracking
- **Status Indicators**: Visual bid status representation
- **Quick Actions**: Fast bid modifications

### 💰 Budget Management System

#### Budget Management (`src/components/admin/BudgetManagement.tsx`)
**Features:**
- **Budget Creation**: Detailed budget allocation forms
- **Multi-source Tracking**: Government grants, internal funds, donor funding
- **Real-time Monitoring**: Live budget consumption tracking
- **Approval Workflows**: Budget approval processes
- **Threshold Alerts**: Automatic overspend warnings
- **Assignment Management**: Budget assignment to users/departments
- **Progress Visualization**: Budget utilization charts

#### Budget Form (`src/components/forms/BudgetForm.tsx`)
**Features:**
- **Comprehensive Input**: Title, amount, source, purpose fields
- **Source Categories**: Predefined funding source options
- **User Assignment**: Dropdown for budget assignment
- **Validation**: Real-time form validation
- **Notes System**: Additional budget information capture

#### Budget Modal (`src/components/admin/BudgetModal.tsx`)
**Features:**
- **Create/Edit Interface**: Modal-based budget management
- **Form Integration**: Uses BudgetForm component
- **Success Notifications**: Toast notifications for actions
- **Error Handling**: Comprehensive error management
- **Data Persistence**: Automatic saving and validation

#### Budget Overview (`src/components/staff/BudgetOverview.tsx`)
**Features:**
- **Staff-level View**: Budget visibility for staff users
- **Allocation Tracking**: Department-specific budget monitoring
- **Spending Analytics**: Historical spending patterns
- **Request Integration**: Link budget to procurement requests

### ✅ Approval Workflow System

#### Approval Workflows (`src/components/admin/ApprovalWorkflows.tsx`)
**Features:**
- **Workflow Designer**: Visual workflow creation interface
- **Multi-step Approvals**: Complex approval chain configuration
- **Role-based Routing**: Automatic routing based on roles
- **Threshold Management**: Amount-based approval routing
- **Template System**: Predefined workflow templates
- **Emergency Procedures**: Fast-track approval options

#### Approval Dashboard (`src/components/admin/ApprovalDashboard.tsx`)
**Features:**
- **Real-time Monitoring**: Live approval status tracking
- **Queue Management**: Pending approval queue
- **Performance Metrics**: Approval time analytics
- **Bottleneck Identification**: Workflow efficiency analysis
- **Escalation Management**: Automatic escalation handling
- **Status Notifications**: Real-time status updates

#### Approval Management (`src/components/admin/ApprovalManagement.tsx`)
**Features:**
- **Legacy Interface**: Traditional approval management
- **Bulk Operations**: Multiple approval processing
- **History Tracking**: Complete approval audit trail
- **Comment System**: Approval comments and feedback
- **Status Management**: Approval status updates

### 📦 Inventory Management

#### Inventory Management (`src/components/staff/InventoryManagement.tsx`)
**Features:**
- **Item Cataloging**: Comprehensive item database
- **Stock Level Monitoring**: Real-time inventory tracking
- **Reorder Alerts**: Automatic low stock notifications
- **Category Organization**: Item categorization system
- **Barcode Support**: Barcode scanning integration
- **Warranty Tracking**: Warranty expiration monitoring
- **Multi-warehouse Support**: Cross-warehouse inventory view

#### Warehouse Inventory (`src/components/warehouse/WarehouseInventory.tsx`)
**Features:**
- **Warehouse-specific View**: Single warehouse inventory focus
- **Stock Movements**: In/out tracking for warehouse
- **Physical Counts**: Inventory count management
- **Location Tracking**: Item location within warehouse
- **Transfer Preparation**: Outbound transfer preparation
- **Damage Reporting**: Damaged item tracking

#### Enhanced Transfer Requests (`src/components/warehouse/EnhancedTransferRequests.tsx`)
**Features:**
- **Inter-warehouse Transfers**: Warehouse-to-warehouse movements
- **Request Management**: Transfer request creation and approval
- **Priority System**: Urgent/normal/low priority handling
- **Status Tracking**: Complete transfer lifecycle tracking
- **Inventory Updates**: Automatic inventory adjustments
- **Documentation**: Transfer documentation and receipts

### 👥 User Management

#### User Management (`src/components/admin/UserManagement.tsx`)
**Features:**
- **User Creation**: New user account creation
- **Role Assignment**: Role-based access control
- **Permission Management**: Granular permission control
- **Profile Management**: User profile editing
- **Account Status**: Active/inactive user management
- **Organization Assignment**: Multi-organization support
- **Photo Management**: Profile photo uploads

#### Profile Management (`src/components/common/ProfileManagement.tsx`)
**Features:**
- **Personal Information**: Name, email, contact details
- **Password Management**: Secure password updates
- **Photo Upload**: Profile picture management
- **Preference Settings**: User preference configuration
- **Activity History**: Personal activity tracking

### 💬 Messaging System

#### Enhanced Messaging System (`src/components/messaging/EnhancedMessagingSystem.tsx`)
**Features:**
- **Real-time Chat**: Instant messaging between users
- **File Attachments**: Document and image sharing
- **Message History**: Complete conversation history
- **User Presence**: Online/offline status indicators
- **Message Threading**: Organized conversation threads
- **Notification System**: Message notifications
- **Role-based Messaging**: Department-specific channels

### 🔐 Authentication & Authorization

#### useAuth Hook (`src/hooks/useAuth.tsx`)
**Features:**
- **Dual Authentication**: Production and test user support
- **Session Management**: Persistent login sessions
- **User Profile Loading**: Automatic profile data retrieval
- **Test User Integration**: Special handling for test accounts
- **Role Verification**: User role validation
- **Logout Handling**: Secure session termination

#### usePermissions Hook (`src/hooks/usePermissions.tsx`)
**Features:**
- **Role-based Permissions**: Granular access control
- **Real-time Validation**: Dynamic permission checking
- **Permission Caching**: Efficient permission storage
- **Fallback Handling**: Default permission sets
- **Loading States**: Permission loading management

#### Role Permissions (`src/config/rolePermissions.ts`)
**Features:**
- **Permission Matrix**: Complete role-permission mapping
- **Centralized Configuration**: Single source of truth
- **Default Permissions**: Fallback permission sets
- **TypeScript Types**: Strongly typed permissions
- **Granular Control**: Fine-grained access control

### 🔍 Audit & Reporting

#### Audit Logs (`src/components/audit/AuditLogs.tsx`)
**Features:**
- **Activity Tracking**: Complete system activity logs
- **User Action Logs**: Individual user activity tracking
- **Data Change Logs**: Database modification tracking
- **Security Monitoring**: Login/logout tracking
- **Report Generation**: Audit report creation
- **Filtering System**: Advanced log filtering

#### Admin Reports (`src/components/admin/AdminReports.tsx`)
**Features:**
- **System Analytics**: Comprehensive system metrics
- **Performance Reports**: System performance analysis
- **User Activity Reports**: User engagement metrics
- **Financial Reports**: Budget and spending analysis
- **Custom Reports**: Configurable report generation
- **Export Functionality**: Report export capabilities

### 🏗️ Layout & Navigation

#### Main Layout (`src/components/layout/MainLayout.tsx`)
**Features:**
- **Responsive Design**: Mobile-first responsive layout
- **Sidebar Navigation**: Collapsible sidebar menu
- **Role-based Menus**: Dynamic menu based on user role
- **Tab Management**: Active tab highlighting
- **Theme Support**: Light/dark theme switching
- **Notification Integration**: Header notification bell
- **User Profile Display**: User info in header

#### App Sidebar (`src/components/layout/AppSidebar.tsx`)
**Features:**
- **Dynamic Menus**: Role-specific menu items
- **Permission Integration**: Permission-based menu filtering
- **Active State Management**: Visual active tab indication
- **Loading States**: Menu loading indicators
- **Role-specific Naming**: Context-aware menu labels
- **Collapsible Design**: Space-efficient navigation

### 🎨 UI Components

All components use the shadcn/ui library for consistent design:
- **Buttons**: Customizable button components with variants
- **Cards**: Layout cards for content organization
- **Dialogs**: Modal dialogs for forms and confirmations
- **Tables**: Data tables with sorting and filtering
- **Forms**: Form inputs with validation
- **Badges**: Status and category indicators
- **Navigation**: Sidebar and menu components
- **Feedback**: Toast notifications and alerts

### 🔧 Services & Data Management

#### Budget Service (`src/services/budgetService.ts`)
**Features:**
- **CRUD Operations**: Create, read, update, delete budgets
- **Validation**: Budget data validation
- **Error Handling**: Comprehensive error management
- **Type Safety**: TypeScript type enforcement

#### Approval Service (`src/services/approvalService.ts`)
**Features:**
- **Workflow Management**: Approval workflow handling
- **Status Updates**: Approval status management
- **Notification Integration**: Approval notifications
- **Audit Trail**: Approval activity logging

### 📊 Real-time Features

- **Live Updates**: Real-time data synchronization via Supabase
- **Notifications**: Instant notifications for important events
- **Status Changes**: Real-time status updates across the system
- **Collaboration**: Real-time collaboration features

### 🗃️ Database Integration

Full Supabase integration with:
- **Tables**: Users, budgets, RFQs, bids, inventory, transfers, messages
- **Real-time Subscriptions**: Live data updates
- **Row Level Security**: Secure data access
- **Audit Logging**: Complete activity tracking

### 🧪 Test Scenarios

Comprehensive test scenarios for:
- **RFQ Workflows**: Standard, high-value, and emergency procurements
- **Approval Chains**: Multi-level approval testing
- **Budget Thresholds**: Amount-based routing validation
- **Role Permissions**: Access control verification

## 🚀 Deployment & Configuration

- **Environment Setup**: Supabase configuration
- **Role Configuration**: Permission matrix setup
- **Test Data**: Sample data for development
- **Production Ready**: Scalable architecture

This system provides a complete procurement management solution with role-based access, real-time collaboration, and comprehensive workflow management.
