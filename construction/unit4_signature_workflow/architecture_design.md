# Architecture Design - Unit 4: Signature Workflow

## 1. Overview

### 1.1 Business Capability
Manage sequential signature approval process for travel accomplishment reports through a three-step workflow (Prepared By → Branch Acknowledgement → NISD Acknowledgement).

### 1.2 Architectural Approach
This unit implements a Feature-Based Architecture with Service-Oriented patterns, designed for teams transitioning from traditional monolithic waterfall development. The architecture emphasizes:
- Clear separation of concerns through feature-based organization
- Straightforward data models with explicit relationships
- Service interfaces for inter-feature communication
- Repository patterns for data access abstraction
- Sequential workflow enforcement through state machine pattern

### 1.3 Technology Stack
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5+
- **Framework:** Express.js 4.x
- **ORM:** TypeORM 0.3+
- **Database:** Microsoft SQL Server
- **Authentication:** JWT (integrated with User Management unit)
- **Validation:** class-validator

---

## 2. Feature Components

The Signature Workflow unit is organized into four primary feature components, each representing a distinct business capability:

### 2.1 Signature Submission Feature
**Responsibility:** Handle report submission for signature workflow initiation

**Capabilities:**
- Validate report completeness before submission
- Validate all 7 checklist items are answered
- Initiate signature workflow
- Update report status to "Pending Signatures"
- Trigger notification to first signatory
- Record submission timestamp

**Business Rules:**
- All required fields must be completed
- All checklist items must be answered
- Report cannot be edited after submission (except by Admin)
- Submission creates immutable workflow state

### 2.2 Signature Capture Feature
**Responsibility:** Capture and record individual signatures with validation

**Capabilities:**
- Present signature interface for authorized users
- Enforce disclaimer acknowledgement
- Capture signatory name and timestamp
- Record signature metadata (IP address, user ID)
- Validate signature eligibility
- Make signatures immutable after recording

**Business Rules:**
- Disclaimer must be acknowledged before signing
- Name field required (max 100 characters)
- Timestamp is system-generated and immutable
- Each signature type can only be recorded once per report
- Users cannot sign same report in multiple roles

### 2.3 Workflow State Management Feature
**Responsibility:** Manage workflow state transitions and enforce sequential flow

**Capabilities:**
- Track current workflow state
- Enforce sequential signature order
- Validate state transitions
- Update workflow state after each signature
- Prevent invalid state transitions
- Maintain workflow history

**Business Rules:**
- Strict sequence: Prepared By → Branch Acknowledgement → NISD Acknowledgement
- Cannot skip signature steps
- Cannot go backwards in workflow
- State transitions are atomic
- Completed workflow cannot be reset

### 2.4 Signature Status Tracking Feature
**Responsibility:** Provide visibility into signature workflow progress

**Capabilities:**
- Display current signature status
- Show completed signatures with details
- Indicate pending signatures
- Show locked (unavailable) signature steps
- Display progress indicators
- Provide signature history

**Business Rules:**
- Status reflects real-time workflow state
- Completed signatures show name and timestamp
- Pending signatures show "Awaiting signature"
- Locked signatures show "Previous step required"

---

## 3. Service Layer Architecture

### 3.1 SignatureWorkflowService
**Purpose:** Orchestrate the entire signature workflow process

**Operations:**
- `submitForSignatures(reportId: string, userId: string): Promise<WorkflowState>`
  - Validates report completeness
  - Creates workflow state record
  - Transitions report to "PendingPreparedBy" state
  - Triggers notification to first signatory
  
- `recordSignature(reportId: string, signatureType: SignatureType, signatoryName: string, userId: string): Promise<Signature>`
  - Validates signature eligibility
  - Records signature with timestamp
  - Updates workflow state
  - Triggers notification for next step
  
- `getSignatureStatus(reportId: string): Promise<SignatureStatusDTO>`
  - Returns comprehensive signature status
  - Includes all completed signatures
  - Shows next required signature
  - Provides progress information

**Dependencies:**
- WorkflowStateService (state management)
- SignatureValidationService (business rules)
- SignatureRepository (data access)
- WorkflowStateRepository (data access)
- NotificationService (external - Unit 5)
- ReportService (external - Unit 2)

