import type { SearchModelDefinition } from '../models/external';
import type { SearchToken } from '../models/internal';
export declare const filterItems: <TItem>(items: TItem[], annotations: SearchModelDefinition<TItem>, selected: SearchToken[]) => TItem[];
