# Local Testing Environment Setup Plan
## Unit 1: User Management & Authentication

**Date:** December 5, 2025  
**Status:** Awaiting Approval

---

## Overview

This plan outlines the creation of a comprehensive local testing environment for Unit 1 (User Management & Authentication). The environment will include unit tests, API testing capabilities, a simple web UI for manual testing, SQLite database configuration, and mock implementations for external dependencies.

**Important Note:** The logical design specifies Node.js/TypeScript/Express.js stack, but the source directory structure is currently empty. This plan will implement the testing environment based on the Node.js stack as specified in the design documents.

---

## Prerequisites Check

- [ ] **CLARIFICATION NEEDED:** Confirm the technology stack:
  - Logical design specifies: Node.js + TypeScript + Express.js + TypeORM + PostgreSQL
  - Should we proceed with Node.js stack or switch to Java/Spring Boot?
  - **Please confirm before proceeding**

---

## Phase 1: Project Setup & Configuration

### Step 1.1: Initialize Node.js Project
- [ ] Create package.json with dependencies
- [ ] Install core dependencies (Express, TypeORM, TypeScript)
- [ ] Install testing dependencies (Jest, Supertest, ts-jest)
- [ ] Install development dependencies (nodemon, ts-node)
- [ ] Configure TypeScript (tsconfig.json)
- [ ] Create .env.example file

**Dependencies to install:**
```
Core: express, typeorm, reflect-metadata, class-validator, class-transformer, bcrypt, uuid
Testing: jest, ts-jest, @types/jest, supertest, @types/supertest, sqlite3
Dev: typescript, ts-node, nodemon, @types/node, @types/express, @types/bcrypt
```

### Step 1.2: Configure SQLite Database
- [ ] Create database configuration for SQLite
- [ ] Set up TypeORM configuration for SQLite
- [ ] Create database initialization script
- [ ] Add sample test data seed script
- [ ] Document SQLite-specific configurations and limitations
- [ ] Create schema creation scripts in src/main/resources/ (or equivalent)

**Files to create:**
- `src/config/database.config.ts`
- `src/database/dataSource.ts`
- `src/database/seeds/testData.seed.ts`
- `DATABASE_SETUP.md` (documentation)

### Step 1.3: Configure Jest Testing Framework
- [ ] Create jest.config.js
- [ ] Set up test environment configuration
- [ ] Create test setup file (tests/setup.ts)
- [ ] Configure coverage thresholds
- [ ] Create test helper utilities
- [ ] Set up test database helper

**Files to create:**
- `jest.config.js`
- `tests/setup.ts`
- `tests/helpers/testDatabase.ts`
- `tests/helpers/testUtils.ts`
- `tests/fixtures/users.fixture.ts`

---

## Phase 2: Core Implementation

### Step 2.1: Implement Entity Models
- [ ] Create User entity (src/entities/User.entity.ts)
- [ ] Create Session entity (src/entities/Session.entity.ts)
- [ ] Create AuditLog entity (src/entities/AuditLog.entity.ts)
- [ ] Add entity relationships and constraints
- [ ] Create entity indexes

**Reference:** Section 6 of logical_design.md

### Step 2.2: Implement DTOs (Data Transfer Objects)
- [ ] Create request DTOs (CreateUserDto, UpdateUserDto, LoginDto, ChangePasswordDto)
- [ ] Create response DTOs (UserResponseDto, AuthResponseDto, SessionResponseDto)
- [ ] Add validation decorators
- [ ] Create DTO mapper utilities

**Files to create:**
- `src/dtos/request/*.ts`
- `src/dtos/response/*.ts`
- `src/utils/dtoMapper.ts`

### Step 2.3: Implement Repositories
- [ ] Create UserRepository with all methods
- [ ] Create SessionRepository with all methods
- [ ] Create AuditLogRepository with all methods
- [ ] Implement custom query methods
- [ ] Add repository error handling

