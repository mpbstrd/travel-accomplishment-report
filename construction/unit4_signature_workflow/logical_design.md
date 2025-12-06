# Logical Design - Unit 4: Signature Workflow

## 1. Overview

### 1.1 Purpose
This document provides the logical design for implementing Unit 4: Signature Workflow using Node.js, TypeScript, Express.js, TypeORM, and MS SQL Server. The design translates the architecture design into a practical, implementable structure suitable for traditional development teams.

### 1.2 Technology Stack
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5+
- **Framework:** Express.js 4.x
- **ORM:** TypeORM 0.3+
- **Database:** Microsoft SQL Server
- **Validation:** class-validator
- **Testing:** Jest
- **Authentication:** JWT (from User Management unit)

### 1.3 Design Principles
- Feature-based organization for clear business capability separation
- Service layer for business logic encapsulation
- Repository pattern for data access abstraction
- DTOs for data transfer and validation
- Dependency injection for testability
- Clear separation of concerns

---

## 2. Directory Structure

```
src/
├── features/
│   └── signature-workflow/
│       ├── controllers/
│       │   └── signature-workflow.controller.ts
│       ├── services/
│       │   ├── signature-workflow.service.ts
│       │   ├── workflow-state.service.ts
│       │   ├── signature-validation.service.ts
│       │   └── signature-notification.service.ts
│       ├── repositories/
│       │   ├── signature.repository.ts
│       │   └── workflow-state.repository.ts
│       ├── entities/
│       │   ├── signature.entity.ts
│       │   └── workflow-state.entity.ts
│       ├── dtos/
│       │   ├── create-signature.dto.ts
│       │   ├── signature-status.dto.ts
│       │   ├── submit-for-signatures.dto.ts
│       │   └── validation-result.dto.ts
│       ├── enums/
│       │   ├── signature-type.enum.ts
│       │   └── workflow-state.enum.ts
│       ├── interfaces/
│       │   ├── signature-workflow.interface.ts
│       │   ├── workflow-state.interface.ts
│       │   └── signature-validation.interface.ts
│       └── routes/
│           └── signature-workflow.routes.ts
├── shared/
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   ├── error-handler.middleware.ts
│   │   └── logging.middleware.ts
│   ├── errors/
│   │   ├── app-error.ts
│   │   ├── validation-error.ts
│   │   ├── authorization-error.ts
│   │   └── not-found-error.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── response-formatter.ts
│   └── types/
│       └── express.d.ts
├── integrations/
│   ├── user-management/
│   │   └── user-management.client.ts
│   ├── report-management/
│   │   └── report-management.client.ts
│   └── notification-service/
│       └── notification.client.ts
├── config/
│   ├── database.config.ts
│   ├── app.config.ts
│   └── integration.config.ts
├── database/
│   ├── migrations/
│   │   ├── 001-create-signature-table.ts
│   │   └── 002-create-workflow-state-table.ts
│   └── data-source.ts
└── app.ts

tests/
├── unit/
│   └── features/
│       └── signature-workflow/
│           ├── services/
│           │   ├── signature-workflow.service.spec.ts
│           │   ├── workflow-state.service.spec.ts
│           │   └── signature-validation.service.spec.ts
│           └── repositories/
│               ├── signature.repository.spec.ts
│               └── workflow-state.repository.spec.ts
├── integration/
│   └── features/
│       └── signature-workflow/
│           └── signature-workflow.integration.spec.ts
└── helpers/
    ├── test-data-builder.ts
    └── mock-factory.ts
```

---

## 3. Data Access Layer

### 3.1 Entity Models (TypeORM)

#### 3.1.1 Signature Entity

**File:** `src/features/signature-workflow/entities/signature.entity.ts`

**Purpose:** Represents individual signature records in the database

**TypeORM Decorators:**
- `@Entity('signatures')` - Table name
- `@PrimaryGeneratedColumn('uuid')` - Primary key
- `@Column()` - Standard columns
- `@CreateDateColumn()` - Auto-generated timestamps
- `@ManyToOne()` - Relationships
- `@Index()` - Database indexes

**Properties:**
- `signatureId: string` - UUID primary key
- `reportId: string` - UUID foreign key to Report
- `signatureType: SignatureType` - Enum (PreparedBy, BranchAcknowledgement, NISDcknowledgement)
- `signatoryName: string` - VARCHAR(100), NOT NULL
- `signatoryUserId: string` - UUID foreign key to User
- `signedAt: Date` - DATETIME2, system-generated
- `ipAddress: string` - VARCHAR(45)
- `disclaimerAcknowledged: boolean` - Must be true
- `createdAt: Date` - Auto-generated

**Indexes:**
- Unique composite index on (reportId, signatureType)
- Index on reportId
- Index on signatoryUserId

**Validation:**
- signatoryName: required, max length 100
- disclaimerAcknowledged: must be true
- signatureType: must be valid enum value

#### 3.1.2 WorkflowState Entity

**File:** `src/features/signature-workflow/entities/workflow-state.entity.ts`

**Purpose:** Tracks workflow state and progression for each report

