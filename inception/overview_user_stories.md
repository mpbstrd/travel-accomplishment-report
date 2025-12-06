# Travel Accomplishment Report Repository System
## User Stories and Acceptance Criteria

---

## Document Information
- **Project:** Travel Accomplishment Report Repository System
- **Department:** Network Infrastructure Services Department (NISD)
- **Organization:** Development Bank of the Philippines
- **Version:** 1.0
- **Date:** December 5, 2025

---

## User Roles

### Admin (NISD Personnel)
- Full system access
- Can create, edit, and delete user accounts
- Can edit any report at any stage
- Can view all reports
- Can manage system settings

### User (NISD Personnel)
- Can create new travel accomplishment reports
- Can input data into reports
- Can view their own reports
- Can add signatures to reports (based on role assignment)
- Cannot edit reports after submission

---

## Epic 1: User Account Management

### US-1.1: Admin Account Creation
**As an** Admin  
**I want to** create new user accounts  
**So that** NISD personnel can access the system

**Acceptance Criteria:**
- AC-1.1.1: Admin can access account creation interface
- AC-1.1.2: System requires the following fields for account creation:
  - Full Name (required, text, max 100 characters)
  - Email Address (required, valid email format)
  - Username (required, unique, alphanumeric, 5-20 characters)
  - Password (required, minimum 8 characters, must contain uppercase, lowercase, number)
  - Role (required, dropdown: Admin or User)
- AC-1.1.3: System validates all required fields before account creation
- AC-1.1.4: System displays error message if username already exists
- AC-1.1.5: System displays error message if email already exists
- AC-1.1.6: System sends confirmation message upon successful account creation
- AC-1.1.7: New account is immediately active and accessible

### US-1.2: Admin Account Editing
**As an** Admin  
**I want to** edit existing user accounts  
**So that** I can update user information and roles

**Acceptance Criteria:**
- AC-1.2.1: Admin can search and select any user account
- AC-1.2.2: Admin can modify: Full Name, Email, Role
- AC-1.2.3: Admin cannot modify: Username (system constraint)
- AC-1.2.4: System validates all modified fields
- AC-1.2.5: System displays confirmation message upon successful update
- AC-1.2.6: Changes take effect immediately

### US-1.3: Admin Account Deletion
**As an** Admin  
**I want to** delete user accounts  
**So that** I can remove access for personnel who no longer need it

**Acceptance Criteria:**
- AC-1.3.1: Admin can select any user account for deletion
- AC-1.3.2: System displays confirmation dialog: "Are you sure you want to delete this account? This action cannot be undone."
- AC-1.3.3: System prevents deletion if user has pending reports requiring their signature
- AC-1.3.4: System displays warning if user has associated reports
- AC-1.3.5: Upon confirmation, account is permanently deleted
- AC-1.3.6: Deleted user cannot log in to the system
- AC-1.3.7: Reports created by deleted user remain in system with user name preserved

### US-1.4: User Login
**As a** User or Admin  
**I want to** log in to the system  
**So that** I can access the travel accomplishment report repository

**Acceptance Criteria:**
- AC-1.4.1: System displays login page with Username and Password fields
- AC-1.4.2: System validates credentials against stored accounts
- AC-1.4.3: System displays error message "Invalid username or password" for incorrect credentials
- AC-1.4.4: System redirects to dashboard upon successful login
- AC-1.4.5: System creates user session with appropriate role permissions
- AC-1.4.6: System logs login timestamp for audit purposes

---

## Epic 2: Report Creation and Data Entry

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

### US-2.5: Upload Images to Report
**As a** User  
**I want to** upload images to the report  
**So that** I can provide visual documentation of the branch visit

