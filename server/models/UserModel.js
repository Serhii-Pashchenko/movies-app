const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: { type: String, required: true },
  isActivate: { type: Boolean, default: false },
  activationLink: { type: String },
  likedMovies: Array,
});

module.exports = mongoose.model('users', userSchema);