**TypeORM Decorators:**
- `@Entity('workflow_states')` - Table name
- `@PrimaryGeneratedColumn('uuid')` - Primary key
- `@Column({ unique: true })` - Unique reportId
- `@OneToOne()` / `@JoinColumn()` - Signature relationships
- `@CreateDateColumn()` / `@UpdateDateColumn()` - Timestamps

**Properties:**
- `workflowId: string` - UUID primary key
- `reportId: string` - UUID foreign key to Report (unique)
- `currentState: WorkflowStateEnum` - Current workflow state
- `submittedAt: Date | null` - When submitted for signatures
- `completedAt: Date | null` - When all signatures completed
- `preparedBySignatureId: string | null` - FK to Signature
- `branchAckSignatureId: string | null` - FK to Signature
- `nisdAckSignatureId: string | null` - FK to Signature
- `createdAt: Date` - Auto-generated
- `updatedAt: Date` - Auto-generated

**Indexes:**
- Unique index on reportId
- Index on currentState

**Relationships:**
- One-to-one with Report (via reportId)
- One-to-one with Signature (preparedBySignatureId)
- One-to-one with Signature (branchAckSignatureId)
- One-to-one with Signature (nisdAckSignatureId)

#### 3.1.3 Enumerations

**File:** `src/features/signature-workflow/enums/signature-type.enum.ts`

**SignatureType Enum:**
```
PREPARED_BY = 'PREPARED_BY'
BRANCH_ACKNOWLEDGEMENT = 'BRANCH_ACKNOWLEDGEMENT'
NISD_ACKNOWLEDGEMENT = 'NISD_ACKNOWLEDGEMENT'
```

**File:** `src/features/signature-workflow/enums/workflow-state.enum.ts`

**WorkflowStateEnum:**
```
DRAFT = 'DRAFT'
PENDING_PREPARED_BY = 'PENDING_PREPARED_BY'
PENDING_BRANCH_ACK = 'PENDING_BRANCH_ACK'
PENDING_NISD_ACK = 'PENDING_NISD_ACK'
COMPLETED = 'COMPLETED'
```

### 3.2 Repository Pattern

#### 3.2.1 SignatureRepository

**File:** `src/features/signature-workflow/repositories/signature.repository.ts`

**Purpose:** Abstract data access for Signature entity

**Interface:** `ISignatureRepository`

**Methods:**
- `create(data: CreateSignatureData): Promise<Signature>`
  - Creates new signature record
  - Returns created signature with generated ID and timestamp
  
- `findById(signatureId: string): Promise<Signature | null>`
  - Retrieves signature by ID
  - Returns null if not found

- `findByReportId(reportId: string): Promise<Signature[]>`
  - Retrieves all signatures for a report
  - Ordered by signedAt ascending
  
- `findByReportAndType(reportId: string, signatureType: SignatureType): Promise<Signature | null>`
  - Finds specific signature type for a report
  - Returns null if not found
  
- `getSignatureHistory(reportId: string): Promise<Signature[]>`
  - Returns all signatures ordered by signedAt
  - Includes all signature details

**Implementation Details:**
- Uses TypeORM Repository pattern
- Extends TypeORM Repository<Signature>
- Implements custom query methods
- Handles database errors gracefully
- Uses transactions for data consistency

#### 3.2.2 WorkflowStateRepository

**File:** `src/features/signature-workflow/repositories/workflow-state.repository.ts`

**Purpose:** Abstract data access for WorkflowState entity

**Interface:** `IWorkflowStateRepository`

**Methods:**
- `create(data: CreateWorkflowStateData): Promise<WorkflowState>`
  - Creates new workflow state record
  - Returns created workflow state
  
- `findById(workflowId: string): Promise<WorkflowState | null>`
  - Retrieves workflow state by ID
  - Includes related signatures (eager loading)

- `findByReportId(reportId: string): Promise<WorkflowState | null>`
  - Retrieves workflow state by report ID
  - Most commonly used query
  
- `update(workflowId: string, updates: Partial<WorkflowState>): Promise<WorkflowState>`
  - Updates workflow state fields
  - Returns updated workflow state
  
- `updateState(workflowId: string, newState: WorkflowStateEnum): Promise<WorkflowState>`
  - Updates currentState field
  - Updates updatedAt timestamp
  
- `linkSignature(workflowId: string, signatureType: SignatureType, signatureId: string): Promise<WorkflowState>`
  - Links signature to workflow state
  - Updates appropriate signature ID field based on type

**Implementation Details:**
- Uses TypeORM Repository pattern
- Extends TypeORM Repository<WorkflowState>
- Implements custom query methods
- Uses optimistic locking for concurrent updates
- Handles database errors gracefully

### 3.3 Database Migrations

**Migration 001:** Create Signature Table
- Creates signatures table with all columns
- Creates indexes (unique composite, foreign keys)
- Sets up constraints

**Migration 002:** Create WorkflowState Table
- Creates workflow_states table
- Creates indexes (unique reportId, currentState)
- Sets up foreign key relationships to signatures

---

## 4. Service Layer

### 4.1 SignatureWorkflowService

**File:** `src/features/signature-workflow/services/signature-workflow.service.ts`

**Purpose:** Orchestrate signature workflow operations

