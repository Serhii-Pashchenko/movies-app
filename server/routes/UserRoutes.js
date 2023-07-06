const UserController = require('../controllers/UserController');
const { body } = require('express-validator');
const AuthMiddleware = require('../middleware/AuthMiddleware');

const router = require('express').Router();

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  UserController.registration
);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activate);
router.get('/refresh', UserController.refresh);

router.get('/liked/:email', AuthMiddleware, UserController.getLikedMovies);
router.post('/add', AuthMiddleware, UserController.addToLikedMovies);
router.put('/remove', AuthMiddleware, UserController.removeFromLikedMovies);

module.exports = router;
