import { z } from "zod";
import {
  ComponentType,
  GetComponentResult,
  Library,
} from "../../types/results.js";
import { http } from "../../utils/http.js";
import { logError, logInfo } from "../../utils/logger.js";

export const schema = z.object({
  scaleName: z.string().min(1, "Scale name is required"),
});

export interface GetColorsScaleParams {
  scaleName: string;
}

export async function handleGetColorsScale(params: GetColorsScaleParams) {
  try {
    const { scaleName } = params;
    logInfo(`Fetching Radix Colors scale: ${scaleName}`);

    // Fetch the actual color data from TypeScript files
    const scaleData = await http.getCompleteColorScale(scaleName);

    // Build the result with actual color values
    const result: GetComponentResult = {
      library: Library.Colors,
      componentName: scaleName,
      packageName: "@radix-ui/colors",
      type: ComponentType.ColorScale,
      source: JSON.stringify(scaleData, null, 2),
      usage: await http.getColorsDocumentation(),
    };

    logInfo(`Successfully fetched Radix Colors scale: ${scaleName}`);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    logError(`Error fetching Radix Colors scale: ${params.scaleName}`, error);
    throw new Error(
      `Failed to fetch Radix Colors scale "${params.scaleName}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
