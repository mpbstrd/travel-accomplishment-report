import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { SignatureWorkflowService, RecordSignatureInput } from '../services/signature-workflow.service';
import { CreateSignatureDTO } from '../dtos/create-signature.dto';
import { sendSuccess, sendCreated } from '../../../shared/utils/response-formatter';
import { log } from '../../../shared/utils/logger';

/**
 * Signature Workflow Controller
 * 
 * Handles HTTP requests for signature workflow operations.
 * Delegates business logic to SignatureWorkflowService.
 */
@injectable()
export class SignatureWorkflowController {
  constructor(
    @inject(SignatureWorkflowService) private workflowService: SignatureWorkflowService
  ) {}

  /**
   * Submit report for signatures
   * 
   * POST /api/reports/:reportId/signatures/submit
   */
  async submitForSignatures(req: Request, res: Response): Promise<void> {
    const { reportId } = req.params;
    const userId = req.user!.userId; // Extracted from JWT by auth middleware

    log.info('Submit for signatures request', { reportId, userId });

    const workflowState = await this.workflowService.submitForSignatures(reportId, userId);

    sendSuccess(res, {
      workflowState,
      message: 'Report submitted successfully. Awaiting signature from Prepared By.'
    });
  }

  /**
   * Record a signature
   * 
   * POST /api/reports/:reportId/signatures
   */
  async recordSignature(req: Request, res: Response): Promise<void> {
    const { reportId } = req.params;
    const dto = req.body as CreateSignatureDTO;
    const userId = req.user!.userId;
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';

    log.info('Record signature request', { reportId, signatureType: dto.signatureType, userId });

    const input: RecordSignatureInput = {
      reportId,
      signatureType: dto.signatureType,
      signatoryName: dto.signatoryName,
      userId: dto.userId,
      disclaimerAcknowledged: dto.disclaimerAcknowledged,
      ipAddress
    };

    const result = await this.workflowService.recordSignature(input);

    sendCreated(res, result, result.message);
  }

  /**
   * Get signature status
   * 
   * GET /api/reports/:reportId/signatures/status
   */
  async getSignatureStatus(req: Request, res: Response): Promise<void> {
    const { reportId } = req.params;
    const userId = req.user?.userId; // Optional for status check

    log.info('Get signature status request', { reportId, userId });

    const status = await this.workflowService.getSignatureStatus(reportId, userId);

    sendSuccess(res, status);
  }

  /**
   * Get signature history
   * 
   * GET /api/reports/:reportId/signatures/history
   */
  async getSignatureHistory(req: Request, res: Response): Promise<void> {
    const { reportId } = req.params;

    log.info('Get signature history request', { reportId });

    const signatures = await this.workflowService.getSignatureHistory(reportId);

    sendSuccess(res, { signatures });
  }

  /**
   * Get available actions for user
   * 
   * GET /api/reports/:reportId/signatures/available-actions
   */
  async getAvailableActions(req: Request, res: Response): Promise<void> {
    const { reportId } = req.params;
    const userId = req.user!.userId;

    log.info('Get available actions request', { reportId, userId });

    const actions = await this.workflowService.getAvailableActions(reportId, userId);

    sendSuccess(res, actions);
  }
}
