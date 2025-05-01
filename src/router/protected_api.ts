import express, { type Response, type Request } from 'express';
import { auth_middleware } from '../middleware/auth_middleware';
import { fullauth_middleware } from '../middleware/fullauth_middleware';

export const protected_router = express.Router();

const router = protected_router;

router.use(auth_middleware);
router.use(fullauth_middleware);

router.get('/testing', async (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    user_id: req.user_id,
    space_id: req.space_id,
    is_profile_required: req.is_profile_required,
    user: req.user,
  });
});

// ############## ----- Example Accounts ----- ##############
router.get('/example-accounts', async (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    user_id: req.user_id,
    space_id: req.space_id,
    is_profile_required: req.is_profile_required,
    user: req.user,
  });
});
