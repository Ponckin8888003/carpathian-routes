# Компонентна архітектура «Карпатські маршрути»

## Маршрути й компонування

```text
BrowserRouter (main.jsx)
  App → Routes
    AppLayout (Outlet; PeakSelectionProvider, PlansProvider)
      HomePage                          /
      CatalogContainer → PeakListPage   /peaks
      PeakDetailsPage                   /peaks/:peakId
      PlansLayout (Outlet, PlanNotice)  /plans
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
    plans/       TripPlanForm, TripPlanSummary, PlanFilters, PlansTable, PlanNotice
    ui/          Section, EmptyState, AppButton, FormField, PageHeading
  context/       PeakSelectionContext.js, PlansContext.js
  domain/        planValidation.js
  hooks/         usePeakFilters.js, usePeakSelection.js, usePlans.js,
                 usePlanFilters.js, useDeletePlan.js
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
| Колекція планів | `PlansProvider` (Context API) | Повертаються початкові записи |
| Повідомлення про операцію (`notice`) | `PlansProvider` | Скидається |
| Останній явний вибір вершини | `PeakSelectionProvider` (Context API) | Скидається |
| Введення у формі (`draft`), `touched`, `attempted` | Локальний стан `PlanPage` | Скидається |
| `detailsOpen` картки | Локальний стан `PeakCard` | Скидається |
| `visiblePeaks`, `visiblePlans`, `selectedPeak`, помилки полів | Обчислюються | — |

Перегляд прямого посилання не залежить від історії вибору: деталі й редактор
визначаються адресою, а контекст зберігає лише останню дію користувача.

## Контракти компонентів

| Компонент | Вхідні властивості | Домовленість |
| --- | --- | --- |
| AppLayout | peaks, initialPlans | Оболонка з `Outlet` і провайдерами вибору та планів |
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
| PlanPage | title, peak, initialDraft, submitLabel, onSave, onCancel, cancelLabel | Власник чернетки; колекції не знає, `onSave(value)` повертає `{ ok }`; URL не читає |
| TripPlanForm | idPrefix, peakName, draft, errors, formError, submitLabel, onChange, onBlur, onSubmit, onReset | Керована форма без власного стану |
| PlansTable | rows, onDelete | Рядки містять `peakName`; дії над рядком надходять від власника |
| PlanFilters | query, advice, sort, on…Change, onReset | Керовані умови списку |
| NotFoundPage | title, message | Невідомий маршрут і відсутній запис |

## Контракти операцій над планами (Л 3.1)

| Операція | Вхід | Успіх | Помилка | Хто викликає |
| --- | --- | --- | --- | --- |
| `validatePlan(input, peaks)` | `{ peakId, date, durationDays, notes, needsAdvice }` | `{ ok: true, errors: {}, value }` | `{ ok: false, errors }` | `PlanPage`, `PlansProvider` |
| `createPlan(input)` | Поля плану без `id` | `{ ok: true, record }`; `id` створює провайдер | `{ ok: false, errors }` | `PlanCreatePage` |
| `updatePlan(id, input)` | Існуючий `id` і поля | `{ ok: true, record }`; `id` не змінюється | `{ ok: false, errors, message }` | `PlanEditPage` |
| `deletePlan(id)` | Існуючий `id` | `{ ok: true }` | `{ ok: false, message }` | `useDeletePlan` |
| `dismissNotice()` | — | Повідомлення очищено | — | `PlanNotice` |

Контракти не залежать від способу зберігання: у Л 3.2 змінюється лише
`PlansProvider`, а сторінки продовжують викликати ті самі операції.

## Правила переходів і часу існування

- Каталог читає фільтри з URL; введення тексту використовує `replace`, щоб кожна
  літера не створювала запис в історії. Перемикання прапорця й скидання фільтрів
  створюють окремі переходи. Пункт меню «Вершини» відкриває каталог без параметрів.
- `PlanCreatePage` і `PlanEditPage` задають `key` (`new-{id}`, `edit-{id}`) на
  `PlanPage`: інша вершина або інший запис створює новий стан редактора.
- Вихід із редактора демонтує `PlanPage`, тому чернетка зникає; якщо є незбережені
  зміни, перед виходом і скиданням запитується підтвердження. Повторне відкриття
  запису показує дані з колекції в `PlansProvider`.
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
6. **Незмінні оновлення:** `[...prev, record]`, `map`, `filter`; `id` створюється до `setState`.
7. **Оформлення:** власні стилі в `src/index.css`, React Bootstrap не підключено.
