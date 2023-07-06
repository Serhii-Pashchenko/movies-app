import React from 'react';
import background from '../assets/bg.jpg';
import styled from 'styled-components';

export default function BackgroundImage() {
  return (
    <Container>
      <img src={background} alt="background" />
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  img {
    height: 99.5vh;
    width: 100vw;
  }
`;
