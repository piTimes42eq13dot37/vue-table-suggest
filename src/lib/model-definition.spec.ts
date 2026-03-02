import { describe, expect, it } from 'vitest'
import { defineModelDefinition, getModelDefinition } from './model-definition'

class ModelDefinitionTestModel {
  id = 0
}

class MissingModelDefinitionModel {
  id = 0
}

describe('model-definition', () => {
  it('stores and returns model definition', () => {
    defineModelDefinition(ModelDefinitionTestModel, {
      modelName: 'ModelDefinitionTestModel',
      columns: [{ key: 'id', label: 'ID', searchable: true, sortable: true }],
    })

    const modelDefinition = getModelDefinition(ModelDefinitionTestModel)
    expect(modelDefinition.modelName).toBe('ModelDefinitionTestModel')
    expect(modelDefinition.columns).toHaveLength(1)
  })

  it('throws when model definition is missing', () => {
    expect(() => getModelDefinition(MissingModelDefinitionModel)).toThrow(
      'No model definition registered for MissingModelDefinitionModel',
    )
  })

  it('throws when model definition has duplicate column keys', () => {
    expect(() =>
      defineModelDefinition(ModelDefinitionTestModel, {
        modelName: 'ModelDefinitionTestModel',
        columns: [
          { key: 'id', label: 'ID', searchable: true, sortable: true },
          { key: 'id', label: 'ID copy', searchable: true, sortable: true },
        ],
      }),
    ).toThrow('Invalid model definition for ModelDefinitionTestModel: duplicate column key "id"')
  })

  it('throws when subline parent key does not exist', () => {
    expect(() =>
      defineModelDefinition(ModelDefinitionTestModel, {
        modelName: 'ModelDefinitionTestModel',
        columns: [
          {
            key: 'detail',
            label: 'Detail',
            searchable: true,
            sortable: true,
            renderAsSublineOf: 'missingParent',
          },
        ],
      }),
    ).toThrow(
      'Invalid model definition for ModelDefinitionTestModel: renderAsSublineOf references unknown key "missingParent"',
    )
  })
})
