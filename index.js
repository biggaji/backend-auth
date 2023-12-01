/**
 * Server entry file
 */

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRouter from './src/routers/user.router.js';
import startDB from './configs/db.js';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import processError from './src/middlewares/processError.middleware.js';
import helmet from 'helmet';
import compression from 'compression';

const app = express();
await startDB().then();

app.use(helmet());
app.use(
  cors({
    origin: '*',
  }),
);

const limiter = rateLimit({
  windowMs: 60 * 2 * 1000, // 2 minutes window
  max: 500000,
  // The handler method overides the default logic that responds with the error message when the 'max' is exceeded
  handler: (req, res, next, options) => res.status(options.statusCode).json({ message: options.message }),
});

app.use(limiter);
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routers
app.use('/users', userRouter);

// Central error processing middleware
app.use(processError);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('API server running', PORT);
});

export default app;
