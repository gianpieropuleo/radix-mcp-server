import { ComponentType, Library, Package } from "../types/results.js";
import { http } from "../utils/http.js";

export interface LibraryConfig {
  library: Exclude<Library, Library.All>;
  componentType: ComponentType;

  fetchAvailableComponents: () => Promise<string[]>;
  fetchComponentUsage: (componentName: string) => Promise<string>;
  fetchComponentSource: (componentName: string) => Promise<string>;
  fetchGettingStartedContent: () => Promise<string>;

  getPackageName: (componentName: string) => string;

  getListComponentsNote?: () => string;
  getGettingStartedTitle?: () => string;
  getGettingStartedDescription?: () => string;
  getGettingStartedSource?: () => string;
  getGettingStartedNote?: () => string;
}

const createDefaultHooks = (library: Exclude<Library, Library.All>) => ({
  getListComponentsNote: () =>
    "Use get-component tool with a specific component name to get detailed usage information",

  getGettingStartedTitle: () =>
    `Radix ${
      library.charAt(0).toUpperCase() + library.slice(1)
    } - Getting Started`,

  getGettingStartedDescription: () =>
    `Official getting started guide for Radix ${
      library.charAt(0).toUpperCase() + library.slice(1)
    }`,

  getGettingStartedSource: () =>
    `https://github.com/radix-ui/website/blob/main/data/${library}/docs/overview/getting-started.mdx`,

  getGettingStartedNote: () =>
    "This content is fetched directly from the official Radix UI documentation to ensure it stays up-to-date.",
});

export const libraryConfigs: Record<
  Exclude<Library, Library.All>,
  LibraryConfig
> = {
  [Library.Themes]: {
    library: Library.Themes,
    componentType: ComponentType.Styled,

    fetchAvailableComponents: () => http.getAvailableComponents("themes"),
    fetchComponentUsage: (componentName: string) =>
      http.getThemesUsage(componentName),
    fetchComponentSource: (componentName: string) =>
      http.getThemesComponentSource(componentName),
    fetchGettingStartedContent: () => http.getThemesGettingStarted(),

    getPackageName: () => Package.Themes,

    ...createDefaultHooks(Library.Themes),

    getGettingStartedSource: () =>
      "https://github.com/radix-ui/website/blob/main/data/themes/docs/overview/getting-started.mdx",
  },

  [Library.Primitives]: {
    library: Library.Primitives,
    componentType: ComponentType.Unstyled,

    fetchAvailableComponents: () => http.getAvailableComponents("primitives"),
    fetchComponentUsage: (componentName: string) =>
      http.getPrimitivesUsage(componentName),
    fetchComponentSource: (componentName: string) =>
      http.getPrimitivesComponentSource(componentName),
    fetchGettingStartedContent: () => http.getPrimitivesGettingStarted(),

    getPackageName: (componentName: string) =>
      `${Package.Primitives}${componentName}`,

    ...createDefaultHooks(Library.Primitives),

    getGettingStartedSource: () =>
      "https://github.com/radix-ui/website/blob/main/data/primitives/docs/overview/getting-started.mdx",
  },

  [Library.Colors]: {
    library: Library.Colors,
    componentType: ComponentType.ColorScale,

    fetchAvailableComponents: () => http.getColorsScaleNames(),
    fetchComponentUsage: () => http.getColorsDocumentation(),
    fetchComponentSource: async (componentName: string) => {
      const scaleData = await http.getCompleteColorScale(componentName);
      return JSON.stringify(scaleData, null, 2);
    },
    fetchGettingStartedContent: () => http.getColorsGettingStarted(),

    getPackageName: () => Package.Colors,

    ...createDefaultHooks(Library.Colors),

    getListComponentsNote: () =>
      "Use get-scale tool with a specific scale name to get detailed color values and usage information",

    getGettingStartedSource: () =>
      "https://github.com/radix-ui/website/blob/main/data/colors/docs/overview/installation.mdx",
  },
};
