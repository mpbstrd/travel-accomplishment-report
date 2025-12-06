# Unit 4: Signature Workflow Service

A TypeScript-based signature workflow management service for travel accomplishment reports. Implements a sequential three-step signature approval process using Node.js, Express.js, TypeORM, and SQLite.

## Overview

This service manages the signature workflow for travel reports through three sequential steps:
1. **Prepared By** - First signature acknowledging report preparation
2. **Branch Acknowledgement** - Second signature for branch acknowledgement
3. **NISD Acknowledgement** - Final signature for NISD approval

### Key Features

- ✅ Sequential signature workflow enforcement
- ✅ State machine-based workflow management
- ✅ Immutable signature records with audit trail
- ✅ Real-time signature status tracking
- ✅ Integration with User Management, Report Management, and Notification services
- ✅ Comprehensive validation and error handling
- ✅ RESTful API with JWT authentication
- ✅ TypeORM with SQLite (file-based, no server required)
- ✅ Dependency injection with tsyringe
- ✅ Structured logging with Winston

## Technology Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript 5+
- **Framework:** Express.js 4.x
- **ORM:** TypeORM 0.3+
- **Database:** SQLite (development) - Portable to PostgreSQL/MS SQL/MySQL for production
- **Validation:** class-validator
- **DI Container:** tsyringe
- **Logging:** Winston
- **Testing:** Jest with ts-jest

## Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- **No database server required!** (Uses SQLite file-based database)

## Installation

1. **Clone the repository and navigate to the project:**
   ```bash
   cd construction/unit4_signature_workflow/src
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**
   ```bash
   cp .env.example .env
   ```
   
   The default configuration works out of the box. You can customize:
   - `DB_PATH` - Database file location (default: ./data/signature_workflow.db)
   - `JWT_SECRET` - Secret key for JWT tokens
   - `PORT` - Server port (default: 3004)

4. **Run database migrations:**
   ```bash
   npm run migration:run
   ```
   
   The database file will be created automatically in the `data/` directory.

## Running the Application

### Development Mode

Start the server with hot reload:
```bash
npm run dev
```

The server will start on `http://localhost:3004` (or the port specified in `.env`).

### Production Mode

Build and run:
```bash
npm run build
npm start
```

### Demo Application

Run the demo to see the complete workflow in action:
```bash
npm run demo
```

This will:
- Initialize the database
- Create a sample workflow
- Record all three signatures in sequence
- Display status at each step
- Show the complete signature history

## API Endpoints

### Base URL
```
http://localhost:3004/api
```

### Authentication

All endpoints (except health check) require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### 1. Submit Report for Signatures
```http
POST /api/reports/:reportId/signatures/submit
```

**Request Body:**
```json
{
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workflowState": { ... },
    "message": "Report submitted successfully. Awaiting signature from Prepared By."
  }
}
```

#### 2. Record Signature
```http
POST /api/reports/:reportId/signatures
```

**Request Body:**
```json
{
  "signatureType": "PREPARED_BY | BRANCH_ACKNOWLEDGEMENT | NISD_ACKNOWLEDGEMENT",
  "signatoryName": "John Smith",
  "disclaimerAcknowledged": true,
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "signature": { ... },
    "workflowState": { ... },
    "message": "Signature recorded successfully",
    "nextSignatureRequired": "BRANCH_ACKNOWLEDGEMENT"
  }
}
```

#### 3. Get Signature Status
```http
GET /api/reports/:reportId/signatures/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workflowState": { ... },
    "signatures": [ ... ],
    "nextRequired": "BRANCH_ACKNOWLEDGEMENT",
    "progress": {
      "completed": 1,
      "total": 3
    },
    "canCurrentUserSign": true,
    "currentUserSignatureType": "BRANCH_ACKNOWLEDGEMENT"
  }
}
```

#### 4. Get Signature History
```http
GET /api/reports/:reportId/signatures/history
```

**Response:**
```json
{
  "success": true,
  "data": {
    "signatures": [
      {
        "signatureId": "uuid",
        "reportId": "uuid",
        "signatureType": "PREPARED_BY",
        "signatoryName": "John Smith",
        "signatoryUserId": "uuid",
        "signedAt": "2024-01-15T10:30:00Z",
        "ipAddress": "192.168.1.100",
        "disclaimerAcknowledged": true
      }
    ]
  }
}
```

#### 5. Get Available Actions
```http
GET /api/reports/:reportId/signatures/available-actions
```

**Response:**
```json
{
  "success": true,
  "data": {
    "actions": ["sign"],
    "canSign": true,
    "signatureType": "PREPARED_BY",
    "message": "You can sign as PREPARED_BY"
  }
}
```

