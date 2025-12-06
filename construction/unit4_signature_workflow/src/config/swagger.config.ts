import swaggerJsdoc from 'swagger-jsdoc';

/**
 * Swagger/OpenAPI Configuration
 * 
 * Provides API documentation accessible at /api-docs
 */

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Signature Workflow API',
      version: '1.0.0',
      description: 'API for managing signature workflow for travel accomplishment reports',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3004',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        SignatureType: {
          type: 'string',
          enum: ['PREPARED_BY', 'BRANCH_ACKNOWLEDGEMENT', 'NISD_ACKNOWLEDGEMENT']
        },
        WorkflowState: {
          type: 'string',
          enum: ['DRAFT', 'PENDING_PREPARED_BY', 'PENDING_BRANCH_ACK', 'PENDING_NISD_ACK', 'COMPLETED']
        },
        Signature: {
          type: 'object',
          properties: {
            signatureId: { type: 'string', format: 'uuid' },
            reportId: { type: 'string', format: 'uuid' },
            signatureType: { $ref: '#/components/schemas/SignatureType' },
            signatoryName: { type: 'string', maxLength: 100 },
            signatoryUserId: { type: 'string', format: 'uuid' },
            signedAt: { type: 'string', format: 'date-time' },
            ipAddress: { type: 'string' },
            disclaimerAcknowledged: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        WorkflowStateEntity: {
          type: 'object',
          properties: {
            workflowId: { type: 'string', format: 'uuid' },
            reportId: { type: 'string', format: 'uuid' },
            currentState: { $ref: '#/components/schemas/WorkflowState' },
            submittedAt: { type: 'string', format: 'date-time', nullable: true },
            completedAt: { type: 'string', format: 'date-time', nullable: true },
            preparedBySignatureId: { type: 'string', format: 'uuid', nullable: true },
            branchAckSignatureId: { type: 'string', format: 'uuid', nullable: true },
            nisdAckSignatureId: { type: 'string', format: 'uuid', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        CreateSignatureRequest: {
          type: 'object',
          required: ['signatureType', 'signatoryName', 'disclaimerAcknowledged'],
          properties: {
            signatureType: { $ref: '#/components/schemas/SignatureType' },
            signatoryName: { type: 'string', maxLength: 100 },
            disclaimerAcknowledged: { type: 'boolean', enum: [true] }
          }
        },
        SubmitForSignaturesRequest: {
          type: 'object',
          properties: {}
        },
        SignatureStatusResponse: {
          type: 'object',
          properties: {
            workflowState: { $ref: '#/components/schemas/WorkflowStateEntity' },
            signatures: {
              type: 'array',
              items: { $ref: '#/components/schemas/Signature' }
            },
            nextRequired: { $ref: '#/components/schemas/SignatureType', nullable: true },
            progress: {
              type: 'object',
              properties: {
                completed: { type: 'integer' },
                total: { type: 'integer' }
              }
            },
            canCurrentUserSign: { type: 'boolean' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
                details: {
                  type: 'array',
                  items: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/features/signature-workflow/routes/*.ts', './src/features/signature-workflow/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
