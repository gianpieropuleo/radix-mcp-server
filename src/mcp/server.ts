/**
 * MCP Server Module
 *
 * Contains the core Model Context Protocol server logic, separated from CLI concerns.
 * This module handles server initialization, configuration, and startup.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DEFAULT_VERSION, PROGRAM_NAME } from "../cli/commands.js";
import { Action } from "../types/actions.js";
import { Library } from "../types/results.js";
import { logError, logInfo, logWarning } from "../utils/logger.js";
import { setupHandlers } from "./handler.js";
import { createTool } from "./tools.js";

/**
 * Server configuration interface
 */
export interface ServerConfig {
  library: Library;
  githubApiKey?: string | null;
}

/**
 * Get tools configuration based on library selection
 */
function getToolsForLibrary(library: Library) {
  if (library !== Library.All) {
    return {
      ...createTool(library, Action.ListComponents),
      ...createTool(library, Action.GetComponent),
      ...createTool(library, Action.GetGettingStarted),
    };
  }

  return Object.values(Library).reduce((acc, library) => {
    return {
      ...acc,
      ...createTool(library, Action.ListComponents),
      ...createTool(library, Action.GetComponent),
      ...createTool(library, Action.GetGettingStarted),
    };
  }, {});
}

/**
 * Read version from package.json
 */
async function getVersion(): Promise<string> {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const { fileURLToPath } = await import("url");

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const packagePath = path.join(__dirname, "..", "package.json");

    const packageContent = fs.readFileSync(packagePath, "utf8");
    const packageJson = JSON.parse(packageContent);
    return packageJson.version;
  } catch (error) {
    logWarning(
      `Could not read version from package.json, using default: ${DEFAULT_VERSION}`
    );
    return DEFAULT_VERSION;
  }
}

/**
 * Configure HTTP client with GitHub API key if provided
 */
async function configureHttpClient(githubApiKey?: string | null) {
  const { http } = await import("../utils/http.js");

  if (githubApiKey) {
    http.setGitHubApiKey(githubApiKey);
    logInfo("GitHub API configured with token");
  } else {
    logWarning("No GitHub API key provided. Rate limited to 60 requests/hour.");
  }
}

/**
 * Create and start the MCP server with the given configuration
 */
export async function startMCPServer(config: ServerConfig): Promise<void> {
  try {
    logInfo("Starting Radix UI MCP Server...");
    logInfo(`Library selection: ${config.library}`);

    // Configure HTTP client
    await configureHttpClient(config.githubApiKey);

    // Get version for server metadata
    const version = await getVersion();

    // Initialize the MCP server with metadata and capabilities
    const server = new Server(
      {
        name: PROGRAM_NAME,
        version,
      },
      {
        capabilities: {
          tools: getToolsForLibrary(config.library),
        },
      }
    );

    // Set up request handlers and register components
    setupHandlers(server);

    // Start server using stdio transport
    const transport = new StdioServerTransport();

    logInfo("Transport initialized: stdio");

    await server.connect(transport);

    logInfo("Server started successfully");
  } catch (error) {
    logError("Failed to start server", error);
    throw error;
  }
}
