import type { SearchModelDefinition } from './models/external';
import type { SearchToken } from './models/internal';
type HighlightableValue = string | number | boolean | Date | null | undefined;
export interface SearchEngineDependencies {
    resolveEnglishLocale: () => string;
    highlightText: (value: HighlightableValue, terms: string[]) => string;
    filterItems: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[]) => TItem[];
    buildSuggestions: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[], rawInput: string) => SearchToken[];
}
export declare const createSearchEngine: (overrides?: Partial<SearchEngineDependencies>) => {
    resolveEnglishLocale: () => string;
    highlightText: (value: HighlightableValue, terms: string[]) => string;
    filterItems: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[]) => TItem[];
    buildSuggestions: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[], rawInput: string) => SearchToken[];
};
export declare const searchEngine: {
    resolveEnglishLocale: () => string;
    highlightText: (value: HighlightableValue, terms: string[]) => string;
    filterItems: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[]) => TItem[];
    buildSuggestions: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[], rawInput: string) => SearchToken[];
};
export declare const resolveEnglishLocale: () => string;
export declare const highlightText: (value: HighlightableValue, terms: string[]) => string;
export declare const filterItems: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[]) => TItem[];
export declare const buildSuggestions: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[], rawInput: string) => SearchToken[];
export {};
