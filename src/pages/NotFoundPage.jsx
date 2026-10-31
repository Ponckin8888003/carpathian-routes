import { Link } from 'react-router'
import PageHeading from '../components/ui/PageHeading.jsx'

// Використовується для невідомої адреси та для відсутнього запису.
function NotFoundPage({
  title = '404: сторінку не знайдено',
  message = 'Перевірте адресу або перейдіть до каталогу вершин.',
}) {
  return (
    <>
      <PageHeading title={title} />
      <p>{message}</p>
      <p>
        <Link to="/peaks">Відкрити каталог вершин</Link>
      </p>
      <p>
        <Link to="/">На головну</Link>
      </p>
    </>
  )
}

export default NotFoundPage