**Reference:** Section 7 of logical_design.md

### Step 2.4: Implement Services
- [ ] Create UserAccountService
- [ ] Create AuthenticationService
- [ ] Create SessionService
- [ ] Create PasswordService
- [ ] Implement all business logic methods
- [ ] Add service-level validations
- [ ] Implement audit logging

**Reference:** Section 5 of logical_design.md

### Step 2.5: Implement Utilities
- [ ] Create PasswordUtils (hash, verify, validate strength)
- [ ] Create TokenUtils (generate session tokens)
- [ ] Create ValidationUtils
- [ ] Create DateUtils (for session expiry)

**Files to create:**
- `src/utils/passwordUtils.ts`
- `src/utils/tokenUtils.ts`
- `src/utils/validationUtils.ts`
- `src/utils/dateUtils.ts`

### Step 2.6: Implement Error Handling
- [ ] Create custom error classes
- [ ] Create error middleware
- [ ] Implement error response formatting
- [ ] Add error logging

**Files to create:**
- `src/errors/AppError.ts`
- `src/errors/AuthenticationError.ts`
- `src/errors/ValidationError.ts`
- `src/middleware/errorHandler.ts`

### Step 2.7: Implement Middleware
- [ ] Create authentication middleware (authMiddleware)
- [ ] Create authorization middleware (adminOnly)
- [ ] Create request validation middleware
- [ ] Create logging middleware

**Files to create:**
- `src/middleware/authMiddleware.ts`
- `src/middleware/adminOnly.ts`
- `src/middleware/validateRequest.ts`
- `src/middleware/logger.ts`

### Step 2.8: Implement Controllers
- [ ] Create AuthController (login, logout, validate, extend session)
- [ ] Create UserController (CRUD operations)
- [ ] Create SessionController (session management)
- [ ] Add controller-level validation
- [ ] Implement response formatting

**Reference:** Section 4 of logical_design.md

### Step 2.9: Implement Routes
- [ ] Create authentication routes
- [ ] Create user management routes
- [ ] Create session management routes
- [ ] Create password management routes
- [ ] Set up route middleware

**Files to create:**
- `src/routes/auth.routes.ts`
- `src/routes/user.routes.ts`
- `src/routes/session.routes.ts`
- `src/routes/index.ts`

### Step 2.10: Create Application Entry Point
- [ ] Create app.ts (Express app setup)
- [ ] Create server.ts (server startup)
- [ ] Configure middleware chain
- [ ] Set up database connection
- [ ] Add graceful shutdown handling

**Files to create:**
- `src/app.ts`
- `src/server.ts`

---

## Phase 3: Mock External Dependencies

### Step 3.1: Identify External Dependencies
- [ ] Document all external integrations (currently none for Unit 1)
- [ ] Document dependencies on other units (Unit 4 for signature checks)
- [ ] Create mock interfaces

### Step 3.2: Create Mock Implementations
- [ ] Create mock for Unit 4 (Signature Workflow) - for user deletion check
- [ ] Create mock notification service (for password reset notifications)
- [ ] Implement Spring profile switching (or equivalent for Node.js)
- [ ] Document mock behaviors

**Files to create:**
- `src/mocks/SignatureWorkflowMock.ts`
- `src/mocks/NotificationServiceMock.ts`
- `MOCKS_DOCUMENTATION.md`

**Note:** Use environment variables to switch between real and mock implementations

---

## Phase 4: Unit Testing Suite

### Step 4.1: Service Unit Tests
- [ ] Create AuthenticationService.test.ts (all methods, success/error cases)
- [ ] Create UserAccountService.test.ts (CRUD operations, validations)
- [ ] Create SessionService.test.ts (session lifecycle)
- [ ] Create PasswordService.test.ts (password operations, strength validation)
- [ ] Achieve 90%+ coverage for services

