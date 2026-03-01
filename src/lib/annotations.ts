import type { SearchModelDefinition } from './models/external'

type Constructor<T> = abstract new (...args: never[]) => T

const annotationStore = new WeakMap<Constructor<unknown>, SearchModelDefinition<unknown>>()

export const defineModelAnnotations = <TItem>(
  ctor: Constructor<TItem>,
  annotations: SearchModelDefinition<TItem>,
): void => {
  annotationStore.set(ctor, annotations as SearchModelDefinition<unknown>)
}

export const getModelAnnotations = <TItem>(
  ctor: Constructor<TItem>,
): SearchModelDefinition<TItem> => {
  const found = annotationStore.get(ctor)
  if (!found) {
    throw new Error(`No model annotations registered for ${ctor.name}`)
  }
  return found as SearchModelDefinition<TItem>
}
