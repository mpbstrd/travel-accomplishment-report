import { injectable, inject } from 'tsyringe';
import { NotificationClient } from '../../../integrations/notification-service/notification.client';
import { ReportManagementClient } from '../../../integrations/report-management/report-management.client';
import { SignatureType } from '../enums/signature-type.enum';
import { log } from '../../../shared/utils/logger';

/**
 * Signature Notification Service
 * 
 * Coordinates with Notification Service for signature-related alerts.
 * Handles notification failures gracefully without blocking workflow.
 */
@injectable()
export class SignatureNotificationService {
  constructor(
    @inject(NotificationClient) private notificationClient: NotificationClient,
    @inject(ReportManagementClient) private reportClient: ReportManagementClient
  ) {}

  /**
   * Notify next signatory
   * 
   * Sends notification to the user assigned to the next signature step.
   * Failures are logged but don't block workflow progression.
   * 
   * @param reportId UUID of the report
   * @param signatureType Type of signature required
   */
  async notifyNextSignatory(reportId: string, signatureType: SignatureType): Promise<void> {
    try {
      // Get report details
      const report = await this.reportClient.getReport(reportId);
      
      // Get assigned signatory
      const signatoryUserId = await this.reportClient.getAssignedSignatory(reportId, signatureType);
      
      // Prepare notification data
      const notificationData = {
        reportId,
        reportTitle: report.title,
        signatureType: this.getSignatureTypeLabel(signatureType),
        actionRequired: 'Please review and sign the report'
      };
      
      // Send notification
      await this.notificationClient.sendNotification(
        signatoryUserId,
        'SIGNATURE_REQUIRED',
        notificationData
      );
      
      log.info(`Notification sent to ${signatoryUserId} for ${signatureType}`, { reportId });
    } catch (error) {
      // Log error but don't throw - notification failures shouldn't block workflow
      log.error('Failed to send signature notification', { reportId, signatureType, error });
    }
  }

  /**
   * Notify workflow complete
   * 
   * Sends completion notification to:
   * - Report creator
   * - All three signatories
   * 
   * @param reportId UUID of the report
   */
  async notifyWorkflowComplete(reportId: string): Promise<void> {
    try {
      // Get report details
      const report = await this.reportClient.getReport(reportId);
      
      // Collect all user IDs to notify
      const userIds: string[] = [
        report.createdBy,
        report.preparedBy || '',
        report.branchAcknowledgement || '',
        report.nisdAcknowledgement || ''
      ].filter(id => id); // Remove empty strings
      
      // Prepare notification data
      const notificationData = {
        reportId,
        reportTitle: report.title,
        message: 'All signatures have been collected. The report is now complete.'
      };
      
      // Send bulk notification
      await this.notificationClient.sendBulkNotification(
        userIds,
        'WORKFLOW_COMPLETE',
        notificationData
      );
      
      log.info(`Completion notification sent for report ${reportId}`, { userIds });
    } catch (error) {
      // Log error but don't throw
      log.error('Failed to send completion notification', { reportId, error });
    }
  }

  /**
   * Notify signature recorded
   * 
   * Sends confirmation to the signatory who just signed.
   * 
   * @param reportId UUID of the report
   * @param signatureType Type of signature recorded
   * @param signatoryName Name of signatory
   * @param userId User ID of signatory
   */
  async notifySignatureRecorded(
    reportId: string,
    signatureType: SignatureType,
    signatoryName: string,
    userId: string
  ): Promise<void> {
    try {
      // Get report details
      const report = await this.reportClient.getReport(reportId);
      
      // Prepare notification data
      const notificationData = {
        reportId,
        reportTitle: report.title,
        signatureType: this.getSignatureTypeLabel(signatureType),
        signatoryName,
        message: 'Your signature has been successfully recorded'
      };
      
      // Send notification
      await this.notificationClient.sendNotification(
        userId,
        'SIGNATURE_RECORDED',
        notificationData
      );
      
      log.info(`Signature confirmation sent to ${userId}`, { reportId, signatureType });
    } catch (error) {
      // Log error but don't throw
      log.error('Failed to send signature confirmation', { reportId, signatureType, error });
    }
  }

  /**
   * Get human-readable label for signature type
   * 
   * @param signatureType Signature type enum
   * @returns Human-readable label
   */
  private getSignatureTypeLabel(signatureType: SignatureType): string {
    const labels: Record<SignatureType, string> = {
      [SignatureType.PREPARED_BY]: 'Prepared By',
      [SignatureType.BRANCH_ACKNOWLEDGEMENT]: 'Branch Acknowledgement',
      [SignatureType.NISD_ACKNOWLEDGEMENT]: 'NISD Acknowledgement'
    };
    
    return labels[signatureType];
  }
}
