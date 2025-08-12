import { GettingStartedResult, Library } from "../../types/results.js";
import { http } from "../../utils/http.js";
import { logInfo } from "../../utils/logger.js";

export async function handleGetThemesGettingStarted() {
  try {
    logInfo("Fetching official Radix Themes getting started guide...");

    // Fetch the official getting-started guide from Radix UI website
    const gettingStartedContent = await http.getThemesGettingStarted();

    const result: GettingStartedResult = {
      library: Library.Themes,
      title: "Radix Themes - Getting Started",
      description: "Official getting started guide for Radix Themes",
      source:
        "https://github.com/radix-ui/website/blob/main/data/themes/docs/overview/getting-started.mdx",
      content: gettingStartedContent,
      note: "This content is fetched directly from the official Radix UI documentation to ensure it stays up-to-date.",
    };

    logInfo("Successfully fetched Radix Themes getting started guide");

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
      `Failed to fetch Radix Themes getting started guide: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
