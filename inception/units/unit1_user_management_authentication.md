# Unit 1: User Management & Authentication

## Unit Overview

**Business Capability:** Manage user accounts, authentication, and authorization

**Purpose:** This unit handles all user-related operations including account creation, modification, deletion, login/logout, password management, and session management. It provides authentication and authorization services to all other units in the system.

**Scope:** 
- User account lifecycle management (CRUD operations)
- Authentication (login/logout)
- Authorization (role-based access control)
- Password management
- Session management

**Team Size:** Single team (2-3 developers)

**Dependencies:**
- Consumes: None (foundational unit)
- Provides: Authentication and authorization services to all other units

---

## User Stories

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

---

## Service Interfaces Exposed

### Authentication Service
- `authenticateUser(username, password)` - Validates credentials and creates session
- `validateSession(sessionToken)` - Verifies active session
- `logout(sessionToken)` - Terminates user session
- `getUserRole(userId)` - Returns user's role (Admin/User)
- `getUserPermissions(userId)` - Returns user's permissions

### User Management Service
- `createUser(userData)` - Creates new user account
- `updateUser(userId, userData)` - Updates user information
- `deleteUser(userId)` - Deletes user account
- `getUser(userId)` - Retrieves user details
- `listUsers(filters)` - Lists users with optional filters
- `checkUserExists(username, email)` - Validates uniqueness

### Password Service
- `changePassword(userId, currentPassword, newPassword)` - Changes user password
- `resetPassword(userId)` - Generates temporary password
- `validatePasswordStrength(password)` - Validates password requirements

---

## Data Model

### User Entity
- userId (UUID, primary key)
- username (string, unique)
- email (string, unique)
- fullName (string)
- passwordHash (string)
- role (enum: Admin, User)
- createdAt (timestamp)
- updatedAt (timestamp)
- lastLoginAt (timestamp)
- isActive (boolean)

### Session Entity
- sessionId (UUID, primary key)
- userId (UUID, foreign key)
- sessionToken (string, unique)
- createdAt (timestamp)
- expiresAt (timestamp)
- ipAddress (string)
- userAgent (string)

---

## Business Rules

1. Only Admin users can create, edit, or delete accounts
2. Username cannot be changed after account creation
3. Passwords must meet complexity requirements
4. Sessions expire after 30 minutes of inactivity
5. Users cannot be deleted if they have pending signature requests
6. All authentication events must be logged for audit
7. Only NISD personnel can have accounts (organizational constraint)

---

## Unit Boundaries

**Responsibilities:**
- User account management
- Authentication and authorization
- Session management
- Password management

**Not Responsible For:**
- Report data management
- File storage
- Notifications
- Business logic for reports or signatures

---

**Total User Stories in Unit:** 6