**Acceptance Criteria:**
- AC-2.5.1: System provides image upload interface
- AC-2.5.2: System accepts the following file formats: JPG, JPEG, PNG, PDF
- AC-2.5.3: System enforces maximum file size of 15MB per file
- AC-2.5.4: System allows maximum of 10 images per report
- AC-2.5.5: System displays error message "File size exceeds 15MB limit" for oversized files
- AC-2.5.6: System displays error message "Maximum 10 images allowed per report" when limit reached
- AC-2.5.7: System displays error message "Unsupported file format" for invalid file types
- AC-2.5.8: System shows thumbnail preview of uploaded images
- AC-2.5.9: User can delete uploaded images before submission
- AC-2.5.10: System displays upload progress indicator
- AC-2.5.11: System labels images with upload timestamp
- AC-2.5.12: User can add caption/description to each image (optional, max 200 characters)
- AC-2.5.13: System stores images securely with report association

---

## Epic 3: Sequential Signature Workflow

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

---

## Epic 4: Notification System

### US-4.1: Receive Signature Request Notification
**As a** User  
**I want to** receive notifications when my signature is required  
**So that** I can promptly review and sign reports

**Acceptance Criteria:**
- AC-4.1.1: System sends notification when user's signature is required
- AC-4.1.2: Notification includes:
  - Report ID
  - Branch/BLU/LC name
  - Date of travel
  - Link to report
  - Signature type required
- AC-4.1.3: System displays notification in user's dashboard
- AC-4.1.4: System sends email notification (if email configured)
- AC-4.1.5: Notification remains visible until signature is completed
- AC-4.1.6: System displays notification count badge on dashboard

### US-4.2: Receive Report Status Update Notifications
**As a** User  
**I want to** receive notifications about report status changes  
**So that** I stay informed about reports I created or signed

**Acceptance Criteria:**
- AC-4.2.1: Report creator receives notification when:
  - Report is submitted for signatures
  - Each signature is completed
  - Report is finalized
- AC-4.2.2: Each signatory receives notification when:
  - Their signature is recorded
  - Subsequent signatures are completed
  - Report is finalized
- AC-4.2.3: Notification includes report ID and new status
- AC-4.2.4: System maintains notification history
- AC-4.2.5: User can mark notifications as read
- AC-4.2.6: System displays unread notification count

### US-4.3: Send Reminder Notifications
**As a** User  
**I want to** receive reminder notifications for pending signatures  
**So that** reports are not delayed due to forgotten signatures

**Acceptance Criteria:**
- AC-4.3.1: System sends first reminder 24 hours after signature request
- AC-4.3.2: System sends second reminder 48 hours after signature request
- AC-4.3.3: System sends final reminder 72 hours after signature request
- AC-4.3.4: Reminder includes:
  - Report ID
  - Days pending
  - Link to report
  - Urgency indicator
- AC-4.3.5: Reminders stop once signature is completed
- AC-4.3.6: Admin can configure reminder intervals (optional)

---

## Epic 5: Report Viewing and Management

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

### US-5.6: Export Report to PDF
**As a** User or Admin  
**I want to** export a report to PDF  
**So that** I can share or archive the report offline

**Acceptance Criteria:**
- AC-5.6.1: System provides "Export PDF" button on report view
- AC-5.6.2: System generates PDF with:
  - DBP header and NISD department name
  - All report sections formatted clearly
  - All images embedded
  - All signatures with timestamps
  - Report status and metadata
  - Page numbers
  - Generation date and time
- AC-5.6.3: PDF filename format: "TAR_[ReportID]_[Branch]_[Date].pdf"
- AC-5.6.4: System displays download progress indicator
- AC-5.6.5: PDF is downloaded to user's default download location
- AC-5.6.6: System logs PDF export in audit trail
- AC-5.6.7: PDF is formatted for A4 paper size
- AC-5.6.8: PDF includes disclaimer text for signatures

### US-5.7: Print Report
**As a** User or Admin  
**I want to** print a report  
**So that** I can have a physical copy for records

**Acceptance Criteria:**
- AC-5.7.1: System provides "Print" button on report view
- AC-5.7.2: System opens browser print dialog
- AC-5.7.3: Print layout includes:
  - DBP header and NISD department name
  - All report sections
  - All images (scaled appropriately)
  - All signatures with timestamps
  - Page breaks at logical sections
