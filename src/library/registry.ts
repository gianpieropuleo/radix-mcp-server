import { Library } from "../types/results.js";
import { createLibraryOperations } from "./operations.js";

/**
 * Registry for library operations using memoization
 * Functional equivalent of the Factory + Singleton patterns
 */
const operationsCache = new Map<
  Exclude<Library, Library.All>,
  ReturnType<typeof createLibraryOperations>
>();

export const getLibraryOperations = (
  library: Exclude<Library, Library.All>
) => {
  if (!operationsCache.has(library)) {
    operationsCache.set(library, createLibraryOperations(library));
  }
  return operationsCache.get(library)!;
};

export const getSupportedLibraries = (): Library[] => {
  return [Library.Themes, Library.Primitives, Library.Colors];
};
