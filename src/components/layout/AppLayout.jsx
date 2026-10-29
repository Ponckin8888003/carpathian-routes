import SiteHeader from './SiteHeader.jsx'

// Спільна оболонка: заголовок, один main (вміст через children), підвал.
function AppLayout({ title, links, children }) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Перейти до вмісту
      </a>
      <SiteHeader title={title} links={links} />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <footer className="footer">Навчальний проєкт · ІФНТУНГ</footer>
    </>
  )
}

export default AppLayout
