import config from '@/config';
import prisma from '@/lib/prisma';
import ApiError from '@/lib/utils/server/ApiError';
import { generateToken, matchedPassword } from '@/lib/utils/server/authHelper';
import catchAsync from '@/lib/utils/server/catchAsync';
import reqValidator from '@/lib/utils/server/reqValidator';
import sendResponse from '@/lib/utils/server/sendResponse';
import { loginSchema } from '@/schemas/auth.schema';

export const POST = catchAsync(async (req) => {
  const validation = await reqValidator(req, loginSchema);
  const { username, password } = validation;

  const user = await prisma.user.findUnique({
    where: { username },
  });
  if (!user) {
    throw new ApiError(401, 'Invalid username.');
  }

  await matchedPassword(password, user.password);

  const token = await generateToken(
    { userId: user.id, email: user.email },
    config.jwt.secret,
    config.jwt.expires
  );

  return sendResponse({
    statusCode: 200,
    message: 'Login successful',
    data: { token },
  });
});
