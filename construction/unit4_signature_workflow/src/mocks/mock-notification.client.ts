import { NotificationClient } from '../integrations/notification-service/notification.client';

/**
 * Mock Notification Client for Testing
 * 
 * This mock implementation simulates the Notification Service
 * for local testing without requiring the actual service to be running.
 * 
 * All notifications are logged to console instead of being sent.
 */
export class MockNotificationClient extends NotificationClient {
  // Store sent notifications for testing verification
  private sentNotifications: any[] = [];

  async sendNotification(userId: string, notificationType: string, data: any): Promise<void> {
    console.log(`[MOCK] Sending notification to user ${userId}`);
    console.log(`  Type: ${notificationType}`);
    console.log(`  Data:`, JSON.stringify(data, null, 2));
    
    const notification = {
      userId,
      notificationType,
      data,
      sentAt: new Date()
    };
    
    this.sentNotifications.push(notification);
    
    // Simulate notification delivery
    await this.simulateDelay(100);
  }

  async sendBulkNotification(userIds: string[], notificationType: string, data: any): Promise<void> {
    console.log(`[MOCK] Sending bulk notification to ${userIds.length} users`);
    console.log(`  Type: ${notificationType}`);
    console.log(`  Data:`, JSON.stringify(data, null, 2));
    
    for (const userId of userIds) {
      await this.sendNotification(userId, notificationType, data);
    }
  }

  // Helper method to get sent notifications (for testing)
  getSentNotifications(): any[] {
    return this.sentNotifications;
  }

  // Helper method to clear sent notifications (for testing)
  clearNotifications(): void {
    this.sentNotifications = [];
  }

  // Simulate network delay
  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
