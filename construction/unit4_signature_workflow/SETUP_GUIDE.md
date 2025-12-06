# Quick Setup Guide - Unit 4: Signature Workflow

## Prerequisites

Before you begin, ensure you have:
- ✅ Node.js 18+ installed
- ✅ MS SQL Server running (local or Azure SQL)
- ✅ npm or yarn package manager

## Step-by-Step Setup

### 1. Navigate to Project Directory

```bash
cd construction/unit4_signature_workflow/src
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Express.js, TypeORM, TypeScript
- MS SQL Server driver
- Validation and DI libraries
- Testing frameworks

### 3. Configure Database

#### Option A: Local MS SQL Server

1. Ensure SQL Server is running
2. Create a new database:
   ```sql
   CREATE DATABASE signature_workflow_db;
   ```

3. Create a SQL Server user (or use existing):
   ```sql
   CREATE LOGIN workflow_user WITH PASSWORD = 'YourStrong@Passw0rd';
   USE signature_workflow_db;
   CREATE USER workflow_user FOR LOGIN workflow_user;
   ALTER ROLE db_owner ADD MEMBER workflow_user;
   ```

#### Option B: Azure SQL Database

1. Create Azure SQL Database
2. Configure firewall rules to allow your IP
3. Get connection string from Azure Portal

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` file with your settings:

```env
# Application
NODE_ENV=development
PORT=3004

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Database - Local SQL Server
DB_HOST=localhost
DB_PORT=1433
DB_NAME=signature_workflow_db
DB_USER=workflow_user
DB_PASSWORD=YourStrong@Passw0rd
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

# For Azure SQL Database, use:
# DB_HOST=yourserver.database.windows.net
# DB_ENCRYPT=true
# DB_TRUST_SERVER_CERTIFICATE=false
```

### 5. Run Database Migrations

```bash
npm run migration:run
```

This creates the required tables:
- `signatures` - Stores signature records
- `workflow_states` - Tracks workflow progression

### 6. Verify Setup

Run the demo application to verify everything works:

```bash
npm run demo
```

You should see:
- ✅ Database connection established
- ✅ Report submitted for signatures
- ✅ Three signatures recorded in sequence
- ✅ Workflow completed successfully

### 7. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3004`

### 8. Test the API

#### Health Check
```bash
curl http://localhost:3004/health
```

#### Generate Test JWT Token

For testing, you can generate a JWT token using Node.js:

```javascript
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: '12345678-1234-4123-8123-123456789012' },
  'your-super-secret-jwt-key-change-in-production',
  { expiresIn: '24h' }
);
console.log(token);
```

#### Test Submit for Signatures

```bash
curl -X POST http://localhost:3004/api/reports/12345678-1234-4123-8123-123456789012/signatures/submit \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"12345678-1234-4123-8123-123456789012"}'
```

## Common Issues and Solutions

### Issue: "Login failed for user"

**Solution:**
- Verify database credentials in `.env`
- Check SQL Server authentication mode (should allow SQL Server authentication)
- Ensure user has appropriate permissions

### Issue: "Connection timeout"

**Solution:**
- Check if SQL Server is running
- Verify firewall rules allow connection on port 1433
- For Azure SQL, check firewall rules in Azure Portal

### Issue: "Migration already exists"

**Solution:**
- Check if migrations have already been run
- To revert: `npm run migration:revert`
- Then run again: `npm run migration:run`

### Issue: "Invalid token"

**Solution:**
- Ensure JWT_SECRET in `.env` matches the one used to generate token
- Check token hasn't expired
- Verify Authorization header format: `Bearer <token>`

## Next Steps

1. **Explore the API:**
   - Review `README.md` for complete API documentation
   - Test all endpoints using Postman or curl

2. **Review the Code:**
   - Check `src/features/signature-workflow/` for business logic
   - Review `src/database/migrations/` for database schema

3. **Run Tests:**
   ```bash
   npm test
   ```

4. **Production Deployment:**
   - Review production notes in configuration files
   - Update environment variables for production
   - Set up monitoring and logging
   - Configure HTTPS/TLS

## Project Structure Overview

```
src/
├── features/signature-workflow/  # Core business logic
│   ├── controllers/              # HTTP handlers
│   ├── services/                 # Business logic
│   ├── repositories/             # Data access
│   ├── entities/                 # Database models
│   └── routes/                   # API routes
├── shared/                       # Shared utilities
│   ├── middleware/               # Express middleware
│   ├── errors/                   # Error classes
│   └── utils/                    # Helper functions
├── integrations/                 # External service clients
├── config/                       # Configuration
├── database/                     # Migrations & data source
└── demo/                         # Demo application
```

## Support

For detailed documentation, see:
- `README.md` - Complete documentation
- `construction/unit4_signature_workflow/logical_design.md` - Design details
- `construction/unit4_signature_workflow/architecture_design.md` - Architecture overview

## Success Checklist

- [ ] Dependencies installed
- [ ] Database created and configured
- [ ] Environment variables set
- [ ] Migrations run successfully
- [ ] Demo application runs without errors
- [ ] Development server starts
- [ ] Health check endpoint responds
- [ ] API endpoints tested with JWT token

Once all items are checked, you're ready to develop and integrate with other services!
