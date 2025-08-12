import {
  ComponentType,
  Library,
  ListComponentsResult,
  Package,
} from "../../types/results.js";
import { http } from "../../utils/http.js";
import { logError, logInfo } from "../../utils/logger.js";

export async function handleListColorsScales() {
  try {
    logInfo("Fetching Radix Colors scales...");

    const scales = await http.getColorsScaleNames();

    const result: ListComponentsResult = {
      library: Library.Colors,
      total: scales.length,
      components: scales.map((scale) => ({
        name: scale,
        packageName: Package.Colors,
        type: ComponentType.ColorScale,
      })),
      note: "Use get-scale tool with a specific scale name to get detailed color values and usage information",
    };

    logInfo(`Successfully fetched ${scales.length} Radix Colors scales`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    logError("Error fetching Radix Colors scales", error);
    throw new Error(
      `Failed to fetch Radix Colors scales: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
