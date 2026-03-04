import type { SearchModelDefinition } from '../models/external';
import type { SearchToken } from '../models/internal';
export declare const filterItemsService: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[]) => TItem[];
export declare const filterItems: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[]) => TItem[];