**Interface:** `ISignatureWorkflowService`

**Dependencies:**
- SignatureRepository
- WorkflowStateRepository
- WorkflowStateService
- SignatureValidationService
- SignatureNotificationService
- ReportManagementClient (external)

**Methods:**

**`submitForSignatures(reportId: string, userId: string): Promise<WorkflowState>`**
- Validates report completeness via ReportManagementClient
- Validates all 7 checklist items answered
- Creates workflow state record with PENDING_PREPARED_BY state
- Updates report status to "Pending Signatures"
- Triggers notification to first signatory
- Returns created workflow state
- Throws ValidationError if report incomplete

**`recordSignature(data: RecordSignatureData): Promise<RecordSignatureResult>`**
- Input: reportId, signatureType, signatoryName, userId, disclaimerAcknowledged, ipAddress
- Validates signature eligibility via SignatureValidationService
- Creates signature record via SignatureRepository
- Updates workflow state via WorkflowStateService
- Links signature to workflow state
- Triggers notification for next step (if applicable)
- Returns signature and updated workflow state
- Throws AuthorizationError if user cannot sign

**`getSignatureStatus(reportId: string, userId?: string): Promise<SignatureStatusDTO>`**
- Retrieves workflow state via WorkflowStateRepository
- Retrieves all signatures via SignatureRepository
- Determines next required signature
- Calculates progress (X of 3 completed)
- Determines if current user can sign (if userId provided)
- Returns comprehensive status DTO

**`getSignatureHistory(reportId: string): Promise<Signature[]>`**
- Retrieves all signatures for report
- Ordered by signedAt ascending
- Returns signature array

**`getAvailableActions(reportId: string, userId: string): Promise<AvailableActionsDTO>`**
- Determines what actions user can perform
- Checks workflow state
- Validates user eligibility
- Returns available actions and signature type

**Transaction Handling:**
- Uses database transactions for atomic operations
- Signature creation and workflow update in single transaction
- Rollback on any failure

**Error Handling:**
- Validates inputs before processing
- Throws specific error types (ValidationError, AuthorizationError, NotFoundError)
- Logs errors for debugging

### 4.2 WorkflowStateService

**File:** `src/features/signature-workflow/services/workflow-state.service.ts`

**Purpose:** Manage workflow state transitions and validation

**Interface:** `IWorkflowStateService`

**Dependencies:**
- WorkflowStateRepository
- SignatureRepository

**Methods:**

**`getWorkflowState(reportId: string): Promise<WorkflowState>`**
- Retrieves current workflow state for report
- Throws NotFoundError if workflow doesn't exist

**`transitionWorkflowState(reportId: string, newState: WorkflowStateEnum): Promise<WorkflowState>`**
- Validates state transition is valid
- Updates workflow state
- Updates timestamps (completedAt if transitioning to COMPLETED)
- Returns updated workflow state
- Throws ValidationError if transition invalid

**`validateStateTransition(currentState: WorkflowStateEnum, newState: WorkflowStateEnum): boolean`**
- Checks if transition is valid based on state machine rules
- Returns true if valid, false otherwise
- Valid transitions:
  - DRAFT → PENDING_PREPARED_BY
  - PENDING_PREPARED_BY → PENDING_BRANCH_ACK
  - PENDING_BRANCH_ACK → PENDING_NISD_ACK
  - PENDING_NISD_ACK → COMPLETED

**`getNextRequiredSignature(reportId: string): Promise<SignatureType | null>`**
- Determines next signature type required based on current state
- Returns null if workflow complete
- Mapping:
  - PENDING_PREPARED_BY → PREPARED_BY
  - PENDING_BRANCH_ACK → BRANCH_ACKNOWLEDGEMENT
  - PENDING_NISD_ACK → NISD_ACKNOWLEDGEMENT
  - COMPLETED → null

**`isWorkflowComplete(reportId: string): Promise<boolean>`**
- Checks if workflow state is COMPLETED
- Returns boolean

**`linkSignatureToWorkflow(workflowId: string, signatureType: SignatureType, signatureId: string): Promise<WorkflowState>`**
- Links signature ID to appropriate workflow field
- Updates workflow state
- Returns updated workflow

**Business Logic:**
- Enforces sequential workflow progression
- Prevents invalid state transitions
- Maintains workflow integrity

### 4.3 SignatureValidationService

**File:** `src/features/signature-workflow/services/signature-validation.service.ts`

**Purpose:** Enforce signature business rules and validation

**Interface:** `ISignatureValidationService`

**Dependencies:**
- SignatureRepository
- WorkflowStateRepository
- ReportManagementClient (external)
- UserManagementClient (external)

**Methods:**

**`validateSignatureEligibility(reportId: string, userId: string, signatureType: SignatureType): Promise<ValidationResult>`**
- Checks if user is assigned to signature role in report
- Validates workflow is at correct state for signature type
- Ensures signature hasn't already been recorded
- Validates user hasn't signed report in different role
- Returns ValidationResult with isValid and error messages

**`validateReportCompleteness(reportId: string): Promise<ValidationResult>`**
- Calls ReportManagementClient to validate report
- Checks all required fields completed
- Validates all 7 checklist items answered
- Returns ValidationResult

