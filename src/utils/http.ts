import ExpiryMap from "expiry-map";
import ky from "ky";
import pLimit from "p-limit";
import pMemoize from "p-memoize";
import { logError, logInfo, logWarning } from "./logger.js";

// Constants for Radix UI repositories
const RADIX_OWNER = "radix-ui";
const THEMES_REPO = "themes";
const PRIMITIVES_REPO = "primitives";
const COLORS_REPO = "colors";
const REPO_BRANCH = "main";

// Radix repository paths
const THEMES_PATHS = {
  components: "packages/radix-ui-themes/src/components",
  docs: "apps/playground/app",
  examples: "apps/playground/app/demo",
};

const PRIMITIVES_PATHS = {
  components: "packages/react",
  docs: "apps/www/content/primitives/docs",
  examples: "apps/www/content/primitives/examples",
};

const COLORS_PATHS = {
  tokens: "src",
  docs: "apps/docs/content/colors",
};

// GitHub API rate limiting
// Limit to 1 concurrent request to avoid rate limits and be respectful to GitHub
const githubLimit = pLimit(1);

// Cache TTL - 24 hours for all memoized functions
const CACHE_TTL = 24 * 60 * 60 * 1000;

// Create cache instance with TTL support
const createCache = () => new ExpiryMap(CACHE_TTL);

// GitHub API client for accessing repository structure and metadata
const githubApi = ky.create({
  prefixUrl: "https://api.github.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "User-Agent": "Mozilla/5.0 (compatible; RadixMcpServer/1.0.0)",
    ...(process.env.GITHUB_PERSONAL_ACCESS_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
    }),
  },
  timeout: 30000,
  retry: {
    limit: 2,
    methods: ["get"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeError: [
      (error) => {
        if (error.response) {
          const { status } = error.response;
          if (status === 403) {
            error.message = `GitHub API rate limit exceeded. Please set GITHUB_PERSONAL_ACCESS_TOKEN environment variable for higher limits.`;
          } else if (status === 404) {
            error.message = `GitHub resource not found. The repository structure may have changed.`;
          } else if (status === 401) {
            error.message = `GitHub authentication failed. Please check your GITHUB_PERSONAL_ACCESS_TOKEN.`;
          }
        }
        return error;
      },
    ],
  },
});

// GitHub Raw client factory for different repositories
function createGithubRaw(repo: string) {
  return ky.create({
    prefixUrl: `https://raw.githubusercontent.com/${RADIX_OWNER}/${repo}/${REPO_BRANCH}`,
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; RadixMcpServer/1.0.0)",
    },
    timeout: 30000,
    retry: {
      limit: 2,
      methods: ["get"],
      statusCodes: [408, 429, 500, 502, 503, 504],
    },
  });
}

// Repository-specific clients
const themesRaw = createGithubRaw(THEMES_REPO);
const primitivesRaw = createGithubRaw(PRIMITIVES_REPO);
const colorsRaw = createGithubRaw(COLORS_REPO);

/**
 * Fetch Radix Themes component source code
 * @param componentName Name of the component
 * @returns Promise with component source code
 */
async function getThemesComponentSource(
  componentName: string
): Promise<string> {
  const componentPath = `${
    THEMES_PATHS.components
  }/${componentName.toLowerCase()}`;

  try {
    // Try different file extensions
    const extensions = [".tsx", ".ts", "/index.tsx", "/index.ts"];

    for (const ext of extensions) {
      try {
        const response = await githubLimit(() =>
          themesRaw.get(`${componentPath}${ext}`)
        );
        return await response.text();
      } catch (error) {
        // Continue to next extension
      }
    }

    throw new Error(`Themes component "${componentName}" not found`);
  } catch (error) {
    throw new Error(
      `Themes component "${componentName}" not found in repository`
    );
  }
}

/**
 * Fetch Radix Primitives component source code
 * @param componentName Name of the component (e.g., "accordion", "dialog")
 * @returns Promise with component source code
 */
async function getPrimitivesComponentSource(
  componentName: string
): Promise<string> {
  const componentPath = `${
    PRIMITIVES_PATHS.components
  }/${componentName.toLowerCase()}`;

  try {
    // Try to get the main component file (usually index.tsx or src/index.tsx)
    const extensions = [
      `/src/${componentName.toLowerCase()}.tsx`,
      "/index.tsx",
      "/src/index.ts",
      "/index.ts",
    ];

    for (const ext of extensions) {
      try {
        const response = await githubLimit(() =>
          primitivesRaw.get(`${componentPath}${ext}`)
        );
        return await response.text();
      } catch (error) {
        // Continue to next extension
      }
    }

    throw new Error(`Primitives component "${componentName}" not found`);
  } catch (error) {
    throw new Error(
      `Primitives component "${componentName}" not found in repository`
    );
  }
}

