import { Router } from 'express';
import { container } from 'tsyringe';
import { SignatureWorkflowController } from '../controllers/signature-workflow.controller';
import { authMiddleware, optionalAuthMiddleware } from '../../../shared/middleware/auth.middleware';
import { validateBody, validateUuidParam } from '../../../shared/middleware/validation.middleware';
import { asyncHandler } from '../../../shared/middleware/error-handler.middleware';
import { CreateSignatureDTO } from '../dtos/create-signature.dto';
import { SubmitForSignaturesDTO } from '../dtos/submit-for-signatures.dto';

/**
 * Signature Workflow Routes
 * 
 * Defines all API endpoints for signature workflow operations.
 * 
 * Route Pattern: /api/reports/:reportId/signatures/*
 */

const router = Router();
const controller = container.resolve(SignatureWorkflowController);

/**
 * POST /api/reports/:reportId/signatures/submit
 * 
 * Submit report for signatures
 * 
 * Authentication: Required
 * Validation: reportId (UUID), body (SubmitForSignaturesDTO)
 */
router.post(
  '/:reportId/signatures/submit',
  authMiddleware,
  validateUuidParam('reportId'),
  validateBody(SubmitForSignaturesDTO),
  asyncHandler((req, res) => controller.submitForSignatures(req, res))
);

/**
 * POST /api/reports/:reportId/signatures
 * 
 * Record a signature
 * 
 * Authentication: Required
 * Validation: reportId (UUID), body (CreateSignatureDTO)
 */
router.post(
  '/:reportId/signatures',
  authMiddleware,
  validateUuidParam('reportId'),
  validateBody(CreateSignatureDTO),
  asyncHandler((req, res) => controller.recordSignature(req, res))
);

/**
 * GET /api/reports/:reportId/signatures/status
 * 
 * Get signature status
 * 
 * Authentication: Optional (provides user-specific info if authenticated)
 * Validation: reportId (UUID)
 */
router.get(
  '/:reportId/signatures/status',
  optionalAuthMiddleware,
  validateUuidParam('reportId'),
  asyncHandler((req, res) => controller.getSignatureStatus(req, res))
);

/**
 * GET /api/reports/:reportId/signatures/history
 * 
 * Get signature history
 * 
 * Authentication: Required
 * Validation: reportId (UUID)
 */
router.get(
  '/:reportId/signatures/history',
  authMiddleware,
  validateUuidParam('reportId'),
  asyncHandler((req, res) => controller.getSignatureHistory(req, res))
);

/**
 * GET /api/reports/:reportId/signatures/available-actions
 * 
 * Get available actions for user
 * 
 * Authentication: Required
 * Validation: reportId (UUID)
 */
router.get(
  '/:reportId/signatures/available-actions',
  authMiddleware,
  validateUuidParam('reportId'),
  asyncHandler((req, res) => controller.getAvailableActions(req, res))
);

export default router;
