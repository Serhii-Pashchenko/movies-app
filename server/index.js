const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/UserRoutes');
const path = require('path');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');

dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
const PORT = process.env.PORT || 5003;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

app.use('/api', userRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.DB_URL);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
