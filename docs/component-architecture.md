# Компонентна архітектура «Карпатські маршрути»

## Маршрути й компонування

```text
BrowserRouter (main.jsx)
  App → Routes
    AppLayout (Outlet; PeakSelectionProvider)
      HomePage                          /
      CatalogContainer → PeakListPage   /peaks
      PeakDetailsPage                   /peaks/:peakId
      PlansLayout (Outlet)              /plans
        PlansPage                       /plans
        PlanCreatePage → PlanPage       /plans/new?peakId=...
        PlanEditPage → PlanPage         /plans/:planId/edit
      NotFoundPage                      *
```

`AppLayout` містить заголовок із меню (`SiteHeader`, `MainNav` на `NavLink`),
один `main` і підвал. Провайдер вибору розташований у `main` над `Outlet`, тому
вибір переживає клієнтські переходи між сторінками. `PlansLayout` додає лише
спільне меню розділу планів. Кожна сторінка має власний `h1` через `PageHeading`,
який також задає `document.title`.

## Структура каталогів

```text
src/
  components/
    layout/      AppLayout, SiteHeader, PlansLayout
    navigation/  MainNav
    peaks/       PeakCard, PeakList, PeakFilters, RoutesBadge, CatalogSummary
    plans/       TripPlanForm, TripPlanSummary
    ui/          Section, EmptyState, AppButton, FormField, PageHeading
  context/       PeakSelectionContext.js
  hooks/         usePeakFilters.js, usePeakSelection.js
  providers/     PeakSelectionProvider.jsx
  data/          peaks.js, plans.js
  pages/         HomePage, PeakListPage, CatalogContainer, PeakDetailsPage,
                 PlansPage, PlanPage, PlanCreatePage, PlanEditPage, NotFoundPage
```

## Де зберігається стан

| Значення | Де зберігається | Після перезавантаження |
| --- | --- | --- |
| Відкрита сторінка та її ідентифікатор | Шлях URL (`/peaks/:peakId`, `/plans/:planId/edit`) | Відновлюється з адреси |
| Пошук і фільтр «Лише з маршрутами» | Query parameters (`q`, `routes`) | Відновлюються з адреси |
| Вершина нового плану | `peakId` у query parameters | Визначається з адреси |
| Останній явний вибір вершини | `PeakSelectionProvider` (Context API) | Скидається |
| Введення у формі (`draft`) | Локальний стан `PlanPage` | Скидається |
| `detailsOpen` картки | Локальний стан `PeakCard` | Скидається |
| `visiblePeaks`, `selectedPeak` | Обчислюються | — |

Перегляд прямого посилання не залежить від історії вибору: деталі й редактор
визначаються адресою, а контекст зберігає лише останню дію користувача.

## Контракти компонентів

| Компонент | Вхідні властивості | Домовленість |
| --- | --- | --- |
| AppLayout | peaks | Оболонка з `Outlet` і провайдером вибору |
| MainNav | links | Пункти `{ to, label, end }`; активний пункт має `aria-current="page"` |
| PageHeading | title | Єдиний `h1` сторінки та власник `document.title` |
| PeakList | peaks, selectedId, onSelect, emptyTitle | Масив; порожній масив допустимий |
| PeakCard | peak, selected, onSelect | Заголовок — посилання на `/peaks/:peakId`, кнопка вибирає |
| PeakListPage | peaks, selectedId, onSelect | Фільтри читаються з URL через `usePeakFilters` |
| PeakDetailsPage | peaks | Вершину шукає за `useParams`; відсутня → `NotFoundPage` |
| PlansPage | plans, peaks | Посилання на редагування відносні: `{planId}/edit` |
| PlanCreatePage | peaks | Вершину задає `?peakId=`; без параметра — пояснення |
| PlanEditPage | plans, peaks | План за `planId`, вершина за `plan.peakId` |
| PlanPage | title, peak, initialDraft, onCancel, cancelLabel | Спільний редактор; `peak` завжди коректний, URL не читає |
| TripPlanForm | idPrefix, peakName, draft, on…Change, onReset | Керована форма без власного стану |
| NotFoundPage | title, message | Невідомий маршрут і відсутній запис |

## Правила переходів і часу існування

- Каталог читає фільтри з URL; введення тексту використовує `replace`, щоб кожна
  літера не створювала запис в історії. Перемикання прапорця й скидання фільтрів
  створюють окремі переходи. Пункт меню «Вершини» відкриває каталог без параметрів.
- `PlanCreatePage` і `PlanEditPage` задають `key` (`new-{id}`, `edit-{id}`) на
  `PlanPage`: інша вершина або інший запис створює новий стан редактора.
- Вихід із редактора демонтує `PlanPage`, тому чернетка зникає. Повторне
  відкриття запису знову показує дані з `data/plans.js`.
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
4. **Провайдер вибору в AppLayout:** один власник вибору, що переживає переходи.
5. **Оформлення:** власні стилі в `src/index.css`, React Bootstrap не підключено.
