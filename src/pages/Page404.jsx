import { Link } from 'react-router-dom';

export default function Page404() {
  return (
    <main className="not-found">
      <p className="eyebrow">404 · PAGE NOT FOUND</p>
      <h1>This scene is missing.</h1>
      <Link className="more-button" to="/">RETURN HOME →</Link>
    </main>
  );
}
