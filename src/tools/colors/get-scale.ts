import { z } from 'zod';
import { logError, logInfo } from '../../utils/logger.js';

export const schema = z.object({
  scaleName: z.string().min(1, "Scale name is required")
});

export interface GetColorsScaleParams {
  scaleName: string;
}

export async function handleGetColorsScale(params: GetColorsScaleParams) {
  try {
    const { scaleName } = params;
    logInfo(`Fetching Radix Colors scale: ${scaleName}`);
    
    // Since we can't easily fetch the actual color values from GitHub,
    // we'll provide the structure and usage information
    const result = {
      library: 'colors',
      scaleName,
      packageName: '@radix-ui/colors',
      type: 'color-scale',
      installation: {
        npm: 'npm install @radix-ui/colors',
        yarn: 'yarn add @radix-ui/colors',
        pnpm: 'pnpm add @radix-ui/colors'
      },
      import: {
        light: `import { ${scaleName} } from '@radix-ui/colors';`,
        dark: `import { ${scaleName}Dark } from '@radix-ui/colors';`,
        both: `import { ${scaleName}, ${scaleName}Dark } from '@radix-ui/colors';`
      },
      structure: {
        description: `The ${scaleName} scale contains 12 carefully crafted color steps`,
        steps: [
          { step: 1, usage: 'App background', semantic: 'app-bg' },
          { step: 2, usage: 'Subtle background', semantic: 'subtle-bg' },
          { step: 3, usage: 'UI element background', semantic: 'ui-bg' },
          { step: 4, usage: 'Hovered UI element background', semantic: 'ui-bg-hover' },
          { step: 5, usage: 'Active/Selected UI element background', semantic: 'ui-bg-active' },
          { step: 6, usage: 'Subtle borders and separators', semantic: 'border-subtle' },
          { step: 7, usage: 'UI element border and focus rings', semantic: 'border' },
          { step: 8, usage: 'Hovered UI element border', semantic: 'border-hover' },
          { step: 9, usage: 'Solid backgrounds', semantic: 'solid' },
          { step: 10, usage: 'Hovered solid backgrounds', semantic: 'solid-hover' },
          { step: 11, usage: 'Low-contrast text', semantic: 'text-low' },
          { step: 12, usage: 'High-contrast text', semantic: 'text-high' }
        ]
      },
      usage_examples: `
// Basic Usage
import { ${scaleName} } from '@radix-ui/colors';

// CSS-in-JS
const styles = {
  backgroundColor: ${scaleName}.${scaleName}3,
  border: \`1px solid \${${scaleName}.${scaleName}6}\`,
  color: ${scaleName}.${scaleName}11,
};

// CSS Custom Properties
:root {
  --${scaleName}-1: \${${scaleName}.${scaleName}1};
  --${scaleName}-2: \${${scaleName}.${scaleName}2};
  --${scaleName}-3: \${${scaleName}.${scaleName}3};
  /* ... continue for all 12 steps */
  --${scaleName}-12: \${${scaleName}.${scaleName}12};
}

// Using in CSS
.button {
  background-color: var(--${scaleName}-9);
  color: var(--${scaleName}-1);
  border: 1px solid var(--${scaleName}-7);
}

.button:hover {
  background-color: var(--${scaleName}-10);
  border-color: var(--${scaleName}-8);
}
      `.trim(),
      dark_mode: `
// Dark Mode Support
import { ${scaleName}, ${scaleName}Dark } from '@radix-ui/colors';

// CSS Custom Properties with dark mode
:root {
  ${Array.from({ length: 12 }, (_, i) => i + 1).map(step => 
    `--${scaleName}-${step}: \${${scaleName}.${scaleName}${step}};`
  ).join('\n  ')}
}

[data-theme="dark"] {
  ${Array.from({ length: 12 }, (_, i) => i + 1).map(step => 
    `--${scaleName}-${step}: \${${scaleName}Dark.${scaleName}${step}};`
  ).join('\n  ')}
}

// CSS-in-JS with theme switching
const getColorScale = (isDark: boolean) => isDark ? ${scaleName}Dark : ${scaleName};

const styles = (isDark: boolean) => ({
  backgroundColor: getColorScale(isDark).${scaleName}3,
  color: getColorScale(isDark).${scaleName}11,
});
      `.trim(),
      semantic_usage: `
// Semantic Color System
const semanticColors = {
  // Backgrounds
  appBg: ${scaleName}.${scaleName}1,
  subtleBg: ${scaleName}.${scaleName}2,
  componentBg: ${scaleName}.${scaleName}3,
  hoveredBg: ${scaleName}.${scaleName}4,
  activeBg: ${scaleName}.${scaleName}5,
  
  // Borders
  subtleBorder: ${scaleName}.${scaleName}6,
  border: ${scaleName}.${scaleName}7,
  hoveredBorder: ${scaleName}.${scaleName}8,
  
  // Solid colors
  solid: ${scaleName}.${scaleName}9,
  hoveredSolid: ${scaleName}.${scaleName}10,
  
  // Text
  lowContrastText: ${scaleName}.${scaleName}11,
  highContrastText: ${scaleName}.${scaleName}12,
};

// Component example
const Button = styled.button\`
  background-color: \${semanticColors.solid};
  color: \${semanticColors.appBg};
  border: 1px solid \${semanticColors.border};
  
  &:hover {
    background-color: \${semanticColors.hoveredSolid};
    border-color: \${semanticColors.hoveredBorder};
  }
\`;
      `.trim(),
      accessibility: `
# Accessibility Considerations

• Steps 11 and 12 provide sufficient contrast for text
• Step 9 and 10 work well for solid interactive elements
• Test your color combinations with accessibility tools
• Ensure 4.5:1 contrast ratio for normal text
• Ensure 3:1 contrast ratio for large text and UI elements

# Recommended Combinations
• Background: Step 1-5
• Text on light backgrounds: Step 11-12  
• Text on solid colors: Step 1-2
• Borders: Step 6-8
• Interactive elements: Step 9-10
      `.trim()
    };

    logInfo(`Successfully generated Radix Colors scale info: ${scaleName}`);

    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    logError(`Error fetching Radix Colors scale: ${params.scaleName}`, error);
    throw new Error(`Failed to fetch Radix Colors scale "${params.scaleName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}