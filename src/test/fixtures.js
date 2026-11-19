import { peaks } from '../data/peaks.js'

// Дані тієї самої предметної області: вершина з довідника й коректні поля плану.
export const testPeak = peaks.find((peak) => peak.id === 'hoverla')

export const validInput = {
  peakId: 'hoverla',
  date: '2026-08-15',
  durationDays: 2,
  notes: 'Підйом з друзями, вихід зранку.',
  needsAdvice: true,
}

export const savedPlan = {
  ...validInput,
  id: 'plan-test-001',
}
