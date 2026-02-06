import { tool } from "@opencode-ai/plugin";

export const buildStatus = tool({
  description:
    "Send a build status notification to Omarchy with success/failure indication",
  args: {
    projectName: tool.schema
      .string()
      .describe("Name of the project being built"),
    success: tool.schema
      .boolean()
      .describe("Whether the build was successful"),
    details: tool.schema
      .string()
      .optional()
      .describe("Additional details about the build (errors, warnings, etc)"),
    duration: tool.schema
      .string()
      .optional()
      .describe("How long the build took (e.g., '2.3s')"),
  },
  async execute(args) {
    const { projectName, success, details, duration } = args;

    const urgency = success ? "normal" : "critical";
    const title = success ? "Build Successful" : "Build Failed";

    let message = `${projectName} `;
    if (success) {
      message += "compiled without errors";
    } else {
      message += "encountered errors";
    }

    if (duration) {
      message += ` (${duration})`;
    }

    if (details) {
      message += `\n${details}`;
    }

    const cmd = `notify-send -a "OpenCode Build" -u ${urgency} "${title}" "${message.replace(/"/g, '\\"')}"`;

    try {
      await Bun.$`${cmd}`.text();
      return `Build notification sent for ${projectName}`;
    } catch (error) {
      throw new Error(`Failed to send build notification: ${error}`);
    }
  },
});

export const testResults = tool({
  description:
    "Send a test results notification to Omarchy with pass/fail counts",
  args: {
    total: tool.schema.number().describe("Total number of tests"),
    passed: tool.schema.number().describe("Number of tests that passed"),
    failed: tool.schema
      .number()
      .optional()
      .describe("Number of tests that failed"),
    duration: tool.schema
      .string()
      .optional()
      .describe("How long tests took to run"),
  },
  async execute(args) {
    const { total, passed, failed: failedCount, duration } = args;
    const failed = failedCount ?? total - passed;
    const success = failed === 0;
    const urgency = success ? "normal" : "critical";

    const title = success ? "Tests Passed" : "Tests Failed";
    let message = `${passed}/${total} tests passed`;

    if (failed > 0) {
      message += `, ${failed} failed`;
    }

    if (duration) {
      message += ` in ${duration}`;
    }

    const cmd = `notify-send -a "OpenCode Tests" -u ${urgency} "${title}" "${message.replace(/"/g, '\\"')}"`;

    try {
      await Bun.$`${cmd}`.text();
      return `Test notification sent: ${passed}/${total} passed`;
    } catch (error) {
      throw new Error(`Failed to send test notification: ${error}`);
    }
  },
});

export const deploymentStatus = tool({
  description:
    "Send a deployment status notification with environment and status information",
  args: {
    environment: tool.schema
      .enum(["staging", "production", "development"])
      .describe("Deployment environment"),
    status: tool.schema
      .enum(["started", "in-progress", "complete", "failed"])
      .describe("Current deployment status"),
    version: tool.schema
      .string()
      .optional()
      .describe("Version being deployed"),
    message: tool.schema
      .string()
      .optional()
      .describe("Additional status message"),
  },
  async execute(args) {
    const { environment, status, version, message: additionalMsg } = args;

    const urgency =
      status === "failed"
        ? "critical"
        : status === "started"
          ? "low"
          : "normal";

    const statusEmoji = {
      started: "🚀",
      "in-progress": "⏳",
      complete: "✅",
      failed: "❌",
    };

    let title = `Deployment ${statusEmoji[status]} ${status.replace("-", " ")}`;
    let msgBody = `Environment: ${environment}`;

    if (version) {
      msgBody += `\nVersion: ${version}`;
    }

    if (additionalMsg) {
      msgBody += `\n${additionalMsg}`;
    }

    const cmd = `notify-send -a "OpenCode Deploy" -u ${urgency} "${title}" "${msgBody.replace(/"/g, '\\"')}"`;

    try {
      await Bun.$`${cmd}`.text();
      return `Deployment notification sent for ${environment}`;
    } catch (error) {
      throw new Error(`Failed to send deployment notification: ${error}`);
    }
  },
});
