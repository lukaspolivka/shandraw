import ApiError from '@/lib/utils/server/ApiError';
import catchAsync from '@/lib/utils/server/catchAsync';
import reqValidator from '@/lib/utils/server/reqValidator';
import sendResponse from '@/lib/utils/server/sendResponse';
import { hashedPassword } from '@/lib/utils/server/authHelper';
import { registerSchema } from '@/schemas/auth.schema';
import prisma from '@/lib/prisma';

export const POST = catchAsync(async (req) => {
  const validated = await reqValidator(req, registerSchema);

  const { name, username, email, password } = validated;

  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUserByEmail) {
    throw new ApiError(409, 'User with this email already exists');
  }
  const existingUserByUsername = await prisma.user.findUnique({
    where: { username },
  });
  if (existingUserByUsername) {
    throw new ApiError(409, 'This username is already taken');
  }
  const newPassword = await hashedPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password: newPassword,
    },
  });

  const { password: _, ...userWithoutPassword } = user;

  return sendResponse({
    statusCode: 201,
    message: 'User registered successfully',
    data: userWithoutPassword,
  });
});
