import MainNav from '../navigation/MainNav.jsx'

function SiteHeader({ title, links }) {
  return (
    <header className="site-header">
      <h1>{title}</h1>
      <MainNav links={links} />
    </header>
  )
}

export default SiteHeader
