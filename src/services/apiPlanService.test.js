import { afterEach, expect, test, vi } from 'vitest'
import { createApiPlanService } from './apiPlanService.js'
import { savedPlan, validInput } from '../test/fixtures.js'

afterEach(() => {
  vi.unstubAllGlobals()
})

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

test('відхиляє HTTP 404 замість удаваного успіху', async () => {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 404 }))
  vi.stubGlobal('fetch', fetchMock)
  const service = createApiPlanService('https://example.test/api')

  await expect(service.getById('missing')).rejects.toMatchObject({
    code: 'NOT_FOUND',
    status: 404,
  })
  expect(fetchMock).toHaveBeenCalledWith(
    'https://example.test/api/plans/missing',
    expect.objectContaining({ method: 'GET' }),
  )
})

test('після DELETE 204 не намагається читати JSON', async () => {
  const response = new Response(null, { status: 204 })
  const readJson = vi.spyOn(response, 'json')
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  const service = createApiPlanService('https://example.test/api')

  await expect(service.delete('plan-test-001')).resolves.toBeUndefined()
  expect(readJson).not.toHaveBeenCalled()
  expect(fetchMock).toHaveBeenCalledWith(
    'https://example.test/api/plans/plan-test-001',
    expect.objectContaining({ method: 'DELETE' }),
  )
})

test.each([
  { label: 'неправильна оболонка', body: { items: [] } },
  { label: 'тип тривалості', body: [{ ...savedPlan, durationDays: 'two' }] },
  { label: 'повторний id', body: [savedPlan, { ...savedPlan }] },
])('відхиляє несумісну структуру: $label', async ({ body }) => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(body)))
  const service = createApiPlanService('https://example.test/api')

  await expect(service.getAll()).rejects.toMatchObject({ code: 'BAD_DATA' })
})

test('відповідь не у форматі JSON дає BAD_DATA', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(new Response('<html>', { status: 200 })),
  )
  const service = createApiPlanService('https://example.test/api')

  await expect(service.getAll()).rejects.toMatchObject({ code: 'BAD_DATA' })
})

test('збій мережі дає NETWORK без технічних подробиць', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))
  const service = createApiPlanService('https://example.test/api')

  await expect(service.getAll()).rejects.toMatchObject({ code: 'NETWORK' })
})

test('create надсилає нормалізовані поля без id', async () => {
  const fetchMock = vi.fn().mockResolvedValue(json({ ...validInput, id: 'plan-new' }, 201))
  vi.stubGlobal('fetch', fetchMock)
  const service = createApiPlanService('https://example.test/api')

  const record = await service.create({ ...validInput, durationDays: '2', id: 'x' })

  expect(record.id).toBe('plan-new')
  const [, options] = fetchMock.mock.calls[0]
  expect(options.method).toBe('POST')
  expect(JSON.parse(options.body)).toEqual(validInput)
})

test('некоректні поля відхиляються до звернення до мережі', async () => {
  const fetchMock = vi.fn()
  vi.stubGlobal('fetch', fetchMock)
  const service = createApiPlanService('https://example.test/api')

  await expect(
    service.create({ ...validInput, date: '2026-02-30' }),
  ).rejects.toMatchObject({ code: 'VALIDATION' })
  expect(fetchMock).not.toHaveBeenCalled()
})
