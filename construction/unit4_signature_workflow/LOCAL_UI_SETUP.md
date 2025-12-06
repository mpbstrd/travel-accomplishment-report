# 🚀 Local UI Testing - Quick Setup Guide

## What You'll Get

A simple, user-friendly web interface to test the Signature Workflow without writing any code!

**5 Pages:**
1. **Home** - Overview and navigation
2. **Submit Report** - Submit reports for signatures
3. **Record Signature** - Record individual signatures
4. **Signature Status** - Check workflow progress
5. **Signature History** - View all signatures

---

## 📋 Prerequisites

You need to install:

1. **Node.js 18+** - Download from https://nodejs.org/
   - Choose the LTS (Long Term Support) version
   - This includes npm (package manager)

2. **Docker Desktop** - Download from https://www.docker.com/products/docker-desktop/
   - Required for MS SQL Server database
   - Make sure it's running before starting

---

## 🚀 Quick Start (5 Steps)

### Step 1: Open Terminal in the Source Directory

```bash
# Navigate to the source directory
cd "construction/unit4_signature_workflow/src"
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (Express, TypeORM, etc.)

### Step 3: Start the Database

```bash
# Start MS SQL Server in Docker
docker-compose up -d

# Wait 30 seconds for SQL Server to start
# You can check if it's ready with:
docker-compose logs mssql
```

### Step 4: Setup Database

```bash
# Run database migrations
npm run migration:run

# Seed test data
npm run seed
```

This creates the database tables and adds test data:
- **report-001** - Completed workflow (all 3 signatures)
- **report-002** - Draft workflow (incomplete report)
- **report-003** - Partial workflow (1 signature, pending branch ack)

### Step 5: Start the Application

```bash
npm run dev
```

You should see:
```
Server running on http://localhost:3004
Mock services enabled
```

---

## 🌐 Access the Web UI

Open your browser and go to:

```
http://localhost:3004
```

You'll see the home page with navigation to all testing pages!

---

## 🎯 What You Can Test

### Test Scenario 1: View Completed Workflow
1. Click **"Signature Status"** in the menu
2. Enter Report ID: `report-001`
3. Click **"Check Status"**
4. See all 3 signatures completed ✅

### Test Scenario 2: Submit a Report (Will Fail - Expected)
1. Click **"Submit Report"** in the menu
2. Enter Report ID: `report-002`
3. Select any user
4. Click **"Submit Report"**
5. See validation error (report is incomplete) ❌

### Test Scenario 3: Record a Signature
1. Click **"Record Signature"** in the menu
2. Enter Report ID: `report-003`
3. Select Signature Type: **"Branch Acknowledgement"**
4. Enter Name: `John Doe`
5. Select User: `user-001 (John Doe - Branch Manager)`
6. Check the disclaimer checkbox ✅
7. Click **"Record Signature"**
8. See success message! 🎉

### Test Scenario 4: View Signature History
1. Click **"Signature History"** in the menu
2. Enter Report ID: `report-001`
3. Click **"View History"**
4. See all 3 signatures with timestamps 📋

---

## 📊 Test Data Reference

### Available Reports

| Report ID | Status | Signatures | Description |
|-----------|--------|-----------|-------------|
| report-001 | COMPLETED | 3/3 | All signatures completed |
| report-002 | DRAFT | 0/3 | Incomplete (for testing errors) |
| report-003 | PENDING_BRANCH_ACK | 1/3 | One signature done |

### Available Users

| User ID | Name | Role | Signs As |
|---------|------|------|----------|
| user-001 | John Doe | Branch Manager | Branch Acknowledgement |
| user-002 | Jane Smith | Branch Staff | Prepared By |
| user-003 | Bob Johnson | NISD Staff | NISD Acknowledgement |

### Signature Types

1. **PREPARED_BY** - First signature (Branch Staff)
2. **BRANCH_ACKNOWLEDGEMENT** - Second signature (Branch Manager)
3. **NISD_ACKNOWLEDGEMENT** - Third signature (NISD Staff)

---

## 🎨 UI Features

### Home Page
- Overview of test scenarios
- Quick action buttons
- Test data reference
- Navigation menu

### Submit Report Page
- Form to submit reports
- User selection dropdown
- Real-time API response
- Error handling

### Record Signature Page
- Signature type selection
- Name input (max 100 characters)
- User selection
- Disclaimer checkbox (required)
- Success/error feedback

### Signature Status Page
- Check current workflow state
- See completed signatures
- View progress (X/3)
- Check if user can sign

### Signature History Page
- View all signatures chronologically
- See signatory names
- See timestamps
- See signature types

---

## 🔧 Troubleshooting

### Issue: npm command not found
**Solution:** Install Node.js from https://nodejs.org/

### Issue: docker-compose command not found
**Solution:** Install Docker Desktop and make sure it's running

### Issue: Port 3004 already in use
**Solution:** 
```bash
# Change port in .env file
PORT=3005

