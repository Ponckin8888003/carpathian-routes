# Компонентна архітектура «Карпатські маршрути»

## Маршрути й компонування

```text
BrowserRouter (main.jsx)
  App → Routes
    AppLayout (Outlet; PeakSelectionProvider, PlansProvider)
      HomePage                          /
      CatalogContainer → PeakListPage   /peaks
      PeakDetailsPage                   /peaks/:peakId
      PlansLayout (PlanNotice, PlansGate → Outlet)  /plans
        PlansPage                       /plans
        PlanCreatePage → PlanPage       /plans/new?peakId=...
        PlanDetailsPage                 /plans/:planId
        PlanEditPage → PlanPage         /plans/:planId/edit
      NotFoundPage                      *
```

`AppLayout` містить заголовок із меню (`SiteHeader`, `MainNav` на `NavLink`),
один `main` і підвал. Провайдери вибору й планів розташовані в `main` над `Outlet`, тому
вибір і колекція планів переживають клієнтські переходи між сторінками. `PlansLayout` додає
спільне меню розділу, пояснення про локальні дані та `PlanNotice`. Кожна сторінка має власний `h1` через `PageHeading`,
який також задає `document.title`.

## Структура каталогів

```text
src/
  components/
    layout/      AppLayout, SiteHeader, PlansLayout
    navigation/  MainNav
    peaks/       PeakCard, PeakList, PeakFilters, RoutesBadge, CatalogSummary
    plans/       TripPlanForm, TripPlanSummary, PlanFilters, PlansTable, PlanNotice,
                 PlansGate, AdviceBadge, MockFailurePanel (лише розроблення)
    ui/          Section, EmptyState, AppButton, FormField, PageHeading
  context/       PeakSelectionContext.js, PlansContext.js
  domain/        planValidation.js
  services/      ServiceError.js, planContract.js, mockPlanService.js,
                 apiPlanService.js, planService.js
  hooks/         usePeakFilters.js, usePeakSelection.js, usePlans.js,
                 usePlanFilters.js, useDeletePlan.js, usePlanRecord.js
  providers/     PeakSelectionProvider.jsx, PlansProvider.jsx
  data/          peaks.js, plans.js
  pages/         HomePage, PeakListPage, CatalogContainer, PeakDetailsPage,
                 PlansPage, PlanPage, PlanCreatePage, PlanEditPage, PlanDetailsPage, NotFoundPage
```

## Де зберігається стан

| Значення | Де зберігається | Після перезавантаження |
| --- | --- | --- |
| Відкрита сторінка та її ідентифікатор | Шлях URL (`/peaks/:peakId`, `/plans/:planId/edit`) | Відновлюється з адреси |
| Пошук і фільтр «Лише з маршрутами» | Query parameters (`q`, `routes`) | Відновлюються з адреси |
| Пошук, фільтр поради та сортування планів | Query parameters (`q`, `advice`, `sort`) | Відновлюються з адреси |
| Вершина нового плану | `peakId` у query parameters | Визначається з адреси |
| Джерело планів | `planService` (mock у `localStorage` або API) | Зберігається в джерелі |
| Знімок підтверджених планів, `status`, `error`, `isMutating` | `PlansProvider` (Context API) | Читається з джерела знову |
| Повідомлення про операцію (`notice`) | `PlansProvider` | Скидається |
| `isSubmitting` форми | Локальний стан `PlanPage` | Скидається |
| Останній явний вибір вершини | `PeakSelectionProvider` (Context API) | Скидається |
| Введення у формі (`draft`), `touched`, `attempted` | Локальний стан `PlanPage` | Скидається |
| `detailsOpen` картки | Локальний стан `PeakCard` | Скидається |
| `visiblePeaks`, `visiblePlans`, `selectedPeak`, помилки полів | Обчислюються | — |

Перегляд прямого посилання не залежить від історії вибору: деталі й редактор
визначаються адресою, а контекст зберігає лише останню дію користувача.

## Контракти компонентів

