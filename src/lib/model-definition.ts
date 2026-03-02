import type { SearchModelDefinition } from './models/external'

type Constructor<T> = abstract new (...args: never[]) => T

const assertModelDefinitionValid = <TItem>(
  ctor: Constructor<TItem>,
  modelDefinition: SearchModelDefinition<TItem>,
): void => {
  if (!modelDefinition.modelName || !String(modelDefinition.modelName).trim()) {
    throw new Error(`Invalid model definition for ${ctor.name}: modelName is required`)
  }

  if (!Array.isArray(modelDefinition.columns) || modelDefinition.columns.length === 0) {
    throw new Error(`Invalid model definition for ${ctor.name}: at least one column is required`)
  }

  const seenKeys = new Set<string>()
  modelDefinition.columns.forEach((column) => {
    if (!column.key || !String(column.key).trim()) {
      throw new Error(`Invalid model definition for ${ctor.name}: column key is required`)
    }

    if (seenKeys.has(column.key)) {
      throw new Error(`Invalid model definition for ${ctor.name}: duplicate column key "${column.key}"`)
    }

    seenKeys.add(column.key)

    if (column.renderAsSublineOf && !modelDefinition.columns.some((entry) => entry.key === column.renderAsSublineOf)) {
      throw new Error(
        `Invalid model definition for ${ctor.name}: renderAsSublineOf references unknown key "${column.renderAsSublineOf}"`,
      )
    }
  })
}

class ModelDefinitionRegistry {
  private readonly modelDefinitionStore = new WeakMap<
    Constructor<unknown>,
    SearchModelDefinition<unknown>
  >()

  define<TItem>(
    ctor: Constructor<TItem>,
    modelDefinition: SearchModelDefinition<TItem>,
  ): void {
    assertModelDefinitionValid(ctor, modelDefinition)
    this.modelDefinitionStore.set(ctor, modelDefinition as SearchModelDefinition<unknown>)
  }

  get<TItem>(ctor: Constructor<TItem>): SearchModelDefinition<TItem> {
    const found = this.modelDefinitionStore.get(ctor)
    if (!found) {
      throw new Error(`No model definition registered for ${ctor.name}`)
    }
    return found as SearchModelDefinition<TItem>
  }
}

const modelDefinitionRegistry = new ModelDefinitionRegistry()

export const defineModelDefinition = <TItem>(
  ctor: Constructor<TItem>,
  modelDefinition: SearchModelDefinition<TItem>,
): void => {
  modelDefinitionRegistry.define(ctor, modelDefinition)
}

export const getModelDefinition = <TItem>(
  ctor: Constructor<TItem>,
): SearchModelDefinition<TItem> =>
  modelDefinitionRegistry.get(ctor)
