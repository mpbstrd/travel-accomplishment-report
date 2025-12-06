# Unit 4: Signature Workflow

## Unit Overview

**Business Capability:** Manage sequential signature approval process

**Purpose:** This unit handles the business-critical three-step sequential signature workflow for travel accomplishment reports. It enforces the approval hierarchy (Prepared By → Branch Acknowledgement → NISD Acknowledgement) and manages signature state transitions.

**Scope:**
- Sequential signature workflow management
- Signature capture with timestamps
- Workflow state management
- Signature validation and enforcement
- Workflow status tracking

**Team Size:** Single team (2-3 developers)

**Dependencies:**
- Consumes: User Management (user identity), Report Management (report data), Notification Service (signature alerts)
- Provides: Signature status to Report Management, triggers to Notification Service

---

## User Stories

### US-3.1: Submit Report for Signatures
**As a** User  
**I want to** submit a completed report for signatures  
**So that** the report can be officially acknowledged

**Acceptance Criteria:**
- AC-3.1.1: System provides "Submit for Signatures" button
- AC-3.1.2: System validates all required fields are completed before submission
- AC-3.1.3: System displays error messages listing incomplete required fields
- AC-3.1.4: System validates all 7 checklist items are answered
- AC-3.1.5: Upon successful validation, report status changes to "Pending Signatures"
- AC-3.1.6: System displays message: "Report submitted successfully. Awaiting signature from Prepared By."
- AC-3.1.7: System sends notification to designated "Prepared By" person
- AC-3.1.8: User cannot edit report after submission (only Admin can edit)
- AC-3.1.9: System records submission timestamp


### US-3.2: Sign as "Prepared By" (Step 1)
**As a** User assigned as "Prepared By"  
**I want to** sign the report  
**So that** I acknowledge I prepared the report

**Acceptance Criteria:**
- AC-3.2.1: System displays signature section for "Prepared By"
- AC-3.2.2: System shows disclaimer: "By entering your name below, you acknowledge that this constitutes your official signature and agreement to the contents of this report."
- AC-3.2.3: User must acknowledge disclaimer before proceeding (checkbox required)
- AC-3.2.4: System provides text field for name entry (required, max 100 characters)
- AC-3.2.5: System auto-captures timestamp when signature is submitted
- AC-3.2.6: System displays timestamp in format: "YYYY-MM-DD HH:MM:SS"
- AC-3.2.7: Upon signature, system updates report status to "Pending Branch Acknowledgement"
- AC-3.2.8: System sends notification to designated "Branch Acknowledgement" person
- AC-3.2.9: "Prepared By" signature cannot be modified after submission
- AC-3.2.10: System displays confirmation: "Signature recorded successfully"

### US-3.3: Sign as "Branch Acknowledgement" (Step 2)
**As a** User assigned as "Branch Acknowledgement"  
**I want to** sign the report  
**So that** I acknowledge the branch visit and activities

**Acceptance Criteria:**
- AC-3.3.1: System only enables "Branch Acknowledgement" signature section after "Prepared By" is completed
- AC-3.3.2: System displays grayed-out section with message "Awaiting Prepared By signature" if Step 1 incomplete
- AC-3.3.3: System shows disclaimer: "By entering your name below, you acknowledge that this constitutes your official signature and agreement to the contents of this report."
- AC-3.3.4: User must acknowledge disclaimer before proceeding (checkbox required)
- AC-3.3.5: System provides text field for name entry (required, max 100 characters)
- AC-3.3.6: System auto-captures timestamp when signature is submitted
- AC-3.3.7: System displays timestamp in format: "YYYY-MM-DD HH:MM:SS"
- AC-3.3.8: Upon signature, system updates report status to "Pending NISD Acknowledgement"
- AC-3.3.9: System sends notification to designated "NISD Acknowledgement" person
- AC-3.3.10: "Branch Acknowledgement" signature cannot be modified after submission
- AC-3.3.11: System displays confirmation: "Signature recorded successfully"
- AC-3.3.12: System displays "Prepared By" signature details (name and timestamp) for reference

### US-3.4: Sign as "NISD Acknowledgement" (Step 3)
**As a** User assigned as "NISD Acknowledgement"  
**I want to** sign the report  
**So that** I provide final NISD approval and complete the report

**Acceptance Criteria:**
- AC-3.4.1: System only enables "NISD Acknowledgement" signature section after "Branch Acknowledgement" is completed
- AC-3.4.2: System displays grayed-out section with message "Awaiting Branch Acknowledgement signature" if Step 2 incomplete
- AC-3.4.3: System shows disclaimer: "By entering your name below, you acknowledge that this constitutes your official signature and agreement to the contents of this report."
- AC-3.4.4: User must acknowledge disclaimer before proceeding (checkbox required)
- AC-3.4.5: System provides text field for name entry (required, max 100 characters)
- AC-3.4.6: System auto-captures timestamp when signature is submitted
- AC-3.4.7: System displays timestamp in format: "YYYY-MM-DD HH:MM:SS"
- AC-3.4.8: Upon signature, system updates report status to "Completed"
- AC-3.4.9: System sends notification to report creator and all signatories
- AC-3.4.10: "NISD Acknowledgement" signature cannot be modified after submission
- AC-3.4.11: System displays confirmation: "Report finalized successfully"
- AC-3.4.12: System displays all previous signatures (names and timestamps) for reference
- AC-3.4.13: Report is now considered finalized and official


