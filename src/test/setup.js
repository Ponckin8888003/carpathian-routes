import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Без глобальних тестових функцій Testing Library не очищує DOM сам.
afterEach(() => {
  cleanup()
})
