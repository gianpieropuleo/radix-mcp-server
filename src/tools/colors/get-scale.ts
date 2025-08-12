import { z } from "zod";
import { http } from "../../utils/http.js";
import { logError, logInfo } from "../../utils/logger.js";

export const schema = z.object({
  scaleName: z.string().min(1, "Scale name is required"),
});

export interface GetColorsScaleParams {
  scaleName: string;
}

function generateUsageExamples(scaleName: string, scaleData: any): string {
  const isOverlay = scaleName === "blackA" || scaleName === "whiteA";
  const hasLight = scaleData.light?.[scaleName];
  const hasDark = scaleData.dark?.[scaleName];

  if (isOverlay) {
    const overlayColors = scaleData.overlay?.[scaleName] || {};
    const colorKeys = Object.keys(overlayColors);
    const firstColor = colorKeys[0];
    const solidColor = colorKeys[8] || firstColor; // Step 9

    return `
// Basic Overlay Usage
import { ${scaleName} } from '@radix-ui/colors';

// CSS-in-JS
const styles = {
  // Subtle overlay
  backgroundColor: ${scaleName}.${firstColor || `${scaleName}1`},
  // Medium overlay  
  boxShadow: \`0 4px 12px \${${scaleName}.${solidColor || `${scaleName}9`}}\`,
};

// CSS Custom Properties
:root {
${colorKeys
  .slice(0, 6)
  .map(
    (key) =>
      `  --${scaleName}-${key.replace(scaleName, "")}: ${overlayColors[key]};`
  )
  .join("\n")}
  /* ... continue for all ${colorKeys.length} steps */
}

// Component example
.modal-backdrop {
  background-color: var(--${scaleName}-8);
}

.card-shadow {
  box-shadow: 0 2px 8px var(--${scaleName}-6);
}
    `.trim();
  }

  const lightColors = hasLight ? scaleData.light[scaleName] : {};
  const darkColors = hasDark ? scaleData.dark[scaleName] : {};
  const lightKeys = Object.keys(lightColors);
  const darkKeys = Object.keys(darkColors);

  return `
// Basic Usage
import { ${scaleName}${
    hasDark ? `, ${scaleName}Dark` : ""
  } } from '@radix-ui/colors';

// CSS-in-JS
const styles = {
  backgroundColor: ${scaleName}.${scaleName}3,
  border: \`1px solid \${${scaleName}.${scaleName}6}\`,
  color: ${scaleName}.${scaleName}11,
};

// CSS Custom Properties${hasDark ? " with Dark Mode" : ""}
:root {
${lightKeys
  .slice(0, 6)
  .map(
    (key) =>
      `  --${scaleName}-${key.replace(scaleName, "")}: ${lightColors[key]};`
  )
  .join("\n")}
  /* ... continue for all ${lightKeys.length} steps */
}

${
  hasDark
    ? `
[data-theme="dark"] {
${darkKeys
  .slice(0, 6)
  .map(
    (key) =>
      `  --${scaleName}-${key.replace(scaleName, "")}: ${darkColors[key]};`
  )
  .join("\n")}
  /* ... continue for all ${darkKeys.length} steps */
}
`
    : ""
}

// Component example
.button {
  background-color: var(--${scaleName}-9);
  color: var(--${scaleName}-1);
  border: 1px solid var(--${scaleName}-7);
}

.button:hover {
  background-color: var(--${scaleName}-10);
  border-color: var(--${scaleName}-8);
}
  `.trim();
}

