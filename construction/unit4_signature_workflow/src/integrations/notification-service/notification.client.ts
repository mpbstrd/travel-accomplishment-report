import { injectable } from 'tsyringe';

/**
 * Notification Service Client
 * 
 * Communicates with Notification Service for sending notifications.
 * 
 * MOCK IMPLEMENTATION for standalone testing.
 * 
 * PRODUCTION NOTES:
 * - Replace with actual HTTP client or message queue
 * - Implement retry logic for failed notifications
 * - Add authentication/authorization
 * - Consider async/fire-and-forget pattern
 * - Implement circuit breaker for resilience
 * - Log notification failures but don't block workflow
 */

export interface NotificationData {
  reportId: string;
  reportTitle?: string;
  signatureType?: string;
  signatoryName?: string;
  [key: string]: any;
}

@injectable()
export class NotificationClient {
  /**
   * Send notification to a user
   * 
   * MOCK: Logs notification
   * PRODUCTION: Call actual Notification Service API or publish to message queue
   * 
   * @param userId UUID of the recipient
   * @param notificationType Type of notification
   * @param data Notification data
   */
  async sendNotification(
    userId: string,
    notificationType: string,
    data: NotificationData
  ): Promise<void> {
    // MOCK IMPLEMENTATION
    console.log(`[MOCK] Sending notification to user ${userId}:`);
    console.log(`  Type: ${notificationType}`);
    console.log(`  Data:`, data);
    
    // PRODUCTION: Implement actual notification sending
    // Example: await axios.post(`${NOTIFICATION_URL}/notifications`, { userId, notificationType, data });
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Send notification to multiple users
   * 
   * MOCK: Logs bulk notification
   * PRODUCTION: Call actual Notification Service bulk API
   * 
   * @param userIds Array of user UUIDs
   * @param notificationType Type of notification
   * @param data Notification data
   */
  async sendBulkNotification(
    userIds: string[],
    notificationType: string,
    data: NotificationData
  ): Promise<void> {
    // MOCK IMPLEMENTATION
    console.log(`[MOCK] Sending bulk notification to ${userIds.length} users:`);
    console.log(`  Type: ${notificationType}`);
    console.log(`  Data:`, data);
    
    // PRODUCTION: Implement actual bulk notification
    // Example: await axios.post(`${NOTIFICATION_URL}/notifications/bulk`, { userIds, notificationType, data });
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
