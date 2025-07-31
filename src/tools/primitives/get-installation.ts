import { z } from 'zod';
import { http } from '../../utils/http.js';
import { logInfo } from '../../utils/logger.js';

export const schema = z.object({
  componentName: z.string().optional()
});

export interface GetPrimitivesInstallationParams {
  componentName?: string;
}

export async function handleGetPrimitivesInstallation(params: GetPrimitivesInstallationParams) {
  try {
    const { componentName } = params;
    logInfo(`Generating Radix Primitives installation guide${componentName ? ` for ${componentName}` : ''}`);
    
    const installationGuide = await http.getInstallationGuide('primitives', componentName);
    
    const result = componentName ? {
      library: 'primitives',
      componentName,
      packageName: `@radix-ui/react-${componentName}`,
      installation: {
        npm: `npm install @radix-ui/react-${componentName}`,
        yarn: `yarn add @radix-ui/react-${componentName}`,
        pnpm: `pnpm add @radix-ui/react-${componentName}`
      },
      setup: `
# Step 1: Install the specific primitive
npm install @radix-ui/react-${componentName}

# Step 2: Import with namespace
import * as ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} from '@radix-ui/react-${componentName}';

# Step 3: Use the compound components
<${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Root>
  <${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Trigger>
    Open ${componentName}
  </${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Trigger>
  <${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Content>
    Content goes here
  </${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Content>
</${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Root>

# Step 4: Add your own styling (CSS, Styled Components, Tailwind, etc.)
      `.trim(),
      styling_examples: `
# CSS Modules Example
.${componentName}Trigger {
  all: unset;
  font-family: inherit;
  border-radius: 4px;
  height: 35px;
  padding: 0 15px;
  background-color: white;
  color: #11181c;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

.${componentName}Content {
  background-color: white;
  border-radius: 6px;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35);
  padding: 20px;
  width: 260px;
}

# Tailwind CSS Example
<${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Trigger className="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50">
  Open ${componentName}
</${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Trigger>

<${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Content className="bg-white rounded-lg shadow-lg p-6 w-64">
  Your content here
</${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Content>
      `.trim()
    } : {
      library: 'primitives',
      overview: 'Radix Primitives are low-level UI primitives with a focus on accessibility, customization and developer experience.',
      philosophy: `
Radix Primitives provide the behavior and accessibility foundation for your design system:

• Unstyled: No default styling, complete control over appearance
• Accessible: WCAG compliant with comprehensive ARIA support  
• Composable: Compound component architecture for flexibility
• Customizable: Extensive props and controlled/uncontrolled modes
• Developer Experience: TypeScript support and great documentation
      `.trim(),
      installation: {
        individual: {
          description: 'Install specific primitives (recommended)',
          examples: [
            'npm install @radix-ui/react-dialog',
            'npm install @radix-ui/react-dropdown-menu', 
            'npm install @radix-ui/react-tooltip'
          ]
        },
        all: {
          description: 'Install all primitives (not recommended for production)',
          command: 'npm install @radix-ui/react',
          note: 'This installs all primitives. Use individual packages for better tree-shaking.'
        }
      },
      usage_patterns: `
# 1. Import with namespace (recommended)
import * as Dialog from '@radix-ui/react-dialog';

# 2. Use compound components
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

# 3. Apply your own styling
<Dialog.Trigger className="your-trigger-styles">
  <Dialog.Content className="your-content-styles">
      `.trim(),
      styling_approaches: `
# CSS-in-JS (Styled Components, Emotion)
const StyledTrigger = styled(Dialog.Trigger)\`
  padding: 8px 16px;
  border-radius: 4px;
  background: var(--colors-blue-500);
\`;

# CSS Modules
<Dialog.Trigger className={styles.dialogTrigger}>

# Tailwind CSS  
<Dialog.Trigger className="px-4 py-2 bg-blue-500 rounded">

# Vanilla CSS with data attributes
[data-state="open"] {
  background-color: var(--colors-blue-600);
}
      `.trim(),
      popular_primitives: [
        { name: 'dialog', description: 'Modal dialogs and overlays', package: '@radix-ui/react-dialog' },
        { name: 'dropdown-menu', description: 'Dropdown menus and context menus', package: '@radix-ui/react-dropdown-menu' },
        { name: 'tooltip', description: 'Contextual tooltips', package: '@radix-ui/react-tooltip' },
        { name: 'select', description: 'Custom select components', package: '@radix-ui/react-select' },
        { name: 'accordion', description: 'Collapsible content sections', package: '@radix-ui/react-accordion' },
        { name: 'tabs', description: 'Tab interfaces', package: '@radix-ui/react-tabs' }
      ]
    };

    logInfo(`Successfully generated Radix Primitives installation guide${componentName ? ` for ${componentName}` : ''}`);

    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    throw new Error(`Failed to generate Radix Primitives installation guide: ${error instanceof Error ? error.message : String(error)}`);
  }
}