**`validateDisclaimerAcknowledgement(acknowledged: boolean): ValidationResult`**
- Ensures disclaimer acknowledged (must be true)
- Returns ValidationResult

**`validateSignatoryName(name: string): ValidationResult`**
- Validates name is not empty
- Validates name length (max 100 characters)
- Returns ValidationResult

**`validateWorkflowState(reportId: string, expectedSignatureType: SignatureType): Promise<ValidationResult>`**
- Checks workflow state matches expected signature type
- Ensures previous signatures completed
- Returns ValidationResult

**ValidationResult Structure:**
- `isValid: boolean`
- `errors: string[]` - Array of error messages

### 4.4 SignatureNotificationService

**File:** `src/features/signature-workflow/services/signature-notification.service.ts`

**Purpose:** Coordinate with Notification Service for signature alerts

**Interface:** `ISignatureNotificationService`

**Dependencies:**
- NotificationClient (external)
- ReportManagementClient (external)

**Methods:**

**`notifyNextSignatory(reportId: string, signatureType: SignatureType): Promise<void>`**
- Retrieves report details to get assigned signatory
- Determines next signatory based on signature type
- Calls NotificationClient to send notification
- Notification includes report details and action required

**`notifyWorkflowComplete(reportId: string): Promise<void>`**
- Retrieves report details and all signatories
- Sends completion notification to:
  - Report creator
  - All three signatories
- Notification includes completion confirmation

**`notifySignatureRecorded(reportId: string, signatureType: SignatureType, signatoryName: string): Promise<void>`**
- Sends confirmation to signatory who just signed
- Includes signature details and timestamp

**Error Handling:**
- Notification failures logged but don't block workflow
- Retry logic for transient failures
- Fallback to email if push notification fails

---

## 5. Data Transfer Objects (DTOs)

### 5.1 Request DTOs

#### 5.1.1 SubmitForSignaturesDTO

**File:** `src/features/signature-workflow/dtos/submit-for-signatures.dto.ts`

**Purpose:** Validate submission request

**Properties:**
- `userId: string` - User submitting the report

**Validation (class-validator):**
- `@IsUUID()` on userId
- `@IsNotEmpty()` on userId

#### 5.1.2 CreateSignatureDTO

**File:** `src/features/signature-workflow/dtos/create-signature.dto.ts`

**Purpose:** Validate signature creation request

**Properties:**
- `signatureType: SignatureType` - Type of signature
- `signatoryName: string` - Name of signatory
- `disclaimerAcknowledged: boolean` - Disclaimer acknowledgement
- `userId: string` - User ID of signatory

**Validation (class-validator):**
- `@IsEnum(SignatureType)` on signatureType
- `@IsString()` `@MaxLength(100)` `@IsNotEmpty()` on signatoryName
- `@IsBoolean()` `@Equals(true)` on disclaimerAcknowledged
- `@IsUUID()` `@IsNotEmpty()` on userId

### 5.2 Response DTOs

#### 5.2.1 SignatureStatusDTO

**File:** `src/features/signature-workflow/dtos/signature-status.dto.ts`

**Purpose:** Return comprehensive signature status

**Properties:**
- `workflowState: WorkflowState` - Current workflow state
- `signatures: Signature[]` - All signatures for report
- `nextRequired: SignatureType | null` - Next signature needed
- `progress: { completed: number; total: number }` - Progress indicator
- `canCurrentUserSign: boolean` - If current user can sign
- `currentUserSignatureType: SignatureType | null` - Type user can sign

#### 5.2.2 RecordSignatureResultDTO

**File:** `src/features/signature-workflow/dtos/record-signature-result.dto.ts`

**Purpose:** Return signature recording result

**Properties:**
- `signature: Signature` - Created signature
- `workflowState: WorkflowState` - Updated workflow state
- `message: string` - Success message
- `nextSignatureRequired: SignatureType | null` - Next step

#### 5.2.3 AvailableActionsDTO

**File:** `src/features/signature-workflow/dtos/available-actions.dto.ts`

**Purpose:** Return available actions for user

**Properties:**
- `actions: string[]` - Array of action names
- `canSign: boolean` - If user can sign
- `signatureType: SignatureType | null` - Type user can sign
- `message: string` - Descriptive message

#### 5.2.4 ValidationResultDTO

**File:** `src/features/signature-workflow/dtos/validation-result.dto.ts`

**Purpose:** Return validation results

**Properties:**
- `isValid: boolean` - Overall validation result
- `errors: string[]` - Array of error messages

---

## 6. API Layer (Controllers)

### 6.1 SignatureWorkflowController

**File:** `src/features/signature-workflow/controllers/signature-workflow.controller.ts`

**Purpose:** Handle HTTP requests for signature workflow operations

**Dependencies:**
- SignatureWorkflowService
- Logger

**Endpoints:**

#### POST /api/reports/:reportId/signatures/submit

**Handler:** `submitForSignatures`

**Request:**
- Path param: reportId (UUID)
- Body: SubmitForSignaturesDTO
- Headers: Authorization (JWT)

**Process:**
- Extract userId from JWT token
- Validate reportId format
- Call SignatureWorkflowService.submitForSignatures()
- Return workflow state

