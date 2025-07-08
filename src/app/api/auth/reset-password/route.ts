import config from '@/config';
import prisma from '@/lib/prisma';
import ApiError from '@/lib/utils/server/ApiError';
import { decodeToken, hashedPassword } from '@/lib/utils/server/authHelper';
import catchAsync from '@/lib/utils/server/catchAsync';
import reqValidator from '@/lib/utils/server/reqValidator';
import apiResponse from '@/lib/utils/server/apiResponse';
import { resetPasswordSchema } from '@/schemas/auth.schema';
import { JWTPayload } from 'jose';

interface ResetTokenPayload extends JWTPayload {
  userId: string;
  email: string;
}

export const POST = catchAsync(async (req) => {
  const validation = await reqValidator(req, resetPasswordSchema);

  const { token, password } = validation;
  const payload = (await decodeToken(token, config.jwt.reset_secret)) as ResetTokenPayload | null;

  if (!payload || !payload.userId) {
    throw new ApiError(400, 'Invalid or expired password reset token');
  }
  const newHashedPassword = await hashedPassword(password);
  await prisma.user.update({
    where: { id: payload.userId },
    data: { password: newHashedPassword },
  });
  return apiResponse({
    statusCode: 200,
    message: 'Password has been reset successfully',
  });
});
