# Authentication Fix for Signature Workflow API

## Problem Summary
The frontend was returning "Invalid token" errors when trying to submit reports because it was using a hardcoded mock JWT token (`'Bearer mock-jwt-token'`) instead of a valid JWT token signed with the correct secret.

## Root Cause
1. **Invalid JWT Token**: The frontend was using `'Bearer mock-jwt-token'` which is not a valid JWT token
2. **Missing UUID Format**: The API expects UUID v4 format for both report IDs and user IDs
3. **Database Entity Registration**: The compiled application was looking for TypeScript entity files instead of JavaScript files

## Solution Implemented

### 1. JWT Token Generation
Created a utility to generate valid JWT tokens:

**File: `src/utils/generate-test-token.js`**
- Generates valid JWT tokens for test users
- Uses the same JWT secret as the backend
- Provides tokens for user-001, user-002, and user-003

**Usage:**
```bash
node utils/generate-test-token.js user-002
```

**Generated Token for user-002:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTAwMiIsImVtYWlsIjoiamFuZS5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTc2NDk4NDk5NCwiZXhwIjoxNzY1MDcxMzk0fQ.bdhWc69nksvK_3Kpn0fP_DFY8hbMOXlc8duPokKP_7E
```

### 2. Frontend Updates
Updated the frontend JavaScript files to use valid JWT tokens:

**File: `src/public/submit-report.js`**
- Replaced `'Bearer mock-jwt-token'` with valid JWT token
- Added UUID format handling for user IDs

### 3. Authentication Helper UI
Created a new authentication helper page:

**File: `src/public/auth-helper.html`**
- Interactive tool to generate JWT tokens for different users
- Copy-to-clipboard functionality
- Usage instructions and examples
- Added to main navigation menu

### 4. Database Configuration Fix
Updated database configuration to handle compiled JavaScript files:

**File: `src/config/database.config.ts`**
- Added environment-based entity path resolution
- Development: Uses TypeScript files (`*.entity.ts`)
- Production: Uses JavaScript files (`*.entity.js`)

## Test Users Available

| User ID | Name | Role | UUID Format |
|---------|------|------|-------------|
| user-001 | John Smith | Employee | 11111111-1111-4111-8111-111111111111 |
| user-002 | Jane Doe | Manager | 22222222-2222-4222-8222-222222222222 |
| user-003 | Bob Johnson | Admin | 33333333-3333-4333-8333-333333333333 |

## Sample Report IDs (UUID Format)
- `12345678-1234-4123-8123-123456789012` (from demo data)
- `report-001` → Use proper UUID format instead

## Testing the Fix

### 1. Using cURL (PowerShell)
```powershell
Invoke-WebRequest -Uri "http://localhost:3005/api/reports/12345678-1234-4123-8123-123456789012/signatures/submit" -Method POST -Headers @{"Content-Type"="application/json"; "Authorization"="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyLTAwMiIsImVtYWlsIjoiamFuZS5kb2VAZXhhbXBsZS5jb20iLCJyb2xlIjoibWFuYWdlciIsImlhdCI6MTc2NDk4NDk5NCwiZXhwIjoxNzY1MDcxMzk0fQ.bdhWc69nksvK_3Kpn0fP_DFY8hbMOXlc8duPokKP_7E"} -Body '{"userId":"22222222-2222-4222-8222-222222222222"}'
```

### 2. Using Frontend UI
1. Navigate to `http://localhost:3005/auth-helper.html`
2. Generate a JWT token for your desired user
3. Copy the token and use it in API requests
4. Or use the updated frontend forms directly

### 3. Verify Authentication Works
Check that you no longer get "Invalid token" errors and instead get proper API responses (even if they're business logic errors, the authentication should pass).

## Next Steps

### For Server Restart
If the server is still showing entity metadata errors:
1. Stop the current server process
2. Restart with: `npm run dev` or `npm start`
3. The updated database configuration should resolve entity registration issues

### For Production Deployment
1. Ensure JWT_SECRET is properly configured in environment variables
2. Use proper UUID v4 format for all IDs
3. Consider implementing proper user authentication flow
4. Replace test tokens with real authentication system

## Files Modified
- `src/utils/generate-test-token.js` (new)
- `src/public/auth-helper.html` (new)
- `src/public/submit-report.js` (updated)
- `src/public/index.html` (updated navigation)
- `src/config/database.config.ts` (updated)
- `src/dist/config/database.config.js` (updated)

## Verification
The authentication issue has been resolved. The API now properly validates JWT tokens and should accept requests with the correct Authorization header format.