**Test scenarios per service:**
- Success scenarios
- Validation errors
- Business rule violations
- Edge cases
- Error handling

### Step 4.2: Repository Unit Tests
- [ ] Create UserRepository.test.ts (all CRUD operations)
- [ ] Create SessionRepository.test.ts (session operations)
- [ ] Create AuditLogRepository.test.ts (logging operations)
- [ ] Test case-insensitive queries
- [ ] Test soft delete functionality
- [ ] Achieve 85%+ coverage for repositories

### Step 4.3: Utility Unit Tests
- [ ] Create PasswordUtils.test.ts (hash, verify, validate)
- [ ] Create TokenUtils.test.ts (token generation)
- [ ] Create ValidationUtils.test.ts (validation functions)
- [ ] Create DateUtils.test.ts (date operations)
- [ ] Achieve 95%+ coverage for utilities

### Step 4.4: Middleware Unit Tests
- [ ] Create authMiddleware.test.ts
- [ ] Create adminOnly.test.ts
- [ ] Create validateRequest.test.ts
- [ ] Test authorization scenarios
- [ ] Test error handling

---

## Phase 5: API Integration Testing

### Step 5.1: Authentication API Tests
- [ ] Test POST /api/auth/login (success, invalid credentials, inactive user)
- [ ] Test POST /api/auth/logout (success, invalid token)
- [ ] Test GET /api/auth/validate (valid session, expired session)
- [ ] Test POST /api/auth/extend-session (success, expired session)
- [ ] Create integration test for complete auth flow

### Step 5.2: User Management API Tests
- [ ] Test POST /api/users (create user - admin only)
- [ ] Test GET /api/users/:userId (retrieve user)
- [ ] Test PUT /api/users/:userId (update user - admin only)
- [ ] Test DELETE /api/users/:userId (delete user - admin only)
- [ ] Test GET /api/users (list users with filters)
- [ ] Test authorization (admin vs regular user)

### Step 5.3: Password Management API Tests
- [ ] Test POST /api/users/password/change (change password)
- [ ] Test POST /api/users/password/reset (reset password - admin only)
- [ ] Test POST /api/users/password/validate (validate password strength)
- [ ] Test session termination after password change

### Step 5.4: API Documentation with Swagger
- [ ] Install swagger-ui-express and swagger-jsdoc
- [ ] Create Swagger configuration
- [ ] Add API documentation annotations to routes
- [ ] Generate OpenAPI specification
- [ ] Make Swagger UI accessible at /api-docs

**Files to create:**
- `src/config/swagger.config.ts`
- `swagger.json` (generated)

---

## Phase 6: Simple Web UI for Manual Testing

### Step 6.1: Create UI Structure
- [ ] Create static file directory structure
- [ ] Set up Express static file serving
- [ ] Create main HTML page (index.html)
- [ ] Create CSS stylesheet (styles.css)
- [ ] Create JavaScript file (app.js)

**Directory structure:**
```
src/public/
├── index.html
├── css/
│   └── styles.css
└── js/
    └── app.js
```

### Step 6.2: Implement Authentication UI
- [ ] Create login form
- [ ] Create logout button
- [ ] Display session information
- [ ] Show session validation status
- [ ] Add session extension button

**UI Features:**
- Login form with username/password
- Display current session token
- Show session expiry time
- Validate session button
- Logout button

### Step 6.3: Implement User Management UI
- [ ] Create user creation form (admin only)
- [ ] Create user list/search interface
- [ ] Create user edit form
- [ ] Create user delete button with confirmation
- [ ] Display user details

**UI Features:**
- Create user form with all fields
- User list table with filters
- Edit user modal/form
- Delete confirmation dialog
- Search functionality

### Step 6.4: Implement Password Management UI
- [ ] Create change password form
- [ ] Create reset password form (admin only)
- [ ] Display password strength indicator
- [ ] Show password validation errors

