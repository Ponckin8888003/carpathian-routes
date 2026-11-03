// Правила плану походу в одному місці. Чиста функція: без React, без стану.
export const MIN_DAYS = 1
export const MAX_DAYS = 7
export const ADVICE_REQUIRED_OVER_DAYS = 3
export const NOTES_MIN = 10
export const NOTES_MAX = 500

// input: { peakId, date, durationDays, notes, needsAdvice }.
// durationDays може бути рядком із поля форми або вже числом.
// Повертає { ok: false, errors } або { ok: true, errors: {}, value }.
export function validatePlan(input, peaks) {
  const errors = {}

  if (!peaks.some((peak) => peak.id === input.peakId)) {
    errors.peakId = 'Вершину не знайдено в каталозі.'
  }

  const date = String(input.date ?? '').trim()
  if (date === '') {
    errors.date = 'Вкажіть дату походу.'
  } else if (Number.isNaN(Date.parse(date))) {
    errors.date = 'Дата має бути коректною.'
  }

  // Number('') дорівнює 0, тому порожній рядок перевіряємо до перетворення.
  const daysText = String(input.durationDays ?? '').trim()
  const days = Number(daysText)
  let daysValid = false
  if (daysText === '') {
    errors.durationDays = 'Вкажіть тривалість у днях.'
  } else if (!Number.isInteger(days) || days < MIN_DAYS || days > MAX_DAYS) {
    errors.durationDays = `Тривалість — ціле число від ${MIN_DAYS} до ${MAX_DAYS} днів.`
  } else {
    daysValid = true
  }

  const notes = String(input.notes ?? '').trim()
  if (notes.length < NOTES_MIN || notes.length > NOTES_MAX) {
    errors.notes = `Нотатки мають містити від ${NOTES_MIN} до ${NOTES_MAX} символів.`
  }

  const needsAdvice = Boolean(input.needsAdvice)
  // Зв'язок полів перевіряємо, лише коли тривалість коректна.
  if (daysValid && days > ADVICE_REQUIRED_OVER_DAYS && !needsAdvice) {
    errors.needsAdvice = `Для походу довше ${ADVICE_REQUIRED_OVER_DAYS} днів потрібна порада щодо маршруту.`
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors }
  }

  return {
    ok: true,
    errors: {},
    value: { peakId: input.peakId, date, durationDays: days, notes, needsAdvice },
  }
}
