#!/usr/bin/env node
import {
  CallToolRequest,
  CallToolRequestSchema,
  Tool,
  TextContent,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

interface ConfluenceConfig {
  baseUrl: string;
  apiToken: string;
  email: string;
}

// Tool definitions
const tools: Tool[] = [
  {
    name: "search_pages",
    description:
      "Search for Confluence pages using CQL (Confluence Query Language). Returns matching pages with their IDs, titles, and basic metadata.",
    inputSchema: {
      type: "object" as const,
      properties: {
        query: {
          type: "string",
          description:
            "CQL query to search pages. Examples: 'text ~ \"keyword\"', 'creator = currentUser()', 'type = page AND space.key = MYSPACE'",
        },
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 25, max: 250)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "get_page",
    description:
      "Get the full content and metadata of a specific Confluence page by its ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the Confluence page",
        },
        includeBody: {
          type: "boolean",
          description: "Include the page body content (default: true)",
        },
      },
      required: ["pageId"],
    },
  },
  {
    name: "get_page_by_title",
    description: "Search for a page by title and space key and retrieve its content.",
    inputSchema: {
      type: "object" as const,
      properties: {
        title: {
          type: "string",
          description: "The exact title of the page",
        },
        spaceKey: {
          type: "string",
          description: "The key of the space (e.g., 'MYSPACE')",
        },
      },
      required: ["title", "spaceKey"],
    },
  },
  {
    name: "create_page",
    description:
      "Create a new Confluence page. Supports storage format for body content.",
    inputSchema: {
      type: "object" as const,
      properties: {
        spaceKey: {
          type: "string",
          description: "The key of the space where the page will be created",
        },
        title: {
          type: "string",
          description: "The title of the new page",
        },
        body: {
          type: "string",
          description:
            "The body content in storage format (XHTML). For simple text, wrap in <p> tags.",
        },
        parentPageId: {
          type: "string",
          description: "Optional parent page ID to create a child page",
        },
      },
      required: ["spaceKey", "title", "body"],
    },
  },
  {
    name: "update_page",
    description: "Update the content and title of an existing Confluence page.",
    inputSchema: {
      type: "object" as const,
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page to update",
        },
        title: {
          type: "string",
          description: "The new title (optional)",
        },
        body: {
          type: "string",
          description: "The new body content in storage format (optional)",
        },
        version: {
          type: "number",
          description: "The current version number of the page (required for updates)",
        },
      },
      required: ["pageId", "version"],
    },
  },
  {
    name: "delete_page",
    description: "Delete a Confluence page by its ID.",
    inputSchema: {
      type: "object" as const,
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page to delete",
        },
      },
      required: ["pageId"],
    },
  },
  {
    name: "get_spaces",
    description: "List all Confluence spaces accessible to the authenticated user.",
    inputSchema: {
      type: "object" as const,
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of spaces to return (default: 25, max: 250)",
        },
        type: {
          type: "string",
          enum: ["global", "personal"],
          description: "Filter by space type",
        },
      },
      required: [],
    },
  },
  {
    name: "get_space_pages",
    description: "Get all pages in a specific Confluence space.",
    inputSchema: {
      type: "object" as const,
      properties: {
        spaceKey: {
          type: "string",
          description: "The key of the space",
        },
        limit: {
          type: "number",
          description: "Maximum number of pages to return (default: 25, max: 250)",
        },
      },
      required: ["spaceKey"],
    },
  },
  {
    name: "add_label",
    description: "Add labels/tags to a Confluence page.",
    inputSchema: {
      type: "object" as const,
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page",
        },
        labels: {
          type: "array",
          items: { type: "string" },
          description: "Array of label names to add",
        },
      },
      required: ["pageId", "labels"],
    },
  },
  {
    name: "get_page_comments",
    description: "Get all comments on a Confluence page.",
    inputSchema: {
      type: "object" as const,
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page",
        },
        limit: {
          type: "number",
          description: "Maximum number of comments to return (default: 25)",
        },
      },
      required: ["pageId"],
    },
  },
  {
    name: "add_comment",
    description: "Add a comment to a Confluence page.",
    inputSchema: {
      type: "object" as const,
      properties: {
        pageId: {
          type: "string",
          description: "The ID of the page",
        },
        body: {
          type: "string",
          description: "The comment text in storage format (XHTML)",
        },
      },
      required: ["pageId", "body"],
    },
  },
];

class ConfluenceServer {
  private server: Server;
  private config: ConfluenceConfig;

