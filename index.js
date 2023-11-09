/**
 * Server entry/startup file
 */

import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import userRouter from './src/routers/user.router.js';
import startDB from './configs/db.js';

const app = express();
await startDB();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routers
app.use('/users', userRouter);

// Central error handling middleware
// TODO: Move code to the middleware directory
app.use((error, request, response, next) => {
  const statusCode = error.statusCode ? error.statusCode : 500;
  const message = error.message ? error.message : 'Internal server error';
  return response.status(statusCode).json({
    message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('API server running', PORT);
});
