import { z } from "zod";
import { http } from "../../utils/http.js";
import { logError, logInfo } from "../../utils/logger.js";

export const schema = z.object({});

export interface ListColorsScalesParams {}

export async function handleListColorsScales(params: ListColorsScalesParams) {
  try {
    logInfo("Fetching Radix Colors scales...");

    const scales = await http.getColorsScaleNames();

    const result = {
      library: "colors",
      total: scales.length,
      scales: scales,
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