### US-3.5: View Signature Status
**As a** User or Admin  
**I want to** view the signature status of a report  
**So that** I can track the approval progress

**Acceptance Criteria:**
- AC-3.5.1: System displays signature status section on report view
- AC-3.5.2: System shows visual indicator for each signature step:
  - ✓ Completed (green) - shows name and timestamp
  - ⏳ Pending (yellow) - shows "Awaiting signature"
  - 🔒 Locked (gray) - shows "Previous step required"
- AC-3.5.3: System displays progress bar showing X of 3 signatures completed
- AC-3.5.4: For completed signatures, system displays:
  - Signatory name
  - Signature timestamp
  - Signature type (Prepared By / Branch Acknowledgement / NISD Acknowledgement)
- AC-3.5.5: System displays overall report status prominently
- AC-3.5.6: System shows estimated completion based on average signature time (optional)

### US-9.2: Enforce Sequential Signature Workflow
**As a** System  
**I want to** enforce sequential signature completion  
**So that** proper approval hierarchy is maintained

**Acceptance Criteria:**
- AC-9.2.1: "Prepared By" signature must be completed first
- AC-9.2.2: "Branch Acknowledgement" signature cannot be completed until "Prepared By" is done
- AC-9.2.3: "NISD Acknowledgement" signature cannot be completed until "Branch Acknowledgement" is done
- AC-9.2.4: System disables signature sections that are not yet available
- AC-9.2.5: System displays clear message indicating which signature is required next
- AC-9.2.6: System prevents skipping signature steps
- AC-9.2.7: System prevents modifying completed signatures
- AC-9.2.8: Report status updates automatically after each signature
- AC-9.2.9: System sends notifications in sequence as each step becomes available

---

## Service Interfaces Exposed

### Signature Workflow Service
- `submitForSignatures(reportId, userId)` - Initiates signature workflow
- `recordSignature(reportId, signatureType, signatoryName, userId)` - Records a signature
- `getSignatureStatus(reportId)` - Returns current signature status
- `getNextRequiredSignature(reportId)` - Returns next signature step
- `validateSignatureEligibility(reportId, userId, signatureType)` - Checks if user can sign
- `getSignatureHistory(reportId)` - Returns all signatures for report
- `isWorkflowComplete(reportId)` - Checks if all signatures completed

### Workflow State Service
- `getWorkflowState(reportId)` - Returns current workflow state
- `transitionWorkflowState(reportId, newState)` - Transitions workflow state
- `validateStateTransition(currentState, newState)` - Validates state transition
- `getAvailableActions(reportId, userId)` - Returns available actions for user

---

## Data Model

### Signature Entity
- signatureId (UUID, primary key)
- reportId (UUID, foreign key)
- signatureType (enum: PreparedBy, BranchAcknowledgement, NISDcknowledgement)
- signatoryName (string)
- signatoryUserId (UUID, foreign key to User)
- signedAt (timestamp)
- ipAddress (string)
- disclaimerAcknowledged (boolean)

### WorkflowState Entity
- workflowId (UUID, primary key)
- reportId (UUID, foreign key, unique)
- currentState (enum: Draft, PendingPreparedBy, PendingBranchAck, PendingNISDAck, Completed)
- submittedAt (timestamp)
- completedAt (timestamp)
- preparedBySignatureId (UUID, foreign key, nullable)
- branchAckSignatureId (UUID, foreign key, nullable)
- nisdAckSignatureId (UUID, foreign key, nullable)

---

## Workflow State Machine

```
Draft
  ↓ (submit for signatures)
PendingPreparedBy
  ↓ (Prepared By signs)
PendingBranchAcknowledgement
  ↓ (Branch Acknowledgement signs)
PendingNISDcknowledgement
  ↓ (NISD Acknowledgement signs)
Completed
```

**State Transitions:**
- Draft → PendingPreparedBy: When report is submitted
- PendingPreparedBy → PendingBranchAcknowledgement: When "Prepared By" signs
- PendingBranchAcknowledgement → PendingNISDcknowledgement: When "Branch Acknowledgement" signs
- PendingNISDcknowledgement → Completed: When "NISD Acknowledgement" signs

**Invalid Transitions:**
- Cannot skip states
- Cannot go backwards
- Cannot modify completed signatures

---

## Business Rules

1. Signatures must be completed in strict sequence: Prepared By → Branch Acknowledgement → NISD Acknowledgement
2. Each signature requires disclaimer acknowledgement
3. Signatures are immutable once recorded
4. Only one signature per type per report
5. Signature timestamp is system-generated (cannot be modified)
6. Report status automatically updates after each signature
7. Notifications are triggered after each signature
8. Users cannot sign the same report multiple times in different roles
9. Admin cannot override or skip signature steps
10. Completed workflow cannot be reset

---

## Unit Boundaries

**Responsibilities:**
- Signature workflow orchestration
- Sequential signature enforcement
- Signature capture and storage
- Workflow state management
- Signature validation

**Not Responsible For:**
- Sending notifications (delegates to Notification Service)
- Report data validation (delegates to Report Management)
- User authentication (delegates to User Management)
- Determining who should sign (configured in Report Management)

---

**Total User Stories in Unit:** 6
