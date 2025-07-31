/**
 * Resource templates implementation for the Model Context Protocol (MCP) server.
 * 
 * This file defines resource templates that can be used to dynamically generate
 * resources based on parameters in the URI.
 */

/**
 * Resource template definitions exported to the MCP handler
 * Each template has a name, description, uriTemplate and contentType
 */
export const resourceTemplates = [
  {
    name: 'get_install_script_for_component',
    description: 'Generate installation script for a specific Radix UI component based on package manager',
    uriTemplate: 'resource-template:get_install_script_for_component?packageManager={packageManager}&library={library}&component={component}',
    contentType: 'text/plain',
  },
  {
    name: 'get_installation_guide',
    description: 'Get the installation guide for Radix UI libraries based on library and package manager',
    uriTemplate: 'resource-template:get_installation_guide?library={library}&packageManager={packageManager}',
    contentType: 'text/plain',
  },
];

// Create a map for easier access in getResourceTemplate
const resourceTemplateMap = {
  'get_install_script_for_component': resourceTemplates[0],
  'get_installation_guide': resourceTemplates[1],
};

/**
 * Extract parameters from URI
 * @param uri URI to extract from
 * @param paramName Name of parameter to extract
 * @returns Parameter value or undefined
 */
function extractParam(uri: string, paramName: string): string | undefined {
  const match = uri.match(new RegExp(`${paramName}=([^&]+)`));
  return match?.[1];
}

/**
 * Gets a resource template handler for a given URI
 * @param uri The URI of the resource template
 * @returns A function that generates the resource
 */
