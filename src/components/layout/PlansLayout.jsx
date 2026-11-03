import { NavLink, Outlet } from 'react-router'
import PlanNotice from '../plans/PlanNotice.jsx'

// Вкладена оболонка розділу «Плани походів»: спільне меню для списку й форм.
function PlansLayout() {
  return (
    <>
      <nav aria-label="Навігація розділом планів">
        <ul className="nav-list sub-nav">
          <li>
            <NavLink to="." end>
              Список планів
            </NavLink>
          </li>
          <li>
            <NavLink to="new">Новий план</NavLink>
          </li>
        </ul>
      </nav>
      <p>Локальні дані зберігаються до перезавантаження сторінки.</p>
      <PlanNotice />
      <Outlet />
    </>
  )
}

export default PlansLayout
