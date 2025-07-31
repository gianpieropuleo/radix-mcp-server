# Radix UI MCP Server

A Model Context Protocol (MCP) server for Radix UI libraries, providing AI assistants with access to component source code, installation guides, and design tokens from the Radix ecosystem.

## Overview

This MCP server provides comprehensive access to three major Radix UI libraries:
- **Radix Themes**: Pre-styled, themeable components
- **Radix Primitives**: Unstyled, accessible UI primitives  
- **Radix Colors**: Comprehensive color system with semantic scales

## Commands

### Development
```bash
npm run dev              # Build and start server
npm run build           # Build TypeScript to JavaScript
npm run clean           # Remove build directory
```

### Testing
```bash
npm test                # Run test suite
```

### CLI Usage
```bash
# Default (all libraries)
npx radix-mcp-server

# Specific library
npx radix-mcp-server --library themes
npx radix-mcp-server --library primitives  
npx radix-mcp-server --library colors

# With GitHub API token
npx radix-mcp-server --github-api-key ghp_your_token_here

# Short flags
npx radix-mcp-server -l themes -g ghp_your_token_here
```

## Architecture

### Core Components

#### CLI Interface (`src/index.ts`)
- **Library Selection**: Support for `themes|primitives|colors|all` modes
- **GitHub API Configuration**: Optional token for higher rate limits
- **Dynamic Tool Registration**: Tools registered based on library selection
- **Environment Variables**: Support for `RADIX_LIBRARY` and `GITHUB_PERSONAL_ACCESS_TOKEN`

#### GitHub API Integration (`src/utils/axios.ts`)
- **Multi-Repository Support**: Connects to `radix-ui/themes`, `radix-ui/primitives`, `radix-ui/colors`
- **Repository-Specific Clients**: Separate axios instances for each repository
- **Path Constants**: Predefined paths for components, docs, and examples
- **Fallback Component Lists**: Hardcoded lists for offline/rate-limited scenarios
- **Rate Limit Handling**: Comprehensive error handling and rate limit detection

### Tool Categories

#### Themes Tools (`src/tools/themes/`)
- **`themes/list_components`**: Lists all available Radix Themes components with styling information
- **`themes/get_component`**: Fetches component source code with theming examples and CSS custom properties
- **`themes/get_installation`**: Complete setup guide including Theme provider configuration

#### Primitives Tools (`src/tools/primitives/`)
- **`primitives/list_components`**: Lists all Radix Primitives with composition patterns and accessibility info
- **`primitives/get_component`**: Fetches component source with styling approaches (CSS, CSS-in-JS, Tailwind)
- **`primitives/get_installation`**: Setup guide with component-specific or general installation instructions

#### Colors Tools (`src/tools/colors/`)
- **`colors/list_scales`**: Lists all color scales with semantic usage guidelines
- **`colors/get_scale`**: Detailed color scale information with step-by-step usage and accessibility considerations
- **`colors/get_installation`**: Complete setup including CSS variables, framework integration, and design token patterns

### Request Handling (`src/handler.ts`)

#### Dynamic Tool Registration
- Tools are registered dynamically based on library selection
- Clean separation between tool categories
- Comprehensive error handling with circuit breaker patterns

#### Validation and Security
- Input parameter validation using Zod schemas
- Rate limit protection and graceful degradation
- Sanitized error messages

## Repository Structure

### Radix Themes Repository
- **Components**: `packages/radix-ui-themes/src/components`
- **Documentation**: `apps/playground/app`
- **Examples**: `apps/playground/app/demo`

### Radix Primitives Repository  
- **Components**: `packages/react` (individual primitive packages)
- **Documentation**: `apps/www/content/primitives/docs`
- **Examples**: `apps/www/content/primitives/examples`

### Radix Colors Repository
- **Color Tokens**: `packages/radix-ui-colors/src`
- **Documentation**: `apps/docs/content/colors`

## Framework Support

This server is framework-agnostic and provides information for:
- **React**: Primary target framework for all Radix libraries
- **Next.js**: Specific setup instructions and SSR considerations
- **Vite**: Build tool configuration examples
- **Styling Solutions**: CSS Modules, Styled Components, Tailwind CSS, Vanilla CSS

## Tool Responses

All tools return comprehensive JSON responses including:
- **Installation Instructions**: Package manager specific commands
- **Usage Examples**: Multiple implementation approaches
- **Styling Guidance**: Framework-specific styling patterns
- **Accessibility Information**: WCAG compliance details
- **Theming Support**: Color scales, CSS custom properties, dark mode

## Dependencies

- **@modelcontextprotocol/sdk**: ^1.16.0 - MCP protocol implementation
- **axios**: ^1.8.4 - HTTP client for GitHub API integration
- **zod**: ^3.24.2 - Runtime type validation
- **winston**: ^3.15.0 - Structured logging
- **cheerio**: ^1.0.0 - HTML parsing utilities

## Configuration

### Environment Variables
- `RADIX_LIBRARY`: Default library selection (`themes|primitives|colors|all`)
- `GITHUB_PERSONAL_ACCESS_TOKEN`: GitHub API token for higher rate limits
- `LOG_LEVEL`: Logging level (`debug|info|warn|error`)

### GitHub API Integration
- **Unauthenticated**: 60 requests/hour rate limit
- **Authenticated**: 5000 requests/hour rate limit  
- **Fallback Support**: Hardcoded component lists when API unavailable
- **Error Handling**: Graceful degradation with meaningful error messages

## Error Handling

### Circuit Breaker Pattern
- Automatic failure detection for external API calls
- Fallback to cached/hardcoded data when GitHub API fails
- Exponential backoff for rate limit recovery

### Comprehensive Error Messages
- Specific error types for different failure scenarios
- User-friendly suggestions for common issues
- Rate limit guidance and token setup instructions

## Performance Considerations

### Tree Shaking
- Individual component imports minimize bundle size
- Library-specific tool registration reduces memory usage
- On-demand fetching of component source code

### Caching Strategy
- Component lists cached during server lifetime
- GitHub API responses cached to respect rate limits
- Fallback data provides offline capability

## Multi-Library Architecture

The server architecture is designed to handle the complexity of the Radix ecosystem:

1. **Unified CLI**: Single entry point with library selection
2. **Modular Tools**: Library-specific tool categories
3. **Shared Infrastructure**: Common GitHub API handling and error management
4. **Flexible Deployment**: Support for focused or comprehensive library access

## Usage Patterns

### Theme Development
```bash
radix-mcp-server --library themes
# Access to styled components, theming system, CSS custom properties
```

### Custom Component Development  
```bash
radix-mcp-server --library primitives
# Access to unstyled primitives, composition patterns, accessibility features
```

### Design System Creation
```bash  
radix-mcp-server --library colors
# Access to color scales, design tokens, semantic color usage
```

### Full Ecosystem Access
```bash
radix-mcp-server --library all
# Complete access to themes, primitives, and colors
```

This comprehensive MCP server enables AI assistants to provide expert guidance on the entire Radix UI ecosystem, from basic component usage to advanced theming and design system creation.