export const getResourceTemplate = (uri: string) => {
  // Component installation script template
  if (uri.startsWith('resource-template:get_install_script_for_component')) {
    return async () => {
      try {
        const packageManager = extractParam(uri, 'packageManager');
        const library = extractParam(uri, 'library');
        const component = extractParam(uri, 'component');
        
        if (!packageManager) {
          return { 
            content: 'Missing packageManager parameter. Please specify npm, pnpm, or yarn.', 
            contentType: 'text/plain' 
          };
        }
        
        if (!library) {
          return { 
            content: 'Missing library parameter. Please specify themes, primitives, or colors.', 
            contentType: 'text/plain' 
          };
        }
        
        if (!component) {
          return { 
            content: 'Missing component parameter. Please specify the component name.', 
            contentType: 'text/plain' 
          };
        }
        
        // Generate installation script based on Radix library
        let installCommand: string;
        let packageName: string;
        
        switch (library.toLowerCase()) {
          case 'themes':
            packageName = '@radix-ui/themes';
            break;
          case 'primitives':
            packageName = `@radix-ui/react-${component}`;
            break;
          case 'colors':
            packageName = '@radix-ui/colors';
            break;
          default:
            return {
              content: 'Invalid library. Please specify themes, primitives, or colors.',
              contentType: 'text/plain'
            };
        }
        
        switch (packageManager.toLowerCase()) {
          case 'npm':
            installCommand = `npm install ${packageName}`;
            break;
          case 'pnpm':
            installCommand = `pnpm add ${packageName}`;
            break;
          case 'yarn':
            installCommand = `yarn add ${packageName}`;
            break;
          case 'bun':
            installCommand = `bun add ${packageName}`;
            break;
          default:
            installCommand = `npm install ${packageName}`;
        }
        
        return {
          content: installCommand,
          contentType: 'text/plain',
        };
      } catch (error) {
        return {
          content: `Error generating installation script: ${error instanceof Error ? error.message : String(error)}`,
          contentType: 'text/plain',
        };
      }
    };
  }
  
  // Installation guide template
  if (uri.startsWith('resource-template:get_installation_guide')) {
    return async () => {
      try {
        const library = extractParam(uri, 'library');
        const packageManager = extractParam(uri, 'packageManager');
        
        if (!library) {
          return { 
            content: 'Missing library parameter. Please specify themes, primitives, or colors.', 
            contentType: 'text/plain' 
          };
        }
        
        if (!packageManager) {
          return { 
            content: 'Missing packageManager parameter. Please specify npm, pnpm, or yarn.', 
            contentType: 'text/plain' 
          };
        }
        
        // Generate installation guide based on Radix library
        const guides = {
          themes: {
            description: `Installation guide for Radix Themes with ${packageManager}`,
            steps: [
              "Install Radix Themes:",
              packageManager === 'npm' ? 'npm install @radix-ui/themes' : 
              packageManager === 'pnpm' ? 'pnpm add @radix-ui/themes' :
              packageManager === 'yarn' ? 'yarn add @radix-ui/themes' :
              packageManager === 'bun' ? 'bun add @radix-ui/themes' : 'npm install @radix-ui/themes',
              "",
              "Import and set up the Theme component in your app root:",
              "import { Theme } from '@radix-ui/themes';",
              "import '@radix-ui/themes/styles.css';",
              "",
              "function App() {",
              "  return (",
              "    <Theme>",
              "      <MyApp />",
              "    </Theme>",
              "  );",
              "}",
              "",
              "Start using Radix Themes components:",
              "import { Button, Flex, Text } from '@radix-ui/themes';",
              "",
              "function MyComponent() {",
              "  return (",
              "    <Flex direction='column' gap='2'>",
              "      <Text>Hello from Radix Themes!</Text>",
              "      <Button>Click me</Button>",
              "    </Flex>",
              "  );",
              "}"
            ]
          },
          primitives: {
            description: `Installation guide for Radix Primitives with ${packageManager}`,
            steps: [
              "Install the specific Radix Primitive you need:",
              "(Example with Dialog primitive)",
              packageManager === 'npm' ? 'npm install @radix-ui/react-dialog' : 
              packageManager === 'pnpm' ? 'pnpm add @radix-ui/react-dialog' :
              packageManager === 'yarn' ? 'yarn add @radix-ui/react-dialog' :
              packageManager === 'bun' ? 'bun add @radix-ui/react-dialog' : 'npm install @radix-ui/react-dialog',
              "",
              "Import and use the primitive components:",
              "import * as Dialog from '@radix-ui/react-dialog';",
              "",
              "function MyDialog() {",
              "  return (",
              "    <Dialog.Root>",
              "      <Dialog.Trigger asChild>",
              "        <button>Open Dialog</button>",
              "      </Dialog.Trigger>",
              "      <Dialog.Portal>",
              "        <Dialog.Overlay />",
              "        <Dialog.Content>",
              "          <Dialog.Title>Dialog Title</Dialog.Title>",
              "          <Dialog.Description>Dialog content goes here.</Dialog.Description>",
              "          <Dialog.Close asChild>",
              "            <button>Close</button>",
              "          </Dialog.Close>",
              "        </Dialog.Content>",
              "      </Dialog.Portal>",
              "    </Dialog.Root>",
              "  );",
              "}",
              "",
              "Each primitive is a separate package. Install only what you need:",
              "- @radix-ui/react-accordion",
              "- @radix-ui/react-alert-dialog",
              "- @radix-ui/react-avatar",
              "- @radix-ui/react-checkbox",
              "- @radix-ui/react-dropdown-menu",
              "- And many more..."
            ]
          },
          colors: {
            description: `Installation guide for Radix Colors with ${packageManager}`,
            steps: [
              "Install Radix Colors:",
              packageManager === 'npm' ? 'npm install @radix-ui/colors' : 
              packageManager === 'pnpm' ? 'pnpm add @radix-ui/colors' :
              packageManager === 'yarn' ? 'yarn add @radix-ui/colors' :
              packageManager === 'bun' ? 'bun add @radix-ui/colors' : 'npm install @radix-ui/colors',
              "",
              "Import the color scales you need:",
              "import { blue, blueDark, gray, grayDark } from '@radix-ui/colors';",
              "",
              "Use in CSS-in-JS:",
              "const styles = {",
              "  backgroundColor: blue.blue3,",
              "  color: blue.blue11,",
              "  border: `1px solid ${blue.blue6}`",
              "};",
              "",
              "Or create CSS custom properties:",
              ":root {",
              "  --blue-1: ${blue.blue1};",
              "  --blue-2: ${blue.blue2};",
              "  /* ... for all 12 steps */",
              "}",
              "",
              "[data-theme='dark'] {",
              "  --blue-1: ${blueDark.blue1};",
              "  --blue-2: ${blueDark.blue2};",
              "  /* ... for all 12 steps */",
              "}",
              "",
              "Available color scales:",
              "- Gray: gray, mauve, slate, sage, olive, sand",
              "- Colors: blue, red, green, yellow, orange, purple",
              "- Extended: tomato, crimson, pink, plum, violet, iris, etc.",
              "- Each with corresponding dark variants"
            ]
          }
        };
        
        // Select appropriate guide based on library
        const guide = guides[library.toLowerCase() as keyof typeof guides];
        
        if (!guide) {
          return {
            content: 'Invalid library. Please specify themes, primitives, or colors.',
            contentType: 'text/plain'
          };
        }
        
        return {
          content: `# ${guide.description}\n\n${guide.steps.join('\n')}`,
          contentType: 'text/plain',
        };
      } catch (error) {
        return {
          content: `Error generating installation guide: ${error instanceof Error ? error.message : String(error)}`,
          contentType: 'text/plain',
        };
      }
    };
  }
  
  return undefined;
};