# Prompt Updates Summary

**Date:** December 5, 2025  
**Updated By:** Kiro AI Assistant  
**Reason:** Technology stack change to Node.js + TypeScript + Express.js + MS SQL Server

---

## Overview

Updated all construction phase prompts (Steps 2.1, 2.2, 2.3, and 2.3.1) to reflect the new technology stack instead of the previous Java/Spring Boot stack.

---

## Technology Stack Change

### Previous Stack (Old)
- **Language:** Java
- **Framework:** Spring Boot
- **Database:** H2 (in-memory), with migration path to Oracle/PostgreSQL/MySQL
- **Build Tool:** Maven
- **Testing:** JUnit 5, Mockito, Spring Boot Test, MockMvc

### New Stack (Current)
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5+
- **Framework:** Express.js 4.x
- **ORM:** TypeORM 0.3+ (recommended) or Sequelize
- **Database:** MS SQL Server (Microsoft SQL Server)
- **Package Manager:** npm
- **Testing:** Jest with ts-jest, Supertest
- **API Documentation:** swagger-ui-express
- **Validation:** class-validator (with TypeORM) or Joi

---

## Files Updated

### 1. Prompts/Step 2.1_ Architecture Design

**Changes:**
- Added technology stack specification section
- Specified Node.js 18+, TypeScript 5+, Express.js 4.x
- Specified TypeORM or Sequelize for ORM
- Specified MS SQL Server as database
- Added authentication and validation library recommendations

**Key Addition:**
```
**Technology Stack:**
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5+
- **Framework:** Express.js 4.x
- **ORM:** TypeORM 0.3+ or Sequelize
- **Database:** MS SQL Server (Microsoft SQL Server)
- **Authentication:** JWT or session-based
- **Validation:** class-validator or Joi
```

---

### 2. Prompts/Step 2.2_ Create Logical Design

**Changes:**
- Updated task description to specify Node.js with TypeScript and Express.js
- Changed from "package structure" to "directory structure"
- Changed from "API controllers" to "API controllers (Express route handlers)"
- Specified TypeORM or Sequelize for MS SQL Server
- Added technology stack specification section
- Added Jest as testing framework

**Key Changes:**
- "Generate a logical design for software source code implementation using Node.js with TypeScript and Express.js framework"
- "API controllers (Express route handlers) for external interfaces"
- "data access layer with repository patterns using TypeORM or Sequelize for MS SQL Server"

**Key Addition:**
```
**Technology Stack:**
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5+
- **Framework:** Express.js 4.x
- **ORM:** TypeORM 0.3+ or Sequelize (for MS SQL Server)
- **Database:** MS SQL Server (Microsoft SQL Server)
- **Validation:** class-validator or Joi
- **Testing:** Jest
```

---

### 3. Prompts/Step 2.3_ Implement Source Code

**Changes:**
- Completely rewrote from Java/Spring Boot to TypeScript/Node.js/Express.js
- Changed from "Java implementation" to "TypeScript implementation"
- Changed from "Spring Boot framework" to "Node.js and Express.js framework"
- Changed from "JDBC with H2" to "TypeORM or Sequelize with MS SQL Server"
- Changed from "feature packages" to "feature directories"
- Changed from "/src/main/java/" to "/src/"
- Changed from "REST controller" to "Express route handlers (controllers)"
- Changed from "Maven pom.xml" to "package.json"
- Updated IMPORTANT section to focus on MS SQL Server migration considerations

**Key Changes:**
- "Generate a simple and intuitive TypeScript implementation"
- "Use TypeORM or Sequelize with MS SQL Server for data persistence"
- "Organize the code by feature directories"
- "Include Express route handlers (controllers) for API endpoints"
- "entity/model classes with TypeORM decorators or Sequelize models"
- "include package.json with all necessary dependencies and scripts"

**Key Addition:**
```
**Technology Stack:**
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5+
- **Framework:** Express.js 4.x
- **ORM:** TypeORM 0.3+ (recommended) or Sequelize
- **Database:** MS SQL Server (mssql driver)
- **Validation:** class-validator (with TypeORM) or Joi
- **Testing:** Jest with ts-jest
```

**Updated IMPORTANT Section:**
Now includes comments about:
- Connection string modifications for MS SQL Server
- Environment variable configuration
- Database migration strategies
- TypeORM/Sequelize configuration for different environments
- MS SQL Server specific considerations
- Security best practices (connection pooling, SSL/TLS, authentication)
- Performance optimization settings

---

### 4. Prompts/Step 2.3.1_ Create Local Testing Environment

**Changes:**
- Updated all 5 component sections to reflect Node.js/TypeScript stack
- Changed from JUnit 5 to Jest
- Changed from Mockito to Jest mocking
- Changed from Spring Boot Test and MockMvc to Supertest
- Changed from SQLite to MS SQL Server
- Changed from Spring profiles to environment variables
- Updated directory paths from Java structure to Node.js structure
- Changed port from 8080 to 3000
- Changed from Maven to npm commands
- Added Docker Compose recommendation for MS SQL Server

**Detailed Changes:**

**Section 1 - Unit Testing Suite:**
- JUnit 5 → Jest
- Mockito → Jest mocking capabilities
- /src/test/java/ → /tests/
- Added ts-jest for TypeScript support

