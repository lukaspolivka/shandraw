import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import argon2 from 'argon2';
import ApiError from './ApiError';

export async function hashedPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password);
  } catch {
    throw new ApiError(500, 'Failed to hash password');
  }
}

export async function matchedPassword(password: string, hash: string): Promise<boolean> {
  try {
    const valid = await argon2.verify(hash, password);
    if (!valid) {
      throw new ApiError(401, 'Wrong password provide.');
    }
    return true;
  } catch (error: any) {
    throw new ApiError(error.statusCode || 500, error.message);
  }
}

export async function generateToken(
  payload: JWTPayload,
  secret: Uint8Array,
  expiresIn: string | number = '5m'
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function decodeToken(token: string, secret: any): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    // This will be caught by authValidate and result in a 401
    return null;
  }
}
