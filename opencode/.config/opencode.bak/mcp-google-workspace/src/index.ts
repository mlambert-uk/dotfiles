#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// OAuth2 configuration
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
];

const TOKEN_PATH = path.join(process.env.HOME || "", ".mcp-google-token.json");
const CREDENTIALS_PATH = path.join(
  process.env.HOME || "",
  ".mcp-google-credentials.json"
);

class GoogleWorkspaceMCPServer {
  private server: Server;
  private auth: OAuth2Client | null = null;

  constructor() {
    this.server = new Server(
      {
        name: "mcp-google-workspace",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private async getAuthClient(): Promise<OAuth2Client> {
    if (this.auth) {
      return this.auth;
    }

    try {
      const credentials = JSON.parse(
        await fs.readFile(CREDENTIALS_PATH, "utf-8")
      );
      const { client_secret, client_id, redirect_uris } =
        credentials.installed || credentials.web;

      const auth = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      try {
        const token = JSON.parse(await fs.readFile(TOKEN_PATH, "utf-8"));
        auth.setCredentials(token);
      } catch (err) {
        throw new Error(
          "Token not found. Please run authentication setup first."
        );
      }

      this.auth = auth;
      return auth;
    } catch (err) {
      throw new Error(
        `Failed to load credentials: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "gmail_search",
          description:
            "Search Gmail messages using Gmail query syntax. Returns message subjects, senders, dates, and snippets.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description:
                  "Gmail search query (e.g., 'from:example@gmail.com', 'subject:meeting', 'is:unread', 'after:2024/01/01')",
              },
              maxResults: {
                type: "number",
                description: "Maximum number of messages to return (default: 10)",
                default: 10,
              },
            },
            required: ["query"],
          },
        },
        {
          name: "gmail_get_message",
          description:
            "Get full content of a specific Gmail message by ID, including body and attachments list.",
          inputSchema: {
            type: "object",
            properties: {
              messageId: {
                type: "string",
                description: "The Gmail message ID",
              },
            },
            required: ["messageId"],
          },
        },
        {
          name: "calendar_list_events",
          description:
            "List upcoming Google Calendar events within a specified time range.",
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
              calendarId: {
                type: "string",
                description: "Calendar ID (default: 'primary')",
                default: "primary",
              },
            },
          },
        },
        {
          name: "calendar_get_event",
          description: "Get details of a specific calendar event by ID.",
          inputSchema: {
            type: "object",
            properties: {
              eventId: {
                type: "string",
                description: "The calendar event ID",
              },
              calendarId: {
                type: "string",
                description: "Calendar ID (default: 'primary')",
                default: "primary",
              },
            },
            required: ["eventId"],
          },
        },
        {
          name: "calendar_search_events",
          description: "Search calendar events by keyword in title or description.",
          inputSchema: {
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "Search query to match in event summary or description",
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
              calendarId: {
                type: "string",
                description: "Calendar ID (default: 'primary')",
                default: "primary",
              },
            },
            required: ["query"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const auth = await this.getAuthClient();

        switch (request.params.name) {
          case "gmail_search":
            return await this.handleGmailSearch(auth, request.params.arguments);
          case "gmail_get_message":
            return await this.handleGmailGetMessage(
              auth,
              request.params.arguments
            );
          case "calendar_list_events":
            return await this.handleCalendarListEvents(
              auth,
              request.params.arguments
            );
          case "calendar_get_event":
            return await this.handleCalendarGetEvent(
              auth,
              request.params.arguments
            );
          case "calendar_search_events":
            return await this.handleCalendarSearchEvents(
              auth,
              request.params.arguments
            );
          default:
            throw new Error(`Unknown tool: ${request.params.name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private async handleGmailSearch(auth: OAuth2Client, args: any) {
    const gmail = google.gmail({ version: "v1", auth });
    const query = args.query || "";
    const maxResults = args.maxResults || 10;

    const response = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults,
    });

    const messages = response.data.messages || [];
    const details = await Promise.all(
      messages.map(async (msg) => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
          metadataHeaders: ["From", "To", "Subject", "Date"],
        });

        const headers = detail.data.payload?.headers || [];
        const getHeader = (name: string) =>
          headers.find((h) => h.name === name)?.value || "";

        return {
          id: msg.id,
          threadId: msg.threadId,
          from: getHeader("From"),
          to: getHeader("To"),
          subject: getHeader("Subject"),
          date: getHeader("Date"),
          snippet: detail.data.snippet,
        };
      })
    );

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              resultCount: messages.length,
              messages: details,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleGmailGetMessage(auth: OAuth2Client, args: any) {
    const gmail = google.gmail({ version: "v1", auth });
    const messageId = args.messageId;

    const message = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full",
    });

    const headers = message.data.payload?.headers || [];
    const getHeader = (name: string) =>
      headers.find((h) => h.name === name)?.value || "";

    // Extract body
    let body = "";
    const parts = message.data.payload?.parts || [];

    const extractBody = (part: any): string => {
      if (part.mimeType === "text/plain" && part.body?.data) {
        return Buffer.from(part.body.data, "base64").toString("utf-8");
      }
      if (part.parts) {
        return part.parts.map(extractBody).join("\n");
      }
      return "";
    };

    if (message.data.payload?.body?.data) {
      body = Buffer.from(message.data.payload.body.data, "base64").toString(
        "utf-8"
      );
    } else {
      body = parts.map(extractBody).join("\n");
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              id: message.data.id,
              threadId: message.data.threadId,
              from: getHeader("From"),
              to: getHeader("To"),
              subject: getHeader("Subject"),
              date: getHeader("Date"),
              body: body,
              snippet: message.data.snippet,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleCalendarListEvents(auth: OAuth2Client, args: any) {
    const calendar = google.calendar({ version: "v3", auth });
    const timeMin = args.timeMin || new Date().toISOString();
    const timeMax = args.timeMax;
    const maxResults = args.maxResults || 10;
    const calendarId = args.calendarId || "primary";

    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (response.data.items || []).map((event) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      attendees: event.attendees?.map((a) => ({
        email: a.email,
        responseStatus: a.responseStatus,
      })),
      htmlLink: event.htmlLink,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              eventCount: events.length,
              events,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleCalendarGetEvent(auth: OAuth2Client, args: any) {
    const calendar = google.calendar({ version: "v3", auth });
    const eventId = args.eventId;
    const calendarId = args.calendarId || "primary";

    const response = await calendar.events.get({
      calendarId,
      eventId,
    });

    const event = response.data;

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              id: event.id,
              summary: event.summary,
              description: event.description,
              location: event.location,
              start: event.start?.dateTime || event.start?.date,
              end: event.end?.dateTime || event.end?.date,
              attendees: event.attendees?.map((a) => ({
                email: a.email,
                displayName: a.displayName,
                responseStatus: a.responseStatus,
              })),
              organizer: event.organizer,
              htmlLink: event.htmlLink,
              conferenceData: event.conferenceData,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  private async handleCalendarSearchEvents(auth: OAuth2Client, args: any) {
    const calendar = google.calendar({ version: "v3", auth });
    const query = args.query;
    const timeMin = args.timeMin || new Date().toISOString();
    const timeMax = args.timeMax;
    const maxResults = args.maxResults || 10;
    const calendarId = args.calendarId || "primary";

    const response = await calendar.events.list({
      calendarId,
      q: query,
      timeMin,
      timeMax,
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = (response.data.items || []).map((event) => ({
      id: event.id,
      summary: event.summary,
      description: event.description,
      location: event.location,
      start: event.start?.dateTime || event.start?.date,
      end: event.end?.dateTime || event.end?.date,
      attendees: event.attendees?.map((a) => ({
        email: a.email,
        responseStatus: a.responseStatus,
      })),
      htmlLink: event.htmlLink,
    }));

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              query,
              eventCount: events.length,
              events,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("MCP Google Workspace Server running on stdio");
  }
}

const server = new GoogleWorkspaceMCPServer();
server.run().catch(console.error);
