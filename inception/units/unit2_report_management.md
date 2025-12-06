# Unit 2: Report Management

## Unit Overview

**Business Capability:** Create, edit, view, and manage travel accomplishment reports

**Purpose:** This unit is the core of the system, handling all report-related operations including creation, data entry, viewing, searching, filtering, editing (Admin only), and deletion. It manages the complete lifecycle of travel accomplishment reports.

**Scope:**
- Report creation and data entry
- Report viewing and retrieval
- Search and filter functionality
- Report editing (Admin only)
- Report deletion (Admin only)
- Data validation
- Draft management

**Team Size:** Single team (3-4 developers)

**Dependencies:**
- Consumes: User Management (authentication, authorization), File Management (image references), Signature Workflow (signature status)
- Provides: Report data to Signature Workflow, Notification Service, Reporting & Analytics

---

## User Stories

### US-2.1: Create New Travel Accomplishment Report
**As a** User  
**I want to** create a new travel accomplishment report  
**So that** I can document branch visit activities

**Acceptance Criteria:**
- AC-2.1.1: User can access "Create New Report" button from dashboard
- AC-2.1.2: System creates new blank report with unique Report ID
- AC-2.1.3: System auto-populates creation date and creator name
- AC-2.1.4: System displays report form with all required sections
- AC-2.1.5: Report status is set to "Draft"
- AC-2.1.6: System allows saving as draft without completing all fields


### US-2.2: Enter Basic Report Information
**As a** User  
**I want to** enter basic travel information  
**So that** the report contains essential travel details

**Acceptance Criteria:**
- AC-2.2.1: System provides the following fields:
  - Branch/BLU/LC (required, text, max 200 characters)
  - Date of Travel (required, date picker, cannot be future date)
  - Time Started (required, time picker, HH:MM format)
  - Time Ended (required, time picker, HH:MM format, must be after Time Started)
  - Purpose of Travel (required, text area, max 500 characters)
- AC-2.2.2: System validates Time Ended is after Time Started
- AC-2.2.3: System displays error message for invalid time range
- AC-2.2.4: System marks required fields with asterisk (*)
- AC-2.2.5: System prevents submission if required fields are empty
- AC-2.2.6: System auto-saves draft every 2 minutes

### US-2.3: Enter Branch Network Equipment Information
**As a** User  
**I want to** enter network equipment details  
**So that** the report documents the branch's network infrastructure

**Acceptance Criteria:**
- AC-2.3.1: System provides fields for Telco 1:
  - Telco 1 Name (optional, text, max 100 characters)
  - Router Brand (optional, text, max 50 characters)
  - Modem Brand (optional, text, max 50 characters)
- AC-2.3.2: System provides fields for Telco 2:
  - Telco 2 Name (optional, text, max 100 characters)
  - Router Brand (optional, text, max 50 characters)
  - Modem Brand (optional, text, max 50 characters)
- AC-2.3.3: System provides fields for Switch 1:
  - Brand (optional, text, max 50 characters)
  - Model (optional, text, max 50 characters)
  - Ports (optional, numeric, max 999)
  - PN (Part Number) (optional, text, max 50 characters)
- AC-2.3.4: System provides fields for Switch 2:
  - Brand (optional, text, max 50 characters)
  - Model (optional, text, max 50 characters)
  - Ports (optional, numeric, max 999)
  - PN (Part Number) (optional, text, max 50 characters)
- AC-2.3.5: System provides field for SD-WAN Lights Status (optional, text, max 200 characters)
- AC-2.3.6: System validates numeric input for Ports field
- AC-2.3.7: System allows saving with empty optional fields


### US-2.4: Complete Activity Checklist
**As a** User  
**I want to** complete the activity checklist  
**So that** all required verification steps are documented

**Acceptance Criteria:**
- AC-2.4.1: System displays 7 checklist items with Yes/No radio buttons:
  1. Capture image of data rack before the activity
  2. Check physical connection of network equipment (UPS, power cords, outlets)
  3. Check all equipment working before activity (Modem, Router, Switch, SD-WAN)
  4. Specify the activity (Others/Re-grooming/cabling/Telco Related)
  5. Verify equipment working after activity (Modem, Router, Switch, SD-WAN)
  6. Are cables properly tagged/labeled?
  7. Capture image of data rack after the activity
- AC-2.4.2: Each checklist item has Comment/Remarks field (optional, text area, max 500 characters)
- AC-2.4.3: Item 4 provides checkboxes for activity type:
  - Others (with specify text field, max 200 characters)
  - Re-grooming/cabling
  - Telco Related
  - Multiple selections allowed
- AC-2.4.4: System allows saving checklist with incomplete items (draft mode)
- AC-2.4.5: System requires all checklist items to be answered before final submission
- AC-2.4.6: System displays progress indicator showing completed vs total items

### US-5.1: View Report List
**As a** User or Admin  
**I want to** view a list of all reports  
**So that** I can access and manage travel accomplishment reports

**Acceptance Criteria:**
- AC-5.1.1: System displays report list in table format
- AC-5.1.2: Table columns include:
  - Report ID
  - Branch/BLU/LC
  - Date of Travel
  - Created By
  - Status (Draft / Pending Signatures / Completed)
  - Last Updated
  - Actions (View / Edit / Delete)
