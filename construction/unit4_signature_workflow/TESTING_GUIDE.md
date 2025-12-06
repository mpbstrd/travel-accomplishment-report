# Testing Guide - Unit 4: Signature Workflow

## Overview
This guide provides comprehensive instructions for testing the Signature Workflow unit locally. The testing environment includes unit tests, integration tests, API testing via Swagger, and a simple web UI for manual testing.

---

## Prerequisites

### Required Software
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/))
- **Git** (for cloning the repository)

### Optional Tools
- **Postman** or **Insomnia** (for API testing)
- **SQL Server Management Studio** (for database inspection)

---

## Quick Start

### 1. Install Dependencies
```bash
cd construction/unit4_signature_workflow/src
npm install
```

### 2. Set Up MS SQL Server (Docker)
```bash
# Start MS SQL Server container
docker-compose up -d

# Wait for SQL Server to be ready (about 30 seconds)
docker-compose logs -f mssql

# You should see "SQL Server is now ready for client connections"
```

### 3. Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env if needed (default values work for local testing)
# Make sure USE_MOCK_SERVICES=true for testing without external services
```

### 4. Run Database Migrations
```bash
npm run migration:run
```

### 5. Seed Test Data
```bash
npm run seed
```

### 6. Start the Application
```bash
npm run dev
```

The application will start on `http://localhost:3004`

---

## Testing Methods

### Method 1: Unit Tests

Unit tests verify individual components in isolation using mocked dependencies.

```bash
# Run all unit tests
npm run test:unit

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**Coverage Goals:**
- Service layer: 90%+
- Repository layer: 80%+
- Overall: 80%+

**Test Files:**
- `tests/unit/repositories/signature.repository.spec.ts`
- `tests/unit/repositories/workflow-state.repository.spec.ts`
- `tests/unit/services/workflow-state.service.spec.ts`
- `tests/unit/services/signature-validation.service.spec.ts`
- `tests/unit/services/signature-workflow.service.spec.ts`

### Method 2: Integration Tests

Integration tests verify API endpoints and database operations.

```bash
# Run integration tests
npm run test:integration

# Run all tests (unit + integration)
npm run test:all
```

**Test Coverage:**
- POST /api/reports/:reportId/signatures/submit
- POST /api/reports/:reportId/signatures
- GET /api/reports/:reportId/signatures/status
- GET /api/reports/:reportId/signatures/history
- GET /api/reports/:reportId/signatures/available-actions

### Method 3: Swagger API Documentation

Access interactive API documentation at:
```
http://localhost:3004/api-docs
```

**Features:**
- View all API endpoints
- See request/response schemas
- Try out APIs directly from the browser
- View example requests and responses

### Method 4: Web UI for Manual Testing

Access the testing UI at:
```
http://localhost:3004
```

**Available Pages:**
- **Home** - Overview and quick start
- **Submit Report** - Submit a report for signatures
- **Record Signature** - Record a signature
- **Signature Status** - Check workflow status
- **Signature History** - View all signatures

---

## Test Scenarios

### Scenario 1: Complete Workflow (report-001)
**Status:** Completed with all 3 signatures

**Test Steps:**
1. Go to Signature Status page
2. Enter `report-001`
3. View completed workflow with all signatures

**Expected Result:**
- Current state: COMPLETED
- 3 signatures present (Prepared By, Branch Ack, NISD Ack)
- Progress: 3/3

### Scenario 2: Submit Draft Report (report-002)
**Status:** Draft (incomplete report)

**Test Steps:**
1. Go to Submit Report page
2. Enter `report-002` and select a user
3. Click Submit

**Expected Result:**
- Error: Report is incomplete
- Validation errors listed

### Scenario 3: Partial Workflow (report-003)
**Status:** Pending Branch Acknowledgement

**Test Steps:**
1. Go to Signature Status page
2. Enter `report-003`
3. View partial workflow

**Expected Result:**
- Current state: PENDING_BRANCH_ACK
- 1 signature present (Prepared By)
- Next required: BRANCH_ACKNOWLEDGEMENT
- Progress: 1/3

### Scenario 4: Record Branch Acknowledgement (report-003)
**Status:** Continue from Scenario 3

**Test Steps:**
1. Go to Record Signature page
2. Enter `report-003`
3. Select "Branch Acknowledgement"
4. Enter "John Doe" as signatory name
5. Select `user-001` (Branch Manager)
6. Check disclaimer acknowledgement
7. Click Record Signature

**Expected Result:**
- Success message
- Workflow state updated to PENDING_NISD_ACK
- Signature recorded with timestamp

### Scenario 5: Complete Workflow (report-003)
**Status:** Continue from Scenario 4

**Test Steps:**
1. Record NISD Acknowledgement signature
2. Use `user-003` (NISD Staff)
3. Check signature status

**Expected Result:**
- Workflow state: COMPLETED
- All 3 signatures present
- Progress: 3/3

---

## Mock Services

The testing environment uses mock implementations for external services:

### Mock User Management
- Provides test users (user-001, user-002, user-003)
- Validates user roles
- Located in: `src/mocks/mock-user-management.client.ts`

### Mock Report Management
- Provides test reports (report-001, report-002, report-003)
- Validates report completeness
- Located in: `src/mocks/mock-report-management.client.ts`

### Mock Notification Service
- Logs notifications to console
- Simulates notification delivery
- Located in: `src/mocks/mock-notification.client.ts`

**To switch between mock and real services:**
```bash
# In .env file
USE_MOCK_SERVICES=true   # Use mocks (default for testing)
USE_MOCK_SERVICES=false  # Use real services
```

---

## Database Management

### View Database Contents
```bash
# Connect to SQL Server
docker exec -it unit4-mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd

