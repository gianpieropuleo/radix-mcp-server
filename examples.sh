#!/bin/bash

# Example usage script for radix-mcp-server
# This demonstrates different ways to use the package

echo "🚀 Radix UI MCP Server - Usage Examples"
echo "========================================"
echo ""

# Basic usage
echo "1️⃣  Basic Usage (no GitHub token - rate limited):"
echo "   npx @gianpieropuleo/radix-mcp-server"
echo ""

# With GitHub token via argument
echo "2️⃣  With GitHub Token (command line):"
echo "   npx @gianpieropuleo/radix-mcp-server --github-api-key ghp_your_token_here"
echo "   npx @gianpieropuleo/radix-mcp-server -g ghp_your_token_here"
echo ""

# Library selection
echo "3️⃣  Library Selection:"
echo "   npx @gianpieropuleo/radix-mcp-server --library themes"
echo "   npx @gianpieropuleo/radix-mcp-server --library primitives"
echo "   npx @gianpieropuleo/radix-mcp-server --library colors"
echo "   npx @gianpieropuleo/radix-mcp-server --library all"
echo ""

# With environment variable
echo "4️⃣  With Environment Variables:"
echo "   export GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here"
echo "   export RADIX_LIBRARY=themes"
echo "   npx @gianpieropuleo/radix-mcp-server"
echo ""

# Claude Desktop integration
echo "5️⃣  Claude Desktop Integration:"
echo "   Add to ~/.config/Claude/claude_desktop_config.json:"
echo '   {'
echo '     "mcpServers": {'
echo '       "radix-ui": {'
echo '         "command": "npx",'
echo '         "args": ["@gianpieropuleo/radix-mcp-server", "--github-api-key", "ghp_your_token"]'
echo '       }'
echo '     }'
echo '   }'
echo ""

# Continue.dev integration
echo "6️⃣  Continue.dev Integration:"
echo "   Add to .continue/config.json:"
echo '   {'
echo '     "tools": [{'
echo '       "name": "radix-ui",'
echo '       "type": "mcp",'
echo '       "command": "npx",'
echo '       "args": ["@gianpieropuleo/radix-mcp-server"],'
echo '       "env": {"GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_your_token"}'
echo '     }]'
echo '   }'
echo ""

# Available tools
echo "🛠️  Available Tools:"
echo "   Radix Themes:"
echo "   • themes/list_components    - List all Radix Themes components"
echo "   • themes/get_component      - Get Themes component source code"
echo "   • themes/get_installation   - Get Themes installation guide"
echo ""
echo "   Radix Primitives:"
echo "   • primitives/list_components - List all Radix Primitives"
echo "   • primitives/get_component   - Get Primitive component source code"
echo "   • primitives/get_installation - Get Primitives installation guide"
echo ""
echo "   Radix Colors:"
echo "   • colors/list_scales        - List all color scales"
echo "   • colors/get_scale          - Get specific color scale"
echo "   • colors/get_installation   - Get Colors installation guide"
echo ""

echo "📚 For more information:"
echo "   npx @gianpieropuleo/radix-mcp-server --help"
echo "   https://github.com/gianpieropuleo/radix-mcp-server"