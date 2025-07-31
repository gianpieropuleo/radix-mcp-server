import { z } from 'zod';
import { http } from '../../utils/http.js';
import { logError, logInfo } from '../../utils/logger.js';

export const schema = z.object({});

export interface ListColorsScalesParams {}

export async function handleListColorsScales(params: ListColorsScalesParams) {
  try {
    logInfo('Fetching Radix Colors scales...');
    
    const scales = await http.getAvailableComponents('colors');
    
    const result = {
      library: 'colors',
      total: scales.length,
      scales: scales.map(name => ({
        name,
        packageName: '@radix-ui/colors',
        type: 'color-scale',
        description: `${name.charAt(0).toUpperCase() + name.slice(1)} color scale with 12 steps`,
        import: `import { ${name} } from '@radix-ui/colors';`,
        usage: `backgroundColor: ${name}.${name}3, color: ${name}.${name}11`
      })),
      categories: {
        'Gray Colors': ['gray', 'mauve', 'slate', 'sage', 'olive', 'sand'],
        'Primary Colors': ['blue', 'red', 'green', 'yellow', 'orange', 'purple'],
        'Extended Colors': ['tomato', 'crimson', 'pink', 'plum', 'violet', 'iris', 'indigo', 'cyan', 'teal', 'mint', 'lime', 'grass'],
        'Metal Colors': ['bronze', 'gold'],
        'Dark Variants': ['grayDark', 'blueDark', 'redDark', 'greenDark', 'yellowDark', 'orangeDark', 'purpleDark']
      },
      scale_structure: `
Each color scale contains 12 steps:

• Step 1: App background
• Step 2: Subtle background  
• Step 3: UI element background
• Step 4: Hovered UI element background
• Step 5: Active / Selected UI element background
• Step 6: Subtle borders and separators
• Step 7: UI element border and focus rings
• Step 8: Hovered UI element border
• Step 9: Solid backgrounds
• Step 10: Hovered solid backgrounds
• Step 11: Low-contrast text
• Step 12: High-contrast text
      `.trim(),
      usage: `
import { blue, blueDark, gray, grayDark } from '@radix-ui/colors';

// Light theme
.my-component {
  background-color: \${blue.blue3};
  border: 1px solid \${blue.blue6};
  color: \${blue.blue11};
}

// Dark theme  
@media (prefers-color-scheme: dark) {
  .my-component {
    background-color: \${blueDark.blue3};
    border: 1px solid \${blueDark.blue6};
    color: \${blueDark.blue11};
  }
}

// CSS Custom Properties
:root {
  --blue-1: \${blue.blue1};
  --blue-2: \${blue.blue2};
  /* ... */
  --blue-12: \${blue.blue12};
}
      `.trim(),
      guidelines: `
# Color Usage Guidelines

## Backgrounds
• Step 1-2: App and component backgrounds
• Step 3-5: Interactive element backgrounds
• Step 9-10: Solid/prominent backgrounds

## Borders  
• Step 6: Subtle borders, separators
• Step 7-8: Interactive element borders

## Text
• Step 11: Low-contrast text (secondary)
• Step 12: High-contrast text (primary)

## Best Practices
• Use semantic naming in your CSS variables
• Always provide dark mode alternatives
• Test contrast ratios for accessibility
• Use the same step number across different colors for consistency
      `.trim()
    };

    logInfo(`Successfully fetched ${scales.length} Radix Colors scales`);

    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    logError('Error fetching Radix Colors scales', error);
    throw new Error(`Failed to fetch Radix Colors scales: ${error instanceof Error ? error.message : String(error)}`);
  }
}