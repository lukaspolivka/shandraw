import config from '@/config';
import prisma from '@/lib/prisma';
import ApiError from '@/lib/utils/server/ApiError';
import { generateToken } from '@/lib/utils/server/authHelper';
import catchAsync from '@/lib/utils/server/catchAsync';
import reqValidator from '@/lib/utils/server/reqValidator';
import sendPasswordResetEmail from '@/lib/utils/server/sendPasswordResetEmail';
import apiResponse from '@/lib/utils/server/apiResponse';
import { forgotPasswordSchema } from '@/schemas/auth.schema';

export const POST = catchAsync(async (req) => {
  const validation = await reqValidator(req, forgotPasswordSchema);
  const { email } = validation;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(404, 'No account found with this email address.');
  }

  const resetToken = await generateToken(
    {
      userId: user.id,
      email: user.email,
    },
    config.jwt.reset_secret,
    config.jwt.reset_expires
  );

  await sendPasswordResetEmail(email, resetToken);

  return apiResponse({
    statusCode: 200,
    message: 'A password reset link has been sent in this email.',
  });
});
