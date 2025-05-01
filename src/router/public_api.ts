import express from 'express';
import { login, login_remember, register } from '../controller/user';

export const public_router = express.Router();

const router = public_router;

router.get('/public-api-test', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ############## ----- AUTH ----- ##############
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/login-remember', login_remember);
