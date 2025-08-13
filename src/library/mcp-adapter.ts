/**
 * MCP Adapter Layer
 *
 * Bridges the new library architecture with the Model Context Protocol (MCP) requirements.
 * Generates MCP-compatible tool handlers and definitions from library configurations.
 */
import { Library } from "../types/results.js";
import { libraryConfigs } from "./config.js";
import { getLibraryOperations } from "./registry.js";

/**
 * Generate MCP-compatible tool handlers from library operations
 */
export const generateMCPHandlers = () => {
  const handlers: Record<string, (params?: any) => Promise<any>> = {};

  for (const library of [Library.Themes, Library.Primitives, Library.Colors]) {
    const operations = getLibraryOperations(library);
    const libraryKey = library.toLowerCase();

    // List operation (no parameters)
    const listKey =
      library === Library.Colors
        ? `${libraryKey}_list_scales`
        : `${libraryKey}_list_components`;
    handlers[listKey] = () => operations.listComponents();

    // Get operation (requires component/scale name parameter)
    const getKey =
      library === Library.Colors
        ? `${libraryKey}_get_scale`
        : `${libraryKey}_get_component`;
    const paramKey = library === Library.Colors ? "scaleName" : "componentName";
    handlers[getKey] = (params: any) => {
      const name = params?.[paramKey];
      if (!name || typeof name !== "string") {
        throw new Error(`${paramKey} is required`);
      }
      return operations.getComponent(name);
    };

    // Getting started operation (no parameters)
    handlers[`${libraryKey}_get_getting_started`] = () =>
      operations.getGettingStarted();
  }

  return handlers;
};

/**
 * Generate MCP-compatible tool definitions from library configurations
 */
export const generateToolDefinitions = () => {
  const tools: Record<string, any> = {};

  for (const library of [Library.Themes, Library.Primitives, Library.Colors]) {
    const config = libraryConfigs[library];
    const libraryKey = library.toLowerCase();
    const libraryName = library.charAt(0).toUpperCase() + library.slice(1);

    // List tool definition
    const listKey =
      library === Library.Colors
        ? `${libraryKey}_list_scales`
        : `${libraryKey}_list_components`;
    const listName = library === Library.Colors ? "scales" : "components";

    tools[listKey] = {
      name: listKey,
      description: `List all available Radix ${libraryName} ${listName}`,
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    };

    // Get tool definition
    const getKey =
      library === Library.Colors
        ? `${libraryKey}_get_scale`
        : `${libraryKey}_get_component`;
    const getDescription =
      library === Library.Colors
        ? `Get detailed information about a specific Radix ${libraryName} color scale`
        : `Get detailed information about a specific Radix ${libraryName} component`;
    const paramKey = library === Library.Colors ? "scaleName" : "componentName";
    const paramDescription = library === Library.Colors ? "scale" : "component";

    tools[getKey] = {
      name: getKey,
      description: getDescription,
      inputSchema: {
        type: "object",
        properties: {
          [paramKey]: {
            type: "string",
            description: `The name of the ${paramDescription} to get information about`,
          },
        },
        required: [paramKey],
      },
    };

    // Getting started tool definition
    tools[`${libraryKey}_get_getting_started`] = {
      name: `${libraryKey}_get_getting_started`,
      description: `Get the official getting started guide for Radix ${libraryName}`,
      inputSchema: {
        type: "object",
        properties: {},
        required: [],
      },
    };
  }

  return tools;
};
