export interface ToolInputSchema {
  type: string;
  properties: Record<string, any>;
  required: string[];
}

export interface Tools {
  [key: string]: {
    name: string;
    description: string;
    inputSchema: any;
  };
}
