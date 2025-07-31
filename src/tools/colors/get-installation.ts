import { z } from 'zod';
import { http } from '../../utils/http.js';
import { logInfo } from '../../utils/logger.js';

export const schema = z.object({});

export interface GetColorsInstallationParams {}

export async function handleGetColorsInstallation(params: GetColorsInstallationParams) {
  try {
    logInfo('Generating Radix Colors installation guide');
    
    const installationGuide = await http.getInstallationGuide('colors');
    
    const result = {
      library: 'colors',
      packageName: '@radix-ui/colors',
      installation: {
        npm: 'npm install @radix-ui/colors',
        yarn: 'yarn add @radix-ui/colors',
        pnpm: 'pnpm add @radix-ui/colors'
      },
      setup: `
# Step 1: Install Radix Colors
npm install @radix-ui/colors

# Step 2: Import the color scales you need
import { blue, blueDark, gray, grayDark } from '@radix-ui/colors';

# Step 3: Use in your CSS-in-JS solution
const styles = {
  backgroundColor: blue.blue3,
  color: blue.blue11,
  border: \`1px solid \${blue.blue6}\`
};

# Step 4: Or create CSS custom properties
:root {
  --blue-1: \${blue.blue1};
  --blue-2: \${blue.blue2};
  /* ... for all 12 steps */
}
      `.trim(),
      css_variables_setup: `
# Complete CSS Variables Setup

// colors.js or colors.ts
import * as colors from '@radix-ui/colors';

// Generate CSS custom properties
export const generateColorVariables = () => {
  const lightColors = {};
  const darkColors = {};
  
  // Process light colors
  Object.entries(colors).forEach(([colorName, colorScale]) => {
    if (!colorName.endsWith('Dark')) {
      Object.entries(colorScale).forEach(([step, value]) => {
        const stepNumber = step.replace(colorName, '');
        lightColors[\`--\${colorName}-\${stepNumber}\`] = value;
      });
    }
  });
  
  // Process dark colors  
  Object.entries(colors).forEach(([colorName, colorScale]) => {
    if (colorName.endsWith('Dark')) {
      const baseName = colorName.replace('Dark', '');
      Object.entries(colorScale).forEach(([step, value]) => {
        const stepNumber = step.replace(baseName, '');
        darkColors[\`--\${baseName}-\${stepNumber}\`] = value;
      });
    }
  });
  
  return { lightColors, darkColors };
};

// Usage in CSS-in-JS
const { lightColors, darkColors } = generateColorVariables();

// Inject into document
const style = document.createElement('style');
style.textContent = \`
  :root {
    \${Object.entries(lightColors).map(([prop, value]) => \`\${prop}: \${value};\`).join('\\n    ')}
  }
  
  [data-theme="dark"] {
    \${Object.entries(darkColors).map(([prop, value]) => \`\${prop}: \${value};\`).join('\\n    ')}
  }
\`;
document.head.appendChild(style);
      `.trim(),
      framework_examples: `
# React with Styled Components
import styled from 'styled-components';
import { blue, blueDark } from '@radix-ui/colors';

const Button = styled.button\`
  background-color: \${blue.blue9};
  color: \${blue.blue1};
  border: 1px solid \${blue.blue7};
  
  &:hover {
    background-color: \${blue.blue10};
  }
  
  @media (prefers-color-scheme: dark) {
    background-color: \${blueDark.blue9};
    color: \${blueDark.blue1};
    border-color: \${blueDark.blue7};
    
    &:hover {
      background-color: \${blueDark.blue10};
    }
  }
\`;

# Next.js with CSS Modules
// styles/colors.module.css
:root {
  --blue-solid: blue9-value-here;
  --blue-text: blue12-value-here;
}

[data-theme="dark"] {
  --blue-solid: blueDark9-value-here;
  --blue-text: blueDark12-value-here;
}

.button {
  background-color: var(--blue-solid);
  color: var(--blue-text);
}

# Tailwind CSS Integration
// tailwind.config.js
import { blue, blueDark, gray, grayDark } from '@radix-ui/colors';

module.exports = {
  theme: {
    extend: {
      colors: {
        blue: {
          1: blue.blue1,
          2: blue.blue2,
          // ... continue for all steps
          12: blue.blue12,
        },
        // Add other scales as needed
      }
    }
  }
};

// Usage: className="bg-blue-9 text-blue-1"
      `.trim(),
      design_tokens: `
# Design System Integration

// tokens/colors.ts
import { 
  gray, grayDark,
  blue, blueDark,
  red, redDark,
  green, greenDark
} from '@radix-ui/colors';

export const semanticTokens = {
  // Neutral colors
  neutral: {
    1: gray.gray1, // App background
    2: gray.gray2, // Subtle background
    3: gray.gray3, // Component background
    // ... continue semantic mapping
  },
  
  // Primary brand color
  primary: {
    1: blue.blue1,
    2: blue.blue2,
    // ... continue mapping
  },
  
  // Status colors
  success: {
    solid: green.green9,
    text: green.green11,
  },
  error: {
    solid: red.red9,
    text: red.red11,
  }
};

// Dark mode variants
export const darkSemanticTokens = {
  neutral: {
    1: grayDark.gray1,
    2: grayDark.gray2,
    // ... continue dark variants
  }
  // ... other dark variants
};
      `.trim(),
      best_practices: `
# Best Practices

## 1. Semantic Naming
• Use semantic names in your design system
• Map Radix steps to semantic meanings
• Example: primary-solid instead of blue-9

## 2. Dark Mode Strategy  
• Always pair light scales with dark variants
• Use CSS custom properties for theme switching
• Test both themes during development

## 3. Accessibility
• Steps 11-12 provide sufficient text contrast
• Test color combinations with accessibility tools
• Consider color-blind users when choosing scales

## 4. Performance
• Only import the color scales you actually use
• Tree-shaking will eliminate unused colors
• Consider bundling strategy for CSS variables

## 5. Consistency
• Use the same step numbers across different colors
• Establish clear usage guidelines for your team
• Document your semantic color system
      `.trim(),
      documentation: 'https://www.radix-ui.com/colors',
      repository: 'https://github.com/radix-ui/colors'
    };

    logInfo('Successfully generated Radix Colors installation guide');

    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    throw new Error(`Failed to generate Radix Colors installation guide: ${error instanceof Error ? error.message : String(error)}`);
  }
}