export async function handleGetColorsScale(params: GetColorsScaleParams) {
  try {
    const { scaleName } = params;
    logInfo(`Fetching Radix Colors scale: ${scaleName}`);

    // Fetch the actual color data from TypeScript files
    const scaleData = await http.getCompleteColorScale(scaleName);

    // Build the result with actual color values
    const result = {
      library: "colors",
      scaleName,
      packageName: "@radix-ui/colors",
      type: "color-scale",
      installation: {
        npm: "npm install @radix-ui/colors",
        yarn: "yarn add @radix-ui/colors",
        pnpm: "pnpm add @radix-ui/colors",
      },
      colors: scaleData,
      imports: {
        base:
          scaleName === "blackA" || scaleName === "whiteA"
            ? `import { ${scaleName} } from '@radix-ui/colors';`
            : `import { ${scaleName} } from '@radix-ui/colors';`,
        ...(scaleName !== "blackA" &&
          scaleName !== "whiteA" && {
            dark: `import { ${scaleName}Dark } from '@radix-ui/colors';`,
            both: `import { ${scaleName}, ${scaleName}Dark } from '@radix-ui/colors';`,
            alpha: `import { ${scaleName}A } from '@radix-ui/colors';`,
            p3: `import { ${scaleName}P3 } from '@radix-ui/colors';`,
            all: `import { ${scaleName}, ${scaleName}Dark, ${scaleName}A, ${scaleName}P3 } from '@radix-ui/colors';`,
          }),
      },
      structure: {
        description:
          scaleName === "blackA" || scaleName === "whiteA"
            ? `The ${scaleName} overlay scale provides alpha transparency values`
            : `The ${scaleName} scale contains 12 carefully crafted color steps`,
        variants: {
          ...(scaleData.light && { light: "Standard light theme colors" }),
          ...(scaleData.dark && { dark: "Dark theme variant" }),
          ...(scaleData.overlay && { overlay: "Alpha transparency overlay" }),
          ...(scaleData.light?.[`${scaleName}A`] && {
            alpha: "Alpha transparency variant",
          }),
          ...(scaleData.light?.[`${scaleName}P3`] && {
            p3: "Display P3 color space variant",
          }),
          ...(scaleData.light?.[`${scaleName}P3A`] && {
            p3Alpha: "Display P3 alpha variant",
          }),
        },
        steps:
          scaleName === "blackA" || scaleName === "whiteA"
            ? Array.from({ length: 12 }, (_, i) => ({
                step: i + 1,
                usage:
                  i < 6
                    ? "Subtle overlays"
                    : i < 9
                    ? "Medium overlays"
                    : "Strong overlays",
                semantic: `overlay-${i + 1}`,
              }))
            : [
                { step: 1, usage: "App background", semantic: "app-bg" },
                { step: 2, usage: "Subtle background", semantic: "subtle-bg" },
                { step: 3, usage: "UI element background", semantic: "ui-bg" },
                {
                  step: 4,
                  usage: "Hovered UI element background",
                  semantic: "ui-bg-hover",
                },
                {
                  step: 5,
                  usage: "Active/Selected UI element background",
                  semantic: "ui-bg-active",
                },
                {
                  step: 6,
                  usage: "Subtle borders and separators",
                  semantic: "border-subtle",
                },
                {
                  step: 7,
                  usage: "UI element border and focus rings",
                  semantic: "border",
                },
                {
                  step: 8,
                  usage: "Hovered UI element border",
                  semantic: "border-hover",
                },
                { step: 9, usage: "Solid backgrounds", semantic: "solid" },
                {
                  step: 10,
                  usage: "Hovered solid backgrounds",
                  semantic: "solid-hover",
                },
                { step: 11, usage: "Low-contrast text", semantic: "text-low" },
                {
                  step: 12,
                  usage: "High-contrast text",
                  semantic: "text-high",
                },
              ],
      },
      usage_examples: generateUsageExamples(scaleName, scaleData),
      accessibility: `
# Accessibility Considerations

${
  scaleName === "blackA" || scaleName === "whiteA"
    ? "• Use for overlays and transparency effects\n• Test visibility against various backgrounds\n• Ensure sufficient contrast when used over content"
    : "• Steps 11 and 12 provide sufficient contrast for text\n• Step 9 and 10 work well for solid interactive elements\n• Test your color combinations with accessibility tools\n• Ensure 4.5:1 contrast ratio for normal text\n• Ensure 3:1 contrast ratio for large text and UI elements"
}

# Recommended Usage
${
  scaleName === "blackA" || scaleName === "whiteA"
    ? "• Steps 1-6: Subtle overlays and shadows\n• Steps 7-9: Medium overlays\n• Steps 10-12: Strong overlays and backgrounds"
    : "• Background: Step 1-5\n• Text on light backgrounds: Step 11-12\n• Text on solid colors: Step 1-2\n• Borders: Step 6-8\n• Interactive elements: Step 9-10"
}
      `.trim(),
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
