import axios from 'axios';
import { getDiscoverMovies, getMovieData } from './api';

jest.mock('axios');

describe('getMovieData', () => {
  beforeEach(() => jest.clearAllMocks());

  it('uses the backup key when the first API key fails', async () => {
    axios.get
      .mockResolvedValueOnce({ data: { Response: 'False', Error: 'Invalid API key!' } })
      .mockResolvedValueOnce({ data: { Response: 'True', Search: [{ Title: 'Black' }] } });

    const result = await getMovieData({ s: 'black' });

    expect(result.Search[0].Title).toBe('Black');
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.get.mock.calls[0][1].params.apikey).toBe('5a292f28');
    expect(axios.get.mock.calls[1][1].params.apikey).toBe('90781f94');
  });

  it('does not request the backup key when there are no matching movies', async () => {
    axios.get.mockResolvedValueOnce({
      data: { Response: 'False', Error: 'Movie not found!' },
    });

    const result = await getMovieData({ s: 'unlikely-search-term' });

    expect(result.Error).toBe('Movie not found!');
    expect(axios.get).toHaveBeenCalledTimes(1);
  });

  it('loads a short, unique featured list from the discovery searches', async () => {
    const movie = (imdbID) => ({ imdbID, Title: imdbID });

    axios.get
      .mockResolvedValueOnce({
        data: { Response: 'True', Search: [movie('one'), movie('two'), movie('skip')] },
      })
      .mockResolvedValueOnce({
        data: { Response: 'True', Search: [movie('one'), movie('three')] },
      })
      .mockResolvedValueOnce({
        data: { Response: 'True', Search: [movie('four'), movie('five')] },
      })
      .mockResolvedValueOnce({
        data: { Response: 'True', Search: [movie('six'), movie('seven')] },
      });

    const result = await getDiscoverMovies();
    const ids = result.map((item) => item.imdbID);

    expect(ids).toEqual(['one', 'two', 'three', 'four', 'five', 'six', 'seven']);
    expect(axios.get).toHaveBeenCalledTimes(4);
  });
});
