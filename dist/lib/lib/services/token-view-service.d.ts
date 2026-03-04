import { type SearchToken } from '../models/search-token';
interface TokenCategoryResolverOptions {
    getColumnByKey?: (key: string) => {
        label: string;
    } | undefined;
    suggestionCategoryLabelByType?: Record<string, string>;
}
export declare const resolveTokenIcon: (token: SearchToken) => string | undefined;
export declare const resolveTokenCategory: (token: SearchToken, options?: TokenCategoryResolverOptions) => string;
export {};
