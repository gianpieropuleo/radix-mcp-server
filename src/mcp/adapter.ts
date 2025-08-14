/**
 * MCP Adapter Layer
 *
 * Bridges the new library architecture with the Model Context Protocol (MCP) requirements.
 * Generates MCP-compatible tool handlers and definitions from library configurations.
 */
import { getLibraryOperations } from "../core/registry.js";
import { Action } from "../types/actions.js";
import { Library } from "../types/results.js";

/**
 * Generate MCP-compatible tool handlers from library operations
 */
export const generateMCPHandlers = () => {
  const handlers: Record<string, (params?: any) => Promise<any>> = {};

  Object.values(Library)
    .filter((lib) => lib !== Library.All)
    .map((library) => {
      const operations = getLibraryOperations(library);
      const libraryKey = library.toLowerCase();

      const getSourceKey = `${libraryKey}_${Action.GetComponentSource}`;
      const getDocumentationKey = `${libraryKey}_${Action.GetComponentDocumentation}`;
      const listKey = `${libraryKey}_${Action.ListComponents}`;
      const gettingStartedKey = `${libraryKey}_${Action.GetGettingStarted}`;

      const paramKey = "componentName";

      handlers[getSourceKey] = (params: any) => {
        const name = params?.[paramKey];
        if (!name || typeof name !== "string") {
          throw new Error(`${paramKey} is required`);
        }
        return operations.getComponentSource(name);
      };

      handlers[getDocumentationKey] = (params: any) => {
        const name = params?.[paramKey];
        if (!name || typeof name !== "string") {
          throw new Error(`${paramKey} is required`);
        }
        return operations.getComponentDocumentation(name);
      };

      handlers[listKey] = () => operations.listComponents();
      handlers[gettingStartedKey] = () => operations.getGettingStarted();
    });

  return handlers;
};
