import { Action } from "../types/actions.js";
import { Library } from "../types/results.js";
import { Tools } from "../types/tools.js";

export function createTool(library: Library, action: Action): Tools {
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
  }
}
