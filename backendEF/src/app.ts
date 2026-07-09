import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import './lib/auth/auth.handlers';
import apiRouter from './api/routes';
import { errorHandlers } from './errors';

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL, // URL del frontend deployato (da .env)
  'http://localhost:4200',  // frontend Angular in locale
];

app.use(cors({
  origin: (origin, callback) => {
    // Consenti richieste senza origine (es. Postman/curl) o da origini in whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
}));

app.use(morgan('tiny'));
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(errorHandlers);

export default app;