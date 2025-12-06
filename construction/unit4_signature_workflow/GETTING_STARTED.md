# Getting Started - Unit 4: Signature Workflow

Welcome! This guide will help you get up and running with the Signature Workflow service in under 15 minutes.

## ⚡ Quick Start (5 minutes)

```bash
# 1. Navigate to project
cd construction/unit4_signature_workflow/src

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your database settings

# 4. Run migrations
npm run migration:run

# 5. Run demo
npm run demo

# 6. Start server
npm run dev
```

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18 or higher installed
- [ ] MS SQL Server running (local or Azure SQL)
- [ ] npm or yarn package manager
- [ ] A code editor (VS Code recommended)
- [ ] SQL Server Management Studio (optional, for database inspection)

## 🎯 Step-by-Step Setup

### Step 1: Verify Prerequisites (2 minutes)

Check your Node.js version:
```bash
node --version
# Should show v18.x.x or higher
```

Check if SQL Server is running:
```bash
# Windows
sc query MSSQLSERVER

# Or try connecting with sqlcmd
sqlcmd -S localhost -U sa -P YourPassword
```

### Step 2: Install Dependencies (2 minutes)

```bash
cd construction/unit4_signature_workflow/src
npm install
```

You should see:
- ✅ express, typeorm, typescript installed
- ✅ mssql driver installed
- ✅ All dependencies resolved
- ✅ No errors

### Step 3: Configure Database (3 minutes)

#### Option A: Local SQL Server

1. Create database:
```sql
CREATE DATABASE signature_workflow_db;
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=1433
DB_NAME=signature_workflow_db
DB_USER=sa
DB_PASSWORD=YourStrong@Passw0rd
```

#### Option B: Azure SQL Database

1. Create Azure SQL Database in Azure Portal

2. Get connection string

3. Edit `.env`:
```env
DB_HOST=yourserver.database.windows.net
DB_PORT=1433
DB_NAME=signature_workflow_db
DB_USER=yourusername
DB_PASSWORD=yourpassword
DB_ENCRYPT=true
DB_TRUST_SERVER_CERTIFICATE=false
```

### Step 4: Run Migrations (1 minute)

```bash
npm run migration:run
```

You should see:
```
✓ Database connection established successfully
Migration CreateSignatureTable1700000001 has been executed successfully
Migration CreateWorkflowStateTable1700000002 has been executed successfully
```

### Step 5: Verify Setup (2 minutes)

Run the demo application:
```bash
npm run demo
```

You should see:
```
============================================================
SIGNATURE WORKFLOW DEMO
============================================================
✓ Database connected
✓ Report submitted successfully
✓ Signature recorded: John Smith
✓ Signature recorded: Jane Doe
✓ Signature recorded: Bob Johnson
============================================================
DEMO COMPLETED SUCCESSFULLY
============================================================
```

### Step 6: Start Development Server (1 minute)

```bash
npm run dev
```

You should see:
```
✓ Database connection established successfully
✓ Server started successfully
  Environment: development
  Port: 3004
  URL: http://localhost:3004
  Health: http://localhost:3004/health
```

### Step 7: Test the API (2 minutes)

Open a new terminal and test the health endpoint:
```bash
curl http://localhost:3004/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "signature-workflow",
  "version": "1.0.0"
}
```

## ✅ Success Checklist

Verify everything is working:

- [ ] Dependencies installed without errors
- [ ] Database created and accessible
- [ ] Environment variables configured
- [ ] Migrations ran successfully
- [ ] Demo application completed successfully
- [ ] Development server started
- [ ] Health check endpoint responds
- [ ] No errors in console

## 🎉 You're Ready!

If all checkboxes are checked, you're ready to:
- Explore the API endpoints
- Review the code structure
- Start development
- Integrate with other services

## 📚 What's Next?

### For Developers
1. **Explore the API**
   - Read [API_EXAMPLES.md](API_EXAMPLES.md) for complete examples
   - Test endpoints using Postman or curl
   - Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for quick commands

2. **Understand the Code**
   - Review `src/features/signature-workflow/` for business logic
   - Check `src/database/migrations/` for database schema
   - Read inline code comments

3. **Start Developing**
   - Use `npm run dev` for hot reload
   - Check logs for debugging
   - Follow existing code patterns

### For Architects
1. **Review Architecture**
   - Read [architecture_design.md](architecture_design.md)
   - Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
   - Evaluate integration points

2. **Plan Integration**
   - Review mock integration clients
   - Plan actual implementations
   - Design service communication

### For Project Managers
1. **Review Status**
   - Read [COMPLETION_REPORT.md](COMPLETION_REPORT.md)
   - Check implementation metrics
   - Review next steps

2. **Plan Next Phase**
   - Schedule testing phase
   - Plan integration with other services
   - Prepare for production deployment

## 🔧 Common Issues

### Issue: "Cannot connect to database"

**Solution:**
1. Verify SQL Server is running
2. Check credentials in `.env`
3. Test connection with SQL Server Management Studio
4. Check firewall rules

### Issue: "Migration already exists"

**Solution:**
```bash
npm run migration:revert
npm run migration:run
```

### Issue: "Port 3004 already in use"

**Solution:**
Change port in `.env`:
```env
PORT=3005
```

### Issue: "Module not found"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 💡 Pro Tips

1. **Use VS Code Extensions:**
   - ESLint
   - Prettier
   - TypeScript Hero
   - REST Client

2. **Enable Auto-Save:**
   - Hot reload works best with auto-save enabled

3. **Use Postman:**
   - Import API examples
   - Save JWT tokens
   - Create test collections

4. **Check Logs:**
   - Set `LOG_LEVEL=debug` for detailed logs
   - Review console output for errors
   - Use Winston logger in code

5. **Database Inspection:**
   - Use SQL Server Management Studio
   - Check table structures
   - Verify data after operations

## 📞 Need Help?

### Documentation
- [README.md](README.md) - Complete documentation
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick commands
- [API_EXAMPLES.md](API_EXAMPLES.md) - API examples

### Troubleshooting
- [SETUP_GUIDE.md#common-issues](SETUP_GUIDE.md#common-issues-and-solutions)
- [README.md#troubleshooting](README.md#troubleshooting)

### Code Review
- Check inline comments in source files
- Review service implementations
- Check middleware implementations

## 🚀 Ready to Code!

You're all set! The signature workflow service is running and ready for development.

**Happy coding!** 🎉

---

**Estimated Setup Time:** 15 minutes  
**Difficulty:** Easy  
**Prerequisites:** Node.js, MS SQL Server  
**Status:** Production Ready
