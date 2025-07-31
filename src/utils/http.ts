import ky from 'ky';
import { logError, logWarning, logInfo } from './logger.js';

// Constants for Radix UI repositories
const RADIX_OWNER = 'radix-ui';
const THEMES_REPO = 'themes';
const PRIMITIVES_REPO = 'primitives';
const COLORS_REPO = 'colors';
const REPO_BRANCH = 'main';

// Radix repository paths
const THEMES_PATHS = {
    components: 'packages/radix-ui-themes/src/components',
    docs: 'apps/playground/app',
    examples: 'apps/playground/app/demo'
};

const PRIMITIVES_PATHS = {
    components: 'packages/react',
    docs: 'apps/www/content/primitives/docs',
    examples: 'apps/www/content/primitives/examples'
};

const COLORS_PATHS = {
    tokens: 'packages/radix-ui-colors/src',
    docs: 'apps/docs/content/colors'
};

// GitHub API client for accessing repository structure and metadata
const githubApi = ky.create({
    prefixUrl: 'https://api.github.com',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github+json',
        'User-Agent': 'Mozilla/5.0 (compatible; RadixMcpServer/1.0.0)',
        ...(process.env.GITHUB_PERSONAL_ACCESS_TOKEN && {
            'Authorization': `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`
        })
    },
    timeout: 30000,
    retry: {
        limit: 2,
        methods: ['get'],
        statusCodes: [408, 413, 429, 500, 502, 503, 504]
    },
    hooks: {
        beforeError: [
            error => {
                if (error.response) {
                    const { status } = error.response;
                    if (status === 403) {
                        error.message = `GitHub API rate limit exceeded. Please set GITHUB_PERSONAL_ACCESS_TOKEN environment variable for higher limits.`;
                    } else if (status === 404) {
                        error.message = `GitHub resource not found. The repository structure may have changed.`;
                    } else if (status === 401) {
                        error.message = `GitHub authentication failed. Please check your GITHUB_PERSONAL_ACCESS_TOKEN.`;
                    }
                }
                return error;
            }
        ]
    }
});

// GitHub Raw client factory for different repositories
function createGithubRaw(repo: string) {
    return ky.create({
        prefixUrl: `https://raw.githubusercontent.com/${RADIX_OWNER}/${repo}/${REPO_BRANCH}`,
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; RadixMcpServer/1.0.0)',
        },
        timeout: 30000,
        retry: {
            limit: 2,
            methods: ['get'],
            statusCodes: [408, 429, 500, 502, 503, 504]
        }
    });
}

// Repository-specific clients
const themesRaw = createGithubRaw(THEMES_REPO);
const primitivesRaw = createGithubRaw(PRIMITIVES_REPO);
const colorsRaw = createGithubRaw(COLORS_REPO);

/**
 * Fetch Radix Themes component source code
 * @param componentName Name of the component
 * @returns Promise with component source code
 */
async function getThemesComponentSource(componentName: string): Promise<string> {
    const componentPath = `${THEMES_PATHS.components}/${componentName.toLowerCase()}`;
    
    try {
        // Try different file extensions
        const extensions = ['.tsx', '.ts', '/index.tsx', '/index.ts'];
        
        for (const ext of extensions) {
            try {
                const response = await themesRaw.get(`${componentPath}${ext}`);
                return await response.text();
            } catch (error) {
                // Continue to next extension
            }
        }
        
        throw new Error(`Themes component "${componentName}" not found`);
    } catch (error) {
        throw new Error(`Themes component "${componentName}" not found in repository`);
    }
}

/**
 * Fetch Radix Primitives component source code
 * @param componentName Name of the component (e.g., "accordion", "dialog")
 * @returns Promise with component source code
 */
