import { describe, expect, test } from 'vitest'
import { validatePlan } from './planValidation.js'
import { testPeak, validInput } from '../test/fixtures.js'

const peaks = [testPeak]

describe('validatePlan', () => {
  test('нормалізує коректні поля, не змінюючи вхід', () => {
    const input = Object.freeze({
      ...validInput,
      date: ` ${validInput.date} `,
      notes: `  ${validInput.notes}  `,
      durationDays: '2',
      id: 'injected-id',
    })

    const result = validatePlan(input, peaks)

    expect(result).toEqual({ ok: true, errors: {}, value: validInput })
    expect(result.value).not.toHaveProperty('id')
    expect(input.durationDays).toBe('2')
    expect(input.notes.startsWith(' ')).toBe(true)
  })

  test.each(['', '0', '1.5', '8', 'abc'])('відхиляє тривалість %j', (durationDays) => {
    const result = validatePlan({ ...validInput, durationDays }, peaks)
    expect(result.ok).toBe(false)
    expect(result.errors.durationDays).toBeTruthy()
  })

  test.each([1, 7])('приймає граничну тривалість %i', (durationDays) => {
    const result = validatePlan({ ...validInput, durationDays }, peaks)
    expect(result.ok).toBe(true)
  })

  test('для походу довше трьох днів вимагає пораду щодо маршруту', () => {
    const long = validatePlan(
      { ...validInput, durationDays: 4, needsAdvice: false },
      peaks,
    )
    expect(long.ok).toBe(false)
    expect(long.errors.needsAdvice).toBeTruthy()

    const short = validatePlan(
      { ...validInput, durationDays: 3, needsAdvice: false },
      peaks,
    )
    expect(short.ok).toBe(true)
  })

  test('зв’язок тривалості й поради не додає другої помилки до некоректної тривалості', () => {
    const result = validatePlan(
      { ...validInput, durationDays: '9', needsAdvice: false },
      peaks,
    )
    expect(result.errors.durationDays).toBeTruthy()
    expect(result.errors.needsAdvice).toBeUndefined()
  })

  test('відхиляє невідому вершину', () => {
    const result = validatePlan({ ...validInput, peakId: 'peak-missing' }, peaks)
    expect(result.errors.peakId).toBeTruthy()
  })

  test.each([9, 501])('відхиляє нотатки завдовжки %i', (length) => {
    const result = validatePlan({ ...validInput, notes: 'а'.repeat(length) }, peaks)
    expect(result.errors.notes).toBeTruthy()
  })

  test.each([10, 500])('приймає нотатки завдовжки %i', (length) => {
    const result = validatePlan({ ...validInput, notes: 'а'.repeat(length) }, peaks)
    expect(result.ok).toBe(true)
  })

  test.each(['', '2026-02-30', '2026-02-29', '2026-13-01', '15.08.2026', 'March 5 2026'])(
    'відхиляє дату %j',
    (date) => {
      const result = validatePlan({ ...validInput, date }, peaks)
      expect(result.ok).toBe(false)
      expect(result.errors.date).toBeTruthy()
    },
  )

  test.each(['2026-02-28', '2028-02-29'])('приймає існуючу дату %s', (date) => {
    const result = validatePlan({ ...validInput, date }, peaks)
    expect(result.ok).toBe(true)
    expect(result.value.date).toBe(date)
  })
})