| Компонент | Вхідні властивості | Домовленість |
| --- | --- | --- |
| AppLayout | peaks | Оболонка з `Outlet` і провайдерами вибору та планів |
| MainNav | links | Пункти `{ to, label, end }`; активний пункт має `aria-current="page"` |
| PageHeading | title | Єдиний `h1` сторінки та власник `document.title` |
| PeakList | peaks, selectedId, onSelect, emptyTitle | Масив; порожній масив допустимий |
| PeakCard | peak, selected, onSelect | Заголовок — посилання на `/peaks/:peakId`, кнопка вибирає |
| PeakListPage | peaks, selectedId, onSelect | Фільтри читаються з URL через `usePeakFilters` |
| PeakDetailsPage | peaks | Вершину шукає за `useParams`; відсутня → `NotFoundPage` |
| PlansPage | peaks | Колекція з `usePlans`, умови з URL; посилання відносні |
| PlanDetailsPage | peaks | План за `planId`; видалення з підтвердженням |
| PlanCreatePage | peaks | Вершину задає `?peakId=`; без параметра — пояснення |
| PlanEditPage | peaks | План з контексту за `planId`, вершина за `plan.peakId` |
| PlanPage | title, peak, initialDraft, submitLabel, onSave, onCancel, cancelLabel | Власник чернетки; колекції не знає, `await onSave(value)` повертає `{ ok }`; під час запису блокується; URL не читає |
| TripPlanForm | idPrefix, peakName, draft, errors, formError, submitLabel, onChange, onBlur, onSubmit, onReset | Керована форма без власного стану |
| PlansTable | rows, onDelete, disabled | Рядки містять `peakName`; дії над рядком надходять від власника |
| PlansGate | children | Показує завантаження або помилку з повтором; сторінки бачать лише успішне читання |
| PlanFilters | query, advice, sort, on…Change, onReset | Керовані умови списку |
| NotFoundPage | title, message | Невідомий маршрут і відсутній запис |

## Межі відповідальності (Л 3.2)

| Частина | Відповідальність | Чого не знає |
| --- | --- | --- |
| TripPlanForm | Поля, повідомлення, стан подання | URL, HTTP, `localStorage` |
| Маршрутна сторінка | Параметри маршруту, сценарій, перехід після успіху | Формат мережевого пакета |
| PlansProvider | Знімок колекції, стани операцій, синхронізація | Спосіб збереження в адаптері |
| planService | Єдина точка вибору реалізації | JSX і навігація |
| Mock або API адаптер | Читання, запис, перетворення даних, помилки | Стан полів форми |
| planValidation | Предметні правила й нормалізація | React, мережа, сховище |

```text
Сторінки та форми
  ↓
PlansProvider / хуки
  ↓
planService
  ↓
mockPlanService  або  apiPlanService
  ↓
localStorage     або  REST API
```

## Контракти операцій над планами

Сервіс отримує нормалізовані поля без `id`; для створення `id` визначає джерело, для оновлення він незмінний. Усі ідентифікатори — рядки. Сервіс відхиляє Promise, а провайдер перетворює результат на `{ ok: true, record }` або `{ ok: false, message, errors, code }`.

| Операція | Вхід | Успіх | Помилка | Хто викликає |
| --- | --- | --- | --- | --- |
| `validatePlan(input, peaks)` | Поля плану | `{ ok: true, value }` | `{ ok: false, errors }` | `PlanPage`, `planContract` |
| `planService.getAll({ signal })` | — | Масив планів | Виняток або скасування | `PlansProvider` |
| `planService.getById(id, { signal })` | `id` | Один план | `NOT_FOUND` | `usePlanRecord` (за потреби) |
| `createPlan(input)` | Поля без `id` | `{ ok: true, record }` | `{ ok: false, … }` | `PlanCreatePage` |
| `updatePlan(id, input)` | `id` і поля | `{ ok: true, record }`; `id` не змінюється | `{ ok: false, … }` | `PlanEditPage` |
| `deletePlan(id)` | `id` | `{ ok: true }` | `{ ok: false, message }` | `useDeletePlan` |
| `reload()` | — | Новий знімок | Стан `error` з повтором | `PlansGate`, `PlansPage` |
| `dismissNotice()` | — | Повідомлення очищено | — | `PlanNotice` |

