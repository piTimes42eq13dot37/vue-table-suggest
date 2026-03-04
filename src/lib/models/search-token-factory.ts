import type {
  DateOperationToken,
  DateRelativeToken,
  DateReference,
  DateRelation,
  FulltextColumnScopeToken,
} from './internal'
import { SearchTokenModel } from './search-token'

type DateOperationTokenType =
  | 'date_before'
  | 'date_after'
  | 'date_exact'

export class SearchTokenFactory {
  static createDateRelative(input: {
    dateRelation: DateRelation
    reference: DateReference
    weekdayIndexMonday: number
    dateText: string
    title: string
  }): DateRelativeToken {
    return {
      uid: `${SearchTokenModel.dateRelative}|${input.dateRelation}|${input.reference}|${input.weekdayIndexMonday}|${input.dateText}`,
      type: 'date_relative',
      title: input.title,
      rawTitle: input.dateText,
      dateRelation: input.dateRelation,
      reference: input.reference,
    }
  }

  static createDateOperation(
    type: DateOperationTokenType,
    dateText: string,
  ): DateOperationToken {
    return {
      uid: `${type}|${dateText}`,
      type,
      title: dateText,
      rawTitle: dateText,
    }
  }

  static createScope(input: {
    key: string
    title: string
    icon?: string
  }): FulltextColumnScopeToken {
    return {
      uid: `${SearchTokenModel.scope}|${input.key}`,
      type: 'scope',
      key: input.key,
      title: input.title,
      icon: input.icon,
    }
  }
}
