const ApiError = require('../error/ApiError');
const TokenService = require('../service/TokenService');

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.unauthorized());
    }
    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.unauthorized());
    }
    const userData = TokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.unauthorized());
    }
    res.user = userData;
    next();
  } catch (e) {
    return next(ApiError.unauthorized());
  }
};
