/// <reference types="react" />

declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
  
  export const useEffect: typeof React.useEffect;
  export const useState: typeof React.useState;
  export const useRef: typeof React.useRef;
  export const useCallback: typeof React.useCallback;
  export const useMemo: typeof React.useMemo;
} 