### 3.2 WorkflowStateService
**Purpose:** Manage workflow state transitions and validation

**Operations:**
- `getWorkflowState(reportId: string): Promise<WorkflowState>`
  - Retrieves current workflow state
  
- `transitionWorkflowState(reportId: string, newState: WorkflowStateEnum): Promise<WorkflowState>`
  - Validates state transition
  - Updates workflow state
  - Records transition timestamp
  
- `validateStateTransition(currentState: WorkflowStateEnum, newState: WorkflowStateEnum): boolean`
  - Enforces valid state transitions
  - Prevents invalid workflow progression
  
- `getAvailableActions(reportId: string, userId: string): Promise<string[]>`
  - Returns actions available to user
  - Based on current state and user role
  
- `isWorkflowComplete(reportId: string): Promise<boolean>`
  - Checks if all signatures completed

**Dependencies:**
- WorkflowStateRepository (data access)
- SignatureRepository (data access)

### 3.3 SignatureValidationService
**Purpose:** Enforce signature business rules and validation

**Operations:**
- `validateSignatureEligibility(reportId: string, userId: string, signatureType: SignatureType): Promise<ValidationResult>`
  - Checks if user can sign at current workflow step
  - Validates user hasn't already signed
  - Ensures previous signatures completed
  
- `validateReportCompleteness(reportId: string): Promise<ValidationResult>`
  - Validates all required fields completed
  - Validates all checklist items answered
  
- `validateDisclaimerAcknowledgement(acknowledged: boolean): ValidationResult`
  - Ensures disclaimer acknowledged
  
- `validateSignatoryName(name: string): ValidationResult`
  - Validates name format and length

**Dependencies:**
- ReportService (external - Unit 2)
- UserService (external - Unit 1)

### 3.4 SignatureNotificationService
**Purpose:** Coordinate with Notification Service for signature alerts

**Operations:**
- `notifyNextSignatory(reportId: string, signatureType: SignatureType): Promise<void>`
  - Determines next signatory
  - Triggers notification
  
- `notifyWorkflowComplete(reportId: string): Promise<void>`
  - Notifies all stakeholders of completion

**Dependencies:**
- NotificationService (external - Unit 5)
- ReportService (external - Unit 2)

---

## 4. Data Models

### 4.1 Signature Entity

**Purpose:** Store individual signature records

**Attributes:**
- `signatureId` (UUID, Primary Key)
- `reportId` (UUID, Foreign Key → Report)
- `signatureType` (Enum: PreparedBy | BranchAcknowledgement | NISDcknowledgement)
- `signatoryName` (VARCHAR(100), NOT NULL)
- `signatoryUserId` (UUID, Foreign Key → User)
- `signedAt` (DATETIME2, NOT NULL, System-generated)
- `ipAddress` (VARCHAR(45), NOT NULL)
- `disclaimerAcknowledged` (BIT, NOT NULL, Must be TRUE)
- `createdAt` (DATETIME2, NOT NULL, System-generated)

**Indexes:**
- Primary Key: `signatureId`
- Unique Index: `(reportId, signatureType)` - Ensures one signature per type per report
- Foreign Key Index: `reportId`
- Foreign Key Index: `signatoryUserId`

**Constraints:**
- `disclaimerAcknowledged` must be TRUE
- `signatoryName` cannot be empty
- `signatureType` must be valid enum value

### 4.2 WorkflowState Entity

**Purpose:** Track workflow state and progression

**Attributes:**
- `workflowId` (UUID, Primary Key)
- `reportId` (UUID, Foreign Key → Report, UNIQUE)
- `currentState` (Enum: Draft | PendingPreparedBy | PendingBranchAck | PendingNISDAck | Completed)
- `submittedAt` (DATETIME2, NULL)
- `completedAt` (DATETIME2, NULL)
- `preparedBySignatureId` (UUID, Foreign Key → Signature, NULL)
- `branchAckSignatureId` (UUID, Foreign Key → Signature, NULL)
- `nisdAckSignatureId` (UUID, Foreign Key → Signature, NULL)
- `createdAt` (DATETIME2, NOT NULL, System-generated)
- `updatedAt` (DATETIME2, NOT NULL, System-generated)

