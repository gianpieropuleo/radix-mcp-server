import { z } from "zod";
import { http } from "../../utils/http.js";
import { logInfo } from "../../utils/logger.js";

export const schema = z.object({});

export interface GetColorsGettingStartedParams {}

export async function handleGetColorsGettingStarted(
  params: GetColorsGettingStartedParams
) {
  try {
    logInfo("Fetching official Radix Colors installation guide...");

    // Fetch the official installation guide from Radix UI website
    const installationContent = await http.getColorsGettingStarted();

    const result = {
      library: "colors",
      title: "Radix Colors - Installation",
      description: "Official installation guide for Radix Colors",
      source:
        "https://github.com/radix-ui/website/blob/main/data/colors/docs/overview/installation.mdx",
      content: installationContent,
      note: "This content is fetched directly from the official Radix UI documentation to ensure it stays up-to-date.",
    };

    logInfo("Successfully fetched Radix Colors installation guide");

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch Radix Colors installation guide: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
