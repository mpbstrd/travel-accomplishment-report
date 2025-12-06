# Report ID Validation Fix

## Issue
When submitting a report using `reportId: "test"`, the API returns:
```json
{
  "success": false,
  "error": {
    "message": "Invalid reportId format. Expected UUID v4."
  }
}
```

## Root Cause
The API validation middleware requires all reportIds to be in UUID v4 format for data integrity and consistency. The string "test" is not a valid UUID.

## Solution Implemented

### 1. Development Test Mode (Immediate Fix)
Added a development-only test mode that allows specific test values:

**Configuration Added:**
- `ALLOW_TEST_REPORT_IDS=true` in `.env` file
- Allows test values: `"test"`, `"demo"`, `"sample"`
- Only works in development mode (`NODE_ENV=development`)

**Usage:**
```bash
# Now works with test reportId
POST /api/reports/test/signatures/submit
POST /api/reports/demo/signatures/submit  
POST /api/reports/sample/signatures/submit
```

### 2. Proper UUID Testing (Recommended)
For more realistic testing, use proper UUID v4 format:

**Test UUIDs you can use:**
```
12345678-1234-4123-8123-123456789012  # Primary test report
87654321-4321-4321-8321-210987654321  # Secondary test report
aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee  # Demo report
11111111-2222-4333-8444-555555555555  # Sample report
```

## Testing Examples

### Option 1: Using Test Mode (Simple) ✅ **NOW WORKS**
```bash
# Submit report for signatures
curl -X POST http://localhost:3005/api/reports/test/signatures/submit \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-001"}'

# Record a signature  
curl -X POST http://localhost:3005/api/reports/test/signatures \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "signatureType": "PREPARED_BY",
    "signatoryName": "John Smith", 
    "disclaimerAcknowledged": true,
    "userId": "user-001"
  }'
```

**Supported Test User IDs:**
- `user-001`, `user-002`, `user-003`
- `test-user`, `admin`, `demo-user`
- `john-smith`, `jane-doe`, `bob-johnson`

### Option 2: Using Proper UUIDs (Recommended)
```bash
# Submit report for signatures
curl -X POST http://localhost:3005/api/reports/12345678-1234-4123-8123-123456789012/signatures/submit \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{"userId":"11111111-1111-4111-8111-111111111111"}'

# Record a signature
curl -X POST http://localhost:3005/api/reports/12345678-1234-4123-8123-123456789012/signatures \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "signatureType": "PREPARED_BY",
    "signatoryName": "John Smith",
    "disclaimerAcknowledged": true, 
    "userId": "11111111-1111-4111-8111-111111111111"
  }'
```

## Important Notes

1. **Restart Required**: After updating the `.env` file, restart the application:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart
   npm run dev
   ```

2. **Production Safety**: The test mode is automatically disabled in production (`NODE_ENV=production`)

3. **User ID Format**: ✅ **FIXED** - `userId` now supports test values in development mode:
   - Test values: `user-001`, `user-002`, `user-003`, `test-user`, `admin`, `demo-user`
   - Or use proper UUIDs like `11111111-1111-4111-8111-111111111111`

4. **JWT Token**: Make sure you're using a valid JWT token. The examples show a truncated token - use the full token from your authentication.

## Quick Test ✅ **BOTH ISSUES FIXED**
After restarting the server, test with:
```bash
# Test with simple test IDs (now works!)
curl -X POST http://localhost:3005/api/reports/test/signatures/submit \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-001"}'

# Or test with UUIDs
curl -X POST http://localhost:3005/api/reports/11111111-1111-4111-8111-111111111111/signatures/submit \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" \
  -H "Content-Type: application/json" \
  -d '{"userId":"22222222-2222-4222-8222-222222222222"}'
```

Both approaches should now work without validation errors!