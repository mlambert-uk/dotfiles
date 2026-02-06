# Confluence MCP Server

A Model Context Protocol (MCP) server for Atlassian Confluence, enabling OpenCode and other MCP clients to interact with Confluence pages, spaces, and comments.

## Features

- **Search Pages**: Query Confluence using CQL (Confluence Query Language)
- **Read Pages**: Retrieve full page content, metadata, labels, and version history
- **Create Pages**: Create new pages with storage format content
- **Update Pages**: Modify existing page titles and content
- **Delete Pages**: Remove pages from Confluence
- **Manage Spaces**: List spaces and retrieve space pages
- **Labels**: Add and manage page labels/tags
- **Comments**: Read and add comments to pages

## Prerequisites

- Node.js 18+ or Bun
- An Atlassian Confluence Cloud instance
- API token with appropriate permissions

## Getting Started

### 1. Create an API Token

1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a descriptive name (e.g., "OpenCode Confluence MCP")
4. Copy the token (you'll only see it once)

### 2. Install Dependencies

```bash
cd mcp-confluence
npm install
# or with bun
bun install
```

### 3. Build the Server

```bash
npm run build
# or
bun run build
```

### 4. Configure OpenCode

Add the MCP server to your `opencode.json`:

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "confluence": {
      "type": "local",
      "command": ["node", "/path/to/mcp-confluence/build/index.js"],
      "enabled": true,
      "environment": {
        "CONFLUENCE_BASE_URL": "https://your-domain.atlassian.net/wiki",
        "CONFLUENCE_API_TOKEN": "{env:CONFLUENCE_API_TOKEN}",
        "CONFLUENCE_EMAIL": "your-email@example.com"
      }
    }
  }
}
```

### 5. Set Environment Variable

```bash
export CONFLUENCE_API_TOKEN="your-api-token-here"
```

Or add it to your shell configuration file (`.bashrc`, `.zshrc`, etc.):

```bash
export CONFLUENCE_API_TOKEN="your-api-token-here"
```

## Usage in OpenCode

Once configured, you can use Confluence tools in your OpenCode prompts:

```
Find all pages in the MYSPACE space created in the last week using confluence

Search for pages about "authentication" using confluence

Create a new page in the DOCS space titled "API Documentation" with example content
```

## Available Tools

### search_pages
Search for pages using CQL syntax.

```
Args:
  - query (string, required): CQL query (e.g., 'text ~ "keyword"', 'creator = currentUser()')
  - limit (number, optional): Max results to return (default: 25, max: 250)
```

### get_page
Retrieve a page by its ID.

```
Args:
  - pageId (string, required): The Confluence page ID
  - includeBody (boolean, optional): Include page body (default: true)
```

### get_page_by_title
Search for a page by title and space.

```
Args:
  - title (string, required): Exact page title
  - spaceKey (string, required): Space key (e.g., 'MYSPACE')
```

### create_page
Create a new page.

```
Args:
  - spaceKey (string, required): Space key
  - title (string, required): Page title
  - body (string, required): Content in storage format (XHTML)
  - parentPageId (string, optional): Parent page ID for hierarchy
```

### update_page
Update an existing page.

```
Args:
  - pageId (string, required): Page ID
  - title (string, optional): New title
  - body (string, optional): New content in storage format
  - version (number, required): Current version number
```

### delete_page
Delete a page.

```
Args:
  - pageId (string, required): Page ID to delete
```

### get_spaces
List Confluence spaces.

```
Args:
  - limit (number, optional): Max spaces (default: 25)
  - type (string, optional): Filter by 'global' or 'personal'
```

### get_space_pages
Get all pages in a space.

```
Args:
  - spaceKey (string, required): Space key
  - limit (number, optional): Max pages (default: 25)
```

### add_label
Add labels to a page.

```
Args:
  - pageId (string, required): Page ID
  - labels (array, required): Label names
```

### get_page_comments
Retrieve comments on a page.

```
Args:
  - pageId (string, required): Page ID
  - limit (number, optional): Max comments (default: 25)
```

### add_comment
Add a comment to a page.

```
Args:
  - pageId (string, required): Page ID
  - body (string, required): Comment text in storage format
```

## Storage Format (XHTML)

Confluence uses XHTML for page content. Here are common examples:

**Simple paragraph:**
```xml
<p>This is a paragraph.</p>
```

**Heading:**
```xml
<h1>Main Heading</h1>
<h2>Subheading</h2>
```

**Lists:**
```xml
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

**Code block:**
```xml
<ac:structured-macro ac:name="code">
  <ac:parameter ac:name="language">javascript</ac:parameter>
  <ac:plain-text-body><![CDATA[
const x = 42;
]]></ac:plain-text-body>
</ac:structured-macro>
```

**Links:**
```xml
<a href="https://example.com">Link text</a>
```

## CQL Query Examples

```
# Pages created by current user
creator = currentUser()

# Pages in a specific space
space.key = "MYSPACE"

# Pages containing specific text
text ~ "keyword"

# Pages modified in last 7 days
updated >= -7d

# Pages with specific label
labels in ("important", "review")

# Combined query
space.key = "DOCS" AND text ~ "API" AND updated >= -30d
```

## Development

### Run in watch mode
```bash
npm run dev
```

### Project Structure
```
mcp-confluence/
├── src/
│   └── index.ts        # Main server implementation
├── build/              # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## Troubleshooting

### "Missing required environment variables"
Ensure all three environment variables are set:
- `CONFLUENCE_BASE_URL`: Your Confluence instance URL (e.g., `https://mycompany.atlassian.net/wiki`)
- `CONFLUENCE_API_TOKEN`: Your API token
- `CONFLUENCE_EMAIL`: Your Confluence user email

### "Confluence API error (401)"
Your API token is invalid or expired. Generate a new one at https://id.atlassian.com/manage-profile/security/api-tokens

### "Space not found"
Double-check the space key is correct (they're typically uppercase and case-sensitive).

### Pages not appearing in search
Try using the `get_space_pages` tool to list pages in a specific space, or adjust your CQL query.

## API Documentation

For complete Confluence API documentation, see:
https://developer.atlassian.com/cloud/confluence/rest/v2/

## License

MIT
