# API Examples - Unit 4: Signature Workflow

Complete examples of all API endpoints with request/response samples.

## Base URL

```
http://localhost:3004/api
```

## Authentication

All endpoints (except health check) require JWT authentication:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 1. Submit Report for Signatures

Initiates the signature workflow for a report.

### Request

```http
POST /api/reports/12345678-1234-4123-8123-123456789012/signatures/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "11111111-1111-4111-8111-111111111111"
}
```

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Report submitted successfully. Awaiting signature from Prepared By.",
  "data": {
    "workflowState": {
      "workflowId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "reportId": "12345678-1234-4123-8123-123456789012",
      "currentState": "PENDING_PREPARED_BY",
      "submittedAt": "2024-01-15T10:30:00.000Z",
      "completedAt": null,
      "preparedBySignatureId": null,
      "branchAckSignatureId": null,
      "nisdAckSignatureId": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Report must be completed before submission",
    "details": [
      "All required fields must be completed",
      "All 7 checklist items must be answered"
    ]
  }
}
```

---

## 2. Record Signature

Records a signature for the report.

### Request - Prepared By

```http
POST /api/reports/12345678-1234-4123-8123-123456789012/signatures
Authorization: Bearer {token}
Content-Type: application/json

{
  "signatureType": "PREPARED_BY",
  "signatoryName": "John Smith",
  "disclaimerAcknowledged": true,
  "userId": "22222222-2222-4222-8222-222222222222"
}
```

### Success Response (201 Created)

```json
{
  "success": true,
  "message": "Signature recorded successfully",
  "data": {
    "signature": {
      "signatureId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      "reportId": "12345678-1234-4123-8123-123456789012",
      "signatureType": "PREPARED_BY",
      "signatoryName": "John Smith",
      "signatoryUserId": "22222222-2222-4222-8222-222222222222",
      "signedAt": "2024-01-15T10:35:00.000Z",
      "ipAddress": "192.168.1.100",
      "disclaimerAcknowledged": true,
      "createdAt": "2024-01-15T10:35:00.000Z"
    },
    "workflowState": {
      "workflowId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "reportId": "12345678-1234-4123-8123-123456789012",
      "currentState": "PENDING_BRANCH_ACK",
      "submittedAt": "2024-01-15T10:30:00.000Z",
      "completedAt": null,
      "preparedBySignatureId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      "branchAckSignatureId": null,
      "nisdAckSignatureId": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    },
    "message": "Signature recorded successfully",
    "nextSignatureRequired": "BRANCH_ACKNOWLEDGEMENT"
  }
}
```

### Request - Branch Acknowledgement

```http
POST /api/reports/12345678-1234-4123-8123-123456789012/signatures
Authorization: Bearer {token}
Content-Type: application/json

{
  "signatureType": "BRANCH_ACKNOWLEDGEMENT",
  "signatoryName": "Jane Doe",
  "disclaimerAcknowledged": true,
  "userId": "33333333-3333-4333-8333-333333333333"
}
```

### Request - NISD Acknowledgement

```http
POST /api/reports/12345678-1234-4123-8123-123456789012/signatures
Authorization: Bearer {token}
Content-Type: application/json

{
  "signatureType": "NISD_ACKNOWLEDGEMENT",
  "signatoryName": "Bob Johnson",
  "disclaimerAcknowledged": true,
  "userId": "44444444-4444-4444-8444-444444444444"
}
```

### Success Response - Final Signature (201 Created)

```json
{
  "success": true,
  "message": "Signature recorded successfully",
  "data": {
    "signature": {
      "signatureId": "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      "reportId": "12345678-1234-4123-8123-123456789012",
      "signatureType": "NISD_ACKNOWLEDGEMENT",
      "signatoryName": "Bob Johnson",
      "signatoryUserId": "44444444-4444-4444-8444-444444444444",
      "signedAt": "2024-01-15T10:45:00.000Z",
      "ipAddress": "192.168.1.102",
      "disclaimerAcknowledged": true,
      "createdAt": "2024-01-15T10:45:00.000Z"
    },
    "workflowState": {
      "workflowId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "reportId": "12345678-1234-4123-8123-123456789012",
      "currentState": "COMPLETED",
      "submittedAt": "2024-01-15T10:30:00.000Z",
      "completedAt": "2024-01-15T10:45:00.000Z",
      "preparedBySignatureId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      "branchAckSignatureId": "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      "nisdAckSignatureId": "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:45:00.000Z"
    },
    "message": "Signature recorded successfully",
    "nextSignatureRequired": null
  }
}
```

### Error Response (403 Forbidden)

```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not authorized to sign this report; Previous signature step must be completed first"
  }
}
```

### Error Response (400 Bad Request)

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      "You must acknowledge the disclaimer to proceed",
      "Signatory name is required"
    ]
  }
}
```