- AC-5.7.4: Print layout is optimized for A4 paper
- AC-5.7.5: System hides navigation and UI elements in print view
- AC-5.7.6: System provides print preview
- AC-5.7.7: User can select printer and print settings
- AC-5.7.8: System logs print action in audit trail

---

## Epic 6: Dashboard and Reporting

### US-6.1: View User Dashboard
**As a** User  
**I want to** view my dashboard  
**So that** I can see my reports and pending actions

**Acceptance Criteria:**
- AC-6.1.1: Dashboard displays:
  - Welcome message with user name
  - Pending signature requests (count and list)
  - My recent reports (last 5)
  - My draft reports (count and list)
  - Quick action buttons (Create New Report, View All Reports)
- AC-6.1.2: Pending signature section shows:
  - Report ID
  - Branch name
  - Days pending
  - Quick sign button
- AC-6.1.3: Recent reports section shows:
  - Report ID
  - Branch name
  - Date of travel
  - Status
  - Quick view button
- AC-6.1.4: Dashboard displays notification count badge
- AC-6.1.5: Dashboard auto-refreshes every 5 minutes
- AC-6.1.6: User can manually refresh dashboard

### US-6.2: View Admin Dashboard
**As an** Admin  
**I want to** view the admin dashboard  
**So that** I can monitor system activity and manage the repository

**Acceptance Criteria:**
- AC-6.2.1: Admin dashboard displays:
  - Total reports count
  - Reports by status (Draft / Pending / Completed) with counts
  - Recent activity feed (last 20 actions)
  - Pending signatures overview (all users)
  - System statistics
  - Quick action buttons (Create Report, Manage Users, View All Reports)
- AC-6.2.2: System statistics include:
  - Total users (Admin / User breakdown)
  - Reports created this month
  - Average signature completion time
  - Most active branches
- AC-6.2.3: Recent activity feed shows:
  - Action type (Created, Signed, Edited, Deleted)
  - User who performed action
  - Report ID
  - Timestamp
  - Quick link to report
- AC-6.2.4: Pending signatures overview shows:
  - User name
  - Number of pending signatures
  - Oldest pending report
  - Quick link to user's pending list
- AC-6.2.5: Dashboard displays charts/graphs for:
  - Reports per month (last 6 months)
  - Reports by status (pie chart)
  - Top 10 branches by report count
- AC-6.2.6: Dashboard auto-refreshes every 5 minutes
- AC-6.2.7: Admin can manually refresh dashboard
- AC-6.2.8: Admin can export dashboard data to Excel

### US-6.3: Generate Reports and Analytics
**As an** Admin  
**I want to** generate reports and analytics  
**So that** I can analyze travel accomplishment data

**Acceptance Criteria:**
- AC-6.3.1: System provides "Reports & Analytics" section
- AC-6.3.2: Admin can generate reports for:
  - All reports within date range
  - Reports by branch
  - Reports by status
  - Reports by user
  - Signature completion times
  - Equipment inventory (aggregated from all reports)
- AC-6.3.3: System displays analytics in table and chart formats
- AC-6.3.4: Admin can export analytics to:
  - Excel (.xlsx)
  - CSV (.csv)
  - PDF (.pdf)
- AC-6.3.5: System provides date range selector
- AC-6.3.6: System displays summary statistics for selected data
- AC-6.3.7: Charts are interactive (click to drill down)
- AC-6.3.8: System logs report generation in audit trail

---

## Epic 7: System Administration and Security

### US-7.1: Audit Trail Logging
**As an** Admin  
**I want to** view audit trail logs  
**So that** I can track all system activities for security and compliance

**Acceptance Criteria:**
- AC-7.1.1: System logs all user actions:
  - Login / Logout
  - Report creation
  - Report editing
  - Report deletion
  - Signature submission
  - Account creation / modification / deletion
  - File uploads
  - Report exports