#### 6. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "service": "signature-workflow",
  "version": "1.0.0"
}
```

## Project Structure

```
src/
├── features/
│   └── signature-workflow/
│       ├── controllers/          # HTTP request handlers
│       ├── services/             # Business logic
│       ├── repositories/         # Data access layer
│       ├── entities/             # TypeORM entities
│       ├── dtos/                 # Data transfer objects
│       ├── enums/                # Enumerations
│       └── routes/               # Route definitions
├── shared/
│   ├── middleware/               # Express middleware
│   ├── errors/                   # Custom error classes
│   ├── utils/                    # Utility functions
│   └── types/                    # TypeScript type definitions
├── integrations/
│   ├── user-management/          # User Management client
│   ├── report-management/        # Report Management client
│   └── notification-service/     # Notification client
├── config/                       # Configuration files
├── database/
│   ├── migrations/               # Database migrations
│   └── data-source.ts            # TypeORM data source
├── demo/                         # Demo application
├── app.ts                        # Express app setup
└── server.ts                     # Server entry point
```

## Database Schema

### Signatures Table
- `signatureId` (UUID, PK)
- `reportId` (UUID, FK)
- `signatureType` (ENUM)
- `signatoryName` (VARCHAR(100))
- `signatoryUserId` (UUID, FK)
- `signedAt` (DATETIME2)
- `ipAddress` (VARCHAR(45))
- `disclaimerAcknowledged` (BIT)
- `createdAt` (DATETIME2)

**Indexes:**
- Unique composite: (reportId, signatureType)
- Index on reportId
- Index on signatoryUserId

### Workflow States Table
- `workflowId` (UUID, PK)
- `reportId` (UUID, UNIQUE, FK)
- `currentState` (ENUM)
- `submittedAt` (DATETIME2)
- `completedAt` (DATETIME2)
- `preparedBySignatureId` (UUID, FK)
- `branchAckSignatureId` (UUID, FK)
- `nisdAckSignatureId` (UUID, FK)
- `createdAt` (DATETIME2)
- `updatedAt` (DATETIME2)

**Indexes:**
- Unique index on reportId
- Index on currentState

## Workflow State Machine

```
DRAFT
  ↓ (submit for signatures)
PENDING_PREPARED_BY
  ↓ (Prepared By signs)
PENDING_BRANCH_ACK
  ↓ (Branch Acknowledgement signs)
PENDING_NISD_ACK
  ↓ (NISD Acknowledgement signs)
COMPLETED
```

**Business Rules:**
- Signatures must be completed in strict sequence
- Each signature requires disclaimer acknowledgement
- Signatures are immutable once recorded
- Only one signature per type per report
- Users cannot sign the same report multiple times

## Testing

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## Production Deployment

### Environment Configuration

1. **Database Configuration:**
   - Update `DB_HOST` to production server
   - For Azure SQL: Set `DB_ENCRYPT=true` and `DB_TRUST_SERVER_CERTIFICATE=false`
   - Use connection pooling settings appropriate for your load
   - Store credentials in Azure Key Vault or AWS Secrets Manager

2. **Security:**
   - Generate strong JWT secret (minimum 32 characters)
   - Store secrets in secure key vault
   - Enable HTTPS/TLS for all connections
   - Configure CORS for specific domains only
   - Enable rate limiting per endpoint if needed

3. **Logging:**
   - Set `LOG_LEVEL=error` or `LOG_LEVEL=warn`
   - Configure log aggregation (ELK, Splunk, Azure Monitor)
   - Enable log rotation

4. **Monitoring:**
   - Set up health check monitoring
   - Configure alerts for errors and performance issues
   - Monitor database connection pool
   - Track API response times

### Migration Strategy

1. Test all migrations in staging environment
2. Back up production database
3. Run migrations during maintenance window
4. Verify data integrity after migration
5. Keep rollback scripts ready

### Scaling Considerations

- Use horizontal scaling for API servers
- Implement database read replicas for read-heavy workloads
- Use Redis for caching workflow states
- Consider message queue for notifications
- Implement circuit breaker for external service calls

## Troubleshooting

### Database Connection Issues

**Error:** "Login failed for user"
- Verify database credentials in `.env`
- Check SQL Server authentication mode
- Ensure user has appropriate permissions

**Error:** "Connection timeout"
- Check firewall rules
- Verify SQL Server is running
- Check network connectivity

### Migration Issues

**Error:** "Migration already exists"
- Check migration history in database
- Verify migration files are in correct order

### Authentication Issues

**Error:** "Invalid token"
- Verify JWT_SECRET matches between services
- Check token expiration
- Ensure Authorization header format is correct

## Contributing

1. Follow TypeScript best practices
2. Write tests for new features
3. Update documentation
4. Follow existing code structure and patterns
5. Use meaningful commit messages

## License

ISC

## Support

For issues and questions, please refer to the project documentation or contact the development team.
