import { describe, expect, it } from 'vitest'
import { defineModelAnnotations, getModelAnnotations } from './annotations'

class AnnotationTestModel {
  id = 0
}

class MissingAnnotationModel {
  id = 0
}

describe('annotations', () => {
  it('stores and returns model annotations', () => {
    defineModelAnnotations(AnnotationTestModel, {
      modelName: 'AnnotationTestModel',
      columns: [{ key: 'id', label: 'ID', searchable: true, sortable: true }],
    })

    const annotations = getModelAnnotations(AnnotationTestModel)
    expect(annotations.modelName).toBe('AnnotationTestModel')
    expect(annotations.columns).toHaveLength(1)
  })

  it('throws when annotations are missing', () => {
    expect(() => getModelAnnotations(MissingAnnotationModel)).toThrow(
      'No model annotations registered for MissingAnnotationModel',
    )
  })
})
