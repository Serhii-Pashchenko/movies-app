import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies, getGenres, searchMovies } from '../store';
import SelectGenre from '../components/SelectGenre';
import Slider from '../components/Slider';
import NotAvailable from '../components/NotAvailable';
import backgroundImage from '../assets/bg.jpg';

function MoviePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: 'movie' }));
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
      <div className="navbar">
        <Navbar isScrolled={isScrolled} onSearch={handleSearch} />
        <SelectGenre genres={genres} type="movie" />
      </div>
      <div className="data">
        {movies.length ? <Slider movies={movies} /> : <NotAvailable />}
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
      color: white;
      margin-top: 4rem;
    }
  }
`;
export default MoviePage;
