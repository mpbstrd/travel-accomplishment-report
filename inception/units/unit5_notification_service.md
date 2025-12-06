# Unit 5: Notification Service

## Unit Overview

**Business Capability:** Send and manage notifications and reminders

**Purpose:** This unit provides cross-cutting notification functionality to alert users about signature requests, status updates, and send reminders for pending actions. It ensures timely communication across the system.

**Scope:**
- Notification creation and delivery
- Reminder scheduling and sending
- Notification history and tracking
- Email notifications (if configured)
- In-app notifications

**Team Size:** Single team (2 developers)

**Dependencies:**
- Consumes: User Management (user contact info), Report Management (report data), Signature Workflow (workflow events)
- Provides: Notification services to all other units

---

## User Stories

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

## Service Interfaces Exposed

### Notification Service
- `sendNotification(userId, notificationType, notificationData)` - Sends notification
- `sendSignatureRequest(userId, reportId, signatureType)` - Sends signature request
- `sendStatusUpdate(userIds, reportId, newStatus)` - Sends status update
- `scheduleReminder(userId, reportId, reminderType, scheduleTime)` - Schedules reminder
- `cancelReminders(reportId, signatureType)` - Cancels pending reminders
- `getNotifications(userId, filters)` - Retrieves user notifications
- `markNotificationRead(notificationId)` - Marks notification as read
- `getUnreadCount(userId)` - Returns unread notification count

### Email Service
- `sendEmail(recipientEmail, subject, body, templateData)` - Sends email
- `sendBulkEmail(recipients, subject, body, templateData)` - Sends bulk email

---

## Data Model

### Notification Entity
- notificationId (UUID, primary key)
- userId (UUID, foreign key)
- reportId (UUID, foreign key, nullable)
- notificationType (enum: SignatureRequest, StatusUpdate, Reminder, SystemAlert)
- title (string)
- message (text)
- link (string, URL to relevant page)
- isRead (boolean)
- createdAt (timestamp)
- readAt (timestamp, nullable)

### ReminderSchedule Entity
- reminderId (UUID, primary key)
- reportId (UUID, foreign key)
- userId (UUID, foreign key)
- signatureType (enum)
- reminderNumber (integer: 1, 2, 3)
- scheduledFor (timestamp)
- sentAt (timestamp, nullable)
- status (enum: Pending, Sent, Cancelled)

---

## Business Rules

1. Notifications are sent immediately for signature requests and status updates
2. Reminders are scheduled at 24, 48, and 72 hours after signature request
3. Reminders are cancelled when signature is completed
4. Email notifications are sent only if user has email configured
5. Notification history is retained for 90 days
6. Unread notifications are highlighted in dashboard
7. System notifications cannot be deleted by users
8. Admin receives notifications for system alerts (storage, errors)

---

## Unit Boundaries

**Responsibilities:**
- Notification creation and delivery
- Reminder scheduling and management
- Notification history tracking
- Email delivery

**Not Responsible For:**
- Determining when to send notifications (triggered by other units)
- User contact information management (delegates to User Management)
- Report data (delegates to Report Management)

---

**Total User Stories in Unit:** 3