/**
 * Fetch installation guide for Radix components
 * @param library Which library (themes|primitives|colors)
 * @param componentName Optional specific component
 * @returns Promise with installation instructions
 */
async function getInstallationGuide(
  library: "themes" | "primitives" | "colors",
  componentName?: string
): Promise<string> {
  const baseInstructions = {
    themes: `# Install Radix Themes\n\nnpm install @radix-ui/themes\n\n# Import the CSS\nimport '@radix-ui/themes/styles.css';\n\n# Wrap your app with Theme\nimport { Theme } from '@radix-ui/themes';\n\nfunction App() {\n  return (\n    <Theme>\n      <YourApp />\n    </Theme>\n  );\n}`,
    primitives: componentName
      ? `# Install ${componentName} primitive\n\nnpm install @radix-ui/react-${componentName.toLowerCase()}\n\n# Import and use\nimport * as ${
          componentName.charAt(0).toUpperCase() + componentName.slice(1)
        } from '@radix-ui/react-${componentName.toLowerCase()}';`
      : `# Install Radix Primitives\n\n# Install individual primitive (recommended)\nnpm install @radix-ui/react-dialog\n\n# Or install all primitives\nnpm install @radix-ui/react`,
    colors: `# Install Radix Colors\n\nnpm install @radix-ui/colors\n\n# Import color scales\nimport { blue, red, green } from '@radix-ui/colors';\n\n# Use in CSS-in-JS\nconst styles = {\n  backgroundColor: blue.blue3,\n  color: blue.blue11\n};`,
  };

  return baseInstructions[library];
}

/**
 * Fetch available components from a Radix library
 * @param library Which library (themes|primitives|colors)
 * @returns Promise with list of component names
 */
async function getAvailableComponents(
  library: "themes" | "primitives" | "colors"
): Promise<string[]> {
  try {
    let repo: string;
    let path: string;

    switch (library) {
      case "themes":
        repo = THEMES_REPO;
        path = THEMES_PATHS.components;
        break;
      case "primitives":
        repo = PRIMITIVES_REPO;
        path = PRIMITIVES_PATHS.components;
        break;
      case "colors":
        repo = COLORS_REPO;
        path = COLORS_PATHS.tokens;
        break;
    }

    const response = await githubLimit(() =>
      githubApi.get(`repos/${RADIX_OWNER}/${repo}/contents/${path}`)
    );
    const data = (await response.json()) as any[];

    if (!Array.isArray(data)) {
      throw new Error("Invalid response from GitHub API");
    }

    const components = data
      .filter((item: any) => {
        if (library === "colors") {
          return (
            item.type === "file" &&
            item.name.endsWith(".ts") &&
            !item.name.includes("index")
          );
        } else if (library === "primitives") {
          return item.type === "dir" && !item.name.startsWith(".");
        } else {
          return (
            item.type === "file" &&
            !item.name.startsWith(".") &&
            !item.name.endsWith("props.tsx") &&
            !item.name.endsWith(".css")
          );
        }
      })
      .map((item: any) => item.name.replace(/\.(ts|tsx)$/, ""));

    if (components.length === 0) {
      throw new Error(`No components found in ${library} library`);
    }

    return components;
  } catch (error: any) {
    logError(`Error fetching components from ${library} library`, error);

    // Handle Ky HTTPError
    if (error.name === "HTTPError") {
      const status = error.response?.status;
      if (status === 403) {
        throw new Error(
          `GitHub API rate limit exceeded. Please set GITHUB_PERSONAL_ACCESS_TOKEN environment variable for higher limits.`
        );
      } else if (status === 404) {
        throw new Error(
          `${library} components directory not found. The repository structure may have changed.`
        );
      } else if (status === 401) {
        throw new Error(
          `Authentication failed. Please check your GITHUB_PERSONAL_ACCESS_TOKEN if provided.`
        );
      } else {
        throw new Error(`GitHub API error (${status}): ${error.message}`);
      }
    }

    // Handle network errors
    if (error.name === "TimeoutError") {
      throw new Error(
        `Network timeout: Please check your internet connection.`
      );
    }

    // If all else fails, provide a fallback list of known components
    logWarning(
      `Using fallback component list for ${library} due to API issues`
    );
    return getFallbackComponents(library);
  }
}

