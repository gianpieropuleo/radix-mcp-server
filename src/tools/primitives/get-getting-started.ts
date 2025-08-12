import { GettingStartedResult, Library } from "../../types/results.js";
import { http } from "../../utils/http.js";
import { logInfo } from "../../utils/logger.js";

export async function handleGetPrimitivesGettingStarted() {
  try {
    logInfo("Fetching official Radix Primitives getting started guide...");

    // Fetch the official getting-started guide from Radix UI website
    const gettingStartedContent = await http.getPrimitivesGettingStarted();

    const result: GettingStartedResult = {
      library: Library.Primitives,
      title: "Radix Primitives - Getting Started",
      description: "Official getting started guide for Radix Primitives",
      source:
        "https://github.com/radix-ui/website/blob/main/data/primitives/docs/overview/getting-started.mdx",
      content: gettingStartedContent,
      note: "This content is fetched directly from the official Radix UI documentation to ensure it stays up-to-date.",
    };

    logInfo("Successfully fetched Radix Primitives getting started guide");

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
      `Failed to fetch Radix Primitives getting started guide: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
