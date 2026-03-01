import type { ParsedSearchSelectionState } from '../models/internal';
import type { SearchToken } from '../models/internal';
export declare const parseSelection: (selected: SearchToken[]) => ParsedSearchSelectionState;
export declare const isDateToken: (token: SearchToken) => boolean;
export declare const resolveTermKey: (token: SearchToken) => string;
