'use strict';
// Simple way to connect to MongoDB. The Mongoose is cached by NodeJs, so when you use it in multiple files, it will not connect to the database multiple times.

const mongoose = require('mongoose');

const connectString = 'mongodb://localhost:27017/shopDEV';

mongoose
  .connect(connectString)
  .then((_) => console.log('Connected to MongoDB'))
  .catch((err) => console.log('Error connect!'));

if (1 === 1) {
  mongoose.set('debug', true);
  mongoose.set('debug', { color: true });
}

export default mongoose;