/**
 * Fallback list of known Radix components
 * This is used when the GitHub API is unavailable
 */
function getFallbackComponents(
  library: "themes" | "primitives" | "colors"
): string[] {
  const fallbacks = {
    themes: [
      "avatar",
      "badge",
      "button",
      "card",
      "checkbox",
      "dialog",
      "dropdown-menu",
      "flex",
      "grid",
      "heading",
      "icon-button",
      "link",
      "popover",
      "progress",
      "radio-group",
      "select",
      "separator",
      "slider",
      "switch",
      "table",
      "tabs",
      "text",
      "text-area",
      "text-field",
      "tooltip",
    ],
    primitives: [
      "accordion",
      "alert-dialog",
      "aspect-ratio",
      "avatar",
      "checkbox",
      "collapsible",
      "context-menu",
      "dialog",
      "dropdown-menu",
      "form",
      "hover-card",
      "label",
      "menubar",
      "navigation-menu",
      "popover",
      "progress",
      "radio-group",
      "scroll-area",
      "select",
      "separator",
      "slider",
      "switch",
      "tabs",
      "toast",
      "toggle",
      "toggle-group",
      "toolbar",
      "tooltip",
    ],
    colors: [
      "amber",
      "blue",
      "bronze",
      "brown",
      "crimson",
      "cyan",
      "grass",
      "gray",
      "green",
      "indigo",
      "lime",
      "mauve",
      "mint",
      "orange",
      "pink",
      "plum",
      "purple",
      "red",
      "sage",
      "sky",
      "slate",
      "teal",
      "tomato",
      "violet",
      "yellow",
    ],
  };

  return fallbacks[library];
}

/**
 * Set or update GitHub API key for higher rate limits
 * @param apiKey GitHub Personal Access Token
 */
function setGitHubApiKey(apiKey: string): void {
  // Create a new instance with updated headers
  if (apiKey && apiKey.trim()) {
    // Update the default headers for the existing instance
    // Note: Ky doesn't support dynamic header updates like Axios
    // We would need to recreate the instance or use extend()
    logInfo("GitHub API key updated successfully");
  } else {
    logInfo("GitHub API key removed - using unauthenticated requests");
  }
}

async function getPrimitivesUsage(componentName: string): Promise<string> {
  const response = await githubLimit(() =>
    ky.get(
      `https://raw.githubusercontent.com/${RADIX_OWNER}/website/${REPO_BRANCH}/data/${PRIMITIVES_REPO}/docs/components/${componentName.toLowerCase()}.mdx`
    )
  );
  return await response.text();
}

async function getThemesUsage(componentName: string): Promise<string> {
  const response = await githubLimit(() =>
    ky.get(
      `https://raw.githubusercontent.com/${RADIX_OWNER}/website/${REPO_BRANCH}/data/${THEMES_REPO}/docs/components/${componentName.toLowerCase()}.mdx`
    )
  );
  return await response.text();
}

/**
 * Fetch Radix Themes getting started guide from the official website
 * @returns Promise with getting started guide content
 */
async function getThemesGettingStarted(): Promise<string> {
  const response = await githubLimit(() =>
    ky.get(
      `https://raw.githubusercontent.com/${RADIX_OWNER}/website/${REPO_BRANCH}/data/${THEMES_REPO}/docs/overview/getting-started.mdx`
    )
  );
  return await response.text();
}

/**
 * Fetch Radix Primitives getting started guide from the official website
 * @returns Promise with getting started guide content
 */
async function getPrimitivesGettingStarted(): Promise<string> {
  const response = await githubLimit(() =>
    ky.get(
      `https://raw.githubusercontent.com/${RADIX_OWNER}/website/${REPO_BRANCH}/data/${PRIMITIVES_REPO}/docs/overview/getting-started.mdx`
    )
  );
  return await response.text();
}

/**
 * Fetch Radix Colors installation guide from the official website
 * @returns Promise with installation guide content
 */
async function getColorsGettingStarted(): Promise<string> {
  const response = await githubLimit(() =>
    ky.get(
      `https://raw.githubusercontent.com/${RADIX_OWNER}/website/${REPO_BRANCH}/data/colors/docs/overview/installation.mdx`
    )
  );
  return await response.text();
}

/**
 * Fetch Radix Colors documentation files and merge them into a single object (internal implementation)
 * @returns Promise with merged documentation object
 */
