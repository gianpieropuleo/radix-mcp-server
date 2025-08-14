import { Action, ColorAction } from "../types/actions.js";
import { Library } from "../types/results.js";
import { Tools } from "../types/tools.js";

export function createTool(
  library: Library,
  action: Action | ColorAction
): Tools {
  switch (action) {
    case Action.ListComponents:
      return {
        [library.toLowerCase() + "_" + action]: {
          name: `${library.toLowerCase()}_${action}`,
          description: `Get all available Radix ${library} components`,
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      };
    case Action.GetComponentSource:
      return {
        [library.toLowerCase() + "_" + action]: {
          name: `${library.toLowerCase()}_${action}`,
          description: `Get the source code for a specific Radix ${library} component`,
          inputSchema: {
            type: "object",
            properties: {
              componentName: {
                type: "string",
                description: `Name of the Radix ${library} component (e.g., "accordion", "dialog")`,
              },
            },
            required: ["componentName"],
          },
        },
      };
    case Action.GetComponentDocumentation:
      return {
        [library.toLowerCase() + "_" + action]: {
          name: `${library.toLowerCase()}_${action}`,
          description: `Get the documentation for a specific Radix ${library} component`,
          inputSchema: {
            type: "object",
            properties: {
              componentName: {
                type: "string",
                description: `Name of the Radix ${library} component (e.g., "accordion", "dialog")`,
              },
            },
            required: ["componentName"],
          },
        },
      };
    case Action.GetGettingStarted:
      return {
        [library.toLowerCase() + "_" + action]: {
          name: `${library.toLowerCase()}_${action}`,
          description: `Get official getting started guide for Radix ${library}`,
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      };
    case ColorAction.ListScales:
      return {
        [library.toLowerCase() + "_" + action]: {
          name: `${library.toLowerCase()}_${action}`,
          description: `Get all available Radix ${library} color scales`,
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
      };
    case ColorAction.GetScale:
      return {
        [library.toLowerCase() + "_" + action]: {
          name: `${library.toLowerCase()}_${action}`,
          description: `Get the source code for a specific Radix ${library} color scale`,
          inputSchema: {
            type: "object",
            properties: {
              scaleName: {
                type: "string",
                description: `Name of the Radix ${library} color scale (e.g., "blue", "green")`,
              },
            },
            required: ["scaleName"],
          },
        },
      };
    case ColorAction.GetScaleDocumentation:
      return {
        [library.toLowerCase() + "_" + action]: {
          name: `${library.toLowerCase()}_${action}`,
          description: `Get the documentation for a Radix ${library} color scale`,
          inputSchema: {
            type: "object",
            properties: {
              scaleName: {
                type: "string",
                description: `Name of the Radix ${library} color scale (e.g., "blue", "green")`,
              },
            },
            required: ["scaleName"],
          },
        },
      };
  }
}
