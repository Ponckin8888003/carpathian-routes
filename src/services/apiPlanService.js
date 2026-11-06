import { ServiceError } from './ServiceError.js'
import { toPlan, toPlanInput, toPlanList } from './planContract.js'

// Адаптер того самого контракту через fetch.
// GET /plans, GET /plans/:id, POST /plans, PUT /plans/:id, DELETE /plans/:id.
// Якщо справжнє API має інші шляхи чи формат JSON, зміни роблять лише тут.
const statusMessages = {
  400: 'Сервіс відхилив дані плану.',
  401: 'Для цієї дії потрібна автентифікація.',
  403: 'Сервіс не дозволяє цю дію.',
  404: 'План не знайдено.',
  409: 'Дані змінилися. Оновіть їх перед повторною дією.',
  422: 'Сервіс не прийняв значення полів.',
  429: 'Забагато запитів. Повторіть дію пізніше.',
}

export function createApiPlanService(baseUrl) {
  if (!baseUrl?.trim()) {
    throw new ServiceError('Не налаштовано адресу API.', { code: 'CONFIG' })
  }
  const base = baseUrl.trim().replace(/\/+$/, '')

  async function request(path, { method = 'GET', body, signal } = {}) {
    let response
    try {
      response = await fetch(`${base}${path}`, {
        method,
        signal,
        headers: {
          Accept: 'application/json',
          ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      })
    } catch (error) {
      if (error.name === 'AbortError') throw error
      throw new ServiceError('Не вдалося зв’язатися із сервісом.', {
        code: 'NETWORK',
      })
    }

    // fetch не відхиляє Promise для 404 чи 500, тому статус перевіряємо явно.
    if (!response.ok) {
      throw new ServiceError(
        statusMessages[response.status] ??
          'Сервіс тимчасово не може виконати дію.',
        {
          code: response.status === 404 ? 'NOT_FOUND' : 'HTTP',
          status: response.status,
        },
      )
    }

    // Для 204 тіла немає, JSON не читаємо.
    if (response.status === 204) return undefined

    try {
      return await response.json()
    } catch (error) {
      if (error.name === 'AbortError') throw error
      throw new ServiceError('Сервіс повернув відповідь не у форматі JSON.', {
        code: 'BAD_DATA',
      })
    }
  }

  function recordPath(id) {
    return `/plans/${encodeURIComponent(id)}`
  }

  return {
    async getAll({ signal } = {}) {
      return toPlanList(await request('/plans', { signal }))
    },
    async getById(id, { signal } = {}) {
      const record = toPlan(await request(recordPath(id), { signal }))
      if (record.id !== id) {
        throw new ServiceError('Сервіс повернув інший план.', {
          code: 'BAD_DATA',
        })
      }
      return record
    },
    async create(input) {
      return toPlan(
        await request('/plans', { method: 'POST', body: toPlanInput(input) }),
      )
    },
    async update(id, input) {
      const record = toPlan(
        await request(recordPath(id), {
          method: 'PUT',
          body: toPlanInput(input),
        }),
      )
      if (record.id !== id) {
        throw new ServiceError('Сервіс змінив ідентифікатор плану.', {
          code: 'BAD_DATA',
        })
      }
      return record
    },
    async delete(id) {
      await request(recordPath(id), { method: 'DELETE' })
    },
  }
}
