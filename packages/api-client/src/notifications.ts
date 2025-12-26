/**
 * Notifications API Endpoints
 */

import { ApiClient } from './client';
import type {
  SendEmailRequest,
  SendEmailResponse,
  SendSMSRequest,
  SendSMSResponse,
} from './types';

export class NotificationsApi {
  constructor(private client: ApiClient) {}

  /**
   * Send email notification
   */
  async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
    return this.client.post<SendEmailResponse>('/api/notifications/send-email', request);
  }

  /**
   * Send SMS notification (Premium feature)
   */
  async sendSMS(request: SendSMSRequest): Promise<SendSMSResponse> {
    return this.client.post<SendSMSResponse>('/api/notifications/send-sms', request);
  }
}

