import { Router } from "express";
import { WebhookController } from "../controllers/webhook.controller";

const router = Router();

// Initialize the webhook controller without authentication
const webhookController = new WebhookController();

// Route to trigger a webhook event
router.post("/trigger", async (req, res) => {
  try {
    const {
      tenantId,
      eventKey,
      properties,
      channelConfiguration,
      retryOptions,
    } = req.body;

    // Validate required fields
    if (
      !tenantId ||
      !eventKey ||
      !properties?.title ||
      !properties?.description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: tenantId, eventKey, properties.title, or properties.description",
      });
    }

    const eventId = await webhookController.triggerWebhookEvent(
      tenantId,
      eventKey,
      properties,
      channelConfiguration,
      retryOptions
    );

    res.status(200).json({
      success: true,
      message: "Webhook event triggered successfully",
      eventId,
    });
  } catch (error) {
    console.error("Error triggering webhook:", error);
    res.status(500).json({
      success: false,
      message: "Failed to trigger webhook event",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Route to check webhook event status
router.get("/status/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const status = await webhookController.getWebhookEventStatus(eventId);

    res.status(200).json({
      success: true,
      status,
    });
  } catch (error) {
    console.error("Error getting webhook status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get webhook status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Route to handle incoming webhooks
router.post("/receive", async (req, res) => {
  await webhookController.handleWebhook(req, res);
});

export { router as WebhooksRouter };
