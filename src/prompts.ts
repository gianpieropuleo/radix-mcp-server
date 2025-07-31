/**
 * Prompts implementation for the Model Context Protocol (MCP) server.
 * 
 * This file defines prompts that guide the AI model's responses for Radix UI.
 * Prompts help to direct the model on how to process user requests for Radix components.
 */

/**
 * List of prompts metadata available in this MCP server
 * Each prompt must have a name, description, and arguments if parameters are needed
 */
export const prompts = {
    "build-radix-page": {
      name: "build-radix-page",
      description: "Generate a complete page using Radix UI components (Themes, Primitives, Colors)",
      arguments: [
          { 
              name: "pageType",
              description: "Type of page to build (dashboard, login, calendar, sidebar, products, custom)",
              required: true,
          },
          {
              name: "features",
              description: "Specific features or components needed (comma-separated)"
          },
          {
              name: "layout",
              description: "Layout preference (sidebar, header, full-width, centered)"
          },
          {
              name: "style",
              description: "Design style (minimal, modern, enterprise, creative)"
          }
      ],
    },
    "create-dashboard": {
      name: "create-dashboard",
      description: "Create a comprehensive dashboard using Radix UI components",
      arguments: [
          {
              name: "dashboardType",
              description: "Type of dashboard (analytics, admin, user, project, sales)",
              required: true,
          },
          {
              name: "widgets",
              description: "Dashboard widgets needed (charts, tables, cards, metrics)"
          },
          {
              name: "navigation",
              description: "Navigation style (sidebar, top-nav, breadcrumbs)"
          }
      ],
    },
    "create-auth-flow": {
      name: "create-auth-flow",
      description: "Generate authentication pages using Radix UI components",
      arguments: [
          {
              name: "authType",
              description: "Authentication type (login, register, forgot-password, two-factor)",
              required: true,
          },
          {
              name: "providers",
              description: "Auth providers (email, google, github, apple)"
          },
          {
              name: "features",
              description: "Additional features (remember-me, social-login, validation)"
          }
      ],
    },
    "optimize-radix-component": {
      name: "optimize-radix-component",
      description: "Optimize or enhance existing Radix UI components with best practices",
      arguments: [
          {
              name: "component",
              description: "Component name to optimize",
              required: true,
          },
          {
              name: "optimization",
              description: "Type of optimization (performance, accessibility, responsive, animations)"
          },
          {
              name: "useCase",
              description: "Specific use case or context for the component"
          }
      ],
    },
    "create-data-table": {
      name: "create-data-table",
      description: "Create advanced data tables with Radix UI components",
      arguments: [
          {
              name: "dataType",
              description: "Type of data to display (users, products, orders, analytics)",
              required: true,
          },
          {
              name: "features",
              description: "Table features (sorting, filtering, pagination, search, selection)"
          },
          {
              name: "actions",
              description: "Row actions (edit, delete, view, custom)"
          }
      ],
    },
  };
  
/**
 * Map of prompt names to their handler functions
 * Each handler generates the actual prompt content with the provided parameters
 */
