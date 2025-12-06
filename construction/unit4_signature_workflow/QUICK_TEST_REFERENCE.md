# Quick Test Reference - Unit 4: Signature Workflow

## 🚀 Quick Start (Copy & Paste)

```bash
# Navigate to source directory
cd construction/unit4_signature_workflow/src

# Install dependencies
npm install

# Start MS SQL Server
docker-compose up -d

# Wait 30 seconds for SQL Server to start
# Then run migrations and seed data
npm run migration:run
npm run seed

# Run all tests
npm run test:all

# Start the application
npm run dev
```

## 🌐 Access Points

| Resource | URL | Description |
|----------|-----|-------------|
| Web UI | http://localhost:3004 | Manual testing interface |
| API Docs | http://localhost:3004/api-docs | Swagger documentation |
| Health Check | http://localhost:3004/health | Server status |

## 🧪 Test Commands

```bash
npm run test:unit          # Unit tests only (fast)
npm run test:integration   # Integration tests (requires DB)
npm run test:all          # All tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
```

## 📊 Test Data

### Reports
| ID | Status | Signatures | Use For |
|----|--------|-----------|---------|
| report-001 | COMPLETED | 3/3 | View completed workflow |
| report-002 | DRAFT | 0/3 | Test validation errors |
| report-003 | PENDING_BRANCH_ACK | 1/3 | Continue workflow |

### Users
| ID | Name | Role | Signs As |
|----|------|------|----------|
| user-001 | John Doe | Branch Manager | Branch Ack |
| user-002 | Jane Smith | Branch Staff | Prepared By |
| user-003 | Bob Johnson | NISD Staff | NISD Ack |

### Signature Types
- `PREPARED_BY` - First signature
- `BRANCH_ACKNOWLEDGEMENT` - Second signature
- `NISD_ACKNOWLEDGEMENT` - Third signature

## 🔧 Common Commands

```bash
# Database
docker-compose up -d              # Start database
docker-compose down               # Stop database
docker-compose down -v            # Stop and remove data
npm run migration:run             # Run migrations
npm run seed                      # Seed test data

# Development
npm run dev                       # Start dev server
npm run build                     # Build for production
npm start                         # Start production server

# Testing
npm test                          # Run unit tests
npm run test:integration          # Run integration tests
npm run test:coverage             # Generate coverage report
```

## 📝 Quick Test Scenarios

### Scenario 1: View Completed Workflow
1. Go to http://localhost:3004/signature-status.html
2. Enter `report-001`
3. Click "Check Status"
4. See all 3 signatures completed

### Scenario 2: Record a Signature
1. Go to http://localhost:3004/record-signature.html
2. Enter `report-003`
3. Select "BRANCH_ACKNOWLEDGEMENT"
4. Enter "John Doe"
5. Select `user-001`
6. Check disclaimer
7. Click "Record Signature"

### Scenario 3: Test Validation Error
1. Go to http://localhost:3004/submit-report.html
2. Enter `report-002` (incomplete report)
3. Select any user
4. Click "Submit Report"
5. See validation errors

## 🐛 Troubleshooting

### Database won't start
```bash
docker-compose logs mssql
# Wait 30 seconds after starting
```

### Tests failing
```bash
# Reset database
docker-compose down -v
docker-compose up -d
sleep 30
npm run migration:run
npm run seed
```

### Port already in use
```bash
# Check what's using port 3004
netstat -ano | findstr :3004
# Kill the process or change PORT in .env
```

### Mock services not working
```bash
# Check .env file
USE_MOCK_SERVICES=true
```

## 📚 Documentation

| Document | Description |
|----------|-------------|
| TESTING_GUIDE.md | Complete testing guide |
| TESTING_ENVIRONMENT_SUMMARY.md | Overview of capabilities |
| TESTING_ENVIRONMENT_COMPLETION.md | Completion report |
| logical_design.md | System design |

## 🎯 API Endpoints

```bash
# Submit for signatures
POST /api/reports/:reportId/signatures/submit
Body: { "userId": "user-002" }

# Record signature
POST /api/reports/:reportId/signatures
Body: {
  "signatureType": "PREPARED_BY",
  "signatoryName": "Jane Smith",
  "disclaimerAcknowledged": true
}

# Get status
GET /api/reports/:reportId/signatures/status?userId=user-001

# Get history
GET /api/reports/:reportId/signatures/history

# Get available actions
GET /api/reports/:reportId/signatures/available-actions?userId=user-001
```

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Database running (`docker-compose up -d`)
- [ ] Migrations run (`npm run migration:run`)
- [ ] Data seeded (`npm run seed`)
- [ ] Tests passing (`npm run test:all`)
- [ ] App running (`npm run dev`)
- [ ] Web UI accessible (http://localhost:3004)
- [ ] Swagger docs accessible (http://localhost:3004/api-docs)

## 🎓 Learning Path

1. **Start Here:** Read TESTING_GUIDE.md
2. **Run Tests:** `npm run test:all`
3. **Try Web UI:** http://localhost:3004
4. **Explore APIs:** http://localhost:3004/api-docs
5. **Read Code:** Start with `src/features/signature-workflow/`

---

**Need Help?** See TESTING_GUIDE.md for detailed instructions and troubleshooting.