**UI Features:**
- Change password form
- Password strength meter
- Real-time validation feedback
- Reset password button (admin)

### Step 6.5: Add UI Utilities
- [ ] Implement API client functions
- [ ] Add error handling and display
- [ ] Create response formatting
- [ ] Add loading indicators
- [ ] Implement form validation

**JavaScript utilities:**
- API call wrapper with error handling
- Token storage (localStorage)
- Form validation
- Response display formatting
- Error message display

### Step 6.6: Style and Polish UI
- [ ] Create responsive layout
- [ ] Add basic styling (clean, functional)
- [ ] Add form validation styling
- [ ] Create success/error message displays
- [ ] Add loading states

**Note:** UI should be simple and functional, not production-ready. Focus on testing capability.

---

## Phase 7: Testing Documentation

### Step 7.1: Create TESTING_GUIDE.md
- [ ] Write overview of testing environment
- [ ] Document how to run unit tests
- [ ] Document how to run integration tests
- [ ] Document how to start the application
- [ ] Document how to access the web UI
- [ ] Document how to access Swagger API docs
- [ ] Add troubleshooting section

**Sections to include:**
1. Prerequisites
2. Installation
3. Database Setup
4. Running Tests
5. Starting the Application
6. Accessing the Web UI
7. Using the API
8. Troubleshooting
9. Test Coverage
10. Known Limitations

### Step 7.2: Document Test Scenarios
- [ ] List all test scenarios covered
- [ ] Map tests to acceptance criteria
- [ ] Document test data
- [ ] Document mock behaviors
- [ ] Add test execution examples

### Step 7.3: Create Quick Start Guide
- [ ] Write one-command setup instructions
- [ ] Document environment variables
- [ ] Add sample .env file
- [ ] Create npm scripts for common tasks

**npm scripts to add:**
```json
{
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "dev": "nodemon src/server.ts",
  "start": "ts-node src/server.ts",
  "build": "tsc",
  "seed": "ts-node src/database/seeds/testData.seed.ts"
}
```

---

## Phase 8: Final Integration & Testing

### Step 8.1: End-to-End Testing
- [ ] Test complete user creation flow
- [ ] Test complete authentication flow
- [ ] Test complete password change flow
- [ ] Test admin vs user authorization
- [ ] Test session expiry and cleanup

### Step 8.2: Verify All Components
- [ ] Run all unit tests and verify 80%+ coverage
- [ ] Run all integration tests
- [ ] Test all API endpoints via Swagger
- [ ] Test all UI functionality manually
- [ ] Verify database operations
- [ ] Verify mock implementations work

### Step 8.3: Performance Testing
- [ ] Test concurrent login requests
- [ ] Test session validation performance
- [ ] Test database query performance
- [ ] Document performance metrics

### Step 8.4: Security Testing
- [ ] Test SQL injection prevention
- [ ] Test password hashing
- [ ] Test session security
- [ ] Test authorization enforcement
- [ ] Verify no password hashes in responses

### Step 8.5: Create Test Report
- [ ] Generate coverage report
- [ ] Document test results
- [ ] List any failing tests
- [ ] Document known issues
- [ ] Create test summary

---

## Phase 9: Documentation & Cleanup

### Step 9.1: Code Documentation
- [ ] Add JSDoc comments to all public methods
- [ ] Document complex business logic
- [ ] Add inline comments for clarity
- [ ] Document configuration options

### Step 9.2: README Updates
- [ ] Update main README.md
- [ ] Add architecture diagram
- [ ] Document API endpoints
- [ ] Add usage examples

### Step 9.3: Final Review
- [ ] Review all code for consistency
- [ ] Check naming conventions
- [ ] Verify error handling
- [ ] Review test coverage
- [ ] Verify documentation completeness

---

## Deliverables Checklist

### Code Deliverables
- [ ] Complete source code in `src/` directory
- [ ] Complete test suite in `tests/` directory
- [ ] Simple web UI in `src/public/` directory
- [ ] Database configuration and seeds
- [ ] Mock implementations

