import 'reflect-metadata';

// Carica le variabili del file .env in process.env prima di ogni altra cosa
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import mongoose from 'mongoose';

mongoose.set('debug', true);
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/esame-finale')
  .then(() => {
    console.log('Connected to db');
    const PORT = process.env.PORT || 3000;
    app.listen(Number(PORT), () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
