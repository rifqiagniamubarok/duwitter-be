import express from 'express';
import path from 'path';
import { public_router } from '../router/public_api';
import { error_handler } from '../middleware/error_handler';
import { protected_router } from '../router/protected_api';

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g., images) from the "public" directory
app.use('/public', express.static(path.join(__dirname, '../../public')));

app.use('/api/v1', public_router);
app.use('/api/v1', protected_router);
app.use(error_handler);
