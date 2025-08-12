import { z } from "zod";
import { http } from "../../utils/http.js";
import { logError, logInfo } from "../../utils/logger.js";

export const schema = z.object({
  componentName: z.string().min(1, "Component name is required"),
});

export interface GetThemesComponentParams {
  componentName: string;
}

export async function handleGetThemesComponent(
  params: GetThemesComponentParams
) {
  try {
    const { componentName } = params;
    logInfo(`Fetching Radix Themes component: ${componentName}`);

    const sourceCode = await http.getThemesComponentSource(componentName);
    const usage = await http.getThemesUsage(componentName);

    const result = {
      library: "themes",
      componentName,
      packageName: "@radix-ui/themes",
      type: "styled",
      source: sourceCode,
      installation: {
        npm: "npm install @radix-ui/themes",
        yarn: "yarn add @radix-ui/themes",
        pnpm: "pnpm add @radix-ui/themes",
      },
      usage,
    };

    logInfo(`Successfully fetched Radix Themes component: ${componentName}`);

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
      `Error fetching Radix Themes component: ${params.componentName}`,
      error
    );
    throw new Error(
      `Failed to fetch Radix Themes component "${params.componentName}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
