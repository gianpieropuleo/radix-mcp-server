export const HELP_EXAMPLES = `

Examples:
  $ radix-mcp-server
  $ radix-mcp-server --library themes
  $ radix-mcp-server --library primitives --github-api-key ghp_your_token_here
  $ radix-mcp-server -l colors -g ghp_your_token_here
  $ radix-mcp-server -l all

Environment Variables:
  GITHUB_PERSONAL_ACCESS_TOKEN    Alternative way to provide GitHub token
  RADIX_LIBRARY                   Library to use: 'themes', 'primitives', 'colors', or 'all' (default: all)
  LOG_LEVEL                       Log level (debug, info, warn, error) - default: info

For more information, visit: https://github.com/gianpieropuleo/radix-mcp-server`;
