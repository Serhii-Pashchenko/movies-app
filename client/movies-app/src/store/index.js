import {
  configureStore,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { API_KEY, TMDB_BASE_URL } from '../utils/constants';

const initialState = {
  movies: [],
  genresLoaded: false,
  genres: [],
  actors: {},
};

export const searchMovies = createAsyncThunk(
  'netflix/search',
  async (query, thunkAPI) => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
    );
    if (response.status >= 200 && response.status < 300) {
      const { netflix } = thunkAPI.getState();
      const genres = netflix.genres;

      const movies = response.data.results.map((movie) => {
        const movieGenres = movie.genre_ids.map((genreId) => {
          const genre = genres.find((genre) => genre.id === genreId);
          return genre ? genre.name : '';
        });

        return {
          id: movie.id,
          name: movie.original_name
            ? movie.original_name
            : movie.original_title,
          image: movie.backdrop_path,
          genres: movieGenres.slice(0, 3),
        };
      });

      return movies;
    } else {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  }
);

export const getGenres = createAsyncThunk('netflix/genres', async () => {
  const {
    data: { genres },
  } = await axios.get(`${TMDB_BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
  return genres;
});

export const getActors = createAsyncThunk(
  'netflix/movieActors',
  async (movieId) => {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${movieId}/casts?api_key=${API_KEY}`
    );
    if (response.status >= 200 && response.status < 300) {
      const { cast } = response.data;
      return { movieId, actors: cast };
    } else {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
  }
);

const createArrayFromRawData = (array, moviesArray, genres) => {
  array.forEach((movie) => {
    const movieGenres = [];
    movie.genre_ids.forEach((genre) => {
      const name = genres.find(({ id }) => id === genre);
      if (name) movieGenres.push(name.name);
    });

    if (movie.backdrop_path)
      moviesArray.push({
        id: movie.id,
        name: movie.original_name ? movie.original_name : movie.original_title,
        image: movie.backdrop_path,
        genres: movieGenres.slice(0, 3),
        overview: movie.overview,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
      });
  });
};

const getRawData = async (api, genres, paging = false) => {
  const moviesArray = [];
  for (let i = 1; moviesArray.length < 60 && i < 10; i++) {
    const {
      data: { results },
    } = await axios.get(`${api}${paging ? `&page=${i}` : ''}`);
    createArrayFromRawData(results, moviesArray, genres);
  }
  return moviesArray;
};

export const fetchDataByGenre = createAsyncThunk(
  'netflix/genre',
  async ({ genre, type }, thunkAPI) => {
    const {
      netflix: { genres },
    } = thunkAPI.getState();
    return getRawData(
      `${TMDB_BASE_URL}/discover/${type}?api_key=${API_KEY}&with_genres=${genre}`,
      genres
    );
  }
);

export const fetchMovies = createAsyncThunk(
  'netflix/trending',
  async ({ type }, thunkAPI) => {
    const {
      netflix: { genres },
    } = thunkAPI.getState();
    const movies = await getRawData(
      `${TMDB_BASE_URL}/trending/${type}/week?api_key=${API_KEY}`,
      genres,
      true
    );

    const movieIds = movies.map((movie) => movie.id);

    await Promise.all(
      movieIds.map((movieId) => thunkAPI.dispatch(getActors(movieId)))
    );

    return movies;
  }
);

export const getUsersLikedMovies = createAsyncThunk(
  'netflix/getLiked',
  async (email) => {
    const token = localStorage.getItem('token');
    const {
      data: { movies },
    } = await axios.get(`http://localhost:5000/api/liked/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return movies;
  }
);

export const removeMovieFromLiked = createAsyncThunk(
  'netflix/deleteLiked',
  async ({ movieId }) => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const {
      data: { movies },
    } = await axios.put(
      'http://localhost:5000/api/remove',
      {
        email,
        movieId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return movies;
  }
);

const NetflixSlice = createSlice({
  name: 'Netflix',
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getGenres.fulfilled, (state, action) => {
      state.genres = action.payload;
      state.genresLoaded = true;
    });
    builder.addCase(getActors.fulfilled, (state, action) => {
      const { movieId, actors } = action.payload;
      state.actors[movieId] = actors;
    });
    builder.addCase(searchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
      const movieIds = action.payload.map((movie) => movie.id);
      state.actors = movieIds.reduce((acc, movieId) => {
        acc[movieId] = [];
        return acc;
      }, {});
    });
    builder.addCase(fetchDataByGenre.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(getUsersLikedMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
    builder.addCase(removeMovieFromLiked.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export const store = configureStore({
  reducer: {
    netflix: NetflixSlice.reducer,
  },
});

export const { setGenres, setMovies } = NetflixSlice.actions;
