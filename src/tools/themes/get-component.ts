import { z } from 'zod';
import { http } from '../../utils/http.js';
import { logError, logInfo } from '../../utils/logger.js';

export const schema = z.object({
  componentName: z.string().min(1, "Component name is required")
});

export interface GetThemesComponentParams {
  componentName: string;
}

export async function handleGetThemesComponent(params: GetThemesComponentParams) {
  try {
    const { componentName } = params;
    logInfo(`Fetching Radix Themes component: ${componentName}`);
    
    const sourceCode = await http.getThemesComponentSource(componentName);
    
    const result = {
      library: 'themes',
      componentName,
      packageName: '@radix-ui/themes',
      type: 'styled',
      source: sourceCode,
      installation: {
        npm: 'npm install @radix-ui/themes',
        yarn: 'yarn add @radix-ui/themes',
        pnpm: 'pnpm add @radix-ui/themes'
      },
      setup: `
// 1. Import the CSS file in your root component
import '@radix-ui/themes/styles.css';

// 2. Wrap your application with the Theme component
import { Theme } from '@radix-ui/themes';

function App() {
  return (
    <Theme>
      <YourAppContent />
    </Theme>
  );
}
      `.trim(),
      usage: `
// Import the component
import { ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} } from '@radix-ui/themes';

// Use in your JSX
<${componentName.charAt(0).toUpperCase() + componentName.slice(1)}>
  Your content here
</${componentName.charAt(0).toUpperCase() + componentName.slice(1)}>
      `.trim(),
      theming: `
Radix Themes components support comprehensive theming:

1. Color scales: Use appearance prop or CSS custom properties
2. Spacing: Built-in spacing scale
3. Typography: Consistent text styles
4. Dark mode: Automatic dark mode support
5. CSS custom properties: Override any design token

Example:
<${componentName.charAt(0).toUpperCase() + componentName.slice(1)} color="blue" size="3" variant="soft">
  Themed component
</${componentName.charAt(0).toUpperCase() + componentName.slice(1)}>
      `.trim()
    };

    logInfo(`Successfully fetched Radix Themes component: ${componentName}`);

    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    logError(`Error fetching Radix Themes component: ${params.componentName}`, error);
    throw new Error(`Failed to fetch Radix Themes component "${params.componentName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}