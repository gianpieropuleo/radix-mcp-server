# Radix UI MCP Server

[![npm version](https://badge.fury.io/js/@gianpieropuleo%2Fradix-mcp-server.svg)](https://badge.fury.io/js/@gianpieropuleo%2Fradix-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight Model Context Protocol (MCP) server that provides AI assistants with comprehensive access to [Radix UI](https://www.radix-ui.com/) libraries including Themes, Primitives, and Colors. This server enables AI tools like Claude Desktop, Continue.dev, VS Code, Cursor, and other MCP-compatible clients to retrieve and work with Radix UI components seamlessly.

> **Built upon the excellent foundation of [shadcn-ui-mcp-server](https://github.com/Jpisnice/shadcn-ui-mcp-server) by [@Jpisnice](https://github.com/Jpisnice).** This project adapts that work to focus specifically on the Radix UI ecosystem while maintaining the same powerful MCP integration capabilities.

## 🚀 Key Features

- **Radix Themes**: Access high-level styled components with built-in design system
- **Radix Primitives**: Get unstyled, accessible component implementations
- **Radix Colors**: Retrieve semantic color scales with light/dark mode support
- **Component Source Code**: Get the latest Radix UI component TypeScript source
- **Installation Guides**: Dynamic installation instructions for all package managers
- **GitHub API Integration**: Efficient caching and intelligent rate limit handling
- **Lightweight**: Built with Ky HTTP client for minimal bundle size

## 📦 Quick Start

### ⚡ Using npx (Recommended)

The fastest way to get started - no installation required!

```bash
# Basic usage (rate limited to 60 requests/hour)
npx @gianpieropuleo/radix-mcp-server

# With GitHub token for better rate limits (5000 requests/hour)
npx @gianpieropuleo/radix-mcp-server --github-api-key ghp_your_token_here

# Short form
npx @gianpieropuleo/radix-mcp-server -g ghp_your_token_here

# Using environment variable
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here
npx @gianpieropuleo/radix-mcp-server

# Select specific library
npx @gianpieropuleo/radix-mcp-server --library themes
npx @gianpieropuleo/radix-mcp-server --library primitives
npx @gianpieropuleo/radix-mcp-server --library colors

# All libraries (default)
npx @gianpieropuleo/radix-mcp-server --library all

# Using environment variable for library
export RADIX_LIBRARY=themes
npx @gianpieropuleo/radix-mcp-server
```

**🎯 Try it now**: Run `npx @gianpieropuleo/radix-mcp-server --help` to see all options!

### 🔧 Command Line Options

```bash
radix-mcp-server [options]

Options:
  --library, -l <library>         Radix library: 'themes', 'primitives', 'colors', or 'all' (default: all)
  --github-api-key, -g <token>    GitHub Personal Access Token for API access
  --help, -h                      Show this help message
  --version, -v                   Show version information

Environment Variables:
  GITHUB_PERSONAL_ACCESS_TOKEN    Alternative way to provide GitHub token
  RADIX_LIBRARY                   Library to use: 'themes', 'primitives', 'colors', or 'all' (default: all)
  LOG_LEVEL                       Log level (debug, info, warn, error) - default: info

Examples:
  npx @gianpieropuleo/radix-mcp-server
  npx @gianpieropuleo/radix-mcp-server --library themes
  npx @gianpieropuleo/radix-mcp-server --library primitives --github-api-key ghp_your_token_here
  npx @gianpieropuleo/radix-mcp-server -l colors -g ghp_your_token_here
  npx @gianpieropuleo/radix-mcp-server -l all
```

## 🎨 Radix UI Libraries

### 🎭 Radix Themes

High-level React components with a built-in design system. Perfect for rapid application development.

```typescript
// Example: Get Button component from Themes
{
  "tool": "themes_get_component",
  "arguments": { "componentName": "button" }
}
```

### 🧩 Radix Primitives

Low-level, unstyled, accessible React components. Maximum flexibility for custom designs.

```typescript
// Example: Get Dialog primitive
{
  "tool": "primitives_get_component",
  "arguments": { "componentName": "dialog" }
}
```

### 🌈 Radix Colors

Beautiful, accessible color scales with semantic meanings and dark mode support.

```typescript
// Example: List all color scales
{
  "tool": "colors_list_scales",
  "arguments": {}
}
```

## 🔑 GitHub API Token Setup

**Why do you need a token?**

- Without token: Limited to 60 API requests per hour
- With token: Up to 5,000 requests per hour
- Better reliability and faster responses

### 📝 Getting Your Token (2 minutes)

1. **Go to GitHub Settings**:

   - Visit [GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)](https://github.com/settings/tokens)
   - Or: GitHub Profile → Settings → Developer settings → Personal access tokens

2. **Generate New Token**:

   - Click "Generate new token (classic)"
   - Add a note: "Radix UI MCP server"
   - **Expiration**: Choose your preference (90 days recommended)
   - **Scopes**: ✅ **No scopes needed!** (public repository access is sufficient)

3. **Copy Your Token**:
   - Copy the generated token (starts with `ghp_`)
   - ⚠️ **Save it securely** - you won't see it again!

### 🚀 Using Your Token

**Method 1: Command Line (Quick testing)**

```bash
npx @gianpieropuleo/radix-mcp-server --github-api-key ghp_your_token_here
```

**Method 2: Environment Variable (Recommended)**

```bash
# Add to your shell profile (~/.bashrc, ~/.zshrc, etc.)
export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here

# Then simply run:
npx @gianpieropuleo/radix-mcp-server
```

## 🛠️ Editor Integration

### Claude Desktop Integration

Add to your Claude Desktop configuration (`~/.config/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "radix-ui": {
      "command": "npx",
      "args": [
        "@gianpieropuleo/radix-mcp-server",
        "--github-api-key",
        "ghp_your_token_here"
      ]
    },
    // Or for specific library only:
    "radix-themes": {
      "command": "npx",
      "args": [
        "@gianpieropuleo/radix-mcp-server",
        "--library",
        "themes",
        "--github-api-key",
        "ghp_your_token_here"
      ]
    }
  }
}
```

Or with environment variable:

```json
{
  "mcpServers": {
    "radix-ui": {
      "command": "npx",
      "args": ["@gianpieropuleo/radix-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### VS Code Integration

#### Method 1: Using Continue Extension

```json
{
  "continue.server": {
    "mcpServers": {
      "radix-ui": {
        "command": "npx",
        "args": [
          "@gianpieropuleo/radix-mcp-server",
          "--github-api-key",
          "ghp_your_token_here"
        ]
      }
    }
  }
}
```

#### Method 2: Using Claude Extension

```json
{
  "claude.mcpServers": {
    "radix-ui": {
      "command": "npx",
      "args": ["@gianpieropuleo/radix-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

### Cursor Integration

Create a `.cursorrules` file in your project root:

```json
{
  "mcpServers": {
    "radix-ui": {
      "command": "npx",
      "args": ["@gianpieropuleo/radix-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token_here"
      }
    }
  }
}
```

## 🎯 Usage Examples

### Getting Radix Themes Components

Ask your AI assistant:

```
"Show me the source code for the Radix Themes Button component"
"List all available Radix Themes components"
"How do I install and set up Radix Themes?"
```

### Working with Radix Primitives

Ask your AI assistant:

```
"Get the Dialog primitive from Radix UI"
"Show me how to use the Accordion primitive"
"List all available Radix Primitives"
```

### Using Radix Colors

Ask your AI assistant:

```
"Show me the blue color scale from Radix Colors"
"How do I set up Radix Colors with CSS variables?"
"List all available color scales"
```

### Building a Complete UI

Ask your AI assistant:

```
"Create a dashboard using Radix Themes components"
"Build a modal dialog using Radix Primitives"
"Set up a design system with Radix Colors"
```

## 🛠️ Available Tools

The MCP server provides these tools for AI assistants:

### Radix Themes Tools

- **`themes_list_components`** - List all available Radix Themes components
- **`themes_get_component`** - Get Radix Themes component source code
- **`themes_get_installation`** - Get installation instructions for Radix Themes

### Radix Primitives Tools

- **`primitives_list_components`** - List all available Radix Primitives
- **`primitives_get_component`** - Get Radix Primitive component source code
- **`primitives_get_installation`** - Get installation instructions for specific primitives

### Radix Colors Tools

- **`colors_list_scales`** - List all available color scales
- **`colors_get_scale`** - Get specific color scale definition
- **`colors_get_installation`** - Get installation instructions for Radix Colors

### Example Tool Usage

```typescript
// Get Radix Themes Button component
{
  "tool": "themes_get_component",
  "arguments": { "componentName": "button" }
}

// List all Radix Primitives
{
  "tool": "primitives_list_components",
  "arguments": {}
}

// Get blue color scale
{
  "tool": "colors_get_scale",
  "arguments": { "scaleName": "blue" }
}

// Get installation guide for Radix Colors
{
  "tool": "colors_get_installation",
  "arguments": {}
}
```

## 🐛 Troubleshooting

### Common Issues

**"Rate limit exceeded" errors:**

```bash
# Solution: Add GitHub API token
npx @gianpieropuleo/radix-mcp-server --github-api-key ghp_your_token_here
```

**"Command not found" errors:**

```bash
# Solution: Install Node.js 18+ and ensure npx is available
node --version  # Should be 18+
npx --version   # Should work
```

**Component not found:**

```bash
# Check available components first
npx @gianpieropuleo/radix-mcp-server --library themes
# Then call appropriate list tool via your MCP client
```

**Library selection issues:**

```bash
# Verify library parameter
npx @gianpieropuleo/radix-mcp-server --library themes  # ✅ Valid
npx @gianpieropuleo/radix-mcp-server --library invalid # ❌ Invalid
```

### Debug Mode

Enable verbose logging:

```bash
# Set debug environment variable
LOG_LEVEL=debug npx @gianpieropuleo/radix-mcp-server --github-api-key ghp_your_token
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- 🐛 [Report Issues](https://github.com/gianpieropuleo/radix-mcp-server/issues)
- 💬 [Discussions](https://github.com/gianpieropuleo/radix-mcp-server/discussions)
- 📖 [Documentation](https://github.com/gianpieropuleo/radix-mcp-server#readme)
- 📦 [npm Package](https://www.npmjs.com/package/@gianpieropuleo/radix-mcp-server)

## 🔗 Related Projects

- [Radix UI Themes](https://www.radix-ui.com/themes) - High-level React components
- [Radix UI Primitives](https://www.radix-ui.com/primitives) - Low-level React components
- [Radix UI Colors](https://www.radix-ui.com/colors) - Beautiful color system
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol specification
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Official MCP SDK

## ⭐ Acknowledgments

- [Radix UI Team](https://github.com/radix-ui) for the amazing component libraries
- [Anthropic](https://anthropic.com) for the Model Context Protocol specification
- The open source community for inspiration and contributions

---

**Made with ❤️ by [Gianpiero Puleo](https://github.com/gianpieropuleo) and [Claude Code](https://www.anthropic.com/claude-code)**

**Built upon the excellent work of [shadcn-ui-mcp-server](https://github.com/Jpisnice/shadcn-ui-mcp-server) by [@Jpisnice](https://github.com/Jpisnice)**

**Star ⭐ this repo if you find it helpful! Also consider starring the [original project](https://github.com/Jpisnice/shadcn-ui-mcp-server) that made this possible.**
