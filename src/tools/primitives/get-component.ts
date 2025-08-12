import { z } from "zod";
import {
  ComponentType,
  GetComponentResult,
  Library,
} from "../../types/results.js";
import { http } from "../../utils/http.js";
import { logError, logInfo } from "../../utils/logger.js";

export const schema = z.object({
  componentName: z.string().min(1, "Component name is required"),
});

export interface GetPrimitivesComponentParams {
  componentName: string;
}

export async function handleGetPrimitivesComponent(
  params: GetPrimitivesComponentParams
) {
  try {
    const { componentName } = params;
    logInfo(`Fetching Radix Primitives component: ${componentName}`);

    const usage = await http.getPrimitivesUsage(componentName);
    const source = await http.getPrimitivesComponentSource(componentName);

    const result: GetComponentResult = {
      library: Library.Primitives,
      componentName,
      packageName: `@radix-ui/react-${componentName}`,
      type: ComponentType.Unstyled,
      source,
      usage,
    };

    logInfo(
      `Successfully fetched Radix Primitives component: ${componentName}`
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
    logError(
      `Error fetching Radix Primitives component: ${params.componentName}`,
      error
    );
    throw new Error(
      `Failed to fetch Radix Primitives component "${params.componentName}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
