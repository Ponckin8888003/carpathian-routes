import { useEffect } from 'react'

// Єдиний власник document.title: h1 і заголовок вкладки відповідають поточній сторінці.
function PageHeading({ title }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = `${title} | Карпатські маршрути`
    return () => {
      document.title = previousTitle
    }
  }, [title])

  return <h1>{title}</h1>
}

export default PageHeading
