import type {
  DateReference as DateReference,
  SearchDirection,
  SearchToken,
} from './internal'
import {
  isSearchDirectionAfter,
  isSearchDirectionBefore,
} from './search-direction'
import { SearchTokenTypeValueObject } from './search-token-type'

type DateOperationTokenType =
  | typeof SearchTokenTypeValueObject.dateBefore
  | typeof SearchTokenTypeValueObject.dateAfter
  | typeof SearchTokenTypeValueObject.dateExact

export class SearchTokenFactory {
  private static getDateCategoryFromDirection(direction: SearchDirection): string {
    if (isSearchDirectionBefore(direction)) {
      return 'date before'
    }

    if (isSearchDirectionAfter(direction)) {
      return 'date after'
    }

    return 'date exact'
  }

  private static getDateOperationMetadata(
    type: DateOperationTokenType,
  ): { category: string; icon: string } {
    if (SearchTokenTypeValueObject.isDateBefore(type)) {
      return { category: 'date before', icon: 'event_busy' }
    }

    if (SearchTokenTypeValueObject.isDateAfter(type)) {
      return { category: 'date after', icon: 'event_available' }
    }

    return { category: 'date exact', icon: 'event' }
  }

  static createDateRelative(input: {
    direction: SearchDirection
    reference: DateReference
    weekdayIndexMonday: number
    dateText: string
    title: string
  }): SearchToken {
    return {
      uid: `${SearchTokenTypeValueObject.dateRelative}|${input.direction}|${input.reference}|${input.weekdayIndexMonday}|${input.dateText}`,
      type: SearchTokenTypeValueObject.dateRelative,
      title: input.title,
      rawTitle: input.dateText,
      category: SearchTokenFactory.getDateCategoryFromDirection(input.direction),
      icon: 'event_repeat',
      direction: input.direction,
      reference: input.reference,
    }
  }

  static createDateOperation(
    type: DateOperationTokenType,
    dateText: string,
  ): SearchToken {
    const metadata = SearchTokenFactory.getDateOperationMetadata(type)

    return {
      uid: `${type}|${dateText}`,
      type,
      title: dateText,
      rawTitle: dateText,
      category: metadata.category,
      icon: metadata.icon,
    }
  }

  static createScope(input: {
    key: string
    title: string
    icon?: string
  }): SearchToken {
    return {
      uid: `${SearchTokenTypeValueObject.scope}|${input.key}`,
      type: SearchTokenTypeValueObject.scope,
      key: input.key,
      title: input.title,
      category: 'Fulltext scope',
      icon: input.icon,
    }
  }
}
