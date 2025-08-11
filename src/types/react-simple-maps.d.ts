declare module "react-simple-maps" {
  import * as React from "react";

  export interface ComposableMapProps {
    projectionConfig?: { scale?: number } | Record<string, unknown>;
    style?: React.CSSProperties;
    children?: React.ReactNode;
  }

  export const ComposableMap: React.FC<ComposableMapProps>;

  export interface GeographiesRenderProps {
    geographies: unknown[];
  }

  export interface GeographiesProps {
    geography: string | object;
    children?: (props: GeographiesRenderProps) => React.ReactNode;
  }

  export const Geographies: React.FC<GeographiesProps>;

  export interface GeographyProps {
    geography: unknown;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: Partial<Record<'default' | 'hover' | 'pressed', React.CSSProperties>>;
  }

  export const Geography: React.FC<GeographyProps>;
}
