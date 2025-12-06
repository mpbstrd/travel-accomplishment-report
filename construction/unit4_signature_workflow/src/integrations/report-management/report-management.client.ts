import { injectable } from 'tsyringe';
import { SignatureType } from '../../features/signature-workflow/enums/signature-type.enum';
import { ValidationResultDTO } from '../../features/signature-workflow/dtos/validation-result.dto';

/**
 * Report Management Client
 * 
 * Communicates with Report Management unit for report-related operations.
 * 
 * MOCK IMPLEMENTATION for standalone testing.
 * 
 * PRODUCTION NOTES:
 * - Replace with actual HTTP client or internal service call
 * - Implement proper error handling and retries
 * - Add authentication/authorization headers
 * - Consider caching report data for performance
 * - Implement circuit breaker for resilience
 */

export interface Report {
  reportId: string;
  title: string;
  status: string;
  createdBy: string;
  preparedBy?: string;
  branchAcknowledgement?: string;
  nisdAcknowledgement?: string;
}

@injectable()
export class ReportManagementClient {
  /**
   * Get report by ID
   * 
   * MOCK: Returns dummy report data
   * PRODUCTION: Call actual Report Management API
   * 
   * @param reportId UUID of the report
   * @returns Report details
   */
  async getReport(reportId: string): Promise<Report> {
    // MOCK IMPLEMENTATION
    return {
      reportId,
      title: `Travel Report ${reportId.substring(0, 8)}`,
      status: 'Draft',
      createdBy: 'user-123',
      preparedBy: 'user-456',
      branchAcknowledgement: 'user-789',
      nisdAcknowledgement: 'user-012'
    };
  }

  /**
   * Validate report completeness
   * 
   * MOCK: Returns success for all reports
   * PRODUCTION: Implement actual validation logic
   * 
   * @param _reportId UUID of the report
   * @returns Validation result
   */
  async validateReportCompleteness(_reportId: string): Promise<ValidationResultDTO> {
    // MOCK IMPLEMENTATION - always returns valid
    // PRODUCTION: Check all required fields and checklist items
    return ValidationResultDTO.success();
  }

  /**
   * Update report status
   * 
   * MOCK: Logs status update
   * PRODUCTION: Call actual Report Management API
   * 
   * @param reportId UUID of the report
   * @param status New status
   */
  async updateReportStatus(reportId: string, status: string): Promise<void> {
    // MOCK IMPLEMENTATION
    console.log(`[MOCK] Updating report ${reportId} status to: ${status}`);
    // PRODUCTION: Implement actual API call
  }

  /**
   * Get assigned signatory for a signature type
   * 
   * MOCK: Returns dummy user ID
   * PRODUCTION: Return actual assigned user from report
   * 
   * @param reportId UUID of the report
   * @param signatureType Type of signature
   * @returns User ID of assigned signatory
   */
  async getAssignedSignatory(reportId: string, signatureType: SignatureType): Promise<string> {
    // MOCK IMPLEMENTATION
    const report = await this.getReport(reportId);
    
    switch (signatureType) {
      case SignatureType.PREPARED_BY:
        return report.preparedBy || 'user-456';
      case SignatureType.BRANCH_ACKNOWLEDGEMENT:
        return report.branchAcknowledgement || 'user-789';
      case SignatureType.NISD_ACKNOWLEDGEMENT:
        return report.nisdAcknowledgement || 'user-012';
    }
  }
}
