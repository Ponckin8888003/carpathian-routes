import { describe, expect, test } from 'vitest'
import { normalizeAdvice, normalizeSort, selectPlans } from './selectPlans.js'
import { savedPlan, testPeak } from '../test/fixtures.js'

const peaks = [testPeak, { ...testPeak, id: 'syvulia', name: 'Сивуля' }]
const none = { query: '', advice: '', sort: '' }

describe('selectPlans', () => {
  test('поєднує пошук, пораду й порядок без зміни джерела', () => {
    const records = Object.freeze([
      Object.freeze({ ...savedPlan, id: 'p-1', durationDays: 4 }),
      Object.freeze({ ...savedPlan, id: 'p-2', durationDays: 1 }),
      Object.freeze({ ...savedPlan, id: 'p-3', needsAdvice: false }),
    ])

    const result = selectPlans(records, peaks, {
      query: ' ЗРАНКУ ',
      advice: 'yes',
      sort: 'days-desc',
    })

    expect(result.map((row) => row.id)).toEqual(['p-1', 'p-2'])
    expect(result[0].peakName).toBe('Говерла')
    expect(records.map((record) => record.id)).toEqual(['p-1', 'p-2', 'p-3'])
  })

  test('відсутність збігів не видаляє початковий запис', () => {
    const records = [savedPlan]
    const result = selectPlans(records, peaks, { ...none, query: 'немає такого збігу' })
    expect(result).toEqual([])
    expect(records).toEqual([savedPlan])
  })

  test('рівні значення сортування впорядковує за id', () => {
    const records = [
      { ...savedPlan, id: 'b' },
      { ...savedPlan, id: 'a' },
    ]
    const result = selectPlans(records, peaks, { ...none, sort: 'date-asc' })
    expect(result.map((row) => row.id)).toEqual(['a', 'b'])
  })

  test('сортує за назвою вершини українським порядком', () => {
    const records = [
      { ...savedPlan, id: 'p-1', peakId: 'syvulia' },
      { ...savedPlan, id: 'p-2', peakId: 'hoverla' },
    ]
    const result = selectPlans(records, peaks, { ...none, sort: 'peak' })
    expect(result.map((row) => row.peakName)).toEqual(['Говерла', 'Сивуля'])
  })

  test('план з відсутньою вершиною не ламає відбір', () => {
    const result = selectPlans([{ ...savedPlan, peakId: 'gone' }], peaks, none)
    expect(result[0].peakName).toBe('Вершина відсутня')
  })

  test.each(['zzz', 'constructor', 'toString'])(
    'невідоме значення умови %j не приховує плани',
    (value) => {
      const result = selectPlans([savedPlan], peaks, {
        query: '',
        advice: value,
        sort: value,
      })
      expect(result).toHaveLength(1)
    },
  )
})

describe('нормалізація умов адреси', () => {
  test('залишає лише відомі значення', () => {
    expect(normalizeAdvice('yes')).toBe('yes')
    expect(normalizeAdvice('all')).toBe('')
    expect(normalizeAdvice(null)).toBe('')
    expect(normalizeSort('peak')).toBe('peak')
    expect(normalizeSort('constructor')).toBe('')
    expect(normalizeSort(null)).toBe('')
  })
})
