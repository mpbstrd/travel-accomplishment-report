# Unit 3: File Management

## Unit Overview

**Business Capability:** Handle file uploads, storage, and retrieval

**Purpose:** This unit manages all file-related operations including image uploads, storage, retrieval, validation, and optimization. It provides secure and reliable file storage services to the Report Management unit.

**Scope:**
- File upload handling
- File validation (format, size, security)
- File storage and organization
- File retrieval and serving
- Image optimization and compression
- Storage capacity management

**Team Size:** Single team (2 developers)

**Dependencies:**
- Consumes: User Management (authentication), Report Management (report association)
- Provides: File storage and retrieval services to Report Management

---

## User Stories

### US-2.5: Upload Images to Report
**As a** User  
**I want to** upload images to the report  
**So that** I can provide visual documentation of the branch visit

**Acceptance Criteria:**
- AC-2.5.1: System provides image upload interface
- AC-2.5.2: System accepts the following file formats: JPG, JPEG, PNG, PDF
- AC-2.5.3: System enforces maximum file size of 15MB per file
- AC-2.5.4: System allows maximum of 10 images per report
- AC-2.5.5: System displays error message "File size exceeds 15MB limit" for oversized files
- AC-2.5.6: System displays error message "Maximum 10 images allowed per report" when limit reached
- AC-2.5.7: System displays error message "Unsupported file format" for invalid file types
- AC-2.5.8: System shows thumbnail preview of uploaded images
- AC-2.5.9: User can delete uploaded images before submission
- AC-2.5.10: System displays upload progress indicator
- AC-2.5.11: System labels images with upload timestamp
- AC-2.5.12: User can add caption/description to each image (optional, max 200 characters)
- AC-2.5.13: System stores images securely with report association

### US-9.4: Validate File Uploads
**As a** System  
**I want to** validate file uploads  
**So that** only appropriate files are stored in the system

**Acceptance Criteria:**
- AC-9.4.1: System accepts only: JPG, JPEG, PNG, PDF file formats
- AC-9.4.2: System rejects files larger than 15MB
- AC-9.4.3: System limits uploads to maximum 10 files per report
- AC-9.4.4: System displays error: "File size exceeds 15MB limit. Please upload a smaller file."
- AC-9.4.5: System displays error: "Unsupported file format. Please upload JPG, JPEG, PNG, or PDF files only."
- AC-9.4.6: System displays error: "Maximum 10 images allowed per report. Please delete an existing image to upload a new one."
- AC-9.4.7: System scans uploaded files for malware/viruses
- AC-9.4.8: System rejects files that fail security scan
- AC-9.4.9: System validates file integrity (not corrupted)
- AC-9.4.10: System generates unique filename for each uploaded file
- AC-9.4.11: System stores original filename for user reference

### US-10.3: Reliable File Storage
**As a** System  
**I want to** store uploaded files reliably  
**So that** images are never lost and always accessible

**Acceptance Criteria:**
- AC-10.3.1: System stores files in redundant storage
- AC-10.3.2: System generates unique identifiers for each file
- AC-10.3.3: System maintains file-to-report associations
- AC-10.3.4: System prevents file corruption
- AC-10.3.5: System includes files in backup process
- AC-10.3.6: System provides file recovery mechanism
- AC-10.3.7: System optimizes storage with image compression (without quality loss)
- AC-10.3.8: System monitors storage capacity
- AC-10.3.9: System alerts Admin when storage reaches 80% capacity
- AC-10.3.10: System prevents uploads when storage is full

---

## Service Interfaces Exposed

### File Upload Service
- `uploadFile(userId, reportId, fileData, metadata)` - Uploads file and returns fileId
- `deleteFile(fileId, userId)` - Deletes file (with authorization check)
- `getFileMetadata(fileId)` - Returns file metadata
- `listFilesByReport(reportId)` - Lists all files for a report
- `validateFile(fileData)` - Validates file before upload
- `updateFileCaption(fileId, caption)` - Updates file caption

### File Retrieval Service
- `getFile(fileId)` - Retrieves file content
- `getFileThumbnail(fileId)` - Retrieves thumbnail version
- `getFileUrl(fileId)` - Returns URL for file access
- `downloadFile(fileId)` - Downloads file with original filename

### Storage Management Service
- `getStorageUsage()` - Returns current storage usage
- `getStorageCapacity()` - Returns total storage capacity
- `optimizeStorage()` - Runs storage optimization
- `checkStorageHealth()` - Checks storage system health

---

## Data Model

### File Entity
- fileId (UUID, primary key)
- reportId (UUID, foreign key)
- uploadedBy (UUID, foreign key to User)
- originalFilename (string)
- storedFilename (string, unique)
- fileFormat (enum: JPG, JPEG, PNG, PDF)
- fileSize (integer, bytes)
- caption (string, max 200 characters)
- uploadedAt (timestamp)
- thumbnailPath (string)
- storagePath (string)
- checksum (string, for integrity verification)

---

## Business Rules

1. Maximum 10 files per report
2. Maximum file size: 15MB
3. Accepted formats: JPG, JPEG, PNG, PDF only
4. All files must pass security scan
5. Files are associated with reports and cannot exist independently
6. Deleted reports trigger cascade deletion of associated files
7. Files are compressed for storage optimization (lossless)
8. Thumbnails are generated automatically for images
9. Storage alerts at 80% capacity
10. Uploads blocked when storage is full

---

## Unit Boundaries

**Responsibilities:**
- File upload and validation
- File storage and organization
- File retrieval and serving
- Storage optimization
- Storage capacity monitoring

**Not Responsible For:**
- Report data management (delegates to Report Management)
- User authentication (delegates to User Management)
- Determining which files to display (delegates to Report Management)

---

**Total User Stories in Unit:** 3
