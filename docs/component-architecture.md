# Компонентна архітектура «Карпатські маршрути»

## Ієрархія

```text
App
  AppLayout
    SiteHeader
      MainNav
    main
      PeakSelectionProvider            (власник вибору вершини)
        CatalogContainer               (читає контекст → props)
          HomePage                     (власник фільтрів через usePeakFilters)
            Section (Про сервіс)
            Section (Вершини)
              CatalogSummary
              PeakFilters
              PeakList
                PeakCard (для кожної вершини; локальний detailsOpen)
                  RoutesBadge
                  AppButton
                EmptyState (якщо нічого не знайдено)
        PlanContainer                  (читає контекст → props, key=selectedId)
          PlanPage                     (власник чернетки draft)
            Section (Підготовка плану походу)
              RoutesBadge
              TripPlanForm
                FormField (для кожного поля)
                AppButton
              TripPlanSummary
              AppButton (скасувати вибір)
              EmptyState (якщо вершину не вибрано)
    footer
```

Провайдер охоплює лише робочу область: `SiteHeader`, `MainNav` і підвал вибору
не потребують.

## Структура каталогів

```text
src/
  components/
    layout/      AppLayout, SiteHeader
    navigation/  MainNav
    peaks/       PeakCard, PeakList, PeakFilters, RoutesBadge, CatalogSummary
    plans/       TripPlanForm, TripPlanSummary
    ui/          Section, EmptyState, AppButton, FormField
  context/       PeakSelectionContext.js
  hooks/         usePeakFilters.js, usePeakSelection.js
  providers/     PeakSelectionProvider.jsx
  data/          peaks.js
  pages/         HomePage, PlanPage, CatalogContainer, PlanContainer
```

## Карта стану

| Значення | Природа | Початково | Власник | Споживачі | Скидання |
| --- | --- | --- | --- | --- | --- |
| `peaks` | Предметні дані | Масив із `peaks.js` | Модуль даних, передається з `App` | HomePage, провайдер | — |
| `detailsOpen` | Локальний стан UI | `false` | Конкретна `PeakCard` | Ця картка | Зникає при демонтуванні картки |
| `query`, `routesOnly` | Стан UI каталогу | `''`, `false` | `HomePage` (через `usePeakFilters`) | PeakFilters, список | Кнопка «Скинути фільтри» |
| `selectedId` | Спільний стан вибору | `null` | `PeakSelectionProvider` | Каталог і сторінка плану | «Скасувати вибір» |
| `draft` | Незбережена чернетка | порожні поля | `PlanPage` | TripPlanForm, TripPlanSummary | «Очистити поля», зміна вершини |
| `visiblePeaks` | Похідне | обчислюється | — | PeakList, лічильник | — |
| `selectedPeak` | Похідне | пошук за `selectedId` у повному масиві | — | PlanContainer | — |

Окремих `useState` для `visiblePeaks`, `selectedPeak`, кількості результатів і
тексту підсумку немає: вони обчислюються під час відображення.

## Контракти компонентів

| Компонент | Вхідні властивості | Домовленість |
| --- | --- | --- |
| AppLayout | title, links, children | Спільна оболонка з одним `main` |
| Section | id, title, children | `id` унікальний у документі |
| AppButton | children, type, variant, disabled, onClick, aria-* | `variant`: primary або secondary |
| PeakList | peaks, selectedId, onSelect, emptyTitle | Масив; порожній масив допустимий |
| PeakCard | peak, selected, onSelect | `selected` приходить ззовні; `detailsOpen` локальний |
| PeakFilters | query, routesOnly, onQueryChange, onRoutesOnlyChange, onReset | Керовані поля, стану не зберігає |
| HomePage | peaks, selectedId, onSelect | Власник фільтрів |
| PlanPage | peak, onClearSelection | `peak` може бути `undefined`; власник `draft` |
| TripPlanForm | idPrefix, peakName, draft, onDateChange, onNotesChange, onNeedsAdviceChange, onReset | Керована форма без власного стану |
| TripPlanSummary | peakName, draft | Читає той самий `draft` |

## Контракти подій

| Подія | Відправник | Власник стану | Зміна |
| --- | --- | --- | --- |
| `onSelect(id)` | PeakCard | PeakSelectionProvider | `selectedId = id` (якщо id відомий) |
| `onQueryChange(text)` | PeakFilters | HomePage | `query` |
| `onRoutesOnlyChange(flag)` | PeakFilters | HomePage | `routesOnly` |
| `onReset()` | PeakFilters | HomePage | скидає обидва фільтри, вибір не чіпає |
| `onDateChange(text)` | TripPlanForm | PlanPage | `draft.date` |
| `onNotesChange(text)` | TripPlanForm | PlanPage | `draft.notes` |
| `onNeedsAdviceChange(flag)` | TripPlanForm | PlanPage | `draft.needsAdvice` |
| `onReset()` | TripPlanForm | PlanPage | порожній `draft`, вибір зберігається |
| `onClearSelection()` | PlanPage | PeakSelectionProvider | `selectedId = null` |

## Правила часу існування

- Чернетка належить `PlanPage`. `PlanContainer` задає `key={selectedId ?? 'empty'}`:
  вибір іншої вершини або скасування вибору створює нову порожню чернетку.
  Повторний вибір тієї самої вершини чернетку не змінює.
- Фільтри не змінюють `selectedId`, тому приховання вибраної картки не скасовує
  вибір і не очищує чернетку. Локальний `detailsOpen` прихованої картки зникає.
- Після перезавантаження сторінки вибір, фільтри й чернетка повертаються до
  початкових значень: збереження ще не реалізовано.
- Чернетка не є збереженим планом і нічого не резервує.

## Ефект

`PlanPage` синхронізує `document.title` із вибраною вершиною. Залежність ефекту —
`title`; очищення відновлює попередній заголовок. Редагування полів чернетки
заголовок не змінює.

## Context API

Контекст містить лише вибір (`selectedId`, `selectedPeak`, `selectPeak`,
`clearSelection`). Фільтри, `detailsOpen` і `draft` залишаються в своїх
власників. Компоненти подання (картка, форма) контекст не читають: його адаптують
до props `CatalogContainer` і `PlanContainer`.

## Засоби керування станом

| Потреба | Засіб | Обґрунтування |
| --- | --- | --- |
| Розгортання опису | Локальний `useState` | Потрібне одній картці |
| Пошук і фільтр маршрутів | Стан сторінки + власний хук | Потрібні фільтрам і списку одного сценарію |
| Поля та підсумок чернетки | Підняття до `PlanPage` | Два сусідні компоненти бачать один об’єкт |
| Вибір вершини | Обмежений Context API | Один ідентифікатор узгоджує каталог і план |
| Видимі вершини, лічильники | Звичайні обчислення | Залежать від даних і фільтрів |
| Заголовок вкладки | `useEffect` | Синхронізація із зовнішньою властивістю браузера |

Для двох близьких гілок вистачило б підняття вибору до `App` через props;
контекст залишено як обґрунтований навчальний варіант із чіткою областю.

## Ключові рішення

1. **RoutesBadge** містить єдине правило підпису про наявність маршрутів.
2. **Section через children** задає заголовок і обрамлення, вміст визначає сторінка.
3. **PeakList окремо від PeakCard:** список відповідає за повторення й порожній
   результат, картка — за одну вершину та її локальне розгортання.
4. **Оформлення:** власні стилі в `src/index.css`, бібліотеку React Bootstrap
   не підключено; контракт `AppButton` дозволяє замінити його реалізацію.
