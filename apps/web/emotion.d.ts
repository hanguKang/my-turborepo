// apps/web/emotion.d.ts (또는 apps/web/types/emotion.d.ts)
import '@emotion/react';

declare module 'react' {
  interface Attributes {
    css?: import('@emotion/react').Interpolation<import('@emotion/react').Theme>;
  }
}