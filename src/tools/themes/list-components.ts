import { z } from 'zod';
import { http } from '../../utils/http.js';
import { logError, logInfo } from '../../utils/logger.js';

export const schema = z.object({});

export interface ListThemesComponentsParams {}

export async function handleListThemesComponents(params: ListThemesComponentsParams) {
  try {
    logInfo('Fetching Radix Themes components...');
    
    const components = await http.getAvailableComponents('themes');
    
    const result = {
      library: 'themes',
      total: components.length,
      components: components.map(name => ({
        name,
        packageName: '@radix-ui/themes',
        type: 'styled',
        description: `${name.charAt(0).toUpperCase() + name.slice(1)} - A styled component from Radix Themes`,
        installation: `import { ${name.charAt(0).toUpperCase() + name.slice(1)} } from '@radix-ui/themes';`
      })),
      usage: `
Radix Themes components are pre-styled and ready to use:

1. Install: npm install @radix-ui/themes
2. Import CSS: import '@radix-ui/themes/styles.css';
3. Wrap your app: <Theme><App /></Theme>
4. Use components: <Button>Click me</Button>

All components support theming through CSS custom properties and the Theme component.
      `.trim()
    };

    logInfo(`Successfully fetched ${components.length} Radix Themes components`);

    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    logError('Error fetching Radix Themes components', error);
    throw new Error(`Failed to fetch Radix Themes components: ${error instanceof Error ? error.message : String(error)}`);
  }
}