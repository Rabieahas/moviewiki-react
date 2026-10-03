import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { getMovieData } from '../api';

export default function Info() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const nav = useNavigate();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const doApi = async () => {
      setMovie(null);
      setIsLoading(true);
      setError('');

      try {
        const data = await getMovieData(
          { i: id, plot: 'full' },
          controller.signal,
        );

        if (data.Response === 'False') {
          setError(data.Error || 'Movie details could not be found.');
          return;
        }

        setMovie(data);
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setError('Could not connect to the movie service. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    doApi();

    return () => controller.abort();
  }, [id]);

  const goBack = () => {
    const query = searchParams.get('s');
    nav(query ? `/?s=${encodeURIComponent(query)}` : '/');
  };

  return (
    <main className="info-page">
      <div className="info-container">
        <button className="back-button" onClick={goBack}>
          ← <span>BACK TO RESULTS</span>
        </button>

        {isLoading && (
          <div className="message">
            <span className="loader" aria-hidden="true" /> Loading movie details...
          </div>
        )}

        {!isLoading && error && (
          <div className="message error-message" role="alert">{error}</div>
        )}

        {!isLoading && movie && <MovieDetails movie={movie} />}
      </div>
    </main>
  );
}

function MovieDetails({ movie }) {
  const poster = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '';
  const rating = movie.imdbRating && movie.imdbRating !== 'N/A'
    ? movie.imdbRating
    : '—';
  const runtime = movie.Runtime !== 'N/A' ? ` · ${movie.Runtime}` : '';

  return (
    <article className="info-card">
      <div className="info-poster-wrap">
        {poster ? (
          <img className="info-poster" src={poster} alt={`${movie.Title} poster`} />
        ) : (
          <div className="poster-placeholder">NO POSTER</div>
        )}
      </div>

      <div className="info-content">
        <p className="eyebrow">{movie.Type} · {movie.Year}{runtime}</p>
        <h1>{movie.Title}</h1>

        <div className="rating" aria-label={`IMDb rating: ${rating}`}>
          <span aria-hidden="true">★</span>
          <strong>{rating}</strong>
          <small> IMDb RATING</small>
        </div>

        <div className="info-rule" />
        <p className="plot">
          {movie.Plot && movie.Plot !== 'N/A'
            ? movie.Plot
            : 'No plot information is available.'}
        </p>

        <dl className="movie-facts">
          <MovieFact label="DIRECTOR" value={movie.Director} />
          <MovieFact label="CAST" value={movie.Actors} />
          <MovieFact label="GENRE" value={movie.Genre} />
          <MovieFact label="RELEASED" value={movie.Released} />
        </dl>
      </div>
    </article>
  );
}

function MovieFact({ label, value }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value && value !== 'N/A' ? value : 'N/A'}</dd>
    </div>
  );
}
