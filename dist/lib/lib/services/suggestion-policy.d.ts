import type { SearchToken } from '../models/internal';
import type { SearchModelDefinition } from '../models/external';
export interface RelativeDateSuggestionPolicyConfig {
    minQueryLength: number;
    defaultMaxWeekdaySuggestions: number;
}
export interface TextSuggestionScoringPolicyConfig {
    scoreStart: number;
    scoreMiddle: number;
    scoreEnd: number;
    wordScoreBase: number;
    wordIndexWeight: number;
    scoreCategoryMatch: number;
    scoreExactMatch: number;
    maxLengthPenalty: number;
    lengthPenaltyDivisor: number;
}
export interface SuggestionPolicyConfig {
    relativeDate: RelativeDateSuggestionPolicyConfig;
    textScoring: TextSuggestionScoringPolicyConfig;
}
export declare const defaultSuggestionPolicyConfig: SuggestionPolicyConfig;
declare class RelativeDateSuggestionPolicy {
    private readonly config;
    constructor(config: RelativeDateSuggestionPolicyConfig);
    private buildRelativeTitlePrefix;
    private getPriority;
    suggest<TItem>(modelDefinition: SearchModelDefinition<TItem>, selected: SearchToken[], rawInput: string): SearchToken[];
}
declare class DateOperationSuggestionPolicy {
    suggest(selected: SearchToken[], rawInput: string): SearchToken[];
}
declare class TextSuggestionScoringPolicy {
    private readonly config;
    constructor(config: TextSuggestionScoringPolicyConfig);
    private getPositionWeight;
    private getBestWordMatchScore;
    score(title: string, category: string, needle: string): number;
}
declare class UniqueSuggestionMergeService {
    merge(...lists: SearchToken[][]): SearchToken[];
}
export interface SuggestionPolicies {
    relativeDateSuggestionPolicy: RelativeDateSuggestionPolicy;
    dateOperationSuggestionPolicy: DateOperationSuggestionPolicy;
    textSuggestionScoringPolicy: TextSuggestionScoringPolicy;
    uniqueSuggestionMergeService: UniqueSuggestionMergeService;
}
export declare const createSuggestionPolicies: (overrides?: Partial<SuggestionPolicyConfig>) => SuggestionPolicies;
export declare const relativeDateSuggestionPolicy: RelativeDateSuggestionPolicy;
export declare const dateOperationSuggestionPolicy: DateOperationSuggestionPolicy;
export declare const textSuggestionScoringPolicy: TextSuggestionScoringPolicy;
export declare const uniqueSuggestionMergeService: UniqueSuggestionMergeService;
export {};
