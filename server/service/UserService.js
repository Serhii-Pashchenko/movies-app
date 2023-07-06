const ApiError = require('../error/ApiError');
const TokenService = require('./TokenService');
const UserModel = require('../models/UserModel');
const UserDto = require('../dto/userDto');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const MailService = require('./MailService');

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.badRequest(`User with email ${email} already exists`);
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuidv4();
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });
    await MailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (!candidate) {
      throw ApiError.badRequest(`User with email ${email} not found`);
    }
    const isPasswordEquals = await bcrypt.compare(password, candidate.password);
    if (!isPasswordEquals) {
      throw ApiError.badRequest('Invalid password');
    }
    const userDto = new UserDto(candidate);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const token = await TokenService.removeToken(refreshToken);
    return token;
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.badRequest('Activation link is invalid');
    }
    user.isActivate = true;
    await user.save();
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized();
    }
    const userData = await TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.forbidden('Expired or invalid token, please login again');
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });
    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getLikedMovies(email) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  async addToLikedMovies(email) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  async addToLikedMovies(email) {
    const user = await UserModel.findOne({ email });
    return user;
  }

  async findByIdAndUpdate(userId, likedMovies, newLikedMovies) {
    await UserModel.findByIdAndUpdate(userId, {
      likedMovies,
      newLikedMovies,
    });
  }

  async createlikedMovies({ email, data }) {
    await UserModel.create({
      email,
      likedMovies: data,
    });
  }
}

module.exports = new UserService();
