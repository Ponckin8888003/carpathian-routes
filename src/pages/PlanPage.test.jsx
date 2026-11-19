import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import PlanPage from './PlanPage.jsx'
import { testPeak, validInput, savedPlan } from '../test/fixtures.js'
import { deferred } from '../test/deferred.js'

function renderEditor(onSave) {
  return render(
    <PlanPage
      title="Новий план походу"
      peak={testPeak}
      onSave={onSave}
      onCancel={vi.fn()}
      submitLabel="Створити план"
    />,
  )
}

// Поле type="date" не має ролі, тому знаходимо його за підписом.
// Значення задаємо подією change: так надійніше за введення по символах.
async function fillValidForm(user) {
  fireEvent.change(screen.getByLabelText('Дата походу'), {
    target: { value: validInput.date },
  })
  const days = screen.getByRole('spinbutton', { name: /Тривалість/ })
  await user.clear(days)
  await user.type(days, String(validInput.durationDays))
  await user.type(
    screen.getByRole('textbox', { name: /Нотатки до походу/ }),
    validInput.notes,
  )
  await user.click(
    screen.getByRole('checkbox', { name: /Потрібна порада щодо маршруту/ }),
  )
}

test('не зберігає порожню форму та пояснює першу помилку', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  renderEditor(onSave)

  await user.click(screen.getByRole('button', { name: 'Створити план' }))

  const date = screen.getByLabelText('Дата походу')
  expect(date).toHaveAttribute('aria-invalid', 'true')
  expect(date).toHaveFocus()
  expect(screen.getByText('Вкажіть дату походу.')).toBeInTheDocument()
  expect(screen.getByRole('alert')).toHaveTextContent('Виправте позначені поля.')
  expect(onSave).not.toHaveBeenCalled()
})

test('передає нормалізовані поля й блокує повтор до відповіді', async () => {
  const user = userEvent.setup()
  const pending = deferred()
  const onSave = vi.fn().mockReturnValue(pending.promise)
  renderEditor(onSave)
  await fillValidForm(user)

  await user.click(screen.getByRole('button', { name: 'Створити план' }))

  const submit = screen.getByRole('button', { name: 'Збереження…' })
  expect(submit).toBeDisabled()
  expect(screen.getByRole('textbox', { name: /Нотатки до походу/ })).toBeDisabled()
  await user.click(submit)
  expect(onSave).toHaveBeenCalledTimes(1)
  expect(onSave).toHaveBeenCalledWith(validInput)

  await act(async () => {
    pending.resolve({ ok: true, record: savedPlan })
    await pending.promise
  })

  expect(screen.getByRole('button', { name: 'Створити план' })).toBeEnabled()
})

test('після відмови зберігає введення й дозволяє свідомий повтор', async () => {
  const user = userEvent.setup()
  const onSave = vi
    .fn()
    .mockResolvedValueOnce({ ok: false, message: 'Сервіс тимчасово недоступний.' })
    .mockResolvedValueOnce({ ok: true, record: savedPlan })
  renderEditor(onSave)
  await fillValidForm(user)

  await user.click(screen.getByRole('button', { name: 'Створити план' }))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Сервіс тимчасово недоступний.',
  )
  expect(screen.getByRole('textbox', { name: /Нотатки до походу/ })).toHaveValue(
    validInput.notes,
  )
  expect(screen.getByRole('spinbutton', { name: /Тривалість/ })).toHaveValue(2)
  expect(screen.getByLabelText('Дата походу')).toHaveValue(validInput.date)
  expect(
    screen.getByRole('checkbox', { name: /Потрібна порада щодо маршруту/ }),
  ).toBeChecked()

  await user.click(screen.getByRole('button', { name: 'Створити план' }))

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Створити план' })).toBeEnabled()
  })
  expect(onSave).toHaveBeenCalledTimes(2)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('тривалість понад три дні без поради не доходить до збереження', async () => {
  const user = userEvent.setup()
  const onSave = vi.fn()
  renderEditor(onSave)
  await fillValidForm(user)
  await user.click(
    screen.getByRole('checkbox', { name: /Потрібна порада щодо маршруту/ }),
  )
  const days = screen.getByRole('spinbutton', { name: /Тривалість/ })
  await user.clear(days)
  await user.type(days, '5')

  await user.click(screen.getByRole('button', { name: 'Створити план' }))

  expect(
    screen.getByText(/Для походу довше 3 днів потрібна порада/),
  ).toBeInTheDocument()
  expect(onSave).not.toHaveBeenCalled()
})
