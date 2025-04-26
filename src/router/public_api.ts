import express from 'express';
import { login, register } from '../controller/user';

export const publicRouter = express.Router();

const router = publicRouter;

router.get('/test', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// AUTH
router.post('/register', register);
router.post('/login', login);