- AC-7.1.2: Each log entry includes:
  - Timestamp (YYYY-MM-DD HH:MM:SS)
  - User ID and name
  - Action type
  - Target (Report ID, User ID, etc.)
  - IP address
  - Details of changes (before/after for edits)
- AC-7.1.3: Admin can view audit trail in chronological order
- AC-7.1.4: Admin can filter audit trail by:
  - Date range
  - User
  - Action type
  - Target report
- AC-7.1.5: Admin can export audit trail to CSV
- AC-7.1.6: Audit trail entries cannot be modified or deleted
- AC-7.1.7: System retains audit trail for minimum 5 years
- AC-7.1.8: System displays audit trail with pagination (50 entries per page)

### US-7.2: Password Management
**As a** User or Admin  
**I want to** change my password  
**So that** I can maintain account security

**Acceptance Criteria:**
- AC-7.2.1: User can access "Change Password" from profile menu
- AC-7.2.2: System requires:
  - Current password
  - New password
  - Confirm new password
- AC-7.2.3: System validates:
  - Current password is correct
  - New password meets requirements (min 8 chars, uppercase, lowercase, number)
  - New password matches confirmation
  - New password is different from current password
- AC-7.2.4: System displays password strength indicator
- AC-7.2.5: System displays error messages for validation failures
- AC-7.2.6: Upon successful change, system:
  - Updates password
  - Logs out user from all sessions
  - Requires re-login
  - Sends confirmation email
  - Logs password change in audit trail
- AC-7.2.7: Admin can reset user passwords
- AC-7.2.8: Password reset generates temporary password sent to user's email

### US-7.3: Session Management
**As a** User or Admin  
**I want to** have secure session management  
**So that** my account remains protected

**Acceptance Criteria:**
- AC-7.3.1: System creates session upon successful login
- AC-7.3.2: Session expires after 30 minutes of inactivity
- AC-7.3.3: System displays warning 5 minutes before session expiry
- AC-7.3.4: User can extend session by clicking "Stay Logged In"
- AC-7.3.5: System logs out user automatically after session expiry
- AC-7.3.6: System redirects to login page after logout
- AC-7.3.7: User can manually logout using "Logout" button
- AC-7.3.8: System clears all session data upon logout
- AC-7.3.9: System prevents concurrent sessions from same account (optional)
- AC-7.3.10: System logs all session activities in audit trail

### US-7.4: Data Backup and Recovery
**As an** Admin  
**I want to** ensure data is backed up regularly  
**So that** data can be recovered in case of system failure

**Acceptance Criteria:**
- AC-7.4.1: System performs automatic daily backups
- AC-7.4.2: Backup includes:
  - All report data
  - All user accounts
  - All uploaded images
  - All audit trail logs
- AC-7.4.3: System retains backups for minimum 90 days
- AC-7.4.4: Admin can manually trigger backup
- AC-7.4.5: System displays last backup timestamp on admin dashboard
- AC-7.4.6: System sends notification if backup fails
- AC-7.4.7: Admin can download backup files
- AC-7.4.8: System provides restore functionality (with confirmation)
- AC-7.4.9: Backup files are encrypted
- AC-7.4.10: System logs all backup and restore operations

---

## Epic 8: User Experience and Accessibility

### US-8.1: Responsive Design
**As a** User or Admin  
**I want to** access the system from different devices  
**So that** I can work from desktop, tablet, or mobile

**Acceptance Criteria:**
- AC-8.1.1: System is responsive and adapts to screen sizes:
  - Desktop (1920x1080 and above)
  - Laptop (1366x768 and above)
  - Tablet (768x1024)
  - Mobile (375x667 and above)
