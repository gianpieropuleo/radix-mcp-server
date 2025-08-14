import {
  GetComponentDocumentationResult,
  GetComponentSourceResult,
  GettingStartedResult,
  Library,
  ListComponentsResult,
} from "../types/results.js";
import { logError, logInfo } from "../utils/logger.js";
import { LibraryConfig, libraryConfigs } from "./config.js";

export const createListComponentsOperation = (config: LibraryConfig) => {
  return async (): Promise<{
    content: Array<{ type: string; text: string }>;
  }> => {
    try {
      logInfo(`Fetching ${config.library} components...`);

      const components = await config.fetchAvailableComponents();
      const result: ListComponentsResult = {
        library: config.library,
        total: components.length,
        components: components.map((name) => ({
          name,
          packageName: config.getPackageName(name),
          type: config.componentType,
        })),
        note: config.getListComponentsNote?.() || "",
      };

      logInfo(
        `Successfully fetched ${components.length} ${config.library} components`
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      logError(`Error fetching ${config.library} components`, error);
      throw new Error(
        `Failed to fetch ${config.library} components: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };
};

export const createGetComponentSourceOperation = (config: LibraryConfig) => {
  return async (
    componentName: string
  ): Promise<{ content: Array<{ type: string; text: string }> }> => {
    try {
      logInfo(`Fetching ${config.library} component source: ${componentName}`);

      const source = await config.fetchComponentSource(componentName);

      const result: GetComponentSourceResult = {
        library: config.library,
        componentName,
        packageName: config.getPackageName(componentName),
        type: config.componentType,
        source,
      };

      logInfo(
        `Successfully fetched ${config.library} component source: ${componentName}`
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      logError(
        `Error fetching ${config.library} component source: ${componentName}`,
        error
      );
      throw new Error(
        `Failed to fetch ${
          config.library
        } component source "${componentName}": ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };
};

export const createGetComponentDocumentationOperation = (
  config: LibraryConfig
) => {
  return async (
    componentName: string
  ): Promise<{ content: Array<{ type: string; text: string }> }> => {
    try {
      logInfo(
        `Fetching ${config.library} component documentation: ${componentName}`
      );

      const usage = await config.fetchComponentUsage(componentName);

      const result: GetComponentDocumentationResult = {
        library: config.library,
        componentName,
        packageName: config.getPackageName(componentName),
        type: config.componentType,
        usage,
      };

      logInfo(
        `Successfully fetched ${config.library} component documentation: ${componentName}`
      );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      logError(
        `Error fetching ${config.library} component documentation: ${componentName}`,
        error
      );
      throw new Error(
        `Failed to fetch ${
          config.library
        } component documentation "${componentName}": ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };
};

export const createGettingStartedOperation = (config: LibraryConfig) => {
  return async (): Promise<{
    content: Array<{ type: string; text: string }>;
  }> => {
    try {
      logInfo(`Fetching official ${config.library} getting started guide...`);

      const gettingStartedContent = await config.fetchGettingStartedContent();

      const result: GettingStartedResult = {
        library: config.library,
        title: config.getGettingStartedTitle?.() || "",
        description: config.getGettingStartedDescription?.() || "",
        source: config.getGettingStartedSource?.() || "",
        content: gettingStartedContent,
        note: config.getGettingStartedNote?.() || "",
      };

      logInfo(`Successfully fetched ${config.library} getting started guide`);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      throw new Error(
        `Failed to fetch ${config.library} getting started guide: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };
};

export const createLibraryOperations = (
  library: Exclude<Library, Library.All>
) => {
  const config = libraryConfigs[library];

  return {
    listComponents: createListComponentsOperation(config),
    getComponentSource: createGetComponentSourceOperation(config),
    getComponentDocumentation: createGetComponentDocumentationOperation(config),
    getGettingStarted: createGettingStartedOperation(config),
  };
};