**Section 2 - API Implementation & Testing:**
- Spring Boot Test and MockMvc → Supertest with Jest
- Added swagger-ui-express specification
- /src/test/java/ → /tests/integration/

**Section 3 - Simple Web UI:**
- /src/main/resources/static/ → /src/public/
- Added "Configure Express to serve static files"
- localhost:8080 → localhost:3000

**Section 4 - Database Configuration:**
- SQLite → MS SQL Server
- /src/main/resources/ → /src/database/
- Added TypeORM migrations
- Added Docker container setup documentation
- Added Docker Compose file requirement

**Section 5 - Mock External Dependencies:**
- Spring profiles → environment variables or configuration files
- "appropriate test or mock packages" → /src/mocks/ directory

**Section 6 - Testing Documentation:**
- No changes (already generic)

**Added Technology Stack Section:**
```
**Technology Stack:**
- **Runtime:** Node.js 18+
- **Language:** TypeScript 5+
- **Framework:** Express.js 4.x
- **ORM:** TypeORM 0.3+ (recommended) or Sequelize
- **Database:** MS SQL Server (mssql driver)
- **Testing:** Jest with ts-jest, Supertest
- **API Docs:** swagger-ui-express
```

**Updated IMPORTANT Section:**
- "single Maven command" → "single npm command (npm test, npm run dev)"
- Added Docker Compose configuration recommendation
- Added documentation requirement for testing against real vs mocked database

---

## Impact on Existing Documents

### Documents That Need Updating

The following existing documents were created with the old stack and should be reviewed/updated:

1. **construction/unit1_user_management_authentication/logical_design.md**
   - Currently specifies Node.js/TypeScript (already correct!)
   - Uses PostgreSQL instead of MS SQL Server (needs update)

2. **construction/unit1_user_management_authentication/architecture_design.md**
   - Currently specifies Node.js/TypeScript (already correct!)
   - May reference PostgreSQL (needs verification)

3. **construction/unit1_user_management_authentication/TEST_SUITE.md**
   - Currently specifies Jest and TypeScript (already correct!)
   - References SQLite for testing (may need update to MS SQL Server or keep for unit tests)

4. **Step 2.3.1_ Create Local Testing Environment_plan.md**
   - Created with Node.js/TypeScript stack
   - References SQLite (should be updated to MS SQL Server)
   - Otherwise aligned with new stack

### Recommendation

For Unit 1 documents:
- The logical_design.md and architecture_design.md already use Node.js/TypeScript ✓
- Update database references from PostgreSQL to MS SQL Server
- Update TEST_SUITE.md to use MS SQL Server (or keep SQLite for unit tests only)
- Update the testing environment plan to use MS SQL Server

---

## Migration Notes

### For Teams Using These Prompts

When using the updated prompts:

1. **Database Setup:**
   - Install MS SQL Server locally or use Docker
   - Recommended: Use Docker Compose for easy setup
   - Connection string format: `mssql://username:password@localhost:1433/database`

2. **ORM Choice:**
   - **TypeORM** (recommended): Better TypeScript support, decorators, migrations
   - **Sequelize**: More mature, larger community, but less TypeScript-native

3. **Development Environment:**
   - Node.js 18+ required
   - TypeScript 5+ required
   - npm or yarn for package management
   - VS Code recommended with TypeScript extensions

4. **Testing Strategy:**
   - Unit tests: Can use in-memory database or mocked connections
   - Integration tests: Use Docker MS SQL Server container
   - E2E tests: Use dedicated test database

5. **Key Dependencies:**
   ```json
   {
     "dependencies": {
       "express": "^4.x",
       "typeorm": "^0.3.x",
       "mssql": "^10.x",
       "reflect-metadata": "^0.1.x",
       "class-validator": "^0.14.x",
       "class-transformer": "^0.5.x"
     },
     "devDependencies": {
       "typescript": "^5.x",
       "jest": "^29.x",
       "ts-jest": "^29.x",
       "supertest": "^6.x",
       "@types/express": "^4.x",
       "@types/jest": "^29.x",
       "@types/supertest": "^6.x"
     }
   }
   ```

---

## Verification Checklist

- [x] Step 2.1 prompt updated with Node.js/TypeScript/Express.js/MS SQL
- [x] Step 2.2 prompt updated with Node.js/TypeScript/Express.js/MS SQL
- [x] Step 2.3 prompt updated with Node.js/TypeScript/Express.js/MS SQL
- [x] Step 2.3.1 prompt updated with Node.js/TypeScript/Express.js/MS SQL
- [x] Technology stack consistently specified across all prompts
- [x] Directory structures updated from Java to Node.js conventions
- [x] Testing frameworks updated from JUnit/Mockito to Jest/Supertest
- [x] Database references updated from H2/SQLite to MS SQL Server
- [x] Build tool references updated from Maven to npm
- [x] Port numbers updated from 8080 to 3000
- [x] Documentation created (this file)

---

## Next Steps

1. **Review existing Unit 1 documents** and update database references from PostgreSQL to MS SQL Server
2. **Update the testing environment plan** to use MS SQL Server instead of SQLite
3. **Create Docker Compose file** for local MS SQL Server setup
4. **Update any other units** that have already been designed with the old stack
5. **Proceed with implementation** using the updated prompts

---

**Status:** ✅ All prompts successfully updated  
**Date Completed:** December 5, 2025