- AC-8.1.2: All features are accessible on all device types
- AC-8.1.3: Forms are easy to fill on mobile devices
- AC-8.1.4: Images are properly scaled on all devices
- AC-8.1.5: Navigation is touch-friendly on mobile/tablet
- AC-8.1.6: System detects device type and optimizes layout
- AC-8.1.7: File upload works on all devices
- AC-8.1.8: System supports both portrait and landscape orientations

### US-8.2: User-Friendly Interface
**As a** User  
**I want to** have an intuitive and easy-to-use interface  
**So that** I can complete tasks efficiently

**Acceptance Criteria:**
- AC-8.2.1: System uses clear, consistent navigation
- AC-8.2.2: All buttons and links have descriptive labels
- AC-8.2.3: System provides helpful tooltips for complex fields
- AC-8.2.4: Forms are organized logically with clear sections
- AC-8.2.5: System uses consistent color scheme and branding
- AC-8.2.6: Error messages are clear and actionable
- AC-8.2.7: Success messages are visible and confirmatory
- AC-8.2.8: System provides breadcrumb navigation
- AC-8.2.9: Loading states are indicated with spinners/progress bars
- AC-8.2.10: System uses icons to enhance understanding
- AC-8.2.11: Required fields are clearly marked with asterisk (*)
- AC-8.2.12: System provides "Help" or "?" icons for guidance

### US-8.3: Form Validation and Error Handling
**As a** User  
**I want to** receive clear validation feedback  
**So that** I can correct errors and complete forms successfully

**Acceptance Criteria:**
- AC-8.3.1: System validates fields in real-time (on blur)
- AC-8.3.2: System displays inline error messages below fields
- AC-8.3.3: Error messages are specific and helpful:
  - "This field is required"
  - "Please enter a valid email address"
  - "Time Ended must be after Time Started"
  - "File size must not exceed 15MB"
- AC-8.3.4: System highlights invalid fields with red border
- AC-8.3.5: System prevents form submission if validation fails
- AC-8.3.6: System displays summary of all errors at top of form
- AC-8.3.7: System scrolls to first error field
- AC-8.3.8: System removes error message when field is corrected
- AC-8.3.9: System provides format examples for complex fields
- AC-8.3.10: System handles server errors gracefully with user-friendly messages

### US-8.4: Auto-Save Functionality
**As a** User  
**I want to** have my work automatically saved  
**So that** I don't lose data if I navigate away or experience connection issues

**Acceptance Criteria:**
- AC-8.4.1: System auto-saves draft reports every 2 minutes
- AC-8.4.2: System displays "Saving..." indicator during save
- AC-8.4.3: System displays "All changes saved" confirmation after save
- AC-8.4.4: System displays "Save failed" error if save unsuccessful
- AC-8.4.5: User can manually save using "Save Draft" button
- AC-8.4.6: System saves before user navigates away (with confirmation)
- AC-8.4.7: System recovers unsaved changes after unexpected disconnect
- AC-8.4.8: System displays last saved timestamp
- AC-8.4.9: Auto-save does not interfere with user typing
- AC-8.4.10: System queues saves if multiple changes occur rapidly

---

## Epic 9: Data Validation and Business Rules

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

### US-9.4: Validate File Uploads
**As a** System  
**I want to** validate file uploads  
**So that** only appropriate files are stored in the system

**Acceptance Criteria:**
- AC-9.4.1: System accepts only: JPG, JPEG, PNG, PDF file formats
- AC-9.4.2: System rejects files larger than 15MB
- AC-9.4.3: System limits uploads to maximum 10 files per report
- AC-9.4.4: System displays error: "File size exceeds 15MB limit. Please upload a smaller file."
- AC-9.4.5: System displays error: "Unsupported file format. Please upload JPG, JPEG, PNG, or PDF files only."
- AC-9.4.6: System displays error: "Maximum 10 images allowed per report. Please delete an existing image to upload a new one."
- AC-9.4.7: System scans uploaded files for malware/viruses
- AC-9.4.8: System rejects files that fail security scan
- AC-9.4.9: System validates file integrity (not corrupted)
- AC-9.4.10: System generates unique filename for each uploaded file
- AC-9.4.11: System stores original filename for user reference

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

