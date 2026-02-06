#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Client } from "@microsoft/microsoft-graph-client";
import { DeviceCodeCredential } from "@azure/identity";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials/index.js";

// Configuration
const CLIENT_ID = process.env.OUTLOOK_CLIENT_ID;
const TENANT_ID = process.env.OUTLOOK_TENANT_ID || "common";

if (!CLIENT_ID) {
  console.error("Error: OUTLOOK_CLIENT_ID environment variable is required");
  process.exit(1);
}

// Create MCP server
const server = new Server(
  {
    name: "mcp-outlook-calendar",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize Microsoft Graph client
let graphClient: Client | null = null;

async function getGraphClient(): Promise<Client> {
  if (graphClient) {
    return graphClient;
  }

  const credential = new DeviceCodeCredential({
    tenantId: TENANT_ID,
    clientId: CLIENT_ID,
    userPromptCallback: (info) => {
      console.error(info.message);
    },
  });

  const authProvider = new TokenCredentialAuthenticationProvider(credential, {
    scopes: ["https://graph.microsoft.com/.default"],
  });

  graphClient = Client.initWithMiddleware({
    authProvider,
  });

  return graphClient;
}

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "list_calendar_events",
        description:
          "List calendar events from Microsoft Outlook within a specified time range",
        inputSchema: {
          type: "object",
          properties: {
            timeMin: {
              type: "string",
              description:
                "Start time in ISO 8601 format (e.g., '2024-01-01T00:00:00Z'). Defaults to now.",
            },
            timeMax: {
              type: "string",
              description:
                "End time in ISO 8601 format (e.g., '2024-12-31T23:59:59Z')",
            },
            maxResults: {
              type: "number",
              description: "Maximum number of events to return (default: 10)",
              default: 10,
            },
          },
        },
      },
      {
        name: "get_calendar_event",
        description: "Get details of a specific calendar event by ID",
        inputSchema: {
          type: "object",
          properties: {
            eventId: {
              type: "string",
              description: "The calendar event ID",
            },
          },
          required: ["eventId"],
        },
      },
      {
        name: "search_calendar_events",
        description: "Search calendar events by keyword in title or description",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query to match in event subject or body",
            },
            timeMin: {
              type: "string",
              description: "Start time in ISO 8601 format. Defaults to now.",
            },
            timeMax: {
              type: "string",
              description: "End time in ISO 8601 format",
            },
            maxResults: {
              type: "number",
              description: "Maximum number of events to return (default: 10)",
              default: 10,
            },
          },
          required: ["query"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const client = await getGraphClient();

    switch (name) {
      case "list_calendar_events": {
        const maxResults = (args?.maxResults as number) || 10;
        const timeMin = args?.timeMin as string | undefined;
        const timeMax = args?.timeMax as string | undefined;

        let query = client.api("/me/calendar/events").top(maxResults).orderby("start/dateTime");

        // Build filter if time range is specified
        const filters: string[] = [];
        if (timeMin) {
          filters.push(`start/dateTime ge '${timeMin}'`);
        }
        if (timeMax) {
          filters.push(`end/dateTime le '${timeMax}'`);
        }
        if (filters.length > 0) {
          query = query.filter(filters.join(" and "));
        }

        const response = await query.get();
        const events = response.value || [];

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  eventCount: events.length,
                  events: events.map((event: any) => ({
                    id: event.id,
                    subject: event.subject,
                    start: event.start.dateTime,
                    end: event.end.dateTime,
                    location: event.location?.displayName,
                    organizer: event.organizer?.emailAddress?.name,
                    webLink: event.webLink,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "get_calendar_event": {
        const eventId = args?.eventId as string;
        if (!eventId) {
          throw new Error("eventId is required");
        }

        const event = await client.api(`/me/calendar/events/${eventId}`).get();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  id: event.id,
                  subject: event.subject,
                  body: event.body?.content,
                  bodyType: event.body?.contentType,
                  start: event.start.dateTime,
                  end: event.end.dateTime,
                  location: event.location?.displayName,
                  organizer: event.organizer?.emailAddress,
                  attendees: event.attendees?.map((a: any) => ({
                    name: a.emailAddress.name,
                    email: a.emailAddress.address,
                    status: a.status.response,
                  })),
                  webLink: event.webLink,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      case "search_calendar_events": {
        const query = args?.query as string;
        if (!query) {
          throw new Error("query is required");
        }

        const maxResults = (args?.maxResults as number) || 10;
        const timeMin = args?.timeMin as string | undefined;
        const timeMax = args?.timeMax as string | undefined;

        let apiQuery = client
          .api("/me/calendar/events")
          .top(maxResults)
          .orderby("start/dateTime")
          .search(`"${query}"`);

        // Build filter if time range is specified
        const filters: string[] = [];
        if (timeMin) {
          filters.push(`start/dateTime ge '${timeMin}'`);
        }
        if (timeMax) {
          filters.push(`end/dateTime le '${timeMax}'`);
        }
        if (filters.length > 0) {
          apiQuery = apiQuery.filter(filters.join(" and "));
        }

        const response = await apiQuery.get();
        const events = response.value || [];

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  eventCount: events.length,
                  events: events.map((event: any) => ({
                    id: event.id,
                    subject: event.subject,
                    start: event.start.dateTime,
                    end: event.end.dateTime,
                    location: event.location?.displayName,
                    organizer: event.organizer?.emailAddress?.name,
                    webLink: event.webLink,
                  })),
                },
                null,
                2
              ),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Outlook Calendar MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
