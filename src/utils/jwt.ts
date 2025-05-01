import { decode, sign, verify } from 'jsonwebtoken';
import { Response_error } from './response_error';
const secret_key = process.env.JWT_SECRET || 'secret-key';

export interface token_payload {
  email: string;
  user_id: string;
  first_name: string;
  last_name: string;
  is_profile_required: boolean;
  space_id: string;
  space_name: string;
}

export const sign_jwt = (payload: token_payload, exp_time: number = 60 * 60 * 3) => {
  const token = sign(payload, secret_key, { expiresIn: exp_time });
  return token;
};

const decoded_token = (decoded: any): token_payload => {
  const { email, user_id, first_name, last_name, is_profile_required, space_id, space_name } = decoded;
  if (!email || !user_id || !first_name || !last_name || !is_profile_required || !space_id || !space_name) throw new Error('invalid decode');
  return {
    email,
    user_id,
    first_name,
    last_name,
    is_profile_required,
    space_id,
    space_name,
  };
};

export const verify_token = async (token: string): Promise<{ ok: boolean; data: token_payload | null }> => {
  try {
    const decoded = await verify(token, secret_key);
    return { ok: true, data: decoded_token(decoded) };
  } catch (error) {
    return { ok: false, data: null };
  }
};