  constructor(config: ConfluenceConfig) {
    this.config = config;
    this.server = new Server(
      {
        name: "confluence-mcp",
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

  private setupHandlers(): void {
    // Handle list tools request
    this.server.setRequestHandler(
      ListToolsRequestSchema,
      async () => ({ tools })
    );

    // Handle tool call request
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request: CallToolRequest) => this.handleCallTool(request)
    );
  }

  private async handleCallTool(request: CallToolRequest): Promise<{ content: TextContent[] }> {
    try {
      const toolName = request.params.name;
      const args = request.params.arguments || {};

      const result = await this.executeTool(toolName, args as Record<string, unknown>);
      return {
        content: [{ type: "text" as const, text: result }],
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text" as const, text: `Error: ${errorMessage}` }],
      };
    }
  }

  private async executeTool(toolName: string, args: Record<string, unknown>): Promise<string> {
    switch (toolName) {
      case "search_pages":
        return await this.searchPages(args);
      case "get_page":
        return await this.getPage(args);
      case "get_page_by_title":
        return await this.getPageByTitle(args);
      case "create_page":
        return await this.createPage(args);
      case "update_page":
        return await this.updatePage(args);
      case "delete_page":
        return await this.deletePage(args);
      case "get_spaces":
        return await this.getSpaces(args);
      case "get_space_pages":
        return await this.getSpacePages(args);
      case "add_label":
        return await this.addLabel(args);
      case "get_page_comments":
        return await this.getPageComments(args);
      case "add_comment":
        return await this.addComment(args);
      default:
        throw new Error(`Unknown tool: ${toolName}`);
    }
  }

   private async makeRequest(
     method: string,
     endpoint: string,
     body?: Record<string, unknown>
   ): Promise<unknown> {
     const url = `${this.config.baseUrl}${endpoint}`;
     const authHeader = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString(
       "base64"
     );

     const options: RequestInit = {
       method,
       headers: {
         Authorization: `Basic ${authHeader}`,
         "Content-Type": "application/json",
         Accept: "application/json",
       },
     };

     if (body && (method === "POST" || method === "PUT")) {
       options.body = JSON.stringify(body);
     }

     const response = await fetch(url, options);

     if (!response.ok) {
       const errorBody = await response.text();
       throw new Error(
         `Confluence API error (${response.status}): ${errorBody || response.statusText}`
       );
     }

     if (response.status === 204) {
       return null;
     }

     return response.json();
   }

   private async getSpaceIdByKey(spaceKey: string): Promise<string> {
     const result = (await this.makeRequest(
       "GET",
       `/api/v2/spaces?keys=${encodeURIComponent(spaceKey)}&limit=1`
     )) as {
       results?: Array<{ id: string; key: string }>;
     };

     const space = result.results?.[0];
     if (!space || space.key !== spaceKey) {
       throw new Error(`Space with key "${spaceKey}" not found`);
     }

     return space.id;
   }

    private async searchPages(args: Record<string, unknown>): Promise<string> {
      const query = args.query as string;
      const limit = (args.limit as number) || 25;

      // Confluence API v2 doesn't have a dedicated search endpoint
      // CQL search is handled through the v1 API at /rest/api/content/search
      // We'll use v1 for CQL search as it's more powerful
      const searchUrl = new URL(`${this.config.baseUrl}/rest/api/content/search`);
      searchUrl.searchParams.append('cql', query);
      searchUrl.searchParams.append('limit', limit.toString());
      searchUrl.searchParams.append('expand', 'space,version,body.storage');

      const authHeader = Buffer.from(`${this.config.email}:${this.config.apiToken}`).toString(
        "base64"
      );

      const options: RequestInit = {
        method: 'GET',
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      const response = await fetch(searchUrl.toString(), options);

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Confluence API error (${response.status}): ${errorBody || response.statusText}`
        );
      }

      const result = await response.json();
      return JSON.stringify(result, null, 2);
    }

  private async getPage(args: Record<string, unknown>): Promise<string> {
    const pageId = args.pageId as string;
    const includeBody = args.includeBody !== false;

    const expand = includeBody
      ? "body.storage,metadata.labels,version,ancestors"
      : "metadata.labels,version";

    const result = await this.makeRequest(
      "GET",
      `/api/v2/pages/${pageId}?expand=${expand}`
    );

    return JSON.stringify(result, null, 2);
  }

  private async getPageByTitle(args: Record<string, unknown>): Promise<string> {
    const title = args.title as string;
    const spaceKey = args.spaceKey as string;

    // Get space ID first
    const spaceId = await this.getSpaceIdByKey(spaceKey);

    // Use v2 pages endpoint with title and space-id filters
    const result = await this.makeRequest(
      "GET",
      `/api/v2/pages?space-id=${spaceId}&title=${encodeURIComponent(title)}&body-format=storage&limit=1`
    );

    return JSON.stringify(result, null, 2);
  }

   private async createPage(args: Record<string, unknown>): Promise<string> {
     const spaceKey = args.spaceKey as string;
     const title = args.title as string;
     const body = args.body as string;
     const parentPageId = args.parentPageId as string | undefined;

     const bodyContent: Record<string, unknown> = {
       representation: "storage",
       value: body,
     };

     // Get the space ID from the space key
     const spaceId = await this.getSpaceIdByKey(spaceKey);

     const pageBody: Record<string, unknown> = {
       spaceId,
       title,
       body: bodyContent,
     };

     if (parentPageId) {
       pageBody.parentId = parentPageId;
     }

     const result = await this.makeRequest("POST", "/api/v2/pages", pageBody);

     return JSON.stringify(result, null, 2);
   }

  private async updatePage(args: Record<string, unknown>): Promise<string> {
    const pageId = args.pageId as string;
    const title = args.title as string | undefined;
    const body = args.body as string | undefined;
    const version = args.version as number;

    if (!title && !body) {
      throw new Error("Either title or body must be provided");
    }

    // First, get the current page to retrieve the current title and status
    const currentPage = await this.makeRequest(
      "GET",
      `/api/v2/pages/${pageId}`
    ) as { title?: string; status?: string };

    const updateBody: Record<string, unknown> = {
      id: pageId,
      status: currentPage.status || "current",
      title: title || currentPage.title,
      version: {
        number: version + 1,
      },
    };

    if (body) {
      updateBody.body = {
        representation: "storage",
        value: body,
      };
    }

    const result = await this.makeRequest("PUT", `/api/v2/pages/${pageId}`, updateBody);

    return JSON.stringify(result, null, 2);
  }

  private async deletePage(args: Record<string, unknown>): Promise<string> {
    const pageId = args.pageId as string;

    await this.makeRequest("DELETE", `/api/v2/pages/${pageId}`);

    return `Page ${pageId} deleted successfully`;
  }

  private async getSpaces(args: Record<string, unknown>): Promise<string> {
    const limit = (args.limit as number) || 25;
    const type = args.type as string | undefined;

    let endpoint = `/api/v2/spaces?limit=${limit}`;
    if (type) {
      endpoint += `&type=${type}`;
    }

    const result = await this.makeRequest("GET", endpoint);

    return JSON.stringify(result, null, 2);
  }

   private async getSpacePages(args: Record<string, unknown>): Promise<string> {
     const spaceKey = args.spaceKey as string;
     const limit = (args.limit as number) || 25;

     // Convert space key to space ID
     const spaceId = await this.getSpaceIdByKey(spaceKey);

     // API v2 uses cursor pagination, not expand parameter
     const result = await this.makeRequest(
       "GET",
       `/api/v2/spaces/${spaceId}/pages?limit=${limit}&body-format=storage`
     );

     return JSON.stringify(result, null, 2);
   }

  private async addLabel(args: Record<string, unknown>): Promise<string> {
    // API v2 doesn't support batch label addition - need to add one at a time
    // However, the endpoint doesn't exist in v2 for adding labels directly
    // Labels are managed through page properties in v2
    const pageId = args.pageId as string;
    const labels = args.labels as string[];
    
    throw new Error(`Label addition is not supported in Confluence API v2. Labels must be managed through the UI or v1 API. Attempted to add labels ${JSON.stringify(labels)} to page ${pageId}.`);
  }

  private async getPageComments(args: Record<string, unknown>): Promise<string> {
    const pageId = args.pageId as string;
    const limit = (args.limit as number) || 25;

    // API v2 uses footer-comments endpoint, not comments
    const result = await this.makeRequest(
      "GET",
      `/api/v2/pages/${pageId}/footer-comments?limit=${limit}&body-format=storage`
    );

    return JSON.stringify(result, null, 2);
  }

  private async addComment(args: Record<string, unknown>): Promise<string> {
    const pageId = args.pageId as string;
    const body = args.body as string;

    // API v2 uses footer-comments endpoint, not comments
    // Also requires pageId in the body, not in the URL
    const commentBody = {
      pageId: pageId,
      body: {
        representation: "storage",
        value: body,
      },
    };

    const result = await this.makeRequest(
      "POST",
      `/api/v2/footer-comments`,
      commentBody
    );

    return JSON.stringify(result, null, 2);
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Confluence MCP server running on stdio");
  }
}

// Initialize server from environment variables
function getConfig(): ConfluenceConfig {
  const baseUrl = process.env.CONFLUENCE_BASE_URL;
  const apiToken = process.env.CONFLUENCE_API_TOKEN;
  const email = process.env.CONFLUENCE_EMAIL;

  if (!baseUrl || !apiToken || !email) {
    throw new Error(
      "Missing required environment variables: CONFLUENCE_BASE_URL, CONFLUENCE_API_TOKEN, CONFLUENCE_EMAIL"
    );
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ""), // Remove trailing slash
    apiToken,
    email,
  };
}

// Main execution
const config = getConfig();
const server = new ConfluenceServer(config);
server.run().catch(console.error);
