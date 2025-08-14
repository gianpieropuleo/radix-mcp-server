import { z } from "zod";

/**
 * Validation schemas for different request types using Zod
 */
export const validationSchemas = {
  // Component-related schemas for Radix UI tools
  componentName: z.object({
    componentName: z.string().min(1, "Component name is required").max(100),
  }),

  // Scale name for Radix Colors
  scaleName: z.object({
    scaleName: z.string().min(1, "Scale name is required").max(100),
  }),

  // Package manager selection
  packageManager: z.object({
    packageManager: z.enum(["npm", "yarn", "pnpm"]).optional(),
  }),

  // Optional component name (for primitive installation)
  optionalComponentName: z.object({
    componentName: z.string().min(1).max(100).optional(),
  }),

  // Empty object for tools with no parameters
  empty: z.object({}),
};

/**
 * Validate request parameters against a Zod schema
 * @param schema Zod schema to validate against
 * @param params Parameters to validate
 * @returns Validated parameters
 * @throws ValidationError if validation fails
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, params: any): T {
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join(", ");

      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw new Error(
      `Unexpected validation error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

/**
 * Get validation schema for a specific method
 * @param method Method name
 * @returns Zod schema or undefined
 */
export function getValidationSchema(
  method: string
): z.ZodSchema<any> | undefined {
  const schemaMap: Record<string, z.ZodSchema<any>> = {
    // Radix Themes tools
    themes_get_component_source: validationSchemas.componentName,
    themes_get_component_documentation: validationSchemas.componentName,
    themes_get_getting_started: validationSchemas.empty,
    themes_list_components: validationSchemas.empty,

    // Radix Primitives tools
    primitives_get_component_source: validationSchemas.componentName,
    primitives_get_component_documentation: validationSchemas.componentName,
    primitives_get_getting_started: validationSchemas.empty,
    primitives_list_components: validationSchemas.empty,

    // Radix Colors tools
    colors_get_component_source: validationSchemas.componentName,
    colors_get_component_documentation: validationSchemas.componentName,
    colors_get_getting_started: validationSchemas.empty,
    colors_list_components: validationSchemas.empty,
  };

  return schemaMap[method];
}

/**
 * Validate and sanitize input parameters
 * @param method Method name
 * @param params Parameters to validate
 * @returns Validated and sanitized parameters
 */
export function validateAndSanitizeParams<T>(method: string, params: any): T {
  const schema = getValidationSchema(method);

  if (!schema) {
    // If no specific schema found, return params as-is
    return params as T;
  }

  return validateRequest<T>(schema, params);
}
