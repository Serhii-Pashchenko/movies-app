import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

export default function Header(props) {
  const navigate = useNavigate();
  return (
    <Container className="flex a-center j-between">
      <div className="logo">Movies app</div>
      <button onClick={() => navigate(props.login ? '/login' : '/signup')}>
        {props.login ? 'Log In' : 'Sign Up'}
      </button>
    </Container>
  );
}

const Container = styled.div`
  margin-top: 1.5rem;
  padding: 0 4rem;
  .logo {
    padding: 1rem;
    font-weight: bold;
    font-size: 1.05rem;
    background-color: #000;
    border-radius: 50%;
    font-style: italic;
    color: #e50914;
  }
  button {
    padding: 0.5rem 1rem;
    background-color: #e50914;
    border: none;
    cursor: pointer;
    color: white;
    border-radius: 0.2rem;
    font-weight: bold;
    font-size: 1.05rem;
  }
`;
