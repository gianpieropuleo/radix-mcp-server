import { Library } from "../types/results.js";
import { getLibraryOperations } from "./registry.js";

export const createLibraryHandler = (
  library: Exclude<Library, Library.All>
) => {
  const operations = getLibraryOperations(library);

  return {
    listComponents: () => operations.listComponents(),
    getComponent: (componentName: string) =>
      operations.getComponent(componentName),
    getGettingStarted: () => operations.getGettingStarted(),

    handleListOperation: operations.listComponents,
    handleGetOperation: operations.getComponent,
    handleGettingStartedOperation: operations.getGettingStarted,
  };
};

export const createMultiLibraryHandler = (
  libraries: Exclude<Library, Library.All>[]
) => {
  const handlers = libraries.map((lib) => ({
    library: lib,
    ...createLibraryHandler(lib),
  }));

  return {
    getAllComponents: async () => {
      const results = await Promise.all(
        handlers.map(async (handler) => ({
          library: handler.library,
          result: await handler.listComponents(),
        }))
      );
      return results;
    },

    getComponentFromAnyLibrary: async (componentName: string) => {
      for (const handler of handlers) {
        try {
          return await handler.getComponent(componentName);
        } catch (error) {}
      }
      throw new Error(`Component "${componentName}" not found in any library`);
    },

    getAllGettingStartedGuides: async () => {
      const results = await Promise.all(
        handlers.map(async (handler) => ({
          library: handler.library,
          result: await handler.getGettingStarted(),
        }))
      );
      return results;
    },
  };
};