**Indexes:**
- Primary Key: `workflowId`
- Unique Index: `reportId` - One workflow per report
- Foreign Key Index: `preparedBySignatureId`
- Foreign Key Index: `branchAckSignatureId`
- Foreign Key Index: `nisdAckSignatureId`

**Constraints:**
- `reportId` must be unique
- `completedAt` must be NULL or after `submittedAt`
- State transitions must follow valid progression

### 4.3 Enumerations

**SignatureType:**
```
PreparedBy = 'PREPARED_BY'
BranchAcknowledgement = 'BRANCH_ACKNOWLEDGEMENT'
NISDcknowledgement = 'NISD_ACKNOWLEDGEMENT'
```

**WorkflowStateEnum:**
```
Draft = 'DRAFT'
PendingPreparedBy = 'PENDING_PREPARED_BY'
PendingBranchAck = 'PENDING_BRANCH_ACK'
PendingNISDAck = 'PENDING_NISD_ACK'
Completed = 'COMPLETED'
```

### 4.4 Relationships

**Signature → Report:** Many-to-One
- Multiple signatures belong to one report
- Foreign key: `reportId`

**Signature → User:** Many-to-One
- Multiple signatures can be created by one user
- Foreign key: `signatoryUserId`

**WorkflowState → Report:** One-to-One
- Each report has exactly one workflow state
- Foreign key: `reportId` (unique)

**WorkflowState → Signature:** One-to-One (for each signature type)
- Workflow references each signature
- Foreign keys: `preparedBySignatureId`, `branchAckSignatureId`, `nisdAckSignatureId`

---

## 5. Repository Patterns

### 5.1 SignatureRepository

**Purpose:** Abstract data access for Signature entity

**Methods:**
- `create(signature: CreateSignatureDTO): Promise<Signature>`
- `findById(signatureId: string): Promise<Signature | null>`
- `findByReportId(reportId: string): Promise<Signature[]>`
- `findByReportAndType(reportId: string, signatureType: SignatureType): Promise<Signature | null>`
- `getSignatureHistory(reportId: string): Promise<Signature[]>` - Ordered by signedAt

**Query Patterns:**
- Find all signatures for a report
- Find specific signature type for a report
- Check if signature exists for report and type

### 5.2 WorkflowStateRepository

**Purpose:** Abstract data access for WorkflowState entity

**Methods:**
- `create(workflowState: CreateWorkflowStateDTO): Promise<WorkflowState>`
- `findById(workflowId: string): Promise<WorkflowState | null>`
- `findByReportId(reportId: string): Promise<WorkflowState | null>`
- `update(workflowId: string, updates: UpdateWorkflowStateDTO): Promise<WorkflowState>`
- `updateState(workflowId: string, newState: WorkflowStateEnum): Promise<WorkflowState>`
- `linkSignature(workflowId: string, signatureType: SignatureType, signatureId: string): Promise<WorkflowState>`

**Query Patterns:**
- Find workflow by report ID
- Update workflow state
- Link signatures to workflow
- Check workflow completion status

---

## 6. Workflow State Machine

### 6.1 State Diagram
```
┌─────────┐
│  Draft  │
└────┬────┘
     │ submitForSignatures()
     ↓
┌──────────────────────┐
│ PendingPreparedBy    │
└──────────┬───────────┘
           │ recordSignature(PreparedBy)
           ↓
┌──────────────────────┐
│ PendingBranchAck     │
└──────────┬───────────┘
           │ recordSignature(BranchAcknowledgement)
           ↓
┌──────────────────────┐
│ PendingNISDAck       │
└──────────┬───────────┘
           │ recordSignature(NISDcknowledgement)
           ↓
┌──────────────────────┐
│    Completed         │
└──────────────────────┘
```

