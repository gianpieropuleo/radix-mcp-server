#!/usr/bin/env node
/**
 * Radix UI MCP Server - Commander.js CLI Router
 *
 * A command-line interface for the Radix UI MCP Server.
 * Handles argument parsing and routes to the appropriate server functionality.
 *
 * Usage:
 *   npx radix-mcp-server
 *   npx radix-mcp-server --library themes
 *   npx radix-mcp-server --library primitives --github-api-key YOUR_TOKEN
 *   npx radix-mcp-server -l all -g YOUR_TOKEN
 */
import { Command } from "commander";
import {
  COMMAND_GITHUB_API_KEY,
  COMMAND_GITHUB_API_KEY_SHORT,
  COMMAND_LIBRARY,
  COMMAND_LIBRARY_SHORT,
  DEFAULT_LIBRARY,
  DEFAULT_VERSION,
  GITHUB_API_KEY_OPTION_DESCRIPTION,
  LIBRARY_OPTION_DESCRIPTION,
  PROGRAM_DESCRIPTION,
  PROGRAM_NAME,
} from "./cli/commands.js";
import { HELP_EXAMPLES } from "./cli/help.js";
import { startMCPServer } from "./mcp/server.js";
import { Library } from "./types/results.js";
import { logError } from "./utils/logger.js";

const program = new Command();

/**
 * Parse and validate library selection from options and environment
 */
function parseLibrarySelection(options: any): Library {
  let library: Library = Library.All;

  if (options.library) {
    const libraryArg = options.library.toLowerCase();
    if (Object.values(Library).includes(libraryArg as Library)) {
      library = libraryArg as Library;
    } else {
      program.error(
        `Invalid library: ${libraryArg}. Must be ${Object.values(Library).join(
          ", "
        )}`
      );
    }
  } else if (process.env.RADIX_LIBRARY) {
    const envLibrary = process.env.RADIX_LIBRARY.toLowerCase();
    if (Object.values(Library).includes(envLibrary as Library)) {
      library = envLibrary as Library;
    }
  }

  return library;
}

/**
 * Parse GitHub API key from options and environment
 */
function parseGitHubApiKey(options: any): string | null {
  return (
    options.githubApiKey || process.env.GITHUB_PERSONAL_ACCESS_TOKEN || null
  );
}

/**
 * Main CLI action handler - parses options and starts the server
 */
async function handleStartServer() {
  try {
    // Get parsed options from commander
    const options = program.opts();

    // Parse configuration
    const library = parseLibrarySelection(options);
    const githubApiKey = parseGitHubApiKey(options);

    // Start the MCP server with parsed configuration
    await startMCPServer({
      library,
      githubApiKey,
    });
  } catch (error) {
    logError("Failed to start server", error);
    process.exit(1);
  }
}

/**
 * Read version from package.json for commander
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
    return DEFAULT_VERSION;
  }
}

// Configure the program - idiomatic commander.js approach
program
  .name(PROGRAM_NAME)
  .description(PROGRAM_DESCRIPTION)
  .version(await getVersion())
  .option(
    `${COMMAND_LIBRARY_SHORT}, ${COMMAND_LIBRARY} <library>`,
    LIBRARY_OPTION_DESCRIPTION,
    DEFAULT_LIBRARY
  )
  .option(
    `${COMMAND_GITHUB_API_KEY_SHORT}, ${COMMAND_GITHUB_API_KEY} <token>`,
    GITHUB_API_KEY_OPTION_DESCRIPTION
  )
  .action(handleStartServer);

// Add help examples using idiomatic commander approach
program.addHelpText("after", HELP_EXAMPLES);

// Parse command line arguments and execute - idiomatic commander approach
program.parseAsync().catch((error) => {
  logError("Unhandled startup error", error);
  process.exit(1);
});
