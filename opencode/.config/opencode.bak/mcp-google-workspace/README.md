# MCP Google Workspace Server

A Model Context Protocol (MCP) server that provides access to Gmail and Google Calendar within AI conversations. This allows you to search emails, read messages, and query calendar events directly from OpenCode or any other MCP-compatible client.

## Features

### Gmail Tools
- **gmail_search**: Search for emails using Gmail query syntax
- **gmail_get_message**: Get full content of a specific email by ID

### Google Calendar Tools
- **calendar_list_events**: List upcoming calendar events
- **calendar_get_event**: Get details of a specific event
- **calendar_search_events**: Search calendar events by keyword

## Setup Instructions

### 1. Create Google Cloud Project & Enable APIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Enable the following APIs:
   - Gmail API
   - Google Calendar API
4. Go to "APIs & Services" > "Credentials"
5. Click "Create Credentials" > "OAuth client ID"
6. Configure OAuth consent screen if prompted:
   - User Type: External
   - Add scopes: `gmail.readonly` and `calendar.readonly`
   - Add your email as a test user
7. Choose "Desktop app" as application type
8. Download the credentials JSON file
9. Save it as `~/.mcp-google-credentials.json`

### 2. Install Dependencies

```bash
cd /home/mark/AI/mcp-google-workspace
npm install
```

### 3. Build the Server

```bash
npm run build
```

### 4. Authenticate with Google

Run the authentication helper to get your OAuth token:

```bash
node dist/auth.js
```

This will:
- Open your browser for Google OAuth authentication
- Save the token to `~/.mcp-google-token.json`
- Grant the MCP server access to your Gmail and Calendar

### 5. Configure OpenCode

Add the following to your OpenCode MCP settings file (usually `~/.config/opencode/mcp.json`):

```json
{
  "mcpServers": {
    "google-workspace": {
      "command": "node",
      "args": ["/home/mark/AI/mcp-google-workspace/dist/index.js"]
    }
  }
}
```

### 6. Restart OpenCode

Restart OpenCode to load the new MCP server.

## Usage Examples

Once configured, you can use natural language in your conversations:

### Gmail Examples

```
"Show me unread emails from the last week"
"Search for emails about the quarterly review"
"Find emails from john@example.com sent yesterday"
"Get the full content of message ID abc123"
```

### Calendar Examples

```
"What meetings do I have tomorrow?"
"Show me all events next week"
"Find calendar events about the project launch"
"What's on my calendar for January?"
```

## Available Tools

### gmail_search
Search Gmail messages using Gmail query syntax.

**Parameters:**
- `query` (string, required): Gmail search query
  - Examples: `"from:example@gmail.com"`, `"subject:meeting"`, `"is:unread"`, `"after:2024/01/01"`
- `maxResults` (number, optional): Maximum number of messages to return (default: 10)

**Returns:** List of messages with subject, sender, date, and snippet

### gmail_get_message
Get full content of a specific Gmail message.

**Parameters:**
- `messageId` (string, required): The Gmail message ID

**Returns:** Full message including body content

### calendar_list_events
List upcoming Google Calendar events.

**Parameters:**
- `timeMin` (string, optional): Start time in ISO 8601 format (defaults to now)
- `timeMax` (string, optional): End time in ISO 8601 format
- `maxResults` (number, optional): Maximum events to return (default: 10)
- `calendarId` (string, optional): Calendar ID (default: "primary")

**Returns:** List of events with details

### calendar_get_event
Get details of a specific calendar event.

**Parameters:**
- `eventId` (string, required): The calendar event ID
- `calendarId` (string, optional): Calendar ID (default: "primary")

**Returns:** Full event details

### calendar_search_events
Search calendar events by keyword.

**Parameters:**
- `query` (string, required): Search query
- `timeMin` (string, optional): Start time in ISO 8601 format
- `timeMax` (string, optional): End time in ISO 8601 format
- `maxResults` (number, optional): Maximum events to return (default: 10)
- `calendarId` (string, optional): Calendar ID (default: "primary")

**Returns:** Matching events

## Gmail Query Syntax

You can use Gmail's powerful query syntax:
- `from:sender@example.com` - Emails from specific sender
- `to:recipient@example.com` - Emails to specific recipient
- `subject:keyword` - Emails with keyword in subject
- `is:unread` - Unread emails
- `is:starred` - Starred emails
- `has:attachment` - Emails with attachments
- `after:2024/01/01` - Emails after date
- `before:2024/12/31` - Emails before date
- Combine with AND/OR: `from:example.com AND subject:invoice`

## Security Notes

- This server uses OAuth 2.0 with read-only scopes
- Credentials are stored locally in your home directory
- Token file (`~/.mcp-google-token.json`) contains access tokens - keep it secure
- The server only has read access to your Gmail and Calendar

## Troubleshooting

### "Token not found" Error
Run the authentication script again:
```bash
node dist/auth.js
```

### "Credentials not found" Error
Ensure you've downloaded the OAuth credentials from Google Cloud Console and saved them to `~/.mcp-google-credentials.json`

### "Access Denied" Error
Make sure you've:
1. Enabled Gmail API and Google Calendar API in Google Cloud Console
2. Added your email as a test user in the OAuth consent screen
3. Granted permissions during the OAuth flow

## Development

Watch mode for development:
```bash
npm run dev
```

## License

MIT