Стани читання й запису:

| Стан | Що показано | Чого не стверджується |
| --- | --- | --- |
| `loading` | «Завантаження планів…», `aria-busy` | Що планів немає |
| `success`, список не порожній | Таблиця й дії | Автоматична синхронізація з іншими клієнтами |
| `success`, список порожній | «Планів ще немає.» і перехід до каталогу | Що сталася помилка |
| `error` | Причина й «Спробувати ще раз» | Що джерело повернуло порожній список |
| запис триває | «Збереження плану…» / «Опрацювання зміни…», блокування | Що зміни вже підтверджені |

Порожня колекція й «за умовами нічого не знайдено» — різні стани; другий перевіряється лише після успішного читання.

## Синхронізація та її межі

Колекція змінюється лише після успіху сервісу, повернений запис застосовується до знімка. Читання має номер версії та `AbortController`: відповідь, що запізнилась, не затирає новіший знімок. Запис блокує повторну команду (`mutationLock`) і скасовує активне читання. Деталі й редактор читають той самий знімок; `usePlanRecord` (getById) підготовлено для випадків часткового списку чи пагінації. Зміни іншої вкладки з’являються після «Оновити дані». Автоматичного повтору запису немає: повтор POST міг би створити дублікат.

## Правила переходів і часу існування

- Каталог читає фільтри з URL; введення тексту використовує `replace`, щоб кожна
  літера не створювала запис в історії. Перемикання прапорця й скидання фільтрів
  створюють окремі переходи. Пункт меню «Вершини» відкриває каталог без параметрів.
- `PlanCreatePage` і `PlanEditPage` задають `key` (`new-{id}`, `edit-{id}`) на
  `PlanPage`: інша вершина або інший запис створює новий стан редактора.
- Вихід із редактора демонтує `PlanPage`, тому чернетка зникає; якщо є незбережені
  зміни, перед виходом і скиданням запитується підтвердження. Повторне відкриття
  запису показує дані з колекції в `PlansProvider`.
- Сторінки переходять лише після підтвердженого результату (`await`) і лише якщо сторінка ще активна (`pageAlive`, `activeId`).
- Після створення плану виконується `navigate('/plans/{id}', { replace: true })`,
  після видалення зі сторінки плану — `navigate('/plans', { replace: true })`.
- Видалення завжди проходить через `window.confirm` у `useDeletePlan`.
- «Скасувати чернетку й очистити вибір» очищує вибір і виконує
  `navigate('/peaks', { replace: true })`.
- Розгортання описів карток не відновлюється після переходу: компоненти демонтуються.
- Невідомий маршрут (`*`) і відсутній запис за відомим шаблоном
  (`/peaks/missing`) обробляються окремо; в обох випадках є заголовок і посилання
  для продовження.

## Прямі адреси та хостинг

У режимі розроблення й `npm run preview` Vite повертає `index.html` для клієнтських
маршрутів. На майбутньому хостингу сервер статичних файлів має повертати
`index.html` для адрес на кшталт `/plans/plan-001/edit`, зберігаючи коректну видачу
статичних ресурсів. Застосунок розрахований на розміщення в корені сайту.

## Ключові рішення

1. **RoutesBadge** містить єдине правило підпису про наявність маршрутів.
2. **Фільтри в URL** без дублювання у `useState`: адресу каталогу можна скопіювати.
3. **Спільний редактор PlanPage** використовується для створення й редагування;
   маршрутні сторінки перевіряють запис і передають його редактору.
4. **Провайдери в AppLayout:** один власник вибору й один власник колекції планів.
5. **Єдине джерело правил:** `validatePlan` викликають і форма, і провайдер.
6. **Незмінні оновлення:** `[...prev, record]`, `map`, `filter`; `id` створює джерело.
7. **Єдина точка вибору джерела:** `planService.js`; компоненти не імпортують адаптери.
8. **Без прихованого відкату:** помилка обраного API не підміняється mock-даними.
9. **Оформлення:** власні стилі в `src/index.css`, React Bootstrap не підключено.