**Response (200 OK):**
```
{
  workflowState: WorkflowState,
  message: "Report submitted successfully. Awaiting signature from Prepared By."
}
```

**Error Responses:**
- 400 Bad Request: Validation errors
- 404 Not Found: Report not found
- 401 Unauthorized: Invalid token

#### POST /api/reports/:reportId/signatures

**Handler:** `recordSignature`

**Request:**
- Path param: reportId (UUID)
- Body: CreateSignatureDTO
- Headers: Authorization (JWT)

**Process:**
- Extract userId from JWT token
- Extract IP address from request
- Validate request body
- Call SignatureWorkflowService.recordSignature()
- Return signature and workflow state

**Response (201 Created):**
```
{
  signature: Signature,
  workflowState: WorkflowState,
  message: "Signature recorded successfully",
  nextSignatureRequired: SignatureType | null
}
```

**Error Responses:**
- 400 Bad Request: Validation errors
- 403 Forbidden: User not authorized to sign
- 404 Not Found: Report or workflow not found
- 409 Conflict: Signature already exists

#### GET /api/reports/:reportId/signatures/status

**Handler:** `getSignatureStatus`

**Request:**
- Path param: reportId (UUID)
- Query param: userId (optional, UUID)
- Headers: Authorization (JWT)

**Process:**
- Extract userId from JWT or query param
- Call SignatureWorkflowService.getSignatureStatus()
- Return status DTO

**Response (200 OK):**
```
SignatureStatusDTO
```

#### GET /api/reports/:reportId/signatures/history

**Handler:** `getSignatureHistory`

**Request:**
- Path param: reportId (UUID)
- Headers: Authorization (JWT)

**Process:**
- Call SignatureWorkflowService.getSignatureHistory()
- Return signature array

**Response (200 OK):**
```
{
  signatures: Signature[]
}
```

#### GET /api/reports/:reportId/signatures/available-actions

**Handler:** `getAvailableActions`

**Request:**
- Path param: reportId (UUID)
- Query param: userId (UUID)
- Headers: Authorization (JWT)

**Process:**
- Extract userId from JWT or query param
- Call SignatureWorkflowService.getAvailableActions()
- Return available actions DTO

**Response (200 OK):**
```
AvailableActionsDTO
```

**Controller Responsibilities:**
- Request validation
- Authentication/authorization checks
- Calling appropriate service methods
- Response formatting
- Error handling and logging

### 6.2 Route Configuration

**File:** `src/features/signature-workflow/routes/signature-workflow.routes.ts`

**Purpose:** Define Express routes for signature workflow

**Route Definitions:**
```
POST   /api/reports/:reportId/signatures/submit
POST   /api/reports/:reportId/signatures
GET    /api/reports/:reportId/signatures/status
GET    /api/reports/:reportId/signatures/history
GET    /api/reports/:reportId/signatures/available-actions
```

**Middleware Chain:**
1. Authentication middleware (validates JWT)
2. Validation middleware (validates request body/params)
3. Controller handler
4. Error handler middleware

**Route Registration:**
- Routes registered in main app.ts
- Prefix: /api
- Version: v1 (optional)

---

## 7. Middleware Components

### 7.1 Authentication Middleware

**File:** `src/shared/middleware/auth.middleware.ts`

**Purpose:** Validate JWT tokens and extract user information

**Functionality:**
- Extracts JWT from Authorization header
- Validates token signature and expiration
- Extracts userId and role from token
- Attaches user info to request object
- Returns 401 if token invalid

**Integration:**
- Uses JWT library from User Management unit
- Validates against shared secret

### 7.2 Validation Middleware

**File:** `src/shared/middleware/validation.middleware.ts`

**Purpose:** Validate request data using class-validator

**Functionality:**
- Validates request body against DTO class
- Validates path parameters (UUID format)
- Validates query parameters
- Returns 400 with validation errors if invalid
- Passes validated data to controller

**Usage:**
- Applied to routes requiring validation
- Uses class-validator decorators
- Formats validation errors consistently

### 7.3 Error Handler Middleware

**File:** `src/shared/middleware/error-handler.middleware.ts`

**Purpose:** Centralized error handling

**Functionality:**
- Catches all errors from controllers/services
- Maps error types to HTTP status codes
- Formats error responses consistently
- Logs errors for debugging
- Hides internal errors from clients

**Error Type Mapping:**
- ValidationError → 400 Bad Request
- AuthorizationError → 403 Forbidden
- NotFoundError → 404 Not Found
- ConflictError → 409 Conflict
- AppError → 500 Internal Server Error

**Error Response Format:**
```
{
  error: {
    code: string,
    message: string,
    details: string[] (optional)
  }
}
```

### 7.4 Logging Middleware

**File:** `src/shared/middleware/logging.middleware.ts`

**Purpose:** Log HTTP requests and responses

**Functionality:**
- Logs incoming requests (method, path, timestamp)
- Logs response status and duration
- Logs errors with stack traces
- Excludes sensitive data (passwords, tokens)
- Uses structured logging format

---

## 8. Integration Layer

### 8.1 User Management Integration

