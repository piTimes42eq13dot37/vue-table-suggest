import type { DateReference } from './search-date-reference';
import type { SearchDirection } from './search-direction';
import type { SearchTokenType } from './search-token-type';
export interface SearchToken {
    uid: string;
    type: SearchTokenType;
    title: string;
    rawTitle?: string;
    category?: string;
    icon?: string;
    key?: string;
    direction?: SearchDirection;
    reference?: DateReference;
    matchCount?: number;
}
