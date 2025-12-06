import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { Signature } from '../features/signature-workflow/entities/signature.entity';
import { WorkflowState } from '../features/signature-workflow/entities/workflow-state.entity';
import { SignatureType } from '../features/signature-workflow/enums/signature-type.enum';
import { WorkflowStateEnum } from '../features/signature-workflow/enums/workflow-state.enum';

/**
 * Database Seed Script
 * 
 * Seeds the database with sample test data for local development and testing.
 * 
 * Usage: npm run seed
 */

async function seed() {
  console.log('Initializing database connection...');
  
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    const signatureRepository = AppDataSource.getRepository(Signature);
    const workflowStateRepository = AppDataSource.getRepository(WorkflowState);

    // Clear existing data
    console.log('Clearing existing data...');
    await signatureRepository.delete({});
    await workflowStateRepository.delete({});

    // Seed Scenario 1: Completed workflow
    console.log('Seeding completed workflow...');
    const completedWorkflow = workflowStateRepository.create({
      reportId: 'report-001',
      currentState: WorkflowStateEnum.COMPLETED,
      submittedAt: new Date('2024-01-01T09:00:00Z'),
      completedAt: new Date('2024-01-03T10:00:00Z')
    });
    await workflowStateRepository.save(completedWorkflow);

    const sig1 = signatureRepository.create({
      reportId: 'report-001',
      signatureType: SignatureType.PREPARED_BY,
      signatoryName: 'Jane Smith',
      signatoryUserId: 'user-002',
      signedAt: new Date('2024-01-01T10:00:00Z'),
      ipAddress: '192.168.1.100',
      disclaimerAcknowledged: true
    });
    await signatureRepository.save(sig1);

    const sig2 = signatureRepository.create({
      reportId: 'report-001',
      signatureType: SignatureType.BRANCH_ACKNOWLEDGEMENT,
      signatoryName: 'John Doe',
      signatoryUserId: 'user-001',
      signedAt: new Date('2024-01-02T10:00:00Z'),
      ipAddress: '192.168.1.101',
      disclaimerAcknowledged: true
    });
    await signatureRepository.save(sig2);

    const sig3 = signatureRepository.create({
      reportId: 'report-001',
      signatureType: SignatureType.NISD_ACKNOWLEDGEMENT,
      signatoryName: 'Bob Johnson',
      signatoryUserId: 'user-003',
      signedAt: new Date('2024-01-03T10:00:00Z'),
      ipAddress: '192.168.1.102',
      disclaimerAcknowledged: true
    });
    await signatureRepository.save(sig3);

    // Link signatures to workflow
    completedWorkflow.preparedBySignatureId = sig1.signatureId;
    completedWorkflow.branchAckSignatureId = sig2.signatureId;
    completedWorkflow.nisdAckSignatureId = sig3.signatureId;
    await workflowStateRepository.save(completedWorkflow);

    // Seed Scenario 2: Workflow pending branch acknowledgement
    console.log('Seeding workflow pending branch acknowledgement...');
    const pendingWorkflow = workflowStateRepository.create({
      reportId: 'report-003',
      currentState: WorkflowStateEnum.PENDING_BRANCH_ACK,
      submittedAt: new Date('2024-02-01T09:00:00Z')
    });
    await workflowStateRepository.save(pendingWorkflow);

    const sig4 = signatureRepository.create({
      reportId: 'report-003',
      signatureType: SignatureType.PREPARED_BY,
      signatoryName: 'Jane Smith',
      signatoryUserId: 'user-002',
      signedAt: new Date('2024-02-01T10:00:00Z'),
      ipAddress: '192.168.1.100',
      disclaimerAcknowledged: true
    });
    await signatureRepository.save(sig4);

    pendingWorkflow.preparedBySignatureId = sig4.signatureId;
    await workflowStateRepository.save(pendingWorkflow);

    // Seed Scenario 3: Draft workflow (report-002 from mock data)
    console.log('Seeding draft workflow...');
    const draftWorkflow = workflowStateRepository.create({
      reportId: 'report-002',
      currentState: WorkflowStateEnum.DRAFT
    });
    await workflowStateRepository.save(draftWorkflow);

    console.log('✅ Database seeded successfully!');
    console.log('\nSeeded data:');
    console.log('- 1 completed workflow (report-001) with all 3 signatures');
    console.log('- 1 pending workflow (report-003) with 1 signature');
    console.log('- 1 draft workflow (report-002) with no signatures');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('\nDatabase connection closed');
  }
}

// Run seed
seed();
