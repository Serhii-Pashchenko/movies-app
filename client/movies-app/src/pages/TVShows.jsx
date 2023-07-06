import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies, getGenres, searchMovies } from '../store';
import SelectGenre from '../components/SelectGenre';
import Slider from '../components/Slider';
import backgroundImage from '../assets/bg.jpg';

function TVShows() {
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);
  const dataLoading = useSelector((state) => state.netflix.dataLoading);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!genres.length) dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: 'tv' }));
    }
  }, [genresLoaded]);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  const handleSearch = (query) => {
    dispatch(searchMovies(query));
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} onSearch={handleSearch} />
      <SelectGenre genres={genres} type="tv" />
      <div className="data">
        {movies.length ? (
          <>
            <Slider movies={movies} />
          </>
        ) : (
          <h1 className="not-available">
            No TV Shows available for the selected genre. Please select a
            different genre.
          </h1>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  .select {
    margin-top: 8rem;
  }
  .data {
    margin-top: 3rem;
    background-image: url(${backgroundImage});
    > * {
      background-color: rgba(0, 0, 0, 0.6);
    }
    .not-available {
      text-align: center;
      margin-top: 4rem;
    }
  }
`;
export default TVShows;
