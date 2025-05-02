import express, { type Request, type Response } from 'express';
import { auth_middleware } from '../middleware/auth_middleware';
import { fullauth_middleware } from '../middleware/fullauth_middleware';
import { account_example, create_account, edit_account, get_all_account, get_detail_account } from '../controller/account';

export const protected_router = express.Router();

const router = protected_router;

router.use(auth_middleware);
router.use(fullauth_middleware);

router.get('/protected-api-test', async (req: Request, res: Response) => {
  res.status(200).json({
    ok: true,
    user_id: req.user_id,
    space_id: req.space_id,
    is_profile_required: req.is_profile_required,
    user: req.user,
  });
});

// ############## ----- Accounts ----- ##############
router.get('/account/example', account_example);
router.get('/account', get_all_account);
router.put('/account/:account_id', edit_account);
router.get('/account/:account_id', get_detail_account);
router.post('/account', create_account);
