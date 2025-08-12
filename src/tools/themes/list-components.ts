import {
  ComponentType,
  Library,
  ListComponentsResult,
  Package,
} from "../../types/results.js";
import { http } from "../../utils/http.js";
import { logError, logInfo } from "../../utils/logger.js";

export async function handleListThemesComponents() {
  try {
    logInfo("Fetching Radix Themes components...");

    const components = await http.getAvailableComponents("themes");

    const result: ListComponentsResult = {
      library: Library.Themes,
      total: components.length,
      components: components.map((name) => ({
        name,
        packageName: Package.Themes,
        type: ComponentType.Styled,
      })),
      note: "Use get-component tool with a specific component name to get detailed usage information",
    };

    logInfo(
      `Successfully fetched ${components.length} Radix Themes components`
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
    logError("Error fetching Radix Themes components", error);
    throw new Error(
      `Failed to fetch Radix Themes components: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
