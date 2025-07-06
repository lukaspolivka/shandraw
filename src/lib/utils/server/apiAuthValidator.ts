import type { NextRequest } from 'next/server';
import type { JWTPayload } from 'jose';
import ApiError from './ApiError';
import { decodeToken } from './authHelper';
import config from '@/config';

interface UserJwtPayload extends JWTPayload {
  userId: string;
}

const apiAuthValidator = async (request: NextRequest): Promise<string> => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'Unauthorized: Missing or invalid token format.');
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new ApiError(401, 'Unauthorized: Token not provided.');
  }

  const payload = (await decodeToken(token, config.jwt.secret)) as UserJwtPayload | null;

  if (!payload || !payload.userId) {
    throw new ApiError(401, 'Unauthorized: Invalid or expired token.');
  }

  return payload.userId;
};

export default apiAuthValidator;
