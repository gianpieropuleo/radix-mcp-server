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

- **Commander.js Integration**: Professional CLI with structured command parsing
- **Library Selection**: Support for `themes|primitives|colors|all` modes
- **GitHub API Configuration**: Optional token for higher rate limits
- **Environment Variables**: Support for `RADIX_LIBRARY` and `GITHUB_PERSONAL_ACCESS_TOKEN`
- **Modular CLI Structure**: Commands and help text in `src/cli/` directory

#### Core Architecture (`src/core/`)

- **Configuration Management** (`config.ts`): Centralized library configurations and repository paths
- **Operations Factory** (`operations.ts`): Unified operations pattern for all libraries
- **Registry Pattern** (`registry.ts`): Cached operations with memoization
- **Dynamic Tool Generation**: Configuration-driven tool creation from unified actions

#### GitHub API Integration (`src/utils/http.ts`)

- **Multi-Repository Support**: Connects to `radix-ui/themes`, `radix-ui/primitives`, `radix-ui/colors`
- **Repository-Specific Clients**: Separate ky instances for each repository
- **Path Constants**: Predefined paths for components, docs, and examples
- **Fallback Component Lists**: Hardcoded lists for offline/rate-limited scenarios
- **Rate Limit Handling**: p-limit concurrency control with respectful API usage

### Tool Generation System

#### Dynamic Tool Creation (`src/mcp/tools.ts`)

- **Configuration-Driven**: Tools generated from Action enum and Library configuration
- **Unified Pattern**: All libraries share the same action types
- **Type-Safe**: Full TypeScript support with Zod validation

#### Available Actions (`src/types/actions.ts`)

- **`list_components`**: Lists all available components for any library
- **`get_component_source`**: Fetches component source code for any library
- **`get_component_documentation`**: Gets documentation for any library component
- **`get_getting_started`**: Returns official getting started guide for any library

#### Tool Names Pattern

- Format: `{library}_{action}` (e.g., `themes_list_components`, `primitives_get_component_source`)
- Dynamically registered based on selected library mode
- Consistent interface across all libraries

### MCP Integration (`src/mcp/`)

#### Server (`server.ts`)

- **MCP Protocol Implementation**: Full Model Context Protocol support
- **Dynamic Tool Registration**: Tools registered based on library selection
- **Modular Architecture**: Clean separation of concerns

#### Handler (`handler.ts`)

- **Request Processing**: Unified handler for all tool requests
- **Library Routing**: Routes requests to appropriate library operations
- **Error Handling**: Comprehensive error handling with graceful failure modes

#### Adapter (`adapter.ts`)

- **Result Transformation**: Converts internal results to MCP-compatible formats
- **Response Formatting**: Consistent response structure across all tools

#### Validation and Security

- Input parameter validation using Zod schemas
- Rate limit protection using p-limit for respectful API usage
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

- **Color Tokens**: `src` (TypeScript scale definitions)
- **Documentation**: `apps/docs/content/colors` (via radix-ui/website)

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
- **commander**: ^12.2.0 - Professional CLI framework for command parsing
- **ky**: ^1.7.2 - Lightweight HTTP client for GitHub API integration
- **p-memoize**: ^7.1.1 - Function memoization for intelligent caching
- **p-limit**: ^6.2.0 - Concurrency control for respectful rate limiting
- **expiry-map**: ^2.0.0 - TTL cache support for memoization
- **zod**: ^3.24.2 - Runtime type validation
- **pino**: ^9.5.0 - Fast, structured logging

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

### Rate Limiting Strategy

- p-limit concurrency control prevents overwhelming GitHub API
- Intelligent function memoization with 24-hour TTL reduces API calls
- Fallback to cached/hardcoded data when GitHub API fails

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

- p-memoize function-level caching with 24-hour TTL
- GitHub API responses intelligently cached to respect rate limits
- Automatic cache expiration prevents stale data
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
