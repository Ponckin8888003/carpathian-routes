import { NavLink, Outlet } from 'react-router'
import PlanNotice from '../plans/PlanNotice.jsx'
import PlansGate from '../plans/PlansGate.jsx'
import { dataSource } from '../../services/planService.js'

const storageNote =
  dataSource === 'api'
    ? 'Плани зберігаються у зовнішньому сервісі.'
    : 'Плани зберігаються локально в цьому браузері та лишаються після перезавантаження.'

// Вкладена оболонка розділу «Плани походів»: меню, пояснення про джерело даних,
// повідомлення про результат і обмежувач станів читання.
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
      <p className="storage-note">{storageNote}</p>
      <PlanNotice />
      <PlansGate>
        <Outlet />
      </PlansGate>
    </>
  )
}

export default PlansLayout
