import express from 'express';
import { publicRouter } from '../router/public_api';
import { error_handler } from '../middleware/error_handler';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', publicRouter);
app.use(error_handler);