export const promptHandlers = {
    "build-radix-page": ({ pageType, features = "", layout = "sidebar", style = "modern" }: { 
      pageType: string, features?: string, layout?: string, style?: string 
    }) => {
      
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create a complete ${pageType} page using Radix UI libraries (Themes, Primitives, Colors). 

REQUIREMENTS:
- Page Type: ${pageType}
- Features: ${features || 'Standard features for this page type'}
- Layout: ${layout}
- Design Style: ${style}

INSTRUCTIONS:
1. Use the MCP tools to explore available Radix UI components:
   - Use 'themes/list_components' to see Radix Themes components
   - Use 'primitives/list_components' to see Radix Primitives
   - Use 'colors/list_scales' to see available color scales
   - Use specific get tools to fetch component implementations

2. Build the page following these principles:
   - Use Radix UI components as building blocks
   - Leverage Radix Themes for high-level styling
   - Use Radix Primitives for unstyled, accessible components
   - Apply Radix Colors for consistent color system
   - Ensure responsive design with CSS-in-JS or CSS modules
   - Implement proper TypeScript types
   - Follow React best practices and hooks patterns
   - Include proper accessibility attributes

3. For ${pageType} pages specifically:
   ${getPageTypeSpecificInstructions(pageType)}

4. Code Structure:
   - Create a main page component
   - Use sub-components for complex sections
   - Include proper imports from Radix UI packages
   - Add necessary state management with React hooks
   - Include proper error handling

5. Styling Guidelines:
   - Use consistent spacing and typography from Radix Themes
   - Implement ${style} design principles
   - Ensure dark/light mode compatibility with Radix Colors
   - Use Radix design tokens and semantic color scales

Please provide complete, production-ready code with proper imports and TypeScript types.`,
            },
          },
        ],
      };
    },

    "create-dashboard": ({ dashboardType, widgets = "charts,tables,cards", navigation = "sidebar" }: { 
      dashboardType: string, widgets?: string, navigation?: string 
    }) => {
      
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create a comprehensive ${dashboardType} dashboard using Radix UI components.

REQUIREMENTS:
- Dashboard Type: ${dashboardType}
- Widgets: ${widgets}
- Navigation: ${navigation}

INSTRUCTIONS:
1. First, explore available Radix UI components:
   - Use 'themes/list_components' to see available theme components
   - Use 'primitives/list_components' to find navigation and layout primitives
   - Use 'colors/list_scales' to choose appropriate color schemes
   - Study component APIs and usage patterns

2. Dashboard Structure:
   - Implement ${navigation} navigation using Radix Themes components
   - Create a responsive grid layout for widgets using CSS Grid/Flexbox
   - Include proper header with user menu using Radix Primitives
   - Add breadcrumb navigation with Radix components

3. Widgets to Include:
   ${widgets.split(',').map(widget => `- ${widget.trim()} with real-time data simulation`).join('\n   ')}

4. Key Features:
   - Responsive design that works on mobile, tablet, and desktop
   - Interactive charts using a charting library compatible with Radix
   - Data tables using Radix Primitives for accessibility
   - Modal dialogs using Radix Dialog primitive
   - Toast notifications using Radix Toast primitive

5. Data Management:
   - Create mock data structures for ${dashboardType}
   - Implement state management with React hooks
   - Add loading states and error handling
   - Include data refresh functionality

6. Accessibility:
   - Proper ARIA labels and roles
   - Keyboard navigation support
   - Screen reader compatibility
   - Color contrast compliance

Provide complete code with all necessary imports, types, and implementations.`,
            },
          },
        ],
      };
    },

    "create-auth-flow": ({ authType, providers = "email", features = "validation" }: { 
      authType: string, providers?: string, features?: string 
    }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create a complete ${authType} authentication flow using Radix UI components.

REQUIREMENTS:
- Auth Type: ${authType}
- Providers: ${providers}
- Features: ${features}

INSTRUCTIONS:
1. Explore available Radix UI components:
   - Use 'themes/list_components' to see form and button components
   - Use 'primitives/list_components' to find form primitives
   - Study component APIs for forms, dialogs, and validation

2. Authentication Components:
   - Form validation using react-hook-form or similar
   - Input components with proper error states
   - Loading states during authentication
   - Success/error feedback with toast notifications

3. Providers Implementation:
   ${providers.split(',').map(provider => 
     `- ${provider.trim()}: Implement ${provider.trim()} authentication UI`
   ).join('\n   ')}

4. Security Features:
   - Form validation with proper error messages
   - Password strength indicator (if applicable)
   - CSRF protection considerations
   - Secure form submission patterns

5. UX Considerations:
   - Smooth transitions between auth states
   - Clear error messaging
   - Progressive enhancement
   - Mobile-friendly design
   - Remember me functionality (if applicable)

6. Form Features:
   ${features.split(',').map(feature => 
     `- ${feature.trim()}: Implement ${feature.trim()} functionality`
   ).join('\n   ')}

7. Layout Options:
   - Choose appropriate layout from available login blocks
   - Center-aligned forms with proper spacing
   - Background images or gradients (optional)
   - Responsive design for all screen sizes

Provide complete authentication flow code with proper TypeScript types, validation, and error handling.`,
            },
          },
        ],
      };
    },

    "optimize-radix-component": ({ component, optimization = "performance", useCase = "general" }: { 
      component: string, optimization?: string, useCase?: string 
    }) => {
      
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Optimize the ${component} Radix UI component for ${optimization} and ${useCase} use case.

REQUIREMENTS:
- Component: ${component}
- Optimization Focus: ${optimization}
- Use Case: ${useCase}

INSTRUCTIONS:
1. First, analyze the current component:
   - Use appropriate Radix tools to fetch the ${component} source code
   - Study component API and implementation patterns
   - Understand component dependencies and requirements

2. Optimization Strategy for ${optimization}:
   ${getOptimizationInstructions(optimization)}

3. Use Case Specific Enhancements for ${useCase}:
   - Analyze how ${component} is typically used in ${useCase} scenarios
   - Identify common patterns and pain points
   - Suggest improvements for better developer experience

4. Implementation:
   - Provide optimized component code
   - Include performance benchmarks or considerations
   - Add proper TypeScript types and interfaces
   - Include usage examples demonstrating improvements

5. Best Practices:
   - Follow React performance best practices
   - Implement proper memoization where needed
   - Ensure backward compatibility with Radix API
   - Add comprehensive prop validation

6. Testing Considerations:
   - Suggest test cases for the optimized component
   - Include accessibility testing recommendations
   - Performance testing guidelines

Provide the optimized component code with detailed explanations of improvements made.`,
            },
          },
        ],
      };
    },

    "create-data-table": ({ dataType, features = "sorting,filtering,pagination", actions = "edit,delete" }: { 
      dataType: string, features?: string, actions?: string 
    }) => {
      return {
        messages: [
          {
            role: "user",
            content: {
              type: "text",
              text: `Create an advanced data table for ${dataType} using Radix UI components.

REQUIREMENTS:
- Data Type: ${dataType}
- Features: ${features}
- Actions: ${actions}

INSTRUCTIONS:
1. Explore table-related components:
   - Use Radix tools to explore available components
   - Look for table, grid, or data display components
   - Study primitive components that could be used for tables

2. Table Structure:
   - Create a reusable DataTable component
   - Define proper TypeScript interfaces for ${dataType} data
   - Implement column definitions with proper typing
   - Add responsive table design

3. Features Implementation:
   ${features.split(',').map(feature => {
     const featureInstructions: Record<string, string> = {
       'sorting': '- Column sorting (ascending/descending) with visual indicators',
       'filtering': '- Global search and column-specific filters',
       'pagination': '- Page-based navigation with configurable page sizes',
       'search': '- Real-time search across all columns',
       'selection': '- Row selection with bulk actions support'
     };
     return featureInstructions[feature.trim()] || `- ${feature.trim()}: Implement ${feature.trim()} functionality`;
   }).join('\n   ')}

4. Row Actions:
   ${actions.split(',').map(action => 
     `- ${action.trim()}: Implement ${action.trim()} action with proper confirmation dialogs`
   ).join('\n   ')}

5. Data Management:
   - Create mock data for ${dataType}
   - Implement data fetching patterns (loading states, error handling)
   - Add optimistic updates for actions
   - Include data validation

6. UI/UX Features:
   - Loading skeletons during data fetch
   - Empty states when no data is available
   - Error states with retry functionality
   - Responsive design for mobile devices
   - Keyboard navigation support

7. Advanced Features:
   - Column resizing and reordering
   - Export functionality (CSV, JSON)
   - Bulk operations
   - Virtual scrolling for large datasets (if needed)

Provide complete data table implementation with proper TypeScript types, mock data, and usage examples.`,
            },
          },
        ],
      };
    },
};

