import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { getUsersLikedMovies, searchMovies } from '../store';
import { useDispatch, useSelector } from 'react-redux';

export default function UserListedMovies() {
  const movies = useSelector((state) => state.netflix.movies);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (!token) {
      navigate('/login');
    } else {
      dispatch(getUsersLikedMovies(email));
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
      <div className="content flex column">
        <h1>My List</h1>
        <div className="grid flex">
          {movies && movies.length > 0 ? (
            movies.map((movie, index) => (
              <Card
                movieData={movie}
                index={index}
                key={movie.id}
                isLiked={true}
              />
            ))
          ) : (
            <p>List is empty</p>
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
    height: 100%;
    h1 {
      margin-left: 3rem;
    }
    .grid {
      flex-wrap: wrap;
      gap: 1rem;
    }
  }
`;
