# MCP Outlook Calendar Server

A Model Context Protocol (MCP) server for integrating with Microsoft Outlook Calendar. This server allows you to list, search, and retrieve calendar events from your Outlook/Microsoft 365 account.

## Features

- List calendar events within a specified time range
- Get detailed information about specific events
- Search calendar events by keywords
- Uses Microsoft Graph API for reliable access to Outlook data

## Prerequisites

- Node.js 18 or higher
- A Microsoft Azure application registration (for OAuth authentication)
- Microsoft 365 or Outlook.com account

## Setup

### 1. Register an Azure Application

1. Go to the [Azure Portal](https://portal.azure.com/)
2. Navigate to "Azure Active Directory" > "App registrations" > "New registration"
3. Name your application (e.g., "MCP Outlook Calendar")
4. Under "Supported account types", select "Accounts in any organizational directory and personal Microsoft accounts"
5. Click "Register"
6. Note down the **Application (client) ID** and **Directory (tenant) ID**
7. Go to "Authentication" > "Add a platform" > "Mobile and desktop applications"
8. Add the redirect URI: `http://localhost`
9. Enable "Allow public client flows" under "Authentication" > "Advanced settings"
10. Go to "API permissions" > "Add a permission" > "Microsoft Graph" > "Delegated permissions"
11. Add these permissions:
    - `Calendars.Read`
    - `Calendars.ReadWrite` (if you plan to add write features later)
12. Click "Grant admin consent" if you have admin rights, or ask your admin to approve

### 2. Install Dependencies

```bash
cd mcp-outlook-calendar
npm install
```

### 3. Build the Project

```bash
npm run build
```

### 4. Configure Environment Variables

Set the following environment variables with your Azure application details:

```bash
export OUTLOOK_CLIENT_ID="your-client-id"
export OUTLOOK_TENANT_ID="common"  # or your specific tenant ID
```

You can add these to your shell profile (`.bashrc`, `.zshrc`, etc.) to persist them.

## Usage

### Running Directly

```bash
npm start
```

### Integrating with MCP Clients

Add the server to your MCP client configuration. For example, in your OpenCode configuration:

```json
{
  "mcpServers": {
    "outlook-calendar": {
      "command": "node",
      "args": ["/home/mark/AI/mcp-outlook-calendar/dist/index.js"],
      "env": {
        "OUTLOOK_CLIENT_ID": "your-client-id",
        "OUTLOOK_TENANT_ID": "common"
      }
    }
  }
}
```

## Available Tools

### list_calendar_events

List calendar events within a specified time range.

**Parameters:**
- `timeMin` (optional): Start time in ISO 8601 format (e.g., '2024-01-01T00:00:00Z')
- `timeMax` (optional): End time in ISO 8601 format
- `maxResults` (optional): Maximum number of events to return (default: 10)

### get_calendar_event

Get detailed information about a specific calendar event.

**Parameters:**
- `eventId` (required): The calendar event ID

### search_calendar_events

Search calendar events by keywords in the title or description.

**Parameters:**
- `query` (required): Search query to match in event subject or body
- `timeMin` (optional): Start time in ISO 8601 format
- `timeMax` (optional): End time in ISO 8601 format
- `maxResults` (optional): Maximum number of events to return (default: 10)

## Authentication Flow

The server uses Device Code Flow authentication. On first run:

1. The server will display a URL and code
2. Visit the URL in your browser
3. Enter the code when prompted
4. Sign in with your Microsoft account
5. Grant the requested permissions
6. The server will then have access to your calendar

The authentication token is cached by the Azure Identity library, so you won't need to re-authenticate on subsequent runs.

## Development

To run in development mode with auto-rebuild:

```bash
npm run dev
```

## Troubleshooting

### Authentication Errors

- Ensure your `OUTLOOK_CLIENT_ID` is correct
- Check that the Azure application has the correct permissions
- Verify that "Allow public client flows" is enabled in your Azure app settings

### API Errors

- Ensure you have a valid Microsoft 365 or Outlook.com account
- Check that you've granted the necessary calendar permissions
- Review the Microsoft Graph API documentation for specific error codes

## License

MIT
