import 'reflect-metadata';
import { initializeDatabase, closeDatabase } from '../database/data-source';
import { container } from 'tsyringe';
import { SignatureWorkflowService } from '../features/signature-workflow/services/signature-workflow.service';
import { SignatureType } from '../features/signature-workflow/enums/signature-type.enum';

// Import for DI registration
import '../app';

/**
 * Demo Application
 * 
 * Demonstrates the complete signature workflow with sample data.
 * 
 * This demo:
 * 1. Creates a workflow for a sample report
 * 2. Records all three signatures in sequence
 * 3. Shows signature status at each step
 * 4. Displays final completion status
 * 
 * Run with: npm run demo
 */

// Sample data
const SAMPLE_REPORT_ID = '12345678-1234-4123-8123-123456789012';
const USER_CREATOR = '11111111-1111-4111-8111-111111111111';
const USER_PREPARED_BY = '22222222-2222-4222-8222-222222222222';
const USER_BRANCH_ACK = '33333333-3333-4333-8333-333333333333';
const USER_NISD_ACK = '44444444-4444-4444-8444-444444444444';

/**
 * Display signature status
 */
function displayStatus(status: any, step: string): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${step}`);
  console.log('='.repeat(60));
  console.log(`Current State: ${status.workflowState.currentState}`);
  console.log(`Progress: ${status.progress.completed} of ${status.progress.total} signatures`);
  console.log(`Next Required: ${status.nextRequired || 'None - Workflow Complete'}`);
  console.log(`\nSignatures Collected:`);
  
  if (status.signatures.length === 0) {
    console.log('  (none yet)');
  } else {
    status.signatures.forEach((sig: any) => {
      console.log(`  ✓ ${sig.signatureType}: ${sig.signatoryName} (${new Date(sig.signedAt).toLocaleString()})`);
    });
  }
}

/**
 * Run demo workflow
 */
async function runDemo(): Promise<void> {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('SIGNATURE WORKFLOW DEMO');
    console.log('='.repeat(60));
    console.log('\nThis demo demonstrates the complete signature workflow:');
    console.log('1. Submit report for signatures');
    console.log('2. Record "Prepared By" signature');
    console.log('3. Record "Branch Acknowledgement" signature');
    console.log('4. Record "NISD Acknowledgement" signature');
    console.log('5. View final completion status\n');

    // Initialize database
    console.log('Initializing database connection...');
    await initializeDatabase();
    console.log('✓ Database connected\n');

    // Get service from DI container
    const workflowService = container.resolve(SignatureWorkflowService);

    // Step 1: Submit report for signatures
    console.log('\n' + '='.repeat(60));
    console.log('STEP 1: Submit Report for Signatures');
    console.log('='.repeat(60));
    console.log(`Report ID: ${SAMPLE_REPORT_ID}`);
    console.log(`Submitted by: ${USER_CREATOR}`);

    const workflowState = await workflowService.submitForSignatures(SAMPLE_REPORT_ID, USER_CREATOR);
    console.log(`✓ Report submitted successfully`);
    console.log(`  Workflow ID: ${workflowState.workflowId}`);
    console.log(`  Current State: ${workflowState.currentState}`);

    // Check status after submission
    let status = await workflowService.getSignatureStatus(SAMPLE_REPORT_ID);
    displayStatus(status, 'Status After Submission');

    // Wait a moment for effect
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 2: Record "Prepared By" signature
    console.log('\n' + '='.repeat(60));
    console.log('STEP 2: Record "Prepared By" Signature');
    console.log('='.repeat(60));

    const preparedByResult = await workflowService.recordSignature({
      reportId: SAMPLE_REPORT_ID,
      signatureType: SignatureType.PREPARED_BY,
      signatoryName: 'John Smith',
      userId: USER_PREPARED_BY,
      disclaimerAcknowledged: true,
      ipAddress: '192.168.1.100'
    });

    console.log(`✓ Signature recorded: ${preparedByResult.signature.signatoryName}`);
    console.log(`  Signed at: ${preparedByResult.signature.signedAt}`);
    console.log(`  Next required: ${preparedByResult.nextSignatureRequired}`);

    status = await workflowService.getSignatureStatus(SAMPLE_REPORT_ID);
    displayStatus(status, 'Status After "Prepared By" Signature');

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Record "Branch Acknowledgement" signature
    console.log('\n' + '='.repeat(60));
    console.log('STEP 3: Record "Branch Acknowledgement" Signature');
    console.log('='.repeat(60));

    const branchAckResult = await workflowService.recordSignature({
      reportId: SAMPLE_REPORT_ID,
      signatureType: SignatureType.BRANCH_ACKNOWLEDGEMENT,
      signatoryName: 'Jane Doe',
      userId: USER_BRANCH_ACK,
      disclaimerAcknowledged: true,
      ipAddress: '192.168.1.101'
    });

    console.log(`✓ Signature recorded: ${branchAckResult.signature.signatoryName}`);
    console.log(`  Signed at: ${branchAckResult.signature.signedAt}`);
    console.log(`  Next required: ${branchAckResult.nextSignatureRequired}`);

    status = await workflowService.getSignatureStatus(SAMPLE_REPORT_ID);
    displayStatus(status, 'Status After "Branch Acknowledgement" Signature');

    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 4: Record "NISD Acknowledgement" signature
    console.log('\n' + '='.repeat(60));
    console.log('STEP 4: Record "NISD Acknowledgement" Signature');
    console.log('='.repeat(60));

    const nisdAckResult = await workflowService.recordSignature({
      reportId: SAMPLE_REPORT_ID,
      signatureType: SignatureType.NISD_ACKNOWLEDGEMENT,
      signatoryName: 'Bob Johnson',
      userId: USER_NISD_ACK,
      disclaimerAcknowledged: true,
      ipAddress: '192.168.1.102'
    });

    console.log(`✓ Signature recorded: ${nisdAckResult.signature.signatoryName}`);
    console.log(`  Signed at: ${nisdAckResult.signature.signedAt}`);
    console.log(`  Next required: ${nisdAckResult.nextSignatureRequired || 'None - Workflow Complete!'}`);

    status = await workflowService.getSignatureStatus(SAMPLE_REPORT_ID);
    displayStatus(status, 'FINAL STATUS - Workflow Complete');

    // Display signature history
    console.log('\n' + '='.repeat(60));
    console.log('SIGNATURE HISTORY');
    console.log('='.repeat(60));
    const history = await workflowService.getSignatureHistory(SAMPLE_REPORT_ID);
    history.forEach((sig, index) => {
      console.log(`\n${index + 1}. ${sig.signatureType}`);
      console.log(`   Name: ${sig.signatoryName}`);
      console.log(`   User ID: ${sig.signatoryUserId}`);
      console.log(`   Signed At: ${new Date(sig.signedAt).toLocaleString()}`);
      console.log(`   IP Address: ${sig.ipAddress}`);
      console.log(`   Disclaimer Acknowledged: ${sig.disclaimerAcknowledged}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log('DEMO COMPLETED SUCCESSFULLY');
    console.log('='.repeat(60));
    console.log('\nThe signature workflow has been completed successfully!');
    console.log('All three signatures have been collected in the correct sequence.');
    console.log('\nYou can now start the API server with: npm run dev');
    console.log('And test the endpoints using the generated JWT tokens.\n');

  } catch (error) {
    console.error('\n✗ Demo failed:', error);
    throw error;
  } finally {
    // Close database connection
    await closeDatabase();
    console.log('\n✓ Database connection closed');
  }
}

// Run the demo
runDemo()
  .then(() => {
    console.log('\n✓ Demo completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n✗ Demo failed:', error);
    process.exit(1);
  });
