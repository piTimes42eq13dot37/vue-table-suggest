import type { SearchToken } from '../models/internal';
import type { SearchModelDefinition } from '../models/external';
export declare const buildSuggestions: <TItem>(items: TItem[], annotations: SearchModelDefinition<TItem>, selected: SearchToken[], rawInput: string) => SearchToken[];
