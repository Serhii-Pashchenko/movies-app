import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import backgroundImage from '../assets/bg.jpg';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies, getGenres, searchMovies } from '../store';
import Slider from '../components/Slider';
function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.netflix.movies);
  const genres = useSelector((state) => state.netflix.genres);
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  useEffect(() => {
    if (genresLoaded) {
      dispatch(fetchMovies({ genres, type: 'all' }));
    }
  }, [genresLoaded]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, []);

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
      <Slider movies={movies} />
    </Container>
  );
}

const Container = styled.div`
  background-image: url(${backgroundImage});
  > * {
    background-color: rgba(0, 0, 0, 0.6);
  }
  margin-top: 8rem;
`;
export default Home;
