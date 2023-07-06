const UserService = require('../service/UserService');
const User = require('../models/UserModel');
const { validationResult } = require('express-validator');
const ApiError = require('../error/ApiError');

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Validation error', errors.array()));
      }
      const { email, password } = req.body;
      const userData = await UserService.registration(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (e) {
      next(e);
    }
  }
  async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL);
    } catch (e) {
      next(e);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 10 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getLikedMovies(req, res) {
    try {
      const { email } = req.params;
      const user = await await User.findOne({ email });
      if (user) {
        return res.json({ msg: 'success', movies: user.likedMovies });
      } else return res.json({ msg: 'User with given email not found.' });
    } catch (error) {
      return res.json({ msg: 'Error fetching movies.' });
    }
  }

  async addToLikedMovies(req, res) {
    try {
      const { email, data } = req.body;
      const user = await await User.findOne({ email });
      if (user) {
        const { likedMovies } = user;
        const movieAlreadyLiked = likedMovies.find(({ id }) => id === data.id);
        if (!movieAlreadyLiked) {
          await User.findByIdAndUpdate(
            user._id,
            {
              likedMovies: [...user.likedMovies, data],
            },
            { new: true }
          );
        } else
          return res.json({ msg: 'Movie already added to the liked list.' });
      } else await User.create({ email, likedMovies: [data] });
      return res.json({ msg: 'Movie successfully added to liked list.' });
    } catch (error) {
      return res.json({ msg: 'Error adding movie to the liked list' });
    }
  }

  async removeFromLikedMovies(req, res) {
    const { email, movieId } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const movies = user.likedMovies;
      const movieIndex = movies.findIndex(({ id }) => id === movieId);
      if (movieIndex === -1) {
        res.status(400).send({ msg: 'Movie not found.' });
      }
      movies.splice(movieIndex, 1);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedMovies: movies,
        },
        { new: true }
      );
      return res.json({ msg: 'Movie successfully removed.', movies });
    } else return res.json({ msg: 'User with given email not found.' });
  }
  catch(error) {
    return res.json({ msg: 'Error removing movie to the liked list' });
  }
}

module.exports = new UserController();