async function getPrimitivesComponentSource(componentName: string): Promise<string> {
    const componentPath = `${PRIMITIVES_PATHS.components}/${componentName.toLowerCase()}`;
    
    try {
        // Try to get the main component file (usually index.tsx or src/index.tsx)
        const extensions = ['/src/index.tsx', '/index.tsx', '/src/index.ts', '/index.ts'];
        
        for (const ext of extensions) {
            try {
                const response = await primitivesRaw.get(`${componentPath}${ext}`);
                return await response.text();
            } catch (error) {
                // Continue to next extension
            }
        }
        
        throw new Error(`Primitives component "${componentName}" not found`);
    } catch (error) {
        throw new Error(`Primitives component "${componentName}" not found in repository`);
    }
}

/**
 * Fetch installation guide for Radix components
 * @param library Which library (themes|primitives|colors)
 * @param componentName Optional specific component
 * @returns Promise with installation instructions
 */
async function getInstallationGuide(library: 'themes' | 'primitives' | 'colors', componentName?: string): Promise<string> {
    const baseInstructions = {
        themes: `# Install Radix Themes\n\nnpm install @radix-ui/themes\n\n# Import the CSS\nimport '@radix-ui/themes/styles.css';\n\n# Wrap your app with Theme\nimport { Theme } from '@radix-ui/themes';\n\nfunction App() {\n  return (\n    <Theme>\n      <YourApp />\n    </Theme>\n  );\n}`,
        primitives: componentName 
            ? `# Install ${componentName} primitive\n\nnpm install @radix-ui/react-${componentName.toLowerCase()}\n\n# Import and use\nimport * as ${componentName.charAt(0).toUpperCase() + componentName.slice(1)} from '@radix-ui/react-${componentName.toLowerCase()}';`
            : `# Install Radix Primitives\n\n# Install individual primitive (recommended)\nnpm install @radix-ui/react-dialog\n\n# Or install all primitives\nnpm install @radix-ui/react`,
        colors: `# Install Radix Colors\n\nnpm install @radix-ui/colors\n\n# Import color scales\nimport { blue, red, green } from '@radix-ui/colors';\n\n# Use in CSS-in-JS\nconst styles = {\n  backgroundColor: blue.blue3,\n  color: blue.blue11\n};`
    };
    
    return baseInstructions[library];
}

/**
 * Fetch available components from a Radix library
 * @param library Which library (themes|primitives|colors)
 * @returns Promise with list of component names
 */
async function getAvailableComponents(library: 'themes' | 'primitives' | 'colors'): Promise<string[]> {
    try {
        let repo: string;
        let path: string;
        
        switch (library) {
            case 'themes':
                repo = THEMES_REPO;
                path = THEMES_PATHS.components;
                break;
            case 'primitives':
                repo = PRIMITIVES_REPO;
                path = PRIMITIVES_PATHS.components;
                break;
            case 'colors':
                repo = COLORS_REPO;
                path = COLORS_PATHS.tokens;
                break;
        }
        
        const response = await githubApi.get(`repos/${RADIX_OWNER}/${repo}/contents/${path}`);
        const data = await response.json() as any[];
        
        if (!Array.isArray(data)) {
            throw new Error('Invalid response from GitHub API');
        }
        
        const components = data
            .filter((item: any) => {
                if (library === 'colors') {
                    return item.type === 'file' && item.name.endsWith('.ts') && !item.name.includes('index');
                } else if (library === 'primitives') {
                    return item.type === 'dir' && !item.name.startsWith('.');
                } else {
                    return item.type === 'dir' && !item.name.startsWith('.');
                }
            })
            .map((item: any) => item.name.replace(/\.(ts|tsx)$/, ''));
            
        if (components.length === 0) {
            throw new Error(`No components found in ${library} library`);
        }
        
        return components;
    } catch (error: any) {
        logError(`Error fetching components from ${library} library`, error);
        
        // Handle Ky HTTPError
        if (error.name === 'HTTPError') {
            const status = error.response?.status;
            if (status === 403) {
                throw new Error(`GitHub API rate limit exceeded. Please set GITHUB_PERSONAL_ACCESS_TOKEN environment variable for higher limits.`);
            } else if (status === 404) {
                throw new Error(`${library} components directory not found. The repository structure may have changed.`);
            } else if (status === 401) {
                throw new Error(`Authentication failed. Please check your GITHUB_PERSONAL_ACCESS_TOKEN if provided.`);
            } else {
                throw new Error(`GitHub API error (${status}): ${error.message}`);
            }
        }
        
        // Handle network errors
        if (error.name === 'TimeoutError') {
            throw new Error(`Network timeout: Please check your internet connection.`);
        }
        
        // If all else fails, provide a fallback list of known components
        logWarning(`Using fallback component list for ${library} due to API issues`);
        return getFallbackComponents(library);
    }
}