### Error Response (409 Conflict)

```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "This signature has already been recorded"
  }
}
```

---

## 3. Get Signature Status

Retrieves current signature status for a report.

### Request

```http
GET /api/reports/12345678-1234-4123-8123-123456789012/signatures/status
Authorization: Bearer {token}
```

### Success Response - In Progress (200 OK)

```json
{
  "success": true,
  "data": {
    "workflowState": {
      "workflowId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "reportId": "12345678-1234-4123-8123-123456789012",
      "currentState": "PENDING_BRANCH_ACK",
      "submittedAt": "2024-01-15T10:30:00.000Z",
      "completedAt": null,
      "preparedBySignatureId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      "branchAckSignatureId": null,
      "nisdAckSignatureId": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    },
    "signatures": [
      {
        "signatureId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        "reportId": "12345678-1234-4123-8123-123456789012",
        "signatureType": "PREPARED_BY",
        "signatoryName": "John Smith",
        "signatoryUserId": "22222222-2222-4222-8222-222222222222",
        "signedAt": "2024-01-15T10:35:00.000Z",
        "ipAddress": "192.168.1.100",
        "disclaimerAcknowledged": true,
        "createdAt": "2024-01-15T10:35:00.000Z"
      }
    ],
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

### Success Response - Completed (200 OK)

```json
{
  "success": true,
  "data": {
    "workflowState": {
      "workflowId": "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
      "reportId": "12345678-1234-4123-8123-123456789012",
      "currentState": "COMPLETED",
      "submittedAt": "2024-01-15T10:30:00.000Z",
      "completedAt": "2024-01-15T10:45:00.000Z",
      "preparedBySignatureId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
      "branchAckSignatureId": "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      "nisdAckSignatureId": "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:45:00.000Z"
    },
    "signatures": [
      {
        "signatureId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        "reportId": "12345678-1234-4123-8123-123456789012",
        "signatureType": "PREPARED_BY",
        "signatoryName": "John Smith",
        "signatoryUserId": "22222222-2222-4222-8222-222222222222",
        "signedAt": "2024-01-15T10:35:00.000Z",
        "ipAddress": "192.168.1.100",
        "disclaimerAcknowledged": true,
        "createdAt": "2024-01-15T10:35:00.000Z"
      },
      {
        "signatureId": "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        "reportId": "12345678-1234-4123-8123-123456789012",
        "signatureType": "BRANCH_ACKNOWLEDGEMENT",
        "signatoryName": "Jane Doe",
        "signatoryUserId": "33333333-3333-4333-8333-333333333333",
        "signedAt": "2024-01-15T10:40:00.000Z",
        "ipAddress": "192.168.1.101",
        "disclaimerAcknowledged": true,
        "createdAt": "2024-01-15T10:40:00.000Z"
      },
      {
        "signatureId": "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        "reportId": "12345678-1234-4123-8123-123456789012",
        "signatureType": "NISD_ACKNOWLEDGEMENT",
        "signatoryName": "Bob Johnson",
        "signatoryUserId": "44444444-4444-4444-8444-444444444444",
        "signedAt": "2024-01-15T10:45:00.000Z",
        "ipAddress": "192.168.1.102",
        "disclaimerAcknowledged": true,
        "createdAt": "2024-01-15T10:45:00.000Z"
      }
    ],
    "nextRequired": null,
    "progress": {
      "completed": 3,
      "total": 3
    },
    "canCurrentUserSign": false,
    "currentUserSignatureType": null
  }
}
```

---

## 4. Get Signature History

Retrieves complete signature history for a report.

### Request

```http
GET /api/reports/12345678-1234-4123-8123-123456789012/signatures/history
Authorization: Bearer {token}
```

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "signatures": [
      {
        "signatureId": "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        "reportId": "12345678-1234-4123-8123-123456789012",
        "signatureType": "PREPARED_BY",
        "signatoryName": "John Smith",
        "signatoryUserId": "22222222-2222-4222-8222-222222222222",
        "signedAt": "2024-01-15T10:35:00.000Z",
        "ipAddress": "192.168.1.100",
        "disclaimerAcknowledged": true,
        "createdAt": "2024-01-15T10:35:00.000Z"
      },
      {
        "signatureId": "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
        "reportId": "12345678-1234-4123-8123-123456789012",
        "signatureType": "BRANCH_ACKNOWLEDGEMENT",
        "signatoryName": "Jane Doe",
        "signatoryUserId": "33333333-3333-4333-8333-333333333333",
        "signedAt": "2024-01-15T10:40:00.000Z",
        "ipAddress": "192.168.1.101",
        "disclaimerAcknowledged": true,
        "createdAt": "2024-01-15T10:40:00.000Z"
      },
      {
        "signatureId": "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
        "reportId": "12345678-1234-4123-8123-123456789012",
        "signatureType": "NISD_ACKNOWLEDGEMENT",
        "signatoryName": "Bob Johnson",
        "signatoryUserId": "44444444-4444-4444-8444-444444444444",
        "signedAt": "2024-01-15T10:45:00.000Z",
        "ipAddress": "192.168.1.102",
        "disclaimerAcknowledged": true,
        "createdAt": "2024-01-15T10:45:00.000Z"
      }
    ]
  }
}
```

