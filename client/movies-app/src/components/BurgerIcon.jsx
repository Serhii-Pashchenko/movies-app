import React from 'react';
import styled from 'styled-components';

const BurgerMenuIcon = ({ isOpen, onClick }) => (
  <StyledBurgerMenuIcon onClick={onClick}>
    <span />
    <span />
    <span />
  </StyledBurgerMenuIcon>
);

const StyledBurgerMenuIcon = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 2rem;
  height: 1.5rem;
  cursor: pointer;
  margin-left: 1rem;

  span {
    width: 100%;
    height: 3px;
    background-color: white;
    transition: all 0.2s ease;

    &:nth-child(2) {
      width: 75%;
    }

    &:first-child {
      transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg)' : 'rotate(0)')};
    }

    &:nth-child(2) {
      opacity: ${({ isOpen }) => (isOpen ? '0' : '1')};
    }

    &:last-child {
      transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
    }
  }

  @media (min-width: 701px) {
    display: none;
  }
`;

export default BurgerMenuIcon;
