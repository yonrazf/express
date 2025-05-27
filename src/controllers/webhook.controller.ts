import { Request, Response } from "express";
import { EventsClient } from "@frontegg/client";
import { authenticator } from "../auth/authenticator";
import type { ChannelConfiguration } from "@frontegg/client/dist/src/clients/events/types/channel-configuration";

interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoffFactor?: number;
}

export class WebhookController {
  private eventsClient: EventsClient;
  private defaultRetryOptions: Required<RetryOptions> = {
    maxRetries: 3,
    delayMs: 1000,
    backoffFactor: 2,
  };

  constructor() {
    this.eventsClient = new EventsClient(authenticator.authenticatorInstance);
  }

  /**
   * Sleep for a specified number of milliseconds
   * @param ms Number of milliseconds to sleep
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Trigger a webhook event with retry mechanism
   * @param tenantId The tenant ID to trigger the event for
   * @param eventKey Unique event key
   * @param properties Event properties (title and description are required)
   * @param channelConfiguration Optional channel configuration for email or slack
   * @param retryOptions Optional retry configuration
   */
  public async triggerWebhookEvent(
    tenantId: string,
    eventKey: string,
    properties: {
      title: string;
      description: string;
      [key: string]: any;
    },
    channelConfiguration?: ChannelConfiguration,
    retryOptions?: RetryOptions
  ): Promise<string> {
    const options = { ...this.defaultRetryOptions, ...retryOptions };
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= options.maxRetries; attempt++) {
      try {
        const eventId = await this.eventsClient.send(tenantId, {
          eventKey,
          data: properties,
          channelConfiguration,
        });

        return eventId;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        if (attempt === options.maxRetries) {
          console.error(
            `Failed to trigger webhook event after ${options.maxRetries} attempts:`,
            lastError
          );
          throw lastError;
        }

        const delay =
          options.delayMs * Math.pow(options.backoffFactor, attempt);
        console.warn(
          `Attempt ${attempt + 1} failed, retrying in ${delay}ms...`
        );
        await this.sleep(delay);
      }
    }

    throw lastError;
  }

  /**
   * Get the status of a webhook event
   * @param eventId The ID of the event to check
   */
  public async getWebhookEventStatus(eventId: string): Promise<any> {
    try {
      return await this.eventsClient.getStatus(eventId);
    } catch (error) {
      console.error("Error getting webhook event status:", error);
      throw error;
    }
  }

  /**
   * Handle incoming webhook requests
   * @param req Express request object
   * @param res Express response object
   */
  public async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      // Log the webhook payload for debugging
      console.log("Received webhook:", req.body);

      // TODO: Add webhook signature verification
      // TODO: Add specific webhook event handling logic

      // Send success response
      res.status(200).json({
        success: true,
        message: "Webhook received successfully",
      });
    } catch (error) {
      console.error("Error processing webhook:", error);
      res.status(500).json({
        success: false,
        message: "Error processing webhook",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
