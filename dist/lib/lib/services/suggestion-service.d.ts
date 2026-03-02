import type { SearchToken } from '../models/internal';
import type { SearchModelDefinition } from '../models/external';
import { type SuggestionPolicies } from './suggestion-policy';
import { filterItems } from './filter-service';
interface SuggestionServiceDependencies {
    policies: SuggestionPolicies;
    filterItems: typeof filterItems;
}
declare class SuggestionService {
    private readonly dependencies;
    constructor(dependencies: SuggestionServiceDependencies);
    private getRelativeCandidates;
    private getDateOperationCandidates;
    private countTermOccurrencesInValue;
    private countColumnMatchesForTerms;
    private buildNormalCandidates;
    private buildScopeCandidates;
    private collectCandidates;
    buildSuggestions<TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[], rawInput: string): SearchToken[];
}
export declare const createSuggestionService: (overrides?: Partial<SuggestionServiceDependencies>) => Pick<SuggestionService, "buildSuggestions">;
export declare const buildSuggestions: <TItem>(items: TItem[], modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[], rawInput: string) => SearchToken[];
export {};
