import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AiOutlinePlus } from 'react-icons/ai';
import { RiThumbUpFill, RiThumbDownFill } from 'react-icons/ri';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { BsCheck } from 'react-icons/bs';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { removeMovieFromLiked, getActors } from '../store';

export default React.memo(function Card({ index, movieData, isLiked = false }) {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [email, setEmail] = useState(undefined);
  const [isLikedIcon, setIsLikedIcon] = useState(isLiked);
  const [actors, setActors] = useState([]);

  useEffect(() => {
    dispatch(getActors(movieData.id))
      .then((action) => {
        const { movieId, actors } = action.payload;
        setActors(actors);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, movieData.id]);

  const addToList = async () => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    try {
      await axios.post(
        'https://movies-app-omega-snowy.vercel.app/api/add',
        {
          email,
          data: movieData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLikedIcon(!isLikedIcon);
    } catch (error) {
      console.log(error);
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleInfo = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Container
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
        alt={movieData.name}
      />

      {isHovered && (
        <div className="hover">
          <div className="image-video-container">
            <img
              src={`https://image.tmdb.org/t/p/w500${movieData.image}`}
              alt={movieData.name}
            />
          </div>
          <div className="info-container flex column">
            <h3 className="name">{movieData.name}</h3>
            <div className="icons flex j-between">
              <div className="controls flex">
                <RiThumbUpFill title="Like" />
                <RiThumbDownFill title="Dislike" />
                {isLiked || isLikedIcon ? (
                  <BsCheck
                    title="Remove from List"
                    onClick={() =>
                      dispatch(removeMovieFromLiked({ movieId: movieData.id }))
                    }
                  />
                ) : (
                  <AiOutlinePlus title="Add to my list" onClick={addToList} />
                )}
              </div>
              <div className="info">
                {isExpanded ? (
                  <BiChevronUp
                    title="More Info"
                    onClick={toggleInfo}
                    className="expanded"
                  />
                ) : (
                  <BiChevronDown
                    title="More Info"
                    onClick={toggleInfo}
                    className="collapsed"
                  />
                )}
              </div>
            </div>
            <div className="genres flex">
              <ul className="flex">
                {movieData.genres.map((genre, index) => (
                  <li key={index}>{genre}</li>
                ))}
              </ul>
            </div>
            {isExpanded && (
              <div>
                <p>Release date: {movieData.release_date}</p>
                <p>Vote average: {movieData.vote_average}</p>
                <p>Overview: {movieData.overview}</p>
                <p>Actors: {actors.map((actor) => actor.name).join(', ')}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Container>
  );
});

const Container = styled.div`
  max-width: 230px;
  width: 230px;
  height: 100%;
  position: relative;
  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .hover {
    z-index: 99;
    height: max-content;
    width: 20rem;
    position: absolute;
    top: -10vh;
    left: 0;
    border-radius: 0.3rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    background-color: #181818;
    transition: 0.3s ease-in-out;
    .image-video-container {
      position: relative;
      height: 140px;
      img {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 0;
        position: absolute;
      }
    }
    .info-container {
      padding: 1rem;
      gap: 0.5rem;
      p {
        margin-bottom: 1.5rem;
      }
    }
    .icons {
      .controls {
        display: flex;
        gap: 1rem;
      }
      svg {
        font-size: 2rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: #b8b8b8;
        }
      }
    }
    .genres {
      margin-bottom: 1.5rem;
      ul {
        gap: 1rem;
        li {
          padding-right: 0.7rem;
          &:first-of-type {
            list-style-type: none;
          }
        }
      }
    }
  }
`;