**File:** `src/integrations/user-management/user-management.client.ts`

**Purpose:** Communicate with User Management unit

**Interface:** `IUserManagementClient`

**Methods:**

**`getUser(userId: string): Promise<User>`**
- Retrieves user details
- Used for validation and authorization

**`validateUserRole(userId: string, reportId: string, signatureType: SignatureType): Promise<boolean>`**
- Checks if user is assigned to signature role
- Returns boolean

**Implementation:**
- Internal service call (same process)
- Direct method invocation
- Shared data models

### 8.2 Report Management Integration

**File:** `src/integrations/report-management/report-management.client.ts`

**Purpose:** Communicate with Report Management unit

**Interface:** `IReportManagementClient`

**Methods:**

**`getReport(reportId: string): Promise<Report>`**
- Retrieves report details
- Includes assigned signatories

**`validateReportCompleteness(reportId: string): Promise<ValidationResult>`**
- Validates all required fields completed
- Validates all checklist items answered

**`updateReportStatus(reportId: string, status: string): Promise<void>`**
- Updates report status after signature events
- Status values: "Pending Signatures", "Pending Branch Acknowledgement", etc.

**`getAssignedSignatory(reportId: string, signatureType: SignatureType): Promise<string>`**
- Returns userId of assigned signatory for given type

**Implementation:**
- Internal service call (same process)
- Direct method invocation
- Shared data models

### 8.3 Notification Service Integration

**File:** `src/integrations/notification-service/notification.client.ts`

**Purpose:** Communicate with Notification Service unit

**Interface:** `INotificationClient`

**Methods:**

**`sendNotification(userId: string, notificationType: string, data: object): Promise<void>`**
- Sends notification to user
- Types: SIGNATURE_REQUIRED, SIGNATURE_RECORDED, WORKFLOW_COMPLETE

**`sendBulkNotification(userIds: string[], notificationType: string, data: object): Promise<void>`**
- Sends notification to multiple users
- Used for workflow completion

**Implementation:**
- Internal service call (same process)
- Asynchronous (fire and forget)
- Failures logged but don't block workflow

### 8.4 Integration Patterns

**Synchronous Communication:**
- Used for validation and data retrieval
- Direct method calls within same process
- Immediate response required

**Asynchronous Communication:**
- Used for notifications
- Fire and forget pattern
- Failures don't block main workflow

**Error Handling:**
- Retry logic for transient failures
- Circuit breaker for repeated failures
- Fallback mechanisms
- Comprehensive logging

---

## 9. Dependency Injection

### 9.1 Container Setup

**Purpose:** Manage service dependencies and lifecycle

**Container:** Use tsyringe or InversifyJS

**Registration:**
- Repositories registered as singletons
- Services registered as singletons
- Controllers registered as transient
- Clients registered as singletons

**Benefits:**
- Testability (easy mocking)
- Loose coupling
- Lifecycle management
- Configuration flexibility

### 9.2 Service Registration

**Repositories:**
```
container.registerSingleton<ISignatureRepository>(SignatureRepository)
container.registerSingleton<IWorkflowStateRepository>(WorkflowStateRepository)
```

**Services:**
```
container.registerSingleton<ISignatureWorkflowService>(SignatureWorkflowService)
container.registerSingleton<IWorkflowStateService>(WorkflowStateService)
container.registerSingleton<ISignatureValidationService>(SignatureValidationService)
container.registerSingleton<ISignatureNotificationService>(SignatureNotificationService)
```

**Controllers:**
```
container.register<SignatureWorkflowController>(SignatureWorkflowController)
```

**Clients:**
```
container.registerSingleton<IUserManagementClient>(UserManagementClient)
container.registerSingleton<IReportManagementClient>(ReportManagementClient)
container.registerSingleton<INotificationClient>(NotificationClient)
```

---

## 10. Configuration Management

### 10.1 Database Configuration

**File:** `src/config/database.config.ts`

**Purpose:** Configure TypeORM connection to MS SQL Server

**Configuration:**
- Host, port, database name
- Username, password (from environment variables)
- Connection pool settings
- Logging configuration
- Migration settings

**Environment Variables:**
- `DB_HOST` - Database server host
- `DB_PORT` - Database server port (default: 1433)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password
- `DB_ENCRYPT` - Enable encryption (true for Azure SQL)

### 10.2 Application Configuration

**File:** `src/config/app.config.ts`

**Purpose:** Configure application settings

**Configuration:**
- Server port
- JWT secret (from environment)
- CORS settings
- Rate limiting
- Request timeout

**Environment Variables:**
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development, production)
- `JWT_SECRET` - JWT signing secret
- `LOG_LEVEL` - Logging level

### 10.3 Integration Configuration

**File:** `src/config/integration.config.ts`

**Purpose:** Configure external service endpoints

**Configuration:**
- User Management service URL
- Report Management service URL
- Notification Service URL
- Timeout settings
- Retry policies

**Environment Variables:**
- `USER_MGMT_URL` - User Management endpoint
- `REPORT_MGMT_URL` - Report Management endpoint
- `NOTIFICATION_URL` - Notification Service endpoint

---

## 11. Error Handling Strategy

### 11.1 Custom Error Classes