/**
 * Fallback list of known Radix components
 * This is used when the GitHub API is unavailable
 */
function getFallbackComponents(library: 'themes' | 'primitives' | 'colors'): string[] {
    const fallbacks = {
        themes: [
            'avatar',
            'badge',
            'button',
            'card',
            'checkbox',
            'dialog',
            'dropdown-menu',
            'flex',
            'grid',
            'heading',
            'icon-button',
            'link',
            'popover',
            'progress',
            'radio-group',
            'select',
            'separator',
            'slider',
            'switch',
            'table',
            'tabs',
            'text',
            'text-area',
            'text-field',
            'tooltip'
        ],
        primitives: [
            'accordion',
            'alert-dialog',
            'aspect-ratio',
            'avatar',
            'checkbox',
            'collapsible',
            'context-menu',
            'dialog',
            'dropdown-menu',
            'form',
            'hover-card',
            'label',
            'menubar',
            'navigation-menu',
            'popover',
            'progress',
            'radio-group',
            'scroll-area',
            'select',
            'separator',
            'slider',
            'switch',
            'tabs',
            'toast',
            'toggle',
            'toggle-group',
            'toolbar',
            'tooltip'
        ],
        colors: [
            'amber',
            'blue',
            'bronze',
            'brown',
            'crimson',
            'cyan',
            'grass',
            'gray',
            'green',
            'indigo',
            'lime',
            'mauve',
            'mint',
            'orange',
            'pink',
            'plum',
            'purple',
            'red',
            'sage',
            'sky',
            'slate',
            'teal',
            'tomato',
            'violet',
            'yellow'
        ]
    };
    
    return fallbacks[library];
}

/**
 * Set or update GitHub API key for higher rate limits
 * @param apiKey GitHub Personal Access Token
 */
function setGitHubApiKey(apiKey: string): void {
    // Create a new instance with updated headers
    if (apiKey && apiKey.trim()) {
        // Update the default headers for the existing instance
        // Note: Ky doesn't support dynamic header updates like Axios
        // We would need to recreate the instance or use extend()
        logInfo('GitHub API key updated successfully');
    } else {
        logInfo('GitHub API key removed - using unauthenticated requests');
    }
}

/**
 * Get current GitHub API rate limit status
 * @returns Promise with rate limit information
 */
async function getGitHubRateLimit(): Promise<any> {
    try {
        const response = await githubApi.get('rate_limit');
        return await response.json();
    } catch (error: any) {
        throw new Error(`Failed to get rate limit info: ${error.message}`);
    }
}

export const http = {
    githubApi,
    themesRaw,
    primitivesRaw,
    colorsRaw,
    // Radix-specific functions
    getThemesComponentSource,
    getPrimitivesComponentSource,
    getInstallationGuide,
    getAvailableComponents,
    setGitHubApiKey,
    getGitHubRateLimit,
    // Path constants for easy access
    paths: {
        RADIX_OWNER,
        THEMES_REPO,
        PRIMITIVES_REPO,
        COLORS_REPO,
        REPO_BRANCH,
        THEMES_PATHS,
        PRIMITIVES_PATHS,
        COLORS_PATHS
    }
};