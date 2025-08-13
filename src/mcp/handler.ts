/**
 * Request handler setup for the Model Context Protocol (MCP) server.
 *
 * This file configures how the server responds to various MCP requests by setting up
 * handlers for resources, resource templates, tools, and prompts.
 *
 * Updated for MCP SDK 1.16.0 with improved error handling and request processing.
 */
import { type Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { logError, logInfo } from "../utils/logger.js";
import { validateAndSanitizeParams } from "../utils/validation.js";
import { generateMCPHandlers, generateToolDefinitions } from "./adapter.js";

// Generate tool handlers and definitions
const toolHandlers = generateMCPHandlers();
const tools = generateToolDefinitions();

/**
 * Wrapper function to handle requests with simple error handling
 */
async function handleRequest<T>(
  method: string,
  params: any,
  handler: (validatedParams: any) => Promise<T>
): Promise<T> {
  try {
    // Validate and sanitize input parameters
    const validatedParams = validateAndSanitizeParams(method, params);

    // Execute the handler directly
    const result = await handler(validatedParams);

    return result;
  } catch (error) {
    logError(`Error in ${method}`, error);
    throw error;
  }
}

/**
 * Sets up all request handlers for the MCP server
 * Following MCP SDK 1.16.0 best practices for handler registration
 * @param server - The MCP server instance
 */
export const setupHandlers = (server: Server): void => {
  logInfo("Setting up request handlers...");

  // List available tools
  server.setRequestHandler(ListToolsRequestSchema, async (request) => {
    return await handleRequest("list_tools", request.params, async () => {
      // Return the Radix tools that are registered with the server
      const registeredTools = Object.values(tools).map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return { tools: registeredTools };
    });
  });

  // Tool request Handler - executes the requested tool with provided parameters
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    return await handleRequest(
      "call_tool",
      request.params,
      async (validatedParams: any) => {
        const { name, arguments: params } = validatedParams;

        if (!name || typeof name !== "string") {
          throw new Error("Tool name is required");
        }

        const handler = toolHandlers[name as keyof typeof toolHandlers];

        if (!handler) {
          throw new Error(`Tool not found: ${name}`);
        }

        // Execute handler directly
        const result = await Promise.resolve(handler(params || {}));

        return result;
      }
    );
  });

  // Add global error handler
  server.onerror = (error) => {
    logError("MCP server error", error);
  };

  logInfo("Handlers setup complete");
};
