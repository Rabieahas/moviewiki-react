import { Link, useSearchParams } from 'react-router-dom';

export default function MovieItem({ item }) {
  const [searchParams] = useSearchParams();
  const search = searchParams.get('s');
  const poster = item.Poster && item.Poster !== 'N/A' ? item.Poster : '';
  const infoLink = search
    ? `/info/${item.imdbID}?s=${encodeURIComponent(search)}`
    : `/info/${item.imdbID}`;

  return (
    <article className="movie-card">
      <div className="poster-wrap">
        {poster ? (
          <img src={poster} alt={`${item.Title} poster`} loading="lazy" />
        ) : (
          <div className="poster-placeholder">NO POSTER</div>
        )}
        <span className="type-tag">{item.Type}</span>
      </div>

      <div className="movie-card-info">
        <div>
          <p className="movie-year">{item.Year}</p>
          <h2>{item.Title}</h2>
        </div>
        <Link
          className="more-button"
          to={infoLink}
        >
          MORE INFO <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
