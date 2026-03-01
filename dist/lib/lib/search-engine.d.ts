import type { SearchModelDefinition } from './models/external';
import type { SearchToken } from './models/internal';
export declare const resolveEnglishLocale: () => string;
export declare const highlightText: (value: unknown, terms: string[]) => string;
export declare const filterItems: <TItem>(items: TItem[], annotations: SearchModelDefinition<TItem>, selected: SearchToken[]) => TItem[];
export declare const buildSuggestions: <TItem>(items: TItem[], annotations: SearchModelDefinition<TItem>, selected: SearchToken[], rawInput: string) => SearchToken[];
