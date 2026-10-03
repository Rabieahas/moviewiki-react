import axios from 'axios';

const API_URL = 'https://www.omdbapi.com/';
const API_KEYS = ['5a292f28', '90781f94'];
const DISCOVER_SEARCHES = ['batman', 'spider-man', 'harry potter', 'star wars'];

export async function getMovieData(params, signal) {
  let lastResponse;
  let lastError;

  for (const apikey of API_KEYS) {
    try {
      const response = await axios.get(API_URL, {
        params: { ...params, apikey },
        signal,
      });

      lastResponse = response.data;

      if (lastResponse.Response !== 'False') {
        return lastResponse;
      }

      const apiError = lastResponse.Error || '';
      const shouldTryBackup = /api key|limit|request|service|temporarily unavailable/i.test(apiError);

      if (!shouldTryBackup) {
        return lastResponse;
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        throw error;
      }

      lastError = error;
    }
  }

  if (lastResponse) {
    return lastResponse;
  }

  throw lastError || new Error('Movie service is unavailable.');
}

export async function getDiscoverMovies(signal) {
  const responses = await Promise.all(
    DISCOVER_SEARCHES.map((search) => getMovieData({ s: search }, signal)),
  );

  const movies = [];

  responses.forEach((response) => {
    const firstMovies = (response.Search || []).slice(0, 2);
    movies.push(...firstMovies);
  });

  const uniqueMovies = [];

  movies.forEach((movie) => {
    const alreadyExists = uniqueMovies.some(
      (item) => item.imdbID === movie.imdbID,
    );

    if (!alreadyExists) {
      uniqueMovies.push(movie);
    }
  });

  return uniqueMovies.slice(0, 8);
}
