export enum Library {
  Themes = "themes",
  Primitives = "primitives",
  Colors = "colors",
  All = "all",
}

export enum ComponentType {
  Styled = "styled",
  Unstyled = "unstyled",
  ColorScale = "color-scale",
}

export enum Package {
  Themes = "@radix-ui/themes",
  Primitives = "@radix-ui/react-",
  Colors = "@radix-ui/colors",
}

export interface BaseResult {
  library: Library;
}

export interface ComponentInfo {
  name: string;
  packageName: string;
  type: ComponentType;
}

export interface ListComponentsResult extends BaseResult {
  total: number;
  components: ComponentInfo[];
  note: string;
}

export interface GetComponentSourceResult extends BaseResult {
  componentName: string;
  packageName: string;
  type: ComponentType;
  source: string;
}

export interface GetComponentDocumentationResult extends BaseResult {
  componentName: string;
  packageName: string;
  type: ComponentType;
  usage: string;
}

export interface GettingStartedResult extends BaseResult {
  title: string;
  description: string;
  source: string;
  content: string;
  note: string;
}