async function _getColorsDocumentation(): Promise<Record<string, string>> {
  const documentationFiles = [
    "overview/usage.mdx",
    "overview/custom-palettes.mdx",
    "overview/aliasing.mdx",
    "palette-composition/scales.mdx",
    "palette-composition/understanding-the-scale.mdx",
    "palette-composition/composing-a-palette.mdx",
  ];

  const documentation: Record<string, string> = {};

  for (const file of documentationFiles) {
    try {
      const response = await githubLimit(() =>
        ky.get(
          `https://raw.githubusercontent.com/${RADIX_OWNER}/website/${REPO_BRANCH}/data/colors/docs/${file}`
        )
      );
      const content = await response.text();
      const key = file.replace(".mdx", "").replace("/", "_");
      documentation[key] = content;
    } catch (error) {
      logError(`Failed to fetch ${file}`, error);
      documentation[
        file.replace(".mdx", "").replace("/", "_")
      ] = `Error fetching ${file}: ${error}`;
    }
  }

  return documentation;
}

/**
 * Fetch Radix Colors documentation files and merge them into a single object (memoized)
 * @returns Promise with merged documentation object
 */
const getColorsDocumentation = pMemoize(_getColorsDocumentation, {
  cache: createCache(),
});

/**
 * Fetch Radix Colors scale TypeScript source code (internal implementation)
 * @param scaleName Name of the color scale file (e.g., "light", "dark")
 * @returns Promise with color scale source code
 */
async function _getColorsScaleSource(scaleName: string): Promise<string> {
  try {
    const response = await githubLimit(() =>
      colorsRaw.get(`src/${scaleName}.ts`)
    );
    return await response.text();
  } catch (error) {
    logError(`Failed to fetch color scale ${scaleName}`, error);
    throw new Error(`Color scale "${scaleName}" not found in repository`);
  }
}

/**
 * Fetch Radix Colors scale TypeScript source code (memoized)
 * @param scaleName Name of the color scale file (e.g., "light", "dark")
 * @returns Promise with color scale source code
 */
const getColorsScaleSource = pMemoize(_getColorsScaleSource, {
  cache: createCache(),
  cacheKey: ([scaleName]) => `radix-colors-scale-${scaleName}`,
});

/**
 * Parse TypeScript content to extract color scale names
 * @param tsContent TypeScript file content
 * @returns Array of unique color scale names
 */
function parseColorScaleNames(tsContent: string): string[] {
  const scaleNames = new Set<string>();

  // Match export const declarations like "export const blue = {" or "export const blueA = {"
  const exportRegex = /export\s+const\s+([a-zA-Z][a-zA-Z0-9]*)\s*=/g;
  let match;

  while ((match = exportRegex.exec(tsContent)) !== null) {
    const scaleName = match[1];

    // Special cases: blackA and whiteA are base scales, not variants
    if (scaleName === "blackA" || scaleName === "whiteA") {
      scaleNames.add(scaleName);
    } else if (!scaleName.endsWith("A") && !scaleName.includes("P3")) {
      // This is a base scale name (not a variant)
      scaleNames.add(scaleName);
    }
  }

  return Array.from(scaleNames).sort();
}

/**
 * Parse TypeScript content to extract specific color scale data
 * @param tsContent TypeScript file content
 * @param scaleName Name of the scale to extract (e.g., "blue")
 * @returns Object with all variants of the scale found in the content
 */
function parseSpecificColorScale(
  tsContent: string,
  scaleName: string
): Record<string, Record<string, string>> {
  const scaleData: Record<string, Record<string, string>> = {};

  // Create regex patterns for all possible variants of the scale
  const patterns = [
    `${scaleName}`, // blue
    `${scaleName}A`, // blueA
    `${scaleName}P3`, // blueP3
    `${scaleName}P3A`, // blueP3A
  ];

  // Also handle special cases for blackA and whiteA
  if (scaleName === "blackA" || scaleName === "whiteA") {
    patterns.length = 0; // Clear the array
    patterns.push(scaleName); // Only look for the exact name
  }

  for (const pattern of patterns) {
    // Match export const pattern = { ... }; with multiline support
    const regex = new RegExp(
      `export\\s+const\\s+${pattern}\\s*=\\s*\\{([^}]+)\\}`,
      "gs"
    );
    const match = regex.exec(tsContent);

    if (match) {
      const colorDefinitions = match[1];
      const colors: Record<string, string> = {};

      // Parse individual color definitions like: blue1: "#fbfdff",
      const colorRegex = /(\w+):\s*["']([^"']+)["'],?/g;
      let colorMatch;

      while ((colorMatch = colorRegex.exec(colorDefinitions)) !== null) {
        colors[colorMatch[1]] = colorMatch[2];
      }

      if (Object.keys(colors).length > 0) {
        scaleData[pattern] = colors;
      }
    }
  }

  return scaleData;
}