# List databases
SELECT name FROM sys.databases;
GO

# Use the database
USE signature_workflow_db;
GO

# View signatures
SELECT * FROM signatures;
GO

# View workflow states
SELECT * FROM workflow_states;
GO

# Exit
EXIT
```

### Reset Database
```bash
# Stop and remove containers
docker-compose down -v

# Start fresh
docker-compose up -d

# Wait for SQL Server to be ready
sleep 30

# Run migrations and seed
npm run migration:run
npm run seed
```

### Backup Database
```bash
docker exec unit4-mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong@Passw0rd -Q "BACKUP DATABASE signature_workflow_db TO DISK = '/var/opt/mssql/backup/signature_workflow_db.bak'"
```

---

## Troubleshooting

### Issue: Cannot connect to database
**Solution:**
1. Check if Docker container is running: `docker ps`
2. Check container logs: `docker-compose logs mssql`
3. Wait 30 seconds after starting container
4. Verify connection settings in `.env`

### Issue: Port 1433 already in use
**Solution:**
1. Stop local SQL Server service
2. Or change port in `docker-compose.yml` and `.env`

### Issue: Tests failing
**Solution:**
1. Ensure database is seeded: `npm run seed`
2. Check if application is running
3. Verify mock services are enabled: `USE_MOCK_SERVICES=true`
4. Clear test database and re-seed

### Issue: Web UI not loading
**Solution:**
1. Ensure application is running: `npm run dev`
2. Check if port 3004 is available
3. Verify static files are in `src/public/` directory
4. Check browser console for errors

### Issue: Swagger docs not showing
**Solution:**
1. Verify Swagger dependencies installed: `npm install`
2. Check `/api-docs` endpoint
3. Review console for Swagger errors

### Issue: Mock services not working
**Solution:**
1. Verify `USE_MOCK_SERVICES=true` in `.env`
2. Check mock implementations in `src/mocks/`
3. Review console logs for mock service calls

---

## Test Data Reference

### Test Users
| User ID | Name | Role | Use For |
|---------|------|------|---------|
| user-001 | John Doe | Branch Manager | Branch Acknowledgement |
| user-002 | Jane Smith | Branch Staff | Prepared By |
| user-003 | Bob Johnson | NISD Staff | NISD Acknowledgement |

### Test Reports
| Report ID | Status | Description |
|-----------|--------|-------------|
| report-001 | Completed | All 3 signatures completed |
| report-002 | Draft | Incomplete report (for testing validation) |
| report-003 | Pending Branch Ack | 1 signature completed |

### Signature Types
- `PREPARED_BY` - First signature (Branch Staff)
- `BRANCH_ACKNOWLEDGEMENT` - Second signature (Branch Manager)
- `NISD_ACKNOWLEDGEMENT` - Third signature (NISD Staff)

### Workflow States
- `DRAFT` - Report not yet submitted
- `PENDING_PREPARED_BY` - Awaiting first signature
- `PENDING_BRANCH_ACK` - Awaiting second signature
- `PENDING_NISD_ACK` - Awaiting third signature
- `COMPLETED` - All signatures completed

---

## API Endpoints Reference

### Submit Report for Signatures
```
POST /api/reports/:reportId/signatures/submit
Authorization: Bearer <token>
Body: { "userId": "user-002" }
```

### Record Signature
```
POST /api/reports/:reportId/signatures
Authorization: Bearer <token>
Body: {
  "signatureType": "PREPARED_BY",
  "signatoryName": "Jane Smith",
  "disclaimerAcknowledged": true
}
```

### Get Signature Status
```
GET /api/reports/:reportId/signatures/status?userId=user-001
Authorization: Bearer <token>
```

### Get Signature History
```
GET /api/reports/:reportId/signatures/history
Authorization: Bearer <token>
```

### Get Available Actions
```
GET /api/reports/:reportId/signatures/available-actions?userId=user-001
Authorization: Bearer <token>
```

---

## Performance Testing

### Load Testing with Artillery
```bash
# Install Artillery
npm install -g artillery

# Run load test
artillery quick --count 10 --num 100 http://localhost:3004/health
```

### Monitoring
- Check application logs for errors
- Monitor database connections
- Review response times in Swagger UI

---

## Continuous Integration

### Running Tests in CI/CD
```bash
# Install dependencies
npm install

# Run linting (if configured)
npm run lint

# Run all tests
npm run test:all

# Generate coverage report
npm run test:coverage

# Build application
npm run build
```

---

## Additional Resources

- **Logical Design:** `construction/unit4_signature_workflow/logical_design.md`
- **Architecture Design:** `construction/unit4_signature_workflow/architecture_design.md`
- **API Examples:** `construction/unit4_signature_workflow/API_EXAMPLES.md`
- **Setup Guide:** `construction/unit4_signature_workflow/SETUP_GUIDE.md`

---

## Support

For issues or questions:
1. Check this testing guide
2. Review application logs
3. Check Docker container logs
4. Verify environment configuration
5. Consult the logical design document

---

**Happy Testing! 🚀**
