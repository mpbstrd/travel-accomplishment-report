import { ReportManagementClient } from '../integrations/report-management/report-management.client';

/**
 * Mock Report Management Client for Testing
 * 
 * This mock implementation simulates the Report Management service
 * for local testing without requiring the actual service to be running.
 */
export class MockReportManagementClient extends ReportManagementClient {
  // Mock report database
  private mockReports = [
    {
      reportId: 'report-001',
      title: 'Branch Visit - January 2024',
      status: 'Draft',
      isComplete: true,
      preparedByUserId: 'user-002',
      branchAckUserId: 'user-001',
      nisdAckUserId: 'user-003',
      destination: 'Manila Branch',
      purpose: 'Quarterly inspection',
      checklistItems: [
        { id: 1, question: 'Item 1', answer: 'Yes' },
        { id: 2, question: 'Item 2', answer: 'No' },
        { id: 3, question: 'Item 3', answer: 'Yes' },
        { id: 4, question: 'Item 4', answer: 'Yes' },
        { id: 5, question: 'Item 5', answer: 'No' },
        { id: 6, question: 'Item 6', answer: 'Yes' },
        { id: 7, question: 'Item 7', answer: 'Yes' }
      ],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      reportId: 'report-002',
      title: 'Branch Visit - February 2024',
      status: 'Draft',
      isComplete: false,
      preparedByUserId: 'user-002',
      branchAckUserId: 'user-001',
      nisdAckUserId: 'user-003',
      destination: 'Cebu Branch',
      purpose: 'Annual audit',
      checklistItems: [
        { id: 1, question: 'Item 1', answer: 'Yes' },
        { id: 2, question: 'Item 2', answer: null },
        { id: 3, question: 'Item 3', answer: null },
        { id: 4, question: 'Item 4', answer: 'Yes' },
        { id: 5, question: 'Item 5', answer: null },
        { id: 6, question: 'Item 6', answer: null },
        { id: 7, question: 'Item 7', answer: null }
      ],
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-05')
    }
  ];

  async getReport(reportId: string): Promise<any> {
    console.log(`[MOCK] Getting report: ${reportId}`);
    
    const report = this.mockReports.find(r => r.reportId === reportId);
    
    if (!report) {
      throw new Error(`Report not found: ${reportId}`);
    }
    
    return report;
  }

  async validateReportCompleteness(reportId: string): Promise<{ isValid: boolean; errors: string[] }> {
    console.log(`[MOCK] Validating report completeness: ${reportId}`);
    
    const report = await this.getReport(reportId);
    const errors: string[] = [];
    
    // Check if all required fields are filled
    if (!report.destination) {
      errors.push('Destination is required');
    }
    
    if (!report.purpose) {
      errors.push('Purpose is required');
    }
    
    // Check if all 7 checklist items are answered
    const unansweredItems = report.checklistItems.filter((item: any) => !item.answer);
    if (unansweredItems.length > 0) {
      errors.push(`${unansweredItems.length} checklist item(s) not answered`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async updateReportStatus(reportId: string, status: string): Promise<void> {
    console.log(`[MOCK] Updating report status: ${reportId} to ${status}`);
    
    const report = this.mockReports.find(r => r.reportId === reportId);
    
    if (report) {
      report.status = status;
      report.updatedAt = new Date();
    }
  }

  async getAssignedSignatory(reportId: string, signatureType: string): Promise<string> {
    console.log(`[MOCK] Getting assigned signatory: ${reportId} for ${signatureType}`);
    
    const report = await this.getReport(reportId);
    
    switch (signatureType) {
      case 'PREPARED_BY':
        return report.preparedByUserId;
      case 'BRANCH_ACKNOWLEDGEMENT':
        return report.branchAckUserId;
      case 'NISD_ACKNOWLEDGEMENT':
        return report.nisdAckUserId;
      default:
        throw new Error(`Unknown signature type: ${signatureType}`);
    }
  }
}