# Or kill the process using port 3004
```

### Issue: Database connection error
**Solution:**
```bash
# Check if Docker is running
docker ps

# Restart database
docker-compose down
docker-compose up -d

# Wait 30 seconds, then retry
```

### Issue: Cannot connect to database
**Solution:**
```bash
# Check database logs
docker-compose logs mssql

# Make sure you see "SQL Server is now ready for client connections"
```

### Issue: No test data
**Solution:**
```bash
# Re-run seed script
npm run seed
```

---

## 🎓 Step-by-Step First Time Setup

### 1. Install Node.js
- Go to https://nodejs.org/
- Download LTS version (e.g., 18.x or 20.x)
- Run installer
- Accept defaults
- Verify: Open terminal and type `node --version`

### 2. Install Docker Desktop
- Go to https://www.docker.com/products/docker-desktop/
- Download for Windows
- Run installer
- Start Docker Desktop
- Wait for it to say "Docker Desktop is running"

### 3. Open Terminal
- Press `Win + R`
- Type `cmd` and press Enter
- Or use PowerShell or Windows Terminal

### 4. Navigate to Project
```bash
cd "C:\Users\YourUsername\OneDrive\Documents\Kiro\Projects\Travel Accomplishment\construction\unit4_signature_workflow\src"
```

### 5. Run Setup Commands
```bash
# Install dependencies (takes 1-2 minutes)
npm install

# Start database (takes 30 seconds)
docker-compose up -d

# Wait 30 seconds, then:
npm run migration:run
npm run seed

# Start application
npm run dev
```

### 6. Open Browser
- Go to http://localhost:3004
- Start testing!

---

## 📱 UI Screenshots (What to Expect)

### Home Page
- Purple gradient header
- Navigation menu with 5 links
- Welcome section with test scenarios
- Quick action buttons
- Test data reference cards

### Form Pages
- Clean, modern forms
- Dropdown selections
- Input validation
- Submit buttons
- Response section (shows API results)

### Response Display
- Green background for success ✅
- Red background for errors ❌
- JSON formatted response
- Easy to read

---

## 🎯 Complete Testing Workflow

### Full Test (10 minutes)

1. **Start Everything**
   ```bash
   docker-compose up -d
   npm run dev
   ```

2. **Test 1: View Completed Workflow**
   - Go to Signature Status
   - Check report-001
   - See all 3 signatures ✅

3. **Test 2: Try Invalid Submission**
   - Go to Submit Report
   - Try report-002
   - See validation error ❌

4. **Test 3: Record a Signature**
   - Go to Record Signature
   - Sign report-003 as Branch Manager
   - See success ✅

5. **Test 4: Check Updated Status**
   - Go to Signature Status
   - Check report-003
   - See 2/3 signatures now ✅

6. **Test 5: Complete Workflow**
   - Record NISD Acknowledgement
   - Check status again
   - See 3/3 completed! 🎉

---

## 🌟 Additional Features

### API Documentation
Access Swagger docs at:
```
http://localhost:3004/api-docs
```

Features:
- Interactive API explorer
- Try endpoints directly
- See request/response schemas
- Authentication examples

### Health Check
Check if server is running:
```
http://localhost:3004/health
```

Should return:
```json
{
  "status": "healthy",
  "service": "signature-workflow",
  "mockMode": true
}
```

---

## 🛑 Stopping the Application

### Stop the Application
Press `Ctrl + C` in the terminal where `npm run dev` is running

### Stop the Database
```bash
docker-compose down
```

### Stop and Remove Data
```bash
docker-compose down -v
```

---

## 📚 Next Steps

After testing the UI:

1. **Explore Swagger Docs** - http://localhost:3004/api-docs
2. **Read API Examples** - See `API_EXAMPLES.md`
3. **Run Automated Tests** - `npm run test:all`
4. **Review Test Code** - Check `tests/` directory

---

## ✅ Success Checklist

- [ ] Node.js installed
- [ ] Docker Desktop installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] Database started (`docker-compose up -d`)
- [ ] Migrations run (`npm run migration:run`)
- [ ] Data seeded (`npm run seed`)
- [ ] Application started (`npm run dev`)
- [ ] Browser opened to http://localhost:3004
- [ ] Can see the home page
- [ ] Can navigate between pages
- [ ] Can submit forms and see responses

---

## 🎉 You're Ready!

The UI is simple, clean, and fully functional. You can:
- ✅ Test all API endpoints
- ✅ See real-time responses
- ✅ Test error scenarios
- ✅ Complete full workflows
- ✅ No coding required!

**Enjoy testing!** 🚀

---

**Need Help?** Check `TESTING_GUIDE.md` for more detailed information.
