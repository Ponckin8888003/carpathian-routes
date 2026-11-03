// Початкові плани походів. Їх копіює PlansProvider при першому показі застосунку.
// Сторінки не читають цей масив напряму: поточну колекцію дає контекст.
export const plans = [
  {
    id: 'plan-001',
    peakId: 'hoverla',
    date: '2026-08-15',
    durationDays: 1,
    notes: 'Похід на Говерлу з друзями, вихід зранку.',
    needsAdvice: true,
  },
  {
    id: 'plan-002',
    peakId: 'brebeneskul',
    date: '2026-09-05',
    durationDays: 2,
    notes: 'Дводенний маршрут через Чорногору.',
    needsAdvice: false,
  },
]
