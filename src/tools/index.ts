// Radix Themes tools
import { handleGetThemesComponent } from "./themes/get-component.js";
import { handleGetThemesGettingStarted } from "./themes/get-getting-started.js";
import { handleListThemesComponents } from "./themes/list-components.js";

// Radix Primitives tools
import { handleGetPrimitivesComponent } from "./primitives/get-component.js";
import { handleGetPrimitivesGettingStarted } from "./primitives/get-getting-started.js";
import { handleListPrimitivesComponents } from "./primitives/list-components.js";

// Radix Colors tools
import { handleGetColorsGettingStarted } from "./colors/get-getting-started.js";
import { handleGetColorsScale } from "./colors/get-scale.js";
import { handleListColorsScales } from "./colors/list-scales.js";

export const toolHandlers = {
  // Radix Themes tools
  themes_list_components: handleListThemesComponents,
  themes_get_component: handleGetThemesComponent,
  themes_get_getting_started: handleGetThemesGettingStarted,

  // Radix Primitives tools
  primitives_list_components: handleListPrimitivesComponents,
  primitives_get_component: handleGetPrimitivesComponent,
  primitives_get_getting_started: handleGetPrimitivesGettingStarted,

  // Radix Colors tools
  colors_list_scales: handleListColorsScales,
  colors_get_scale: handleGetColorsScale,
  colors_get_getting_started: handleGetColorsGettingStarted,
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
  themes_get_getting_started: {
    name: "themes_get_getting_started",
    description: "Get official getting started guide for Radix Themes",
    inputSchema: {
      type: "object",
      properties: {},
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
  primitives_get_getting_started: {
    name: "primitives_get_getting_started",
    description: "Get official getting started guide for Radix Primitives",
    inputSchema: {
      type: "object",
      properties: {},
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
  colors_get_getting_started: {
    name: "colors_get_getting_started",
    description: "Get official installation guide for Radix Colors",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
};
