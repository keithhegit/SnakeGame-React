declare module 'zustand' {
  import { UseBoundStore, StoreApi } from 'zustand/vanilla';
  
  export type Create = {
    <T>(initializer: (set: any, get: any, api: any) => T): UseBoundStore<StoreApi<T>>;
  };
  
  export const create: Create;
} 