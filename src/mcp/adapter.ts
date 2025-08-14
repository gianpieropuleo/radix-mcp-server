/**
 * MCP Adapter Layer
 *
 * Bridges the new library architecture with the Model Context Protocol (MCP) requirements.
 * Generates MCP-compatible tool handlers and definitions from library configurations.
 */
import { getLibraryOperations } from "../core/registry.js";
import { Action, ColorAction } from "../types/actions.js";
import { Library } from "../types/results.js";

/**
 * Generate MCP-compatible tool handlers from library operations
 */
export const generateMCPHandlers = () => {
  const handlers: Record<string, (params?: any) => Promise<any>> = {};

  const colorOperations = getLibraryOperations(Library.Colors);
  const colorKey = Library.Colors.toLowerCase();
  const colorParamKey = "scaleName";
  const colorHandlers: Record<string, (params?: any) => Promise<any>> = {};
  colorHandlers[`${colorKey}_${ColorAction.ListScales}`] = () =>
    colorOperations.listComponents();
  colorHandlers[`${colorKey}_${ColorAction.GetScale}`] = (params: any) => {
    const name = params?.[colorParamKey];
    if (!name || typeof name !== "string") {
      throw new Error(`${colorParamKey} is required`);
    }
    return colorOperations.getComponentSource(name);
  };
  colorHandlers[`${colorKey}_${ColorAction.GetScaleDocumentation}`] = (
    params: any
  ) => {
    const name = params?.[colorParamKey];
    if (!name || typeof name !== "string") {
      throw new Error(`${colorParamKey} is required`);
    }
    return colorOperations.getComponentDocumentation(name);
  };

  Object.values(Library)
    .filter((lib) => lib !== Library.All)
    .filter((lib) => lib !== Library.Colors)
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

  return { ...handlers, ...colorHandlers };
};