## Epic 10: Performance and Scalability

### US-10.1: Fast Page Load Times
**As a** User or Admin  
**I want to** experience fast page load times  
**So that** I can work efficiently without delays

**Acceptance Criteria:**
- AC-10.1.1: Dashboard loads within 2 seconds
- AC-10.1.2: Report list page loads within 3 seconds
- AC-10.1.3: Report detail page loads within 3 seconds
- AC-10.1.4: Report creation form loads within 2 seconds
- AC-10.1.5: Search results display within 2 seconds
- AC-10.1.6: System uses loading indicators for operations taking >1 second
- AC-10.1.7: System implements lazy loading for images
- AC-10.1.8: System caches frequently accessed data
- AC-10.1.9: System optimizes database queries
- AC-10.1.10: System compresses images for faster loading

### US-10.2: Handle Large Data Volumes
**As a** System  
**I want to** handle large volumes of reports and data  
**So that** performance remains consistent as usage grows

**Acceptance Criteria:**
- AC-10.2.1: System supports minimum 10,000 reports
- AC-10.2.2: System supports minimum 100 concurrent users
- AC-10.2.3: System maintains performance with 100,000+ uploaded images
- AC-10.2.4: Database queries remain fast with large datasets
- AC-10.2.5: System implements pagination for large result sets
- AC-10.2.6: System implements database indexing on key fields
- AC-10.2.7: System archives old reports (>5 years) to separate storage
- AC-10.2.8: System provides archive access for Admin
- AC-10.2.9: System monitors performance metrics
- AC-10.2.10: System alerts Admin if performance degrades

### US-10.3: Reliable File Storage
**As a** System  
**I want to** store uploaded files reliably  
**So that** images are never lost and always accessible

**Acceptance Criteria:**
- AC-10.3.1: System stores files in redundant storage
- AC-10.3.2: System generates unique identifiers for each file
- AC-10.3.3: System maintains file-to-report associations
- AC-10.3.4: System prevents file corruption
- AC-10.3.5: System includes files in backup process
- AC-10.3.6: System provides file recovery mechanism
- AC-10.3.7: System optimizes storage with image compression (without quality loss)
- AC-10.3.8: System monitors storage capacity
- AC-10.3.9: System alerts Admin when storage reaches 80% capacity
- AC-10.3.10: System prevents uploads when storage is full

---

## Summary

This document contains **60 user stories** organized into **10 epics**:

1. **User Account Management** (4 stories) - Account creation, editing, deletion, and login
2. **Report Creation and Data Entry** (5 stories) - Creating reports and entering all required information
3. **Sequential Signature Workflow** (5 stories) - Three-step signature process with timestamps
4. **Notification System** (3 stories) - Signature requests, status updates, and reminders
5. **Report Viewing and Management** (7 stories) - Viewing, filtering, editing, deleting, and exporting reports
6. **Dashboard and Reporting** (3 stories) - User and admin dashboards with analytics
7. **System Administration and Security** (4 stories) - Audit trails, password management, sessions, and backups
8. **User Experience and Accessibility** (4 stories) - Responsive design, UI/UX, validation, and auto-save
9. **Data Validation and Business Rules** (5 stories) - Field validation, workflow enforcement, and duplicate prevention
10. **Performance and Scalability** (3 stories) - Fast loading, large data handling, and reliable storage

Each user story includes comprehensive acceptance criteria that serve as the development contract for the system.

---

## Glossary

- **TAR**: Travel Accomplishment Report
- **NISD**: Network Infrastructure Services Department
- **DBP**: Development Bank of the Philippines
- **BLU**: Business Lending Unit
- **LC**: Lending Center
- **SD-WAN**: Software-Defined Wide Area Network
- **UPS**: Uninterruptible Power Supply
- **Admin**: Administrator role with full system access
- **User**: Standard user role with limited permissions

---

**Document End**
