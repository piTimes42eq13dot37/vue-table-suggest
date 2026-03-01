import type { SearchModelDefinition } from './models/external';
type Constructor<T> = abstract new (...args: never[]) => T;
export declare const defineModelAnnotations: <TItem>(ctor: Constructor<TItem>, annotations: SearchModelDefinition<TItem>) => void;
export declare const getModelAnnotations: <TItem>(ctor: Constructor<TItem>) => SearchModelDefinition<TItem>;
export {};
