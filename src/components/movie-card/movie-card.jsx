import React from "react";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";

export const MovieCard = ({ movie, user, token, setUser, visibilityToggle }) => {
  const [isFavorite, setIsFavorite] = useState(user?.FavoriteMovies?.includes(movie.id)|| false);
  const [isVisible, setIsVisible] = useState(true);
  const Username = user?.Username;

  useEffect(() => {
    if (user?.FavoriteMovies && user.FavoriteMovies.includes(movie.id)) {
      setIsFavorite(true);
    if (visibilityToggle)
      setIsVisible(true);
    } else {
      setIsFavorite(false);
      if(visibilityToggle)
      setIsVisible(false);
    }
  }, [user, movie.id]);

      const addFavoriteMovie = () => { 
        console.log(token)
        fetch(`https://myflixapp-api-3e4d3ace1043.herokuapp.com/users/${Username}/movies/${movie.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              console.log(`Error add ${movie.title} to your favorites`);
              throw new Error(`Error adding ${movie.title} to your favorites`);
            }
          })
          .then((updatedUser) => {
            alert(`${movie.title} has been added to your favorites`);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsFavorite(true);
          })
          .catch((error) => {
            console.error(`Error adding ${movie.title}:`, error);
            alert(`Error adding ${movie.title} to your favorites`);
          });
      };

      const removeFavoriteMovie = () => {
        fetch(`https://myflixapp-api-3e4d3ace1043.herokuapp.com/users/${Username}/movies/${movie.id}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(`Error removing ${movie.title} from your favorites`);
            }
          })
          .then((updatedUser) => {
            alert(`${movie.title} has been removed from your favorites`);
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            setIsFavorite(false);

            if(visibilityToggle)
            setIsVisible(false);

          })
          .catch((error) => {
            console.error(`Error removing ${movie.title} from your favorites:`, error);
            alert(`Error removing ${movie.title} from your favorites`);
          });
      };

      const handleClick = () => {
        window.scrollTo(0, 0);
      };

      return (
        isVisible && (
          <Card className="h-100">
            <Link to={`/movies/${encodeURIComponent(movie.title)}`} onClick={handleClick}>
              <Card.Img variant="top" src={movie.image} />
            </Link>
            <Card.Body>
              <Card.Title>{movie.title}</Card.Title>
              <Card.Text>{movie.director.name}</Card.Text>
            </Card.Body>
            <div className="favorite-btns">
              {!isFavorite ? (
                <Button className="fav-btn" onClick={addFavoriteMovie}>+</Button>
              ) : (
                <Button className="fav-btn" onClick={removeFavoriteMovie}>-</Button>
              )}
            </div>
          </Card>
        )
      );
  };

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    releaseYear: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    genre: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
    director: PropTypes.shape({
      name: PropTypes.string.isRequired,
      bio: PropTypes.string.isRequired,
    }),
    featured: PropTypes.bool.isRequired,
    actors: PropTypes.array.isRequired,
  }).isRequired,
  token: PropTypes.string,
  storedToken: PropTypes.string,
  setUser: PropTypes.func.isRequired,
  user: PropTypes.shape({
    Username: PropTypes.string.isRequired,
    Password: PropTypes.string,
    Email: PropTypes.string.isRequired,
    Birthday: PropTypes.string.isRequired,
    FavoriteMovies: PropTypes.array.isRequired,
    movies: PropTypes.array
  }).isRequired,
  visibilityToggle: PropTypes.bool
};

export default MovieCard;