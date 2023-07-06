import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { getGenres, searchMovies } from '../store';
import { useSelector, useDispatch } from 'react-redux';

function Search() {
  const [isScrolled, setIsScrolled] = useState(false);
  const movies = useSelector((state) => state.netflix.movies);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGenres());
  }, []);

  const handleSearch = (query) => {
    dispatch(searchMovies(query));
  };
  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  return (
    <Container>
      <Navbar isScrolled={isScrolled} onSearch={handleSearch} />
      <div className="content flex column">
        <h1>Search results</h1>
        <div className="grid flex">
          {movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              <Card movieData={movie} index={index} key={movie.id} />
            ))
          ) : (
            <p>Sorry, no movies found :(</p>
          )}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .content {
    margin: 2.3rem;
    margin-top: 8rem;
    gap: 3rem;
    h1 {
      margin-left: 3rem;
    }
    .grid {
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
`;
export default Search;