### 6.2 Valid State Transitions
- `Draft → PendingPreparedBy`: Report submitted for signatures
- `PendingPreparedBy → PendingBranchAck`: Prepared By signature recorded
- `PendingBranchAck → PendingNISDAck`: Branch Acknowledgement signature recorded
- `PendingNISDAck → Completed`: NISD Acknowledgement signature recorded

### 6.3 Invalid Transitions (Prevented)
- Any backward transition
- Skipping states
- Transitioning from Completed
- Any transition not in valid list

### 6.4 State Transition Logic
Each state transition triggers:
1. Validation of current state
2. Validation of new state
3. Update of workflow state
4. Update of report status
5. Notification to next signatory (if applicable)
6. Recording of transition timestamp

---

## 7. API Endpoints (REST)

### 7.1 Signature Workflow Endpoints

**POST /api/reports/:reportId/signatures/submit**
- Submit report for signatures
- Request: `{ userId: string }`
- Response: `{ workflowState: WorkflowState, message: string }`
- Status: 200 OK, 400 Bad Request, 404 Not Found

**POST /api/reports/:reportId/signatures**
- Record a signature
- Request: `{ signatureType: SignatureType, signatoryName: string, disclaimerAcknowledged: boolean, userId: string }`
- Response: `{ signature: Signature, workflowState: WorkflowState, message: string }`
- Status: 201 Created, 400 Bad Request, 403 Forbidden, 404 Not Found

**GET /api/reports/:reportId/signatures/status**
- Get signature status
- Response: `{ workflowState: WorkflowState, signatures: Signature[], nextRequired: SignatureType | null, progress: { completed: number, total: number } }`
- Status: 200 OK, 404 Not Found

**GET /api/reports/:reportId/signatures/history**
- Get signature history
- Response: `{ signatures: Signature[] }`
- Status: 200 OK, 404 Not Found

**GET /api/reports/:reportId/signatures/available-actions**
- Get available actions for user
- Query: `userId`
- Response: `{ actions: string[], canSign: boolean, signatureType: SignatureType | null }`
- Status: 200 OK, 404 Not Found

### 7.2 Request/Response DTOs

**CreateSignatureDTO:**
```
{
  reportId: string
  signatureType: SignatureType
  signatoryName: string
  signatoryUserId: string
  disclaimerAcknowledged: boolean
  ipAddress: string
}
```

**SignatureStatusDTO:**
```
{
  workflowState: WorkflowState
  signatures: Signature[]
  nextRequired: SignatureType | null
  progress: {
    completed: number
    total: number
  }
  canCurrentUserSign: boolean
}
```

**ValidationResult:**
```
{
  isValid: boolean
  errors: string[]
}
```

---

## 8. Integration Points

### 8.1 Consumes from Other Units

**User Management (Unit 1):**
- Service: `UserService.getUserById(userId)`
- Purpose: Validate user identity for signatures
- Data: User details, authentication status

**Report Management (Unit 2):**
- Service: `ReportService.getReport(reportId)`
- Purpose: Validate report exists and retrieve report data
- Data: Report details, completion status, assigned signatories

- Service: `ReportService.updateReportStatus(reportId, status)`
- Purpose: Update report status after signature events
- Data: Report status updates

- Service: `ReportService.validateReportCompleteness(reportId)`
- Purpose: Validate report ready for submission
- Data: Validation results

**Notification Service (Unit 5):**
- Service: `NotificationService.sendNotification(userId, notificationType, data)`
- Purpose: Send signature notifications
- Data: Notification details, recipient information

### 8.2 Provides to Other Units

**Report Management (Unit 2):**
- Service: `SignatureWorkflowService.getSignatureStatus(reportId)`
- Purpose: Allow Report Management to display signature status
- Data: Current workflow state, signature details

- Service: `SignatureWorkflowService.isWorkflowComplete(reportId)`
- Purpose: Check if report signatures are complete
- Data: Boolean completion status

**Notification Service (Unit 5):**
- Event: Signature recorded
- Purpose: Trigger notifications for next signatory
- Data: Report ID, signature type, next signatory

- Event: Workflow completed
- Purpose: Trigger completion notifications
- Data: Report ID, all signatories

### 8.3 Integration Patterns

