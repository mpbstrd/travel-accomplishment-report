import { UserManagementClient } from '../integrations/user-management/user-management.client';

/**
 * Mock User Management Client for Testing
 * 
 * This mock implementation simulates the User Management service
 * for local testing without requiring the actual service to be running.
 */
export class MockUserManagementClient extends UserManagementClient {
  // Mock user database
  private mockUsers = [
    {
      userId: 'user-001',
      username: 'john.doe',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'Branch Manager'
    },
    {
      userId: 'user-002',
      username: 'jane.smith',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      role: 'Branch Staff'
    },
    {
      userId: 'user-003',
      username: 'bob.johnson',
      email: 'bob.johnson@example.com',
      firstName: 'Bob',
      lastName: 'Johnson',
      role: 'NISD Staff'
    }
  ];

  async getUser(userId: string): Promise<any> {
    console.log(`[MOCK] Getting user: ${userId}`);
    
    const user = this.mockUsers.find(u => u.userId === userId);
    
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    
    return user;
  }

  async validateUserRole(userId: string, _reportId: string, signatureType: string): Promise<boolean> {
    console.log(`[MOCK] Validating user role: ${userId} for ${signatureType}`);
    
    // Mock validation logic - always returns true for testing
    // In real implementation, this would check if user is assigned to the signature role
    const user = await this.getUser(userId);
    
    if (!user) {
      return false;
    }
    
    // Simple mock logic based on signature type
    if (signatureType === 'PREPARED_BY' && user.role === 'Branch Staff') {
      return true;
    }
    
    if (signatureType === 'BRANCH_ACKNOWLEDGEMENT' && user.role === 'Branch Manager') {
      return true;
    }
    
    if (signatureType === 'NISD_ACKNOWLEDGEMENT' && user.role === 'NISD Staff') {
      return true;
    }
    
    return false;
  }
}
