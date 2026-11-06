import { peaks } from '../data/peaks.js'
import { validatePlan } from '../domain/planValidation.js'
import { ServiceError } from './ServiceError.js'

// Перевірка даних на межі сервісу. Вершини поки що локальний довідник.
export function toPlanInput(input) {
  const result = validatePlan(input, peaks)
  if (!result.ok) {
    throw new ServiceError('Перевірте поля плану.', {
      code: 'VALIDATION',
      errors: result.errors,
    })
  }
  return result.value
}

// Мінімальна перевірка структури прочитаного запису; створює окремий об'єкт.
export function toPlan(value) {
  const valid =
    value !== null &&
    typeof value === 'object' &&
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.peakId === 'string' &&
    typeof value.date === 'string' &&
    Number.isInteger(value.durationDays) &&
    typeof value.notes === 'string' &&
    typeof value.needsAdvice === 'boolean'

  if (!valid) {
    throw new ServiceError('Джерело повернуло некоректний запис плану.', {
      code: 'BAD_DATA',
    })
  }

  return {
    id: value.id,
    peakId: value.peakId,
    date: value.date,
    durationDays: value.durationDays,
    notes: value.notes,
    needsAdvice: value.needsAdvice,
  }
}

export function toPlanList(value) {
  if (!Array.isArray(value)) {
    throw new ServiceError('Джерело повернуло некоректний список.', {
      code: 'BAD_DATA',
    })
  }
  const records = value.map(toPlan)
  if (new Set(records.map((record) => record.id)).size !== records.length) {
    throw new ServiceError('Джерело повернуло повторні ідентифікатори.', {
      code: 'BAD_DATA',
    })
  }
  return records
}
