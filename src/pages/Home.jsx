import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getDiscoverMovies, getMovieData } from '../api';
import MovieItem from '../components/MovieItem';

export default function Home() {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const inputRef = useRef(null);
  const nav = useNavigate();
  const searchTerm = searchParams.get('s')?.trim() || '';
  const isSearching = Boolean(searchTerm);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = searchTerm;
    }

    const controller = new AbortController();

    const doApi = async () => {
      setIsLoading(true);
      setError('');

      try {
        if (isSearching) {
          const data = await getMovieData({ s: searchTerm }, controller.signal);

          if (data.Response === 'False') {
            setList([]);
            setError(data.Error || 'No movies found. Try another search.');
            return;
          }

          setList(data.Search || []);
        } else {
          const movies = await getDiscoverMovies(controller.signal);

          if (movies.length === 0) {
            setList([]);
            setError('Could not load movies right now. Please try again.');
            return;
          }

          setList(movies);
        }
      } catch (requestError) {
        if (!axios.isCancel(requestError)) {
          setList([]);
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
  }, [isSearching, searchTerm]);

  const onSub = (event) => {
    event.preventDefault();
    const value = inputRef.current?.value.trim();

    if (value) {
      nav(`/?s=${encodeURIComponent(value)}`);
    }
  };

  const searchFor = (term) => nav(`/?s=${encodeURIComponent(term)}`);

  return (
    <main>
      <section className="hero">
        <div className="hero-inner">
          <p className="eyebrow"><span /> THE MOVIE DATABASE</p>
          <h1>Find your next<br /><em>great watch.</em></h1>
          <p className="hero-copy">
            Search thousands of films and discover the stories behind them.
          </p>

          <form onSubmit={onSub} className="search-form">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              ref={inputRef}
              type="search"
              placeholder="Search for a movie..."
              aria-label="Search movies"
              required
            />
            <button type="submit">SEARCH <span aria-hidden="true">→</span></button>
          </form>

          <div className="hero-foot">
            <span>POPULAR SEARCH</span>
            <button onClick={() => searchFor('batman')}>Batman</button>
            <button onClick={() => searchFor('superman')}>Superman</button>
            <button onClick={() => searchFor('lego')}>Lego</button>
          </div>
        </div>
        <div className="hero-decoration" aria-hidden="true">R</div>
      </section>

      <section className="results-section" aria-live="polite">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE THE COLLECTION</p>
            <h2>
              {isSearching ? (
                <>Results for <em>“{searchTerm}”</em></>
              ) : (
                <>Discover <em>movies</em></>
              )}
            </h2>
          </div>
          {!isLoading && list.length > 0 && (
            <span className="results-count">
              {isSearching ? `${list.length} TITLES` : 'FEATURED FILMS'}
            </span>
          )}
        </div>

        {isLoading && (
          <div className="message">
            <span className="loader" aria-hidden="true" />
            {isSearching ? 'Finding movies...' : 'Loading movies to discover...'}
          </div>
        )}

        {!isLoading && error && (
          <div className="message error-message" role="alert">{error}</div>
        )}

        {!isLoading && !error && (
          <div className="movie-grid">
            {list.map((item) => <MovieItem key={item.imdbID} item={item} />)}
          </div>
        )}
      </section>

      <footer className="site-footer">
        <span>MOVIEWIKI</span>
        <span>Movie information provided by OMDb</span>
      </footer>
    </main>
  );
}
