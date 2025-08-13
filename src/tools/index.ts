/**
 * MCP Tool Registry
 *
 * This file exposes MCP-compatible tool handlers and definitions generated
 * from the new library architecture. All tools are now generated dynamically
 * from library configurations instead of individual handler files.
 */
import {
  generateMCPHandlers,
  generateToolDefinitions,
} from "../library/mcp-adapter.js";

// Generate all tool handlers from library configurations
export const toolHandlers = generateMCPHandlers();

// Generate all tool definitions for MCP registration
export const tools = generateToolDefinitions();