### Configuration Files
- [ ] package.json with all dependencies
- [ ] tsconfig.json
- [ ] jest.config.js
- [ ] .env.example
- [ ] Database configuration files

### Documentation
- [ ] TESTING_GUIDE.md
- [ ] DATABASE_SETUP.md
- [ ] MOCKS_DOCUMENTATION.md
- [ ] API documentation (Swagger)
- [ ] README.md updates

### Testing Artifacts
- [ ] Unit tests (90%+ coverage for services)
- [ ] Integration tests
- [ ] API tests
- [ ] Test fixtures and helpers
- [ ] Coverage reports

---

## Success Criteria

1. **Unit Tests:** 80%+ overall coverage, 90%+ for services
2. **Integration Tests:** All API endpoints tested
3. **Web UI:** All CRUD operations testable via browser
4. **Database:** SQLite configured with sample data
5. **Mocks:** All external dependencies mocked
6. **Documentation:** Complete testing guide
7. **Single Command:** Application starts with `npm run dev`
8. **API Docs:** Swagger UI accessible at http://localhost:3000/api-docs
9. **Web UI:** Accessible at http://localhost:3000
10. **All Tests Pass:** `npm test` runs successfully

---

## Estimated Timeline

- **Phase 1:** 2-3 hours (Project setup)
- **Phase 2:** 6-8 hours (Core implementation)
- **Phase 3:** 1-2 hours (Mocks)
- **Phase 4:** 4-6 hours (Unit tests)
- **Phase 5:** 3-4 hours (API tests)
- **Phase 6:** 3-4 hours (Web UI)
- **Phase 7:** 2-3 hours (Documentation)
- **Phase 8:** 2-3 hours (Integration & testing)
- **Phase 9:** 1-2 hours (Cleanup)

**Total Estimated Time:** 24-35 hours

---

## Notes and Considerations

1. **Technology Stack Confirmation Required:** The logical design specifies Node.js/TypeScript, but this needs confirmation before proceeding.

2. **SQLite Limitations:** SQLite has some limitations compared to PostgreSQL:
   - No native UUID type (will use TEXT)
   - Limited concurrent write operations
   - No built-in user management
   - Case-insensitive queries require COLLATE NOCASE

3. **Mock Dependencies:** Unit 1 has minimal external dependencies. Main mock needed is for Unit 4 (Signature Workflow) to check pending signatures before user deletion.

4. **Web UI Scope:** The UI is intentionally simple and functional, not production-ready. It's designed for testing purposes only.

5. **Security:** All passwords will be hashed with bcrypt. Session tokens will be securely generated. No sensitive data in logs.

6. **Test Data:** Sample test data will include:
   - 1 admin user (username: admin, password: Admin123)
   - 2 regular users (username: user1/user2, password: User123)
   - Sample sessions
   - Sample audit logs

---

## Questions for Clarification

1. **Technology Stack:** Should we proceed with Node.js/TypeScript as specified in logical_design.md, or switch to Java/Spring Boot?

2. **Database:** Confirm SQLite is acceptable for local testing (vs H2 for Java)?

3. **UI Framework:** Should the web UI use plain HTML/CSS/JS, or is a framework like React acceptable?

4. **Test Coverage:** Is 80% overall coverage acceptable, or should we target higher?

5. **Mock Complexity:** How detailed should the mock implementations be?

---

## Approval Required

**Please review this plan and:**
1. Confirm the technology stack (Node.js vs Java)
2. Approve the approach and phases
3. Clarify any questions listed above
4. Provide any additional requirements or constraints

Once approved, I will proceed with implementation step by step, marking each checkbox as completed.

---

**Plan Status:** ⏳ Awaiting Review and Approval  
**Created:** December 5, 2025  
**Last Updated:** December 5, 2025
