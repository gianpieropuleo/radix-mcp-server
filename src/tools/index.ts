// Radix Themes tools
import { handleGetThemesComponent } from "./themes/get-component.js";
import { handleGetThemesInstallation } from "./themes/get-installation.js";
import { handleListThemesComponents } from "./themes/list-components.js";

// Radix Primitives tools
import { handleGetPrimitivesComponent } from "./primitives/get-component.js";
import { handleGetPrimitivesInstallation } from "./primitives/get-installation.js";
import { handleListPrimitivesComponents } from "./primitives/list-components.js";

// Radix Colors tools
import { handleGetColorsInstallation } from "./colors/get-installation.js";
import { handleGetColorsScale } from "./colors/get-scale.js";
import { handleListColorsScales } from "./colors/list-scales.js";

export const toolHandlers = {
  // Radix Themes tools
  themes_list_components: handleListThemesComponents,
  themes_get_component: handleGetThemesComponent,
  themes_get_installation: handleGetThemesInstallation,

  // Radix Primitives tools
  primitives_list_components: handleListPrimitivesComponents,
  primitives_get_component: handleGetPrimitivesComponent,
  primitives_get_installation: handleGetPrimitivesInstallation,

  // Radix Colors tools
  colors_list_scales: handleListColorsScales,
  colors_get_scale: handleGetColorsScale,
  colors_get_installation: handleGetColorsInstallation,
};

// Export tools for dynamic registration based on library selection
export const tools = {
  // Radix Themes tools
  themes_list_components: {
    name: "themes_list_components",
    description: "Get all available Radix Themes components",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  themes_get_component: {
    name: "themes_get_component",
    description: "Get the source code for a specific Radix Themes component",
    inputSchema: {
      type: "object",
      properties: {
        componentName: {
          type: "string",
          description: "Name of the Radix Themes component to retrieve",
        },
      },
      required: ["componentName"],
      additionalProperties: false,
    },
  },
  themes_get_installation: {
    name: "themes_get_installation",
    description: "Get installation instructions for Radix Themes",
    inputSchema: {
      type: "object",
      properties: {
        packageManager: {
          type: "string",
          enum: ["npm", "yarn", "pnpm"],
          description: "Package manager to use for installation",
        },
      },
      additionalProperties: false,
    },
  },

  // Radix Primitives tools
  primitives_list_components: {
    name: "primitives_list_components",
    description: "Get all available Radix Primitives components",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  primitives_get_component: {
    name: "primitives_get_component",
    description:
      "Get the source code for a specific Radix Primitives component",
    inputSchema: {
      type: "object",
      properties: {
        componentName: {
          type: "string",
          description: "Name of the Radix Primitives component to retrieve",
        },
      },
      required: ["componentName"],
      additionalProperties: false,
    },
  },
  primitives_get_installation: {
    name: "primitives_get_installation",
    description: "Get installation instructions for Radix Primitives",
    inputSchema: {
      type: "object",
      properties: {
        componentName: {
          type: "string",
          description:
            "Optional component name for specific installation instructions",
        },
      },
      additionalProperties: false,
    },
  },

  // Radix Colors tools
  colors_list_scales: {
    name: "colors_list_scales",
    description: "Get all available Radix Colors color scales",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  colors_get_scale: {
    name: "colors_get_scale",
    description: "Get a specific Radix Colors color scale definition",
    inputSchema: {
      type: "object",
      properties: {
        scaleName: {
          type: "string",
          description: "Name of the color scale to retrieve",
        },
      },
      required: ["scaleName"],
      additionalProperties: false,
    },
  },
  colors_get_installation: {
    name: "colors_get_installation",
    description: "Get installation instructions for Radix Colors",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
};
