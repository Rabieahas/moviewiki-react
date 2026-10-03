import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Header() {
  const nav = useNavigate();
  const location = useLocation();

  const goHome = () => {
    if (location.pathname !== '/') {
      nav('/');
      return;
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/" aria-label="ReelFind home">
          <span className="brand-mark" aria-hidden="true">▶</span>
          <span>MOVIE<span className="brand-light">WIKI</span></span>
        </Link>

        <nav aria-label="Main navigation">
          <button className="nav-link" onClick={goHome}>Discover</button>
          <span className="header-note">YOUR NEXT FAVORITE FILM</span>
        </nav>
      </div>
    </header>
  );
}
