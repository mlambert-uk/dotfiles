import { tool } from "@opencode-ai/plugin";
import { spawn } from "child_process";

/**
 * Outlook Calendar Tools - Direct MCP Integration
 * These tools call the outlook_ews_* tools from the MCP proxy directly
 */

/**
 * Call an MCP tool through the proxy client bridge
 */
async function callMCPTool(
  toolName: string,
  args: Record<string, unknown>
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    // Construct the MCP request
    const request = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: toolName,
        arguments: args,
      },
    };

    // Spawn the MCP client bridge
    const proc = spawn("node", ["/home/mark/AI/mcp-proxy/client-bridge.js"], {
      env: {
        ...process.env,
        MCP_SOCKET_PATH: "/run/user/1000/mcp-proxy.sock",
      },
    });

    let output = "";
    let errorOutput = "";

    // Write the request to the process
    proc.stdin.write(JSON.stringify(request) + "\n");
    proc.stdin.end();

    // Collect the response
    proc.stdout.on("data", (data) => {
      output += data.toString();
    });

    proc.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0 && output) {
        try {
          // Parse the response
          const responses = output
            .trim()
            .split("\n")
            .filter((line) => line.trim());
          const lastResponse = JSON.parse(responses[responses.length - 1]);

          if (lastResponse.error) {
            reject(new Error(`MCP error: ${lastResponse.error.message}`));
          } else {
            resolve(lastResponse.result);
          }
        } catch (error) {
          reject(new Error(`Failed to parse MCP response: ${error}`));
        }
      } else if (errorOutput) {
        reject(new Error(`MCP bridge error: ${errorOutput}`));
      } else {
        reject(new Error("No response from MCP proxy"));
      }
    });

    proc.on("error", (error) => {
      reject(error);
    });

    // Set a timeout
    setTimeout(() => {
      proc.kill();
      reject(new Error("MCP tool call timed out after 30 seconds"));
    }, 30000);
  });
}

/**
 * List upcoming Outlook calendar events
 */
export const listOutlookEvents = tool({
  description: "List upcoming Outlook calendar events",
  args: {
    daysAhead: tool.schema
      .number()
      .default(0)
      .describe("Number of days to look ahead (0 = today only)"),
    maxResults: tool.schema
      .number()
      .optional()
      .describe("Maximum number of events to return"),
  },
  async execute(args) {
    try {
      const result = await callMCPTool("outlook_ews_list_events", args);
      return result;
    } catch (error) {
      throw new Error(`Failed to list Outlook events: ${error}`);
    }
  },
});

/**
 * Get details of a specific Outlook calendar event
 */
export const getOutlookEvent = tool({
  description: "Get detailed information about a specific Outlook calendar event",
  args: {
    eventId: tool.schema.string().describe("The Outlook event ID"),
  },
  async execute(args) {
    try {
      const result = await callMCPTool("outlook_ews_get_event", args);
      return result;
    } catch (error) {
      throw new Error(`Failed to get Outlook event: ${error}`);
    }
  },
});

/**
 * Create a new Outlook calendar event
 */
export const createOutlookEvent = tool({
  description: "Create a new event in Outlook calendar",
  args: {
    summary: tool.schema.string().describe("Event title"),
    startTime: tool.schema
      .string()
      .describe("Start time in ISO 8601 format"),
    endTime: tool.schema.string().describe("End time in ISO 8601 format"),
    description: tool.schema
      .string()
      .optional()
      .describe("Event description"),
    attendees: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Email addresses of attendees"),
  },
  async execute(args) {
    try {
      const result = await callMCPTool("outlook_ews_create_event", args);
      return result;
    } catch (error) {
      throw new Error(`Failed to create Outlook event: ${error}`);
    }
  },
});

// Export the list events tool as default for when tool is called directly
export default listOutlookEvents;
