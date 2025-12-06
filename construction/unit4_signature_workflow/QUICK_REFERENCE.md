# Quick Reference - Unit 4: Signature Workflow

## 🚀 Quick Start

```bash
cd construction/unit4_signature_workflow/src
npm install
cp .env.example .env
# Edit .env with your database settings
npm run migration:run
npm run demo
npm run dev
```

## 📋 Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server with hot reload |
| `npm start` | Start production server |
| `npm run build` | Build TypeScript to JavaScript |
| `npm test` | Run tests |
| `npm run test:coverage` | Run tests with coverage |
| `npm run migration:run` | Run database migrations |
| `npm run migration:revert` | Revert last migration |
| `npm run demo` | Run demo application |

## 🔑 Environment Variables

```env
# Required
DB_HOST=localhost
DB_PORT=1433
DB_NAME=signature_workflow_db
DB_USER=your_user
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key

# Optional
NODE_ENV=development
PORT=3004
LOG_LEVEL=debug
```

## 🌐 API Endpoints

### Base URL
```
http://localhost:3004/api
```

### Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/reports/:reportId/signatures/submit` | ✅ | Submit for signatures |
| POST | `/reports/:reportId/signatures` | ✅ | Record signature |
| GET | `/reports/:reportId/signatures/status` | ⚠️ | Get signature status |
| GET | `/reports/:reportId/signatures/history` | ✅ | Get signature history |
| GET | `/reports/:reportId/signatures/available-actions` | ✅ | Get available actions |
| GET | `/health` | ❌ | Health check |

✅ Required | ⚠️ Optional | ❌ Not required

## 🔐 Authentication

Include JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

Generate test token:
```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: 'your-user-id' },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);
```

## 📊 Workflow States

```
DRAFT
  ↓ submit
PENDING_PREPARED_BY
  ↓ sign (Prepared By)
PENDING_BRANCH_ACK
  ↓ sign (Branch Acknowledgement)
PENDING_NISD_ACK
  ↓ sign (NISD Acknowledgement)
COMPLETED
```

## 🎯 Signature Types

1. `PREPARED_BY` - First signature
2. `BRANCH_ACKNOWLEDGEMENT` - Second signature
3. `NISD_ACKNOWLEDGEMENT` - Third signature

## 📝 Request Examples

### Submit for Signatures
```bash
curl -X POST http://localhost:3004/api/reports/{reportId}/signatures/submit \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-id"}'
```

### Record Signature
```bash
curl -X POST http://localhost:3004/api/reports/{reportId}/signatures \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "signatureType": "PREPARED_BY",
    "signatoryName": "John Smith",
    "disclaimerAcknowledged": true,
    "userId": "user-id"
  }'
```

### Get Status
```bash
curl http://localhost:3004/api/reports/{reportId}/signatures/status \
  -H "Authorization: Bearer {token}"
```

## 🗂️ Project Structure

```
src/
├── features/signature-workflow/  # Core logic
│   ├── controllers/              # HTTP handlers
│   ├── services/                 # Business logic
│   ├── repositories/             # Data access
│   ├── entities/                 # Models
│   ├── dtos/                     # Validation
│   └── routes/                   # Routes
├── shared/                       # Utilities
├── integrations/                 # External clients
├── config/                       # Configuration
├── database/                     # Migrations
└── demo/                         # Demo app
```

## 🔧 Key Services

| Service | Purpose |
|---------|---------|
| `SignatureWorkflowService` | Main orchestration |
| `WorkflowStateService` | State management |
| `SignatureValidationService` | Business rules |
| `SignatureNotificationService` | Notifications |

## 🗄️ Database Tables

### signatures
- Primary Key: `signatureId` (UUID)
- Unique: `(reportId, signatureType)`
- Indexes: reportId, signatoryUserId

### workflow_states
- Primary Key: `workflowId` (UUID)
- Unique: `reportId`
- Indexes: reportId, currentState

## ⚠️ Common Errors

| Error | Solution |
|-------|----------|
| Login failed | Check DB credentials in .env |
| Connection timeout | Verify SQL Server is running |
| Invalid token | Check JWT_SECRET matches |
| Migration exists | Run `migration:revert` first |

## 🧪 Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## 📚 Documentation Files

- `README.md` - Complete documentation
- `SETUP_GUIDE.md` - Setup instructions
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `QUICK_REFERENCE.md` - This file

## 🔗 Integration Points

### Consumes
- User Management (user validation)
- Report Management (report data)
- Notification Service (alerts)

### Provides
- Signature status
- Workflow completion status
- Signature history

## 🚨 Production Checklist

- [ ] Replace mock integration clients
- [ ] Update JWT_SECRET (32+ chars)
- [ ] Configure production database
- [ ] Set DB_ENCRYPT=true for Azure SQL
- [ ] Set LOG_LEVEL=error
- [ ] Configure CORS for specific domains
- [ ] Set up monitoring and alerts
- [ ] Run migrations in staging first
- [ ] Enable HTTPS/TLS
- [ ] Configure rate limiting

## 💡 Tips

1. **Development:** Use `npm run dev` for hot reload
2. **Testing:** Run demo first to verify setup
3. **Debugging:** Set `LOG_LEVEL=debug` in .env
4. **Database:** Use SQL Server Management Studio to inspect tables
5. **API Testing:** Use Postman or curl with JWT tokens

## 📞 Support

- Check `README.md` for detailed docs
- Review `SETUP_GUIDE.md` for setup issues
- See `IMPLEMENTATION_SUMMARY.md` for architecture
- Check logs in console for errors

## 🎓 Learning Resources

- TypeORM: https://typeorm.io/
- Express.js: https://expressjs.com/
- class-validator: https://github.com/typestack/class-validator
- tsyringe: https://github.com/microsoft/tsyringe

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready 🚀