- AC-5.1.3: User can see reports they created
- AC-5.1.4: User can see reports requiring their signature
- AC-5.1.5: Admin can see all reports in the system
- AC-5.1.6: System displays 20 reports per page with pagination
- AC-5.1.7: System sorts reports by Last Updated (newest first) by default
- AC-5.1.8: User can click on any column header to sort
- AC-5.1.9: System displays status with color coding:
  - Draft (gray)
  - Pending Signatures (yellow)
  - Completed (green)


### US-5.2: View Report Details
**As a** User or Admin  
**I want to** view complete report details  
**So that** I can review all information in the travel accomplishment report

**Acceptance Criteria:**
- AC-5.2.1: System displays all report sections:
  - Basic Information
  - Network Equipment Details
  - Activity Checklist
  - Uploaded Images
  - Signature Status
- AC-5.2.2: System displays report in read-only format for Users
- AC-5.2.3: System displays all timestamps (created, updated, signatures)
- AC-5.2.4: System shows audit trail of changes (who, when, what)
- AC-5.2.5: Images are displayed with captions and can be clicked to enlarge
- AC-5.2.6: System provides "Print" button to generate printable version
- AC-5.2.7: System provides "Export PDF" button to download report as PDF
- AC-5.2.8: System displays creator information and creation date

### US-5.3: Filter and Search Reports
**As a** User or Admin  
**I want to** filter and search reports  
**So that** I can quickly find specific travel accomplishment reports

**Acceptance Criteria:**
- AC-5.3.1: System provides filter options for:
  - Branch/BLU/LC (dropdown with autocomplete)
  - Date of Travel (date range picker)
  - Status (Draft / Pending Signatures / Completed)
  - Created By (dropdown of users)
  - Purpose of Travel (text search)
  - Report ID (exact match)
- AC-5.3.2: System provides search bar for keyword search across:
  - Branch/BLU/LC
  - Purpose of Travel
  - Comments/Remarks
  - Equipment details
- AC-5.3.3: Filters can be combined (AND logic)
- AC-5.3.4: System displays count of filtered results
- AC-5.3.5: System provides "Clear Filters" button
- AC-5.3.6: System maintains filter state during session
- AC-5.3.7: System displays "No results found" message when no reports match
- AC-5.3.8: Search results are highlighted in the report list
- AC-5.3.9: System provides "Advanced Search" option with additional filters:
  - Time range (Time Started / Time Ended)
  - Equipment brands
  - Activity type
  - Signatory names


### US-5.4: Admin Edit Report
**As an** Admin  
**I want to** edit any report at any stage  
**So that** I can correct errors or update information

**Acceptance Criteria:**
- AC-5.4.1: Admin can access "Edit" button on any report
- AC-5.4.2: System displays report in edit mode with all fields editable
- AC-5.4.3: Admin can modify:
  - All basic information fields
  - Network equipment details
  - Checklist items and comments
  - Images (add, delete, update captions)
- AC-5.4.4: Admin cannot modify:
  - Report ID
  - Creation date
  - Creator name
  - Existing signatures and timestamps
- AC-5.4.5: System validates all modified fields
- AC-5.4.6: System displays confirmation dialog before saving changes
- AC-5.4.7: System records edit in audit trail (who, when, what changed)
- AC-5.4.8: System updates "Last Updated" timestamp
- AC-5.4.9: System sends notification to report creator about changes
- AC-5.4.10: Report status remains unchanged after edit

### US-5.5: Admin Delete Report
**As an** Admin  
**I want to** delete reports  
**So that** I can remove incorrect or duplicate reports

**Acceptance Criteria:**
- AC-5.5.1: Admin can access "Delete" button on any report
- AC-5.5.2: System displays confirmation dialog: "Are you sure you want to delete this report? This action cannot be undone."
- AC-5.5.3: System displays report summary in confirmation dialog (ID, Branch, Date)
- AC-5.5.4: System requires Admin to type "DELETE" to confirm (case-sensitive)
- AC-5.5.5: Upon confirmation, report and all associated data are permanently deleted:
  - Report data
  - Uploaded images
  - Signatures
  - Notifications
  - Audit trail entries
- AC-5.5.6: System displays success message: "Report deleted successfully"
- AC-5.5.7: System sends notification to report creator about deletion
- AC-5.5.8: Deleted report is removed from all lists and searches
- AC-5.5.9: Report ID is not reused for new reports


### US-9.1: Enforce Required Fields
**As a** System  
**I want to** enforce required field validation  
**So that** reports contain all necessary information

**Acceptance Criteria:**
- AC-9.1.1: Required fields for report submission:
  - Branch/BLU/LC
  - Date of Travel
  - Time Started
  - Time Ended
  - Purpose of Travel
  - All 7 checklist items (Yes/No selection)
- AC-9.1.2: System prevents submission if any required field is empty
- AC-9.1.3: System displays list of missing required fields
- AC-9.1.4: System allows saving as draft with incomplete required fields
- AC-9.1.5: System marks required fields with red asterisk (*)
- AC-9.1.6: System displays field-level error messages
- AC-9.1.7: Optional fields can be left empty without validation errors

