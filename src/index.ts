#!/usr/bin/env node
/**
 * Radix UI MCP Server
 *
 * A Model Context Protocol server for Radix UI libraries (Themes, Primitives, Colors).
 * Provides AI assistants with access to component source code, installation guides, and design tokens.
 *
 * Usage:
 *   npx radix-mcp-server
 *   npx radix-mcp-server --library themes
 *   npx radix-mcp-server --library primitives --github-api-key YOUR_TOKEN
 *   npx radix-mcp-server -l all -g YOUR_TOKEN
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { setupHandlers } from "./handler.js";
import { logError, logInfo, logWarning } from "./utils/logger.js";

/**
 * Parse command line arguments
 */
async function parseArgs() {
  const args = process.argv.slice(2);

  // Help flag
  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
Radix UI MCP Server

Usage:
  npx radix-mcp-server [options]

Options:
  --library, -l <library>         Radix library: 'themes', 'primitives', 'colors', or 'all' (default: all)
  --github-api-key, -g <token>    GitHub Personal Access Token for API access
  --help, -h                      Show this help message
  --version, -v                   Show version information

Examples:
  npx radix-mcp-server
  npx radix-mcp-server --library themes
  npx radix-mcp-server --library primitives --github-api-key ghp_your_token_here
  npx radix-mcp-server -l colors -g ghp_your_token_here
  npx radix-mcp-server -l all

Environment Variables:
  GITHUB_PERSONAL_ACCESS_TOKEN    Alternative way to provide GitHub token
  RADIX_LIBRARY                   Library to use: 'themes', 'primitives', 'colors', or 'all' (default: all)
  LOG_LEVEL                       Log level (debug, info, warn, error) - default: info

For more information, visit: https://github.com/gianpieropuleo/radix-mcp-server
`);
    process.exit(0);
  }

  // Version flag
  if (args.includes("--version") || args.includes("-v")) {
    // Read version from package.json
    try {
      const fs = await import("fs");
      const path = await import("path");
      const { fileURLToPath } = await import("url");

      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const packagePath = path.join(__dirname, "..", "package.json");

      const packageContent = fs.readFileSync(packagePath, "utf8");
      const packageJson = JSON.parse(packageContent);
      console.log(`radix-mcp-server v${packageJson.version}`);
    } catch (error) {
      console.log("radix-mcp-server v1.0.0");
    }
    process.exit(0);
  }

  // Library selection
  const libraryIndex = args.findIndex(
    (arg) => arg === "--library" || arg === "-l"
  );
  let library: "themes" | "primitives" | "colors" | "all" = "all";

  if (libraryIndex !== -1 && args[libraryIndex + 1]) {
    const libraryArg = args[libraryIndex + 1].toLowerCase();
    if (["themes", "primitives", "colors", "all"].includes(libraryArg)) {
      library = libraryArg as "themes" | "primitives" | "colors" | "all";
    } else {
      console.error(
        `Invalid library: ${libraryArg}. Must be 'themes', 'primitives', 'colors', or 'all'`
      );
      process.exit(1);
    }
  } else if (process.env.RADIX_LIBRARY) {
    const envLibrary = process.env.RADIX_LIBRARY.toLowerCase();
    if (["themes", "primitives", "colors", "all"].includes(envLibrary)) {
      library = envLibrary as "themes" | "primitives" | "colors" | "all";
    }
  }

  // GitHub API key
  const githubApiKeyIndex = args.findIndex(
    (arg) => arg === "--github-api-key" || arg === "-g"
  );
  let githubApiKey = null;

  if (githubApiKeyIndex !== -1 && args[githubApiKeyIndex + 1]) {
    githubApiKey = args[githubApiKeyIndex + 1];
  } else if (process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    githubApiKey = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  }

  return { library, githubApiKey };
}

/**
 * Get tools configuration based on library selection
 */
function getToolsForLibrary(
  library: "themes" | "primitives" | "colors" | "all"
) {
  const allTools = {
    themes_list_components: {
      description: "Get all available Radix Themes components",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    themes_get_component: {
      description: "Get the source code for a specific Radix Themes component",
      inputSchema: {
        type: "object",
        properties: {
          componentName: {
            type: "string",
            description:
              'Name of the Radix Themes component (e.g., "button", "dialog")',
          },
        },
        required: ["componentName"],
      },
    },
    themes_get_getting_started: {
      description: "Get official getting started guide for Radix Themes",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    primitives_list_components: {
      description: "Get all available Radix Primitives components",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    primitives_get_component: {
      description:
        "Get the source code for a specific Radix Primitives component",
      inputSchema: {
        type: "object",
        properties: {
          componentName: {
            type: "string",
            description:
              'Name of the Radix Primitives component (e.g., "accordion", "dialog")',
          },
        },
        required: ["componentName"],
      },
    },
    primitives_get_getting_started: {
      description: "Get official getting started guide for Radix Primitives",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    colors_list_scales: {
      description: "Get all available Radix Colors color scales",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
    colors_get_scale: {
      description: "Get a specific Radix Colors color scale definition",
      inputSchema: {
        type: "object",
        properties: {
          scaleName: {
            type: "string",
            description:
              'Name of the color scale (e.g., "blue", "red", "gray")',
          },
        },
        required: ["scaleName"],
      },
    },
    colors_get_getting_started: {
      description: "Get official installation guide for Radix Colors",
      inputSchema: {
        type: "object",
        properties: {},
      },
    },
  };

  switch (library) {
    case "themes":
      return {
        themes_list_components: allTools["themes_list_components"],
        themes_get_component: allTools["themes_get_component"],
        themes_get_getting_started: allTools["themes_get_getting_started"],
      };
    case "primitives":
      return {
        primitives_list_components: allTools["primitives_list_components"],
        primitives_get_component: allTools["primitives_get_component"],
        primitives_get_getting_started:
          allTools["primitives_get_getting_started"],
      };
    case "colors":
      return {
        colors_list_scales: allTools["colors_list_scales"],
        colors_get_scale: allTools["colors_get_scale"],
        colors_get_getting_started: allTools["colors_get_getting_started"],
      };
    case "all":
    default:
      return allTools;
  }
}

/**
 * Main function to start the MCP server
 */
async function main() {
  try {
    logInfo("Starting Radix UI MCP Server...");

    const { library, githubApiKey } = await parseArgs();

    logInfo(`Library selection: ${library}`);

    // Get the http implementation (no framework selection needed for Radix)
    const { http } = await import("./utils/http.js");

    // Configure GitHub API key if provided
    if (githubApiKey) {
      http.setGitHubApiKey(githubApiKey);
      logInfo("GitHub API configured with token");
    } else {
      logWarning(
        "No GitHub API key provided. Rate limited to 60 requests/hour."
      );
    }

    // Initialize the MCP server with metadata and capabilities
    // Following MCP SDK 1.16.0 best practices
    const server = new Server(
      {
        name: "radix-mcp-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: getToolsForLibrary(library),
        },
      }
    );

    // Set up request handlers and register components (tools, resources, etc.)
    setupHandlers(server);

    // Start server using stdio transport
    const transport = new StdioServerTransport();

    logInfo("Transport initialized: stdio");

    await server.connect(transport);

    logInfo("Server started successfully");
  } catch (error) {
    logError("Failed to start server", error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  logError("Unhandled startup error", error);
  process.exit(1);
});