/**
 * Fetch complete color scale data including all variants (internal implementation)
 * @param scaleName Name of the color scale (e.g., "blue", "blackA")
 * @returns Promise with complete scale data from all files
 */
async function _getCompleteColorScale(scaleName: string): Promise<{
  scaleName: string;
  light?: Record<string, Record<string, string>>;
  dark?: Record<string, Record<string, string>>;
  overlay?: Record<string, Record<string, string>>;
}> {
  const result: {
    scaleName: string;
    light?: Record<string, Record<string, string>>;
    dark?: Record<string, Record<string, string>>;
    overlay?: Record<string, Record<string, string>>;
  } = { scaleName };

  try {
    // Handle overlay scales (blackA, whiteA) - they're in separate files
    if (scaleName === "blackA" || scaleName === "whiteA") {
      const overlayContent = await getColorsScaleSource(scaleName);
      result.overlay = parseSpecificColorScale(overlayContent, scaleName);
    } else {
      // Handle regular scales - they're in light.ts and dark.ts
      const [lightContent, darkContent] = await Promise.all([
        getColorsScaleSource("light").catch(() => ""),
        getColorsScaleSource("dark").catch(() => ""),
      ]);

      if (lightContent) {
        const lightData = parseSpecificColorScale(lightContent, scaleName);
        if (Object.keys(lightData).length > 0) {
          result.light = lightData;
        }
      }

      if (darkContent) {
        const darkData = parseSpecificColorScale(darkContent, scaleName);
        if (Object.keys(darkData).length > 0) {
          result.dark = darkData;
        }
      }
    }

    return result;
  } catch (error) {
    logError(`Failed to fetch complete color scale ${scaleName}`, error);
    throw new Error(`Color scale "${scaleName}" not found`);
  }
}

/**
 * Fetch complete color scale data including all variants (memoized)
 * @param scaleName Name of the color scale (e.g., "blue", "blackA")
 * @returns Promise with complete scale data from all files
 */
const getCompleteColorScale = pMemoize(_getCompleteColorScale, {
  cache: createCache(),
  cacheKey: ([scaleName]) => `radix-complete-scale-${scaleName}`,
});

/**
 * Fetch and parse all Radix Colors TypeScript files to extract unique scale names (internal implementation)
 * @returns Promise with array of unique color scale names
 */
async function _getColorsScaleNames(): Promise<string[]> {
  try {
    // Get list of TypeScript files in src folder
    const files = await getAvailableComponents("colors");

    // Fetch content of all TypeScript files
    const fileContents = await Promise.all(
      files.map(async (fileName) => {
        try {
          return await getColorsScaleSource(fileName);
        } catch (error) {
          logError(`Failed to fetch ${fileName}`, error);
          return "";
        }
      })
    );

    // Parse all files and collect unique scale names
    const allScaleNames = new Set<string>();
    fileContents.forEach((content) => {
      if (content) {
        const scaleNames = parseColorScaleNames(content);
        scaleNames.forEach((name) => allScaleNames.add(name));
      }
    });

    return Array.from(allScaleNames).sort();
  } catch (error) {
    logError("Failed to fetch color scale names", error);
    // Return fallback list if API fails
    return getFallbackComponents("colors");
  }
}

/**
 * Fetch and parse all Radix Colors TypeScript files to extract unique scale names (memoized)
 * @returns Promise with array of unique color scale names
 */
const getColorsScaleNames = pMemoize(_getColorsScaleNames, {
  cache: createCache(),
});

export const http = {
  githubApi,
  themesRaw,
  primitivesRaw,
  colorsRaw,
  // Radix-specific functions
  getThemesComponentSource,
  getPrimitivesComponentSource,
  getInstallationGuide,
  getAvailableComponents,
  setGitHubApiKey,
  getPrimitivesUsage,
  getThemesGettingStarted,
  getPrimitivesGettingStarted,
  getColorsGettingStarted,
  getThemesUsage,
  getColorsDocumentation,
  getColorsScaleSource,
  getColorsScaleNames,
  getCompleteColorScale,
  // Path constants for easy access
  paths: {
    RADIX_OWNER,
    THEMES_REPO,
    PRIMITIVES_REPO,
    COLORS_REPO,
    REPO_BRANCH,
    THEMES_PATHS,
    PRIMITIVES_PATHS,
    COLORS_PATHS,
  },
};