### US-9.3: Validate Date and Time Inputs
**As a** System  
**I want to** validate date and time inputs  
**So that** reports contain logical and accurate temporal data

**Acceptance Criteria:**
- AC-9.3.1: Date of Travel cannot be in the future
- AC-9.3.2: Date of Travel cannot be more than 1 year in the past
- AC-9.3.3: Time Started must be in HH:MM format (24-hour)
- AC-9.3.4: Time Ended must be in HH:MM format (24-hour)
- AC-9.3.5: Time Ended must be after Time Started
- AC-9.3.6: System displays error: "Time Ended must be after Time Started"
- AC-9.3.7: System displays error: "Date cannot be in the future"
- AC-9.3.8: System accepts same day travel (Time Started and Ended on same date)
- AC-9.3.9: System provides date picker for easy date selection
- AC-9.3.10: System provides time picker for easy time selection

### US-9.5: Prevent Duplicate Reports
**As a** System  
**I want to** detect potential duplicate reports  
**So that** the same travel visit is not documented multiple times

**Acceptance Criteria:**
- AC-9.5.1: System checks for potential duplicates based on:
  - Same Branch/BLU/LC
  - Same Date of Travel
  - Same creator
- AC-9.5.2: System displays warning: "A report for this branch and date already exists. Do you want to continue?"
- AC-9.5.3: System shows details of existing report(s)
- AC-9.5.4: User can choose to:
  - Continue creating new report
  - View existing report
  - Cancel
- AC-9.5.5: System allows creating duplicate if user confirms
- AC-9.5.6: System logs duplicate creation in audit trail
- AC-9.5.7: Admin can view reports flagged as potential duplicates

---

## Service Interfaces Exposed

### Report Service
- `createReport(userId, reportData)` - Creates new report
- `updateReport(reportId, reportData)` - Updates report (Admin only)
- `deleteReport(reportId)` - Deletes report (Admin only)
- `getReport(reportId)` - Retrieves report details
- `listReports(userId, filters, pagination)` - Lists reports with filters
- `searchReports(searchCriteria)` - Searches reports
- `saveDraft(reportId, reportData)` - Saves report as draft
- `submitReport(reportId)` - Submits report for signatures
- `getReportStatus(reportId)` - Returns report status
- `checkDuplicates(branchName, travelDate, userId)` - Checks for duplicates

### Report Validation Service
- `validateRequiredFields(reportData)` - Validates required fields
- `validateDateTimeFields(reportData)` - Validates date/time logic
- `validateChecklistCompletion(reportData)` - Validates checklist

---

## Data Model

### Report Entity
- reportId (UUID, primary key)
- createdBy (UUID, foreign key to User)
- branchName (string)
- dateOfTravel (date)
- timeStarted (time)
- timeEnded (time)
- purposeOfTravel (text)
- status (enum: Draft, PendingSignatures, Completed)
- createdAt (timestamp)
- updatedAt (timestamp)
- lastModifiedBy (UUID, foreign key to User)

### NetworkEquipment Entity
- equipmentId (UUID, primary key)
- reportId (UUID, foreign key)
- telco1Name, telco1RouterBrand, telco1ModemBrand (strings)
- telco2Name, telco2RouterBrand, telco2ModemBrand (strings)
- switch1Brand, switch1Model, switch1Ports, switch1PN (strings/numeric)
- switch2Brand, switch2Model, switch2Ports, switch2PN (strings/numeric)
- sdWanLightsStatus (string)

### Checklist Entity
- checklistId (UUID, primary key)
- reportId (UUID, foreign key)
- item1_captureImageBefore (boolean)
- item1_comment (text)
- item2_checkPhysicalConnection (boolean)
- item2_comment (text)
- item3_checkEquipmentBefore (boolean)
- item3_comment (text)
- item4_activityType (array: Others, ReGrooming, TelcoRelated)
- item4_otherSpecify (string)
- item4_comment (text)
- item5_verifyEquipmentAfter (boolean)
- item5_comment (text)
- item6_cablesTagged (boolean)
- item6_comment (text)
- item7_captureImageAfter (boolean)
- item7_comment (text)

---

## Business Rules

1. Only authenticated users can create reports
2. Users can only edit their own draft reports
3. Admin can edit any report at any stage
4. Reports must have all required fields completed before submission
5. Date of Travel cannot be in the future or more than 1 year in the past
6. Time Ended must be after Time Started
7. All 7 checklist items must be answered before submission
8. System warns about potential duplicates but allows creation
9. Report status changes to "Pending Signatures" upon submission
10. Deleted reports cannot be recovered

---

## Unit Boundaries

**Responsibilities:**
- Report CRUD operations
- Data validation
- Search and filter functionality
- Draft management
- Duplicate detection

**Not Responsible For:**
- File storage (delegates to File Management)
- Signature processing (delegates to Signature Workflow)
- Sending notifications (delegates to Notification Service)
- User authentication (delegates to User Management)

---

**Total User Stories in Unit:** 12
