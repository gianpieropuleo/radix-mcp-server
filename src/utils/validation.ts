import { z } from "zod";
import { Action, ColorAction } from "../types/actions.js";
import { Library } from "../types/results.js";

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
    [`${Library.Themes}_${Action.GetComponentSource}`]:
      validationSchemas.componentName,
    [`${Library.Themes}_${Action.GetComponentDocumentation}`]:
      validationSchemas.componentName,
    [`${Library.Themes}_${Action.GetGettingStarted}`]: validationSchemas.empty,
    [`${Library.Themes}_${Action.ListComponents}`]: validationSchemas.empty,

    // Radix Primitives tools
    [`${Library.Primitives}_${Action.GetComponentSource}`]:
      validationSchemas.componentName,
    [`${Library.Primitives}_${Action.GetComponentDocumentation}`]:
      validationSchemas.componentName,
    [`${Library.Primitives}_${Action.GetGettingStarted}`]:
      validationSchemas.empty,
    [`${Library.Primitives}_${Action.ListComponents}`]: validationSchemas.empty,

    // Radix Colors tools
    [`${Library.Colors}_${ColorAction.GetScale}`]: validationSchemas.scaleName,
    [`${Library.Colors}_${ColorAction.GetScaleDocumentation}`]:
      validationSchemas.scaleName,
    [`${Library.Colors}_${ColorAction.ListScales}`]: validationSchemas.empty,
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
