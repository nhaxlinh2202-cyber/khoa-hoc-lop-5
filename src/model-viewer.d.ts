import * as React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          poster?: string;
          loading?: 'auto' | 'lazy' | 'eager';
          reveal?: 'auto' | 'manual';
          'auto-rotate'?: boolean | string;
          'auto-rotate-delay'?: number | string;
          'rotation-per-second'?: string;
          'camera-controls'?: boolean | string;
          'camera-orbit'?: string;
          'camera-target'?: string;
          'field-of-view'?: string;
          'min-camera-orbit'?: string;
          'max-camera-orbit'?: string;
          'min-field-of-view'?: string;
          'max-field-of-view'?: string;
          'interaction-prompt'?: 'auto' | 'none';
          'shadow-intensity'?: string;
          'shadow-softness'?: string;
          'environment-image'?: string;
          'skybox-image'?: string;
          exposure?: string;
          ar?: boolean | string;
          'ar-modes'?: string;
          'ar-scale'?: string;
          'touch-action'?: string;
          'disable-zoom'?: boolean | string;
          'disable-pan'?: boolean | string;
          'disable-tap'?: boolean | string;
          'interpolation-decay'?: string;
        },
        HTMLElement
      >;
    }
  }
}