**File:** `src/shared/errors/app-error.ts`

**Base Error Class:** `AppError`
- Extends Error
- Properties: statusCode, message, isOperational

**Derived Error Classes:**

**ValidationError** (`src/shared/errors/validation-error.ts`)
- Status: 400
- Used for: Input validation failures
- Properties: errors array

**AuthorizationError** (`src/shared/errors/authorization-error.ts`)
- Status: 403
- Used for: Permission denied scenarios

**NotFoundError** (`src/shared/errors/not-found-error.ts`)
- Status: 404
- Used for: Resource not found

**ConflictError** (`src/shared/errors/conflict-error.ts`)
- Status: 409
- Used for: Duplicate signatures, invalid state transitions

### 11.2 Error Response Format

**Standard Format:**
```
{
  error: {
    code: "ERROR_CODE",
    message: "Human-readable message",
    details: ["Detail 1", "Detail 2"] // Optional
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR` - Input validation failed
- `AUTHORIZATION_ERROR` - User not authorized
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict
- `INTERNAL_ERROR` - Server error

### 11.3 Logging Strategy

**File:** `src/shared/utils/logger.ts`

**Purpose:** Centralized logging utility

**Log Levels:**
- ERROR - Error conditions
- WARN - Warning conditions
- INFO - Informational messages
- DEBUG - Debug messages

**Logging Format:**
- Timestamp
- Level
- Message
- Context (userId, reportId, etc.)
- Stack trace (for errors)

**Implementation:**
- Use Winston or Pino
- Structured JSON logging
- Log rotation
- Different outputs per environment (console, file, external service)

---

## 12. Testing Strategy

### 12.1 Unit Tests

**Purpose:** Test individual components in isolation

**Coverage:**

**Service Tests:**
- SignatureWorkflowService
  - Test submitForSignatures with valid/invalid data
  - Test recordSignature with various scenarios
  - Test getSignatureStatus
  - Mock all dependencies

- WorkflowStateService
  - Test state transitions
  - Test validation logic
  - Test next signature determination

- SignatureValidationService
  - Test all validation rules
  - Test eligibility checks
  - Test business rules

**Repository Tests:**
- SignatureRepository
  - Test CRUD operations
  - Test query methods
  - Use in-memory database or mocks

- WorkflowStateRepository
  - Test CRUD operations
  - Test state updates
  - Test signature linking

**Test Framework:** Jest

**Mocking:** jest.mock() for dependencies

**Test Structure:**
```
describe('SignatureWorkflowService', () => {
  describe('submitForSignatures', () => {
    it('should create workflow state when report is complete', async () => {
      // Arrange
      // Act
      // Assert
    });
    
    it('should throw ValidationError when report is incomplete', async () => {
      // Test
    });
  });
});
```

### 12.2 Integration Tests

**Purpose:** Test component interactions and database operations

**Coverage:**

**API Integration Tests:**
- Test complete request/response flow
- Test authentication/authorization
- Test validation middleware
- Test error handling
- Use test database

**Database Integration Tests:**
- Test entity relationships
- Test transactions
- Test constraints
- Test migrations

**Service Integration Tests:**
- Test service-to-service communication
- Test external client integrations
- Mock external services

**Test Database:**
- Use separate test database
- Reset database before each test
- Use transactions for isolation

### 12.3 Test Utilities

**File:** `tests/helpers/test-data-builder.ts`

**Purpose:** Build test data objects

**Builders:**
- `buildSignature()` - Create test signature
- `buildWorkflowState()` - Create test workflow state
- `buildReport()` - Create test report
- `buildUser()` - Create test user

**File:** `tests/helpers/mock-factory.ts`

**Purpose:** Create mock objects

**Mocks:**
- Mock repositories
- Mock services
- Mock external clients
- Mock Express request/response

### 12.4 Test Coverage Goals

**Targets:**
- Unit tests: 80%+ coverage
- Integration tests: Critical paths covered
- Service layer: 90%+ coverage
- Repository layer: 80%+ coverage

---

## 13. Implementation Guidelines

### 13.1 Code Organization Principles

**Feature-Based Structure:**
- Group related files by feature
- Keep feature code self-contained
- Minimize cross-feature dependencies

**Separation of Concerns:**
- Controllers handle HTTP only
- Services contain business logic
- Repositories handle data access
- DTOs for data transfer
- Entities for database mapping

**Naming Conventions:**
- PascalCase for classes and interfaces
- camelCase for methods and variables
- kebab-case for file names
- Descriptive names that reflect purpose

### 13.2 TypeScript Best Practices

**Type Safety:**
- Use strict mode
- Avoid `any` type
- Define interfaces for all contracts
- Use enums for fixed values
- Leverage type inference

**Async/Await:**
- Use async/await for asynchronous operations
- Handle promise rejections
- Use try/catch for error handling

**Dependency Injection:**
- Use constructor injection
- Inject interfaces, not implementations
- Use dependency injection container

### 13.3 Database Best Practices

**TypeORM Usage:**
- Use decorators for entity definition
- Use repository pattern
- Use query builder for complex queries
- Use transactions for atomic operations
- Use migrations for schema changes

