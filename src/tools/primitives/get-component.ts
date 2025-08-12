import { z } from "zod";
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

    const sourceCode = await http.getPrimitivesComponentSource(componentName);
    const usage = await http.getPrimitivesUsage(componentName);

    const result = {
      library: "primitives",
      componentName,
      packageName: `@radix-ui/react-${componentName}`,
      type: "unstyled",
      source: sourceCode,
      installation: {
        npm: `npm install @radix-ui/react-${componentName}`,
        yarn: `yarn add @radix-ui/react-${componentName}`,
        pnpm: `pnpm add @radix-ui/react-${componentName}`,
      },
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