**Synchronous Communication:**
- REST API calls for immediate operations
- Used for signature recording, status checks
- Direct service-to-service calls within same process

**Event-Driven Communication:**
- Notification triggers after signature events
- Decouples signature workflow from notification delivery
- Allows asynchronous notification processing

**Data Consistency:**
- Database transactions ensure atomic operations
- Workflow state and signature records updated together
- Rollback on failure maintains consistency

---

## 9. Security Considerations

### 9.1 Authentication
- All endpoints require JWT authentication
- User identity verified through User Management unit
- Token validation on every request

### 9.2 Authorization
- Users can only sign if assigned to signature role
- Signature eligibility validated before recording
- Admin cannot override signature sequence

### 9.3 Data Integrity
- Signatures are immutable once recorded
- Timestamps are system-generated
- IP address captured for audit trail
- Disclaimer acknowledgement required

### 9.4 Audit Trail
- All signature events logged
- Workflow state transitions recorded
- User actions tracked with timestamps
- IP addresses stored for security

---

## 10. Error Handling

### 10.1 Validation Errors
- Report incomplete: "Report must be completed before submission"
- Checklist incomplete: "All 7 checklist items must be answered"
- Disclaimer not acknowledged: "You must acknowledge the disclaimer"
- Invalid name: "Signatory name is required (max 100 characters)"
- Signature already exists: "This signature has already been recorded"

### 10.2 Authorization Errors
- User not eligible: "You are not authorized to sign this report"
- Wrong sequence: "Previous signature must be completed first"
- Already signed: "You have already signed this report"

### 10.3 State Errors
- Invalid transition: "Invalid workflow state transition"
- Workflow complete: "This report has already been completed"
- Report not submitted: "Report must be submitted for signatures first"

### 10.4 System Errors
- Database errors: Logged and return generic error message
- External service failures: Retry logic with fallback
- Transaction failures: Rollback and return error

---

## 11. Performance Considerations

### 11.1 Database Optimization
- Indexes on foreign keys for fast lookups
- Unique constraint on (reportId, signatureType) prevents duplicates
- Composite indexes for common query patterns

### 11.2 Caching Strategy
- Workflow state cached after retrieval
- Cache invalidated on state updates
- Signature status cached with short TTL

### 11.3 Query Optimization
- Eager loading of related entities
- Batch queries for signature history
- Pagination for large result sets (if needed)

---

## 12. Testing Strategy

### 12.1 Unit Testing
- Service layer business logic
- Validation rules
- State transition logic
- Repository methods

### 12.2 Integration Testing
- API endpoint functionality
- Database operations
- Service-to-service communication
- External service integration

### 12.3 End-to-End Testing
- Complete signature workflow
- Sequential signature enforcement
- Notification triggers
- Error scenarios

---

## 13. Deployment Considerations

### 13.1 Database Migration
- Create Signature table
- Create WorkflowState table
- Create indexes and constraints
- Seed enum values if needed

### 13.2 Environment Configuration
- Database connection strings
- JWT secret keys
- External service URLs
- Logging configuration

### 13.3 Monitoring
- Signature completion rates
- Workflow state distribution
- Error rates by type
- Performance metrics

---

## 14. Future Enhancements

### 14.1 Potential Features
- Signature delegation
- Signature reminders
- Workflow analytics
- Bulk signature operations
- Signature expiration

### 14.2 Scalability
- Horizontal scaling of API servers
- Database read replicas
- Caching layer expansion
- Event-driven architecture migration

---

## 15. Summary

This architecture provides a straightforward, maintainable approach to signature workflow management using Feature-Based Architecture with Service-Oriented patterns. The design emphasizes:

- **Clear Separation of Concerns:** Features organized by business capability
- **Straightforward Data Models:** Simple entities with explicit relationships
- **Service Interfaces:** Well-defined contracts between components
- **Repository Patterns:** Abstracted data access
- **Sequential Workflow Enforcement:** State machine pattern ensures proper flow
- **Integration Points:** Clean interfaces with other units

The architecture is designed for teams transitioning from traditional waterfall development, avoiding complex domain modeling while maintaining good architectural principles and separation of concerns.
