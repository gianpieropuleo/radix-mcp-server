import { z } from 'zod';
import { http } from '../../utils/http.js';
import { logError, logInfo } from '../../utils/logger.js';

export const schema = z.object({
  componentName: z.string().min(1, "Component name is required")
});

export interface GetPrimitivesComponentParams {
  componentName: string;
}

export async function handleGetPrimitivesComponent(params: GetPrimitivesComponentParams) {
  try {
    const { componentName } = params;
    logInfo(`Fetching Radix Primitives component: ${componentName}`);
    
    const sourceCode = await http.getPrimitivesComponentSource(componentName);
    
    const result = {
      library: 'primitives',
      componentName,
      packageName: `@radix-ui/react-${componentName}`,
      type: 'unstyled',
      source: sourceCode,
      installation: {
        npm: `npm install @radix-ui/react-${componentName}`,
        yarn: `yarn add @radix-ui/react-${componentName}`,
        pnpm: `pnpm add @radix-ui/react-${componentName}`
      },
      usage: `
// Import the primitive
import * as ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} from '@radix-ui/react-${componentName}';

// Basic usage pattern (components vary)
<${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Root>
  <${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Trigger />
  <${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Content>
    {/* Your styled content */}
  </${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Content>
</${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Root>
      `.trim(),
      styling: `
Radix Primitives are completely unstyled - style them however you prefer:

## With CSS Modules
.trigger {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

.content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

## With Styled Components
const StyledTrigger = styled(${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Trigger)\`
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
\`;

## With Tailwind CSS
<${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Trigger className="px-4 py-2 border border-gray-300 rounded bg-white">
  Open
</${componentName.charAt(0).toUpperCase() + componentName.slice(1)}.Trigger>
      `.trim(),
      accessibility: `
Radix Primitives include comprehensive accessibility features:

• ARIA attributes and roles
• Keyboard navigation
• Focus management  
• Screen reader support
• High contrast mode support

All accessibility features work out of the box with no additional configuration.
      `.trim(),
      composition: `
Most Radix Primitives follow the compound component pattern:

• Root: Provides context and manages state
• Trigger: Interactive element that controls the primitive
• Content: Main content area
• Portal: Renders content outside normal DOM flow
• Overlay: Background overlay for modal components
• Close: Element that closes/dismisses the primitive

Each sub-component accepts all standard HTML props plus primitive-specific props.
      `.trim()
    };

    logInfo(`Successfully fetched Radix Primitives component: ${componentName}`);

    return {
      content: [{
        type: "text", 
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    logError(`Error fetching Radix Primitives component: ${params.componentName}`, error);
    throw new Error(`Failed to fetch Radix Primitives component "${params.componentName}": ${error instanceof Error ? error.message : String(error)}`);
  }
}