**Performance:**
- Create appropriate indexes
- Use eager/lazy loading appropriately
- Avoid N+1 queries
- Use connection pooling
- Monitor query performance

**Data Integrity:**
- Use foreign key constraints
- Use unique constraints
- Use NOT NULL where appropriate
- Validate data at application level
- Use database transactions

### 13.4 Security Best Practices

**Authentication:**
- Validate JWT on every request
- Use secure token storage
- Implement token expiration
- Validate user permissions

**Input Validation:**
- Validate all inputs
- Sanitize user input
- Use parameterized queries
- Prevent SQL injection

**Data Protection:**
- Don't log sensitive data
- Use HTTPS in production
- Encrypt sensitive data at rest
- Implement rate limiting

---

## 14. Deployment Considerations

### 14.1 Environment Setup

**Development:**
- Local MS SQL Server or Docker container
- Hot reload enabled
- Debug logging
- Mock external services

**Testing:**
- Separate test database
- Automated test execution
- Code coverage reporting

**Production:**
- Azure SQL Database or on-premise SQL Server
- Environment variables for configuration
- Production logging level
- Health checks enabled
- Monitoring and alerting

### 14.2 Database Migration Strategy

**Migration Process:**
- Create migration files for schema changes
- Test migrations in development
- Review migrations before production
- Run migrations during deployment
- Keep rollback scripts ready

**Migration Files:**
- 001-create-signature-table.ts
- 002-create-workflow-state-table.ts
- Numbered sequentially
- Idempotent where possible

### 14.3 Monitoring and Observability

**Metrics to Track:**
- Signature completion rate
- Average time per signature step
- Workflow state distribution
- API response times
- Error rates by endpoint
- Database query performance

**Logging:**
- Structured JSON logs
- Log aggregation (e.g., ELK stack)
- Error tracking (e.g., Sentry)
- Performance monitoring (e.g., Application Insights)

**Health Checks:**
- Database connectivity
- External service availability
- Memory usage
- CPU usage

---

## 15. Development Workflow

### 15.1 Implementation Order

**Phase 1: Foundation**
1. Set up project structure
2. Configure TypeORM and database connection
3. Create entity models
4. Create and run migrations

**Phase 2: Data Layer**
5. Implement repositories
6. Write repository unit tests

**Phase 3: Business Logic**
7. Implement services (start with WorkflowStateService)
8. Implement validation service
9. Implement notification service
10. Implement main workflow service
11. Write service unit tests

**Phase 4: API Layer**
12. Implement DTOs with validation
13. Implement controllers
14. Configure routes
15. Implement middleware
16. Write integration tests

**Phase 5: Integration**
17. Implement external service clients
18. Test integrations
19. End-to-end testing

### 15.2 Code Review Checklist

**Functionality:**
- [ ] Code meets requirements
- [ ] Business logic is correct
- [ ] Edge cases handled
- [ ] Error handling implemented

**Code Quality:**
- [ ] Follows naming conventions
- [ ] Properly typed (no `any`)
- [ ] DRY principle followed
- [ ] SOLID principles followed
- [ ] Comments where needed

**Testing:**
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Tests pass
- [ ] Coverage meets targets

**Security:**
- [ ] Input validation implemented
- [ ] Authentication/authorization checked
- [ ] No sensitive data logged
- [ ] SQL injection prevented

**Performance:**
- [ ] Efficient queries
- [ ] Appropriate indexes
- [ ] No N+1 queries
- [ ] Transactions used correctly

---

## 16. Summary

This logical design provides a comprehensive, implementable blueprint for Unit 4: Signature Workflow. The design emphasizes:

**Practical Implementation:**
- Clear directory structure organized by features
- Straightforward service layer with well-defined responsibilities
- Repository pattern for data access abstraction
- DTOs for validation and data transfer

**Maintainability:**
- Feature-based organization for clear boundaries
- Separation of concerns across layers
- Dependency injection for loose coupling
- Comprehensive error handling

**Testability:**
- Unit tests for business logic
- Integration tests for API and database
- Test utilities and mocks
- Clear testing strategy

**Technology Stack:**
- Node.js 18+ with TypeScript 5+
- Express.js for API framework
- TypeORM for MS SQL Server access
- class-validator for input validation
- Jest for testing

**Integration:**
- Clear integration points with other units
- Internal service communication patterns
- Asynchronous notification handling
- Robust error handling

The design is suitable for traditional development teams transitioning to modern Node.js/TypeScript development, providing clear structure and patterns without overwhelming complexity. All components are designed to be independently testable and maintainable, following industry best practices while remaining practical for implementation.

---

## 17. Next Steps

After approval of this logical design:

1. **Set up development environment** with Node.js, TypeScript, and MS SQL Server
2. **Initialize project** with package.json and TypeScript configuration
3. **Implement data layer** (entities, repositories, migrations)
4. **Implement service layer** (business logic and validation)
5. **Implement API layer** (controllers, routes, middleware)
6. **Write tests** (unit and integration)
7. **Integration testing** with other units
8. **Documentation** of API endpoints and usage

This logical design serves as the blueprint for implementation, ensuring all developers have a clear understanding of the system structure and implementation approach.
