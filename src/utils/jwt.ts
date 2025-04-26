import { sign, verify } from 'jsonwebtoken';
const secret_key = process.env.JWT_SECRET || 'secret-key';

export const signJwt = async (payload: any, exp_time: number = 60 * 60 * 3) => {
  const token = await sign(payload, secret_key, { expiresIn: exp_time });

  return token;
};

export const verifyJwt = async (token: string) => {
  const decoded = await verify(token, secret_key);
  return decoded;
};
