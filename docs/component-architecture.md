# Компонентна архітектура «Карпатські маршрути» (Л 1.2)

## Ієрархія

```text
App
  AppLayout
    SiteHeader
      MainNav
    main
      HomePage
        Section (Про сервіс)
        Section (Вершини)
          CatalogSummary
          PeakList
            PeakCard (для кожної вершини)
              RoutesBadge
            EmptyState (якщо масив порожній)
      PlanPage
        Section (Підготовка плану походу)
          RoutesBadge
          TripPlanPreview
            FormField (для кожного поля)
            AppButton (кнопки)
          EmptyState (якщо вершини немає)
    footer
```

`HomePage` і `PlanPage` передаються в `AppLayout` через `children`, тому
оболонка їх не імпортує. Зараз обидві сторінки показано на одній HTML-сторінці;
окремі маршрути з’являться в Л 2.2.

## Структура каталогів

```text
src/
  components/
    layout/      AppLayout, SiteHeader
    navigation/  MainNav
    peaks/       PeakCard, PeakList, RoutesBadge, CatalogSummary
    plans/       TripPlanPreview
    ui/          Section, EmptyState, AppButton, FormField
  data/          peaks.js
  pages/         HomePage, PlanPage
```

## Контракти компонентів

| Компонент | Вхідні властивості | Домовленість |
| --- | --- | --- |
| AppLayout | title, links, children | Створює спільну оболонку з одним `main` |
| Section | id, title, children | `id` унікальний у документі |
| PeakList | peaks | Масив вершин; порожній масив допустимий |
| PeakCard | peak | Коректний запис із полями моделі Л 1.1 |
| RoutesBadge | hasRoutes | Логічне значення, дані не змінює |
| PlanPage | peak | Вершина або `undefined` (тоді пояснення) |
| FormField | id, label, hint, children | Вкладене поле має той самий `id` і `aria-describedby` для підказки |
| TripPlanPreview | idPrefix, peakName | Унікальний префікс; макет без збереження |
| AppButton | children, type, variant, disabled | `variant`: primary або secondary |

## Ключові рішення

1. **RoutesBadge.** Підпис про наявність маршрутів був би потрібен і в картці, і
   на сторінці плану походу. Тепер правило одне: зміна тексту виконується в
   одному файлі й діє скрізь.
2. **Section через children.** Заголовок і обрамлення секції повторюються
   тричі (про сервіс, вершини, план походу), а вміст секції визначає сторінка.
3. **PeakList окремо від PeakCard.** Список відповідає за повторення карток і
   порожній результат, картка — за одну вершину. Додавання вершини в
   `peaks.js` не потребує копіювання JSX.
4. **Оформлення.** Використано власні стилі (`src/index.css`): потреби
   невеликі — кнопка, поле й картка. React Bootstrap не підключено, щоб не
   додавати залежність і глобальні стилі. Контракт `AppButton` дозволяє
   замінити його внутрішню реалізацію без змін у місцях використання.
