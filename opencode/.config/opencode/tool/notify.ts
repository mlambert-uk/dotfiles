import { tool } from "@opencode-ai/plugin";

export default tool({
  description:
    "Send notifications to Omarchy's mako notification system with customizable title, message, urgency, and timeout",
  args: {
    title: tool.schema.string().describe("Notification title"),
    message: tool.schema
      .string()
      .describe("Notification message body"),
    urgency: tool.schema
      .enum(["low", "normal", "critical"])
      .default("normal")
      .describe(
        "Urgency level: low for informational, normal for standard updates, critical for important alerts"
      ),
    timeout: tool.schema
      .number()
      .optional()
      .describe(
        "How long to display the notification in milliseconds (omit for default, 0 for sticky)"
      ),
    appName: tool.schema
      .string()
      .default("OpenCode")
      .describe("Application name to display in the notification"),
  },
  async execute(args) {
    const { title, message, urgency, timeout, appName } = args;

    try {
      // Build command arguments array
      const cmdArgs = ["-a", appName, "-u", urgency];
      
      if (timeout !== undefined) {
        cmdArgs.push("-t", String(timeout));
      }
      
      cmdArgs.push(title, message);
      
      // Spawn process
      const proc = Bun.spawn(["notify-send", ...cmdArgs], {
        stdin: "ignore",
        stdout: "pipe",
        stderr: "pipe",
      });
      
      const exitCode = await proc.exited;
      
      if (exitCode !== 0) {
        const stderr = await new Response(proc.stderr).text();
        throw new Error(`notify-send exited with code ${exitCode}: ${stderr}`);
      }
      
      return `Notification sent: "${title}"`;
    } catch (error) {
      throw new Error(`Failed to send notification: ${error}`);
    }
  },
});
