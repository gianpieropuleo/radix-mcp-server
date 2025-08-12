import { GettingStartedResult, Library } from "../../types/results.js";
import { http } from "../../utils/http.js";
import { logInfo } from "../../utils/logger.js";

export async function handleGetColorsGettingStarted() {
  try {
    logInfo("Fetching official Radix Colors getting started guide...");

    const gettingStartedContent = await http.getColorsGettingStarted();

    const result: GettingStartedResult = {
      library: Library.Colors,
      title: "Radix Colors - Getting Started",
      description: "Official getting started guide for Radix Colors",
      source:
        "https://github.com/radix-ui/website/blob/main/data/colors/docs/overview/installation.mdx",
      content: gettingStartedContent,
      note: "This content is fetched directly from the official Radix UI documentation to ensure it stays up-to-date.",
    };

    logInfo("Successfully fetched Radix Colors getting started guide");

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
      `Failed to fetch Radix Colors getting started guide: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
