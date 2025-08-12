import {
  ComponentType,
  Library,
  ListComponentsResult,
  Package,
} from "../../types/results.js";
import { http } from "../../utils/http.js";
import { logError, logInfo } from "../../utils/logger.js";

export async function handleListPrimitivesComponents() {
  try {
    logInfo("Fetching Radix Primitives components...");

    const components = await http.getAvailableComponents("primitives");

    const result: ListComponentsResult = {
      library: Library.Primitives,
      total: components.length,
      components: components.map((name) => ({
        name,
        packageName: `${Package.Primitives}${name}`,
        type: ComponentType.Unstyled,
      })),
      note: "Use get-component tool with a specific component name to get detailed usage information",
    };

    logInfo(
      `Successfully fetched ${components.length} Radix Primitives components`
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
    logError("Error fetching Radix Primitives components", error);
    throw new Error(
      `Failed to fetch Radix Primitives components: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
