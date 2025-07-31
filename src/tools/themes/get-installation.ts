import { z } from 'zod';
import { http } from '../../utils/http.js';
import { logInfo } from '../../utils/logger.js';

export const schema = z.object({
  packageManager: z.enum(['npm', 'yarn', 'pnpm']).optional().default('npm')
});

export interface GetThemesInstallationParams {
  packageManager?: 'npm' | 'yarn' | 'pnpm';
}

export async function handleGetThemesInstallation(params: GetThemesInstallationParams) {
  try {
    const { packageManager = 'npm' } = params;
    logInfo(`Generating Radix Themes installation guide for ${packageManager}`);
    
    const installationGuide = await http.getInstallationGuide('themes');
    
    const packageManagerCommands = {
      npm: 'npm install @radix-ui/themes',
      yarn: 'yarn add @radix-ui/themes', 
      pnpm: 'pnpm add @radix-ui/themes'
    };

    const result = {
      library: 'themes',
      packageManager,
      installation: {
        command: packageManagerCommands[packageManager],
        package: '@radix-ui/themes',
        version: 'latest'
      },
      setup: `
# Step 1: Install Radix Themes
${packageManagerCommands[packageManager]}

# Step 2: Import the CSS file in your root component (e.g., App.tsx or _app.tsx)
import '@radix-ui/themes/styles.css';

# Step 3: Wrap your application with the Theme component
import { Theme } from '@radix-ui/themes';

function App() {
  return (
    <Theme>
      <YourAppContent />
    </Theme>
  );
}

# Step 4: Start using components
import { Button, Flex, Text } from '@radix-ui/themes';

function MyComponent() {
  return (
    <Flex direction="column" gap="3">
      <Text>Hello from Radix Themes!</Text>
      <Button>Click me</Button>
    </Flex>
  );
}
      `.trim(),
      theming: `
# Theming Configuration

## Basic Theme Setup
<Theme accentColor="blue" grayColor="gray" radius="medium" scaling="100%">
  <App />
</Theme>

## Dark Mode
<Theme appearance="dark">
  <App />
</Theme>

## Custom Theme
<Theme 
  accentColor="crimson" 
  grayColor="mauve" 
  radius="large" 
  scaling="110%"
  panelBackground="solid"
>
  <App />
</Theme>

## Available Props:
- accentColor: Primary brand color
- grayColor: Neutral color for backgrounds and borders  
- radius: Border radius scale
- scaling: Overall size scaling
- appearance: "light" | "dark" | "inherit"
- panelBackground: "solid" | "translucent"
      `.trim(),
      examples: `
# Component Examples

## Button
import { Button } from '@radix-ui/themes';
<Button variant="soft" color="blue" size="3">Click me</Button>

## Card
import { Card, Flex, Avatar, Box, Text } from '@radix-ui/themes';
<Card>
  <Flex gap="3" align="center">
    <Avatar size="3" src="avatar.jpg" fallback="T" />
    <Box>
      <Text as="div" size="2" weight="bold">Teodros Girmay</Text>
      <Text as="div" size="2" color="gray">Engineering</Text>
    </Box>
  </Flex>
</Card>

## Form
import { TextField, Button, Flex } from '@radix-ui/themes';
<Flex direction="column" gap="3">
  <TextField.Root>
    <TextField.Input placeholder="Enter your email" />
  </TextField.Root>
  <Button>Submit</Button>
</Flex>
      `.trim(),
      documentation: 'https://www.radix-ui.com/themes/docs',
      repository: 'https://github.com/radix-ui/themes'
    };

    logInfo(`Successfully generated Radix Themes installation guide for ${packageManager}`);

    return {
      content: [{
        type: "text",
        text: JSON.stringify(result, null, 2)
      }]
    };
  } catch (error) {
    throw new Error(`Failed to generate Radix Themes installation guide: ${error instanceof Error ? error.message : String(error)}`);
  }
}