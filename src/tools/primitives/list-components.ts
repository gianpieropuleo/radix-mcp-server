import { z } from 'zod';
import { http } from '../../utils/http.js';
import { logError, logInfo } from '../../utils/logger.js';

export const schema = z.object({});

export interface ListPrimitivesComponentsParams {}

export async function handleListPrimitivesComponents(params: ListPrimitivesComponentsParams) {
  try {
    logInfo('Fetching Radix Primitives components...');
    
    const components = await http.getAvailableComponents('primitives');
    
    const result = {
      library: 'primitives',
      total: components.length,
      components: components.map(name => ({
        name,
        packageName: `@radix-ui/react-${name}`,
        type: 'unstyled',
        description: `${name.charAt(0).toUpperCase() + name.slice(1)} - An unstyled, accessible UI primitive`,
        installation: `npm install @radix-ui/react-${name}`,
        import: `import * as ${name.charAt(0).toUpperCase() + name.slice(1)} from '@radix-ui/react-${name}';`
      })),
      categories: {
        'Form Controls': ['checkbox', 'radio-group', 'select', 'slider', 'switch', 'toggle', 'toggle-group'],
        'Navigation': ['menubar', 'navigation-menu', 'tabs', 'toolbar'],
        'Overlays': ['alert-dialog', 'context-menu', 'dialog', 'dropdown-menu', 'hover-card', 'popover', 'tooltip'],
        'Layout': ['accordion', 'aspect-ratio', 'collapsible', 'scroll-area', 'separator'],
        'Feedback': ['progress', 'toast'],
        'Data Display': ['avatar', 'label']
      },
      usage: `
Radix Primitives are unstyled, accessible components that you can customize:

1. Install individual primitives: npm install @radix-ui/react-dialog
2. Import with namespace: import * as Dialog from '@radix-ui/react-dialog';
3. Compose with sub-components: <Dialog.Root><Dialog.Trigger /></Dialog.Root>
4. Style with CSS or CSS-in-JS

Each primitive follows the compound component pattern for maximum flexibility.
      `.trim(),
      composition: `
Most primitives follow this pattern:

• Root: Manages state and provides context
• Trigger: Opens/activates the component  
• Content: The main content area
• Portal: Renders content in a different DOM location
• Overlay: Background overlay for modals
• Close: Closes the component

Example structure:
<Dialog.Root>
  <Dialog.Trigger />
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>
      <Dialog.Title />
      <Dialog.Description />
      <Dialog.Close />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
      `.trim()
    };

    logInfo(`Successfully fetched ${components.length} Radix Primitives components`);

    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    logError('Error fetching Radix Primitives components', error);
    throw new Error(`Failed to fetch Radix Primitives components: ${error instanceof Error ? error.message : String(error)}`);
  }
}