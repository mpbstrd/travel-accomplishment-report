import { Signature } from '../../src/features/signature-workflow/entities/signature.entity';
import { WorkflowState } from '../../src/features/signature-workflow/entities/workflow-state.entity';
import { SignatureType } from '../../src/features/signature-workflow/enums/signature-type.enum';
import { WorkflowStateEnum } from '../../src/features/signature-workflow/enums/workflow-state.enum';

/**
 * Test Data Builder - Creates test data objects for testing
 */

export class TestDataBuilder {
  /**
   * Build a test Signature entity
   */
  static buildSignature(overrides?: Partial<Signature>): Signature {
    const signature = new Signature();
    signature.signatureId = overrides?.signatureId || 'sig-' + Math.random().toString(36).substr(2, 9);
    signature.reportId = overrides?.reportId || 'report-' + Math.random().toString(36).substr(2, 9);
    signature.signatureType = overrides?.signatureType || SignatureType.PREPARED_BY;
    signature.signatoryName = overrides?.signatoryName || 'John Doe';
    signature.signatoryUserId = overrides?.signatoryUserId || 'user-' + Math.random().toString(36).substr(2, 9);
    signature.signedAt = overrides?.signedAt || new Date();
    signature.ipAddress = overrides?.ipAddress || '192.168.1.1';
    signature.disclaimerAcknowledged = overrides?.disclaimerAcknowledged !== undefined ? overrides.disclaimerAcknowledged : true;
    signature.createdAt = overrides?.createdAt || new Date();
    
    return signature;
  }

  /**
   * Build a test WorkflowState entity
   */
  static buildWorkflowState(overrides?: Partial<WorkflowState>): WorkflowState {
    const workflowState = new WorkflowState();
    workflowState.workflowId = overrides?.workflowId || 'wf-' + Math.random().toString(36).substr(2, 9);
    workflowState.reportId = overrides?.reportId || 'report-' + Math.random().toString(36).substr(2, 9);
    workflowState.currentState = overrides?.currentState || WorkflowStateEnum.DRAFT;
    workflowState.submittedAt = overrides?.submittedAt || null;
    workflowState.completedAt = overrides?.completedAt || null;
    workflowState.preparedBySignatureId = overrides?.preparedBySignatureId || null;
    workflowState.branchAckSignatureId = overrides?.branchAckSignatureId || null;
    workflowState.nisdAckSignatureId = overrides?.nisdAckSignatureId || null;
    workflowState.createdAt = overrides?.createdAt || new Date();
    workflowState.updatedAt = overrides?.updatedAt || new Date();
    
    return workflowState;
  }

  /**
   * Build a test Report object (mock)
   */
  static buildReport(overrides?: any): any {
    return {
      reportId: overrides?.reportId || 'report-' + Math.random().toString(36).substr(2, 9),
      title: overrides?.title || 'Test Report',
      status: overrides?.status || 'Draft',
      isComplete: overrides?.isComplete !== undefined ? overrides.isComplete : true,
      preparedByUserId: overrides?.preparedByUserId || 'user-1',
      branchAckUserId: overrides?.branchAckUserId || 'user-2',
      nisdAckUserId: overrides?.nisdAckUserId || 'user-3',
      createdAt: overrides?.createdAt || new Date(),
      updatedAt: overrides?.updatedAt || new Date(),
      ...overrides
    };
  }

  /**
   * Build a test User object (mock)
   */
  static buildUser(overrides?: any): any {
    return {
      userId: overrides?.userId || 'user-' + Math.random().toString(36).substr(2, 9),
      username: overrides?.username || 'testuser',
      email: overrides?.email || 'test@example.com',
      firstName: overrides?.firstName || 'Test',
      lastName: overrides?.lastName || 'User',
      role: overrides?.role || 'User',
      ...overrides
    };
  }

  /**
   * Build a complete workflow scenario with all signatures
   */
  static buildCompleteWorkflow(reportId: string): {
    workflowState: WorkflowState;
    signatures: Signature[];
  } {
    const signatures = [
      this.buildSignature({
        reportId,
        signatureType: SignatureType.PREPARED_BY,
        signatoryName: 'John Doe',
        signedAt: new Date('2024-01-01T10:00:00Z')
      }),
      this.buildSignature({
        reportId,
        signatureType: SignatureType.BRANCH_ACKNOWLEDGEMENT,
        signatoryName: 'Jane Smith',
        signedAt: new Date('2024-01-02T10:00:00Z')
      }),
      this.buildSignature({
        reportId,
        signatureType: SignatureType.NISD_ACKNOWLEDGEMENT,
        signatoryName: 'Bob Johnson',
        signedAt: new Date('2024-01-03T10:00:00Z')
      })
    ];

    const workflowState = this.buildWorkflowState({
      reportId,
      currentState: WorkflowStateEnum.COMPLETED,
      submittedAt: new Date('2024-01-01T09:00:00Z'),
      completedAt: new Date('2024-01-03T10:00:00Z'),
      preparedBySignatureId: signatures[0].signatureId,
      branchAckSignatureId: signatures[1].signatureId,
      nisdAckSignatureId: signatures[2].signatureId
    });

    return { workflowState, signatures };
  }
}