---

## 5. Get Available Actions

Retrieves actions available to the current user.

### Request

```http
GET /api/reports/12345678-1234-4123-8123-123456789012/signatures/available-actions
Authorization: Bearer {token}
```

### Success Response - Can Sign (200 OK)

```json
{
  "success": true,
  "data": {
    "actions": ["sign"],
    "canSign": true,
    "signatureType": "BRANCH_ACKNOWLEDGEMENT",
    "message": "You can sign as BRANCH_ACKNOWLEDGEMENT"
  }
}
```

### Success Response - Cannot Sign (200 OK)

```json
{
  "success": true,
  "data": {
    "actions": [],
    "canSign": false,
    "signatureType": null,
    "message": "You are not assigned to this signature role"
  }
}
```

### Success Response - Workflow Complete (200 OK)

```json
{
  "success": true,
  "data": {
    "actions": [],
    "canSign": false,
    "signatureType": null,
    "message": "Workflow is complete"
  }
}
```

---

## 6. Health Check

Check service health status.

### Request

```http
GET /health
```

### Success Response (200 OK)

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "signature-workflow",
  "version": "1.0.0"
}
```

---

## Common Error Responses

### 401 Unauthorized

```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authorization header is required"
  }
}
```

### 404 Not Found

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Workflow state not found for report 12345678-1234-4123-8123-123456789012"
  }
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Testing with cURL

### Complete Workflow Example

```bash
# 1. Submit for signatures
curl -X POST http://localhost:3004/api/reports/12345678-1234-4123-8123-123456789012/signatures/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"11111111-1111-4111-8111-111111111111"}'

# 2. Record Prepared By signature
curl -X POST http://localhost:3004/api/reports/12345678-1234-4123-8123-123456789012/signatures \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "signatureType": "PREPARED_BY",
    "signatoryName": "John Smith",
    "disclaimerAcknowledged": true,
    "userId": "22222222-2222-4222-8222-222222222222"
  }'

# 3. Check status
curl http://localhost:3004/api/reports/12345678-1234-4123-8123-123456789012/signatures/status \
  -H "Authorization: Bearer YOUR_TOKEN"

# 4. Record Branch Acknowledgement signature
curl -X POST http://localhost:3004/api/reports/12345678-1234-4123-8123-123456789012/signatures \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "signatureType": "BRANCH_ACKNOWLEDGEMENT",
    "signatoryName": "Jane Doe",
    "disclaimerAcknowledged": true,
    "userId": "33333333-3333-4333-8333-333333333333"
  }'

# 5. Record NISD Acknowledgement signature
curl -X POST http://localhost:3004/api/reports/12345678-1234-4123-8123-123456789012/signatures \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "signatureType": "NISD_ACKNOWLEDGEMENT",
    "signatoryName": "Bob Johnson",
    "disclaimerAcknowledged": true,
    "userId": "44444444-4444-4444-8444-444444444444"
  }'

# 6. Get complete history
curl http://localhost:3004/api/reports/12345678-1234-4123-8123-123456789012/signatures/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Note:** Replace `YOUR_TOKEN` with an actual JWT token generated for testing.