/**
 * Helper function to get page type specific instructions
 */
function getPageTypeSpecificInstructions(pageType: string): string {
  const instructions = {
    dashboard: `
   - Use Radix Themes components for layout foundation
   - Include metrics cards, charts, and data tables with proper accessibility
   - Implement sidebar navigation using Radix Navigation Menu
   - Add header with user profile using Radix Avatar and Dropdown Menu
   - Create responsive grid layout for widgets using CSS Grid`,
    
    login: `
   - Use Radix Form primitives for accessible form handling
   - Implement form validation with clear error messages
   - Add social authentication options using Radix Button components
   - Include forgot password and sign-up links with proper navigation
   - Ensure mobile-responsive design with Radix responsive utilities`,
    
    calendar: `
   - Build calendar using Radix Themes components and primitives
   - Implement different calendar views (month, week, day) with state management
   - Add event creation using Radix Dialog and Form primitives
   - Include date navigation using Radix Button and Select components
   - Support event categories with Radix Colors for visual distinction`,
    
    sidebar: `
   - Use Radix Navigation Menu as foundation for sidebar
   - Implement collapsible navigation with Radix Collapsible primitive
   - Add proper menu hierarchy with nested navigation
   - Include search functionality with Radix TextField
   - Support both light and dark themes using Radix Colors`,
    
    products: `
   - Create product grid/list views using Radix Themes layout components
   - Implement filtering and sorting with Radix Select and Toggle Group
   - Add product details modal using Radix Dialog primitive
   - Include shopping cart functionality with Radix primitives
   - Use Radix Colors for product status and category indicators`,
    
    custom: `
   - Analyze requirements and choose appropriate Radix components
   - Combine Radix Themes, Primitives, and Colors as needed
   - Focus on component reusability and accessibility
   - Ensure consistent design patterns with Radix design system`
  };
  
  return instructions[pageType as keyof typeof instructions] || instructions.custom;
}

/**
 * Helper function to get optimization specific instructions
 */
function getOptimizationInstructions(optimization: string): string {
  const instructions = {
    performance: `
   - Implement React.memo for preventing unnecessary re-renders
   - Use useMemo and useCallback hooks appropriately
   - Optimize bundle size by code splitting Radix components
   - Implement virtual scrolling for large lists with Radix primitives
   - Minimize DOM manipulations by leveraging Radix's optimized components
   - Use lazy loading for heavy Radix components`,
   
    accessibility: `
   - Add proper ARIA labels and roles
   - Ensure keyboard navigation support
   - Implement focus management
   - Add screen reader compatibility
   - Ensure color contrast compliance
   - Support high contrast mode`,
   
    responsive: `
   - Implement mobile-first design approach
   - Use CSS Grid and Flexbox effectively
   - Add proper breakpoints for all screen sizes
   - Optimize touch interactions for mobile
   - Ensure readable text sizes on all devices
   - Implement responsive navigation patterns`,
   
    animations: `
   - Add smooth transitions between states
   - Implement loading animations and skeletons
   - Use CSS transforms for better performance
   - Add hover and focus animations
   - Implement page transition animations
   - Ensure animations respect reduced motion preferences`
  };
  
   return instructions[optimization as keyof typeof instructions] || 
         'Focus on general code quality improvements and best practices implementation.';
}