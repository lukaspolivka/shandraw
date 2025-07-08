import prisma from '@/lib/prisma';
import apiAuthValidator from '@/lib/utils/server/apiAuthValidator';
import ApiError from '@/lib/utils/server/ApiError';
import { hashedPassword, matchedPassword } from '@/lib/utils/server/authHelper';
import catchAsync from '@/lib/utils/server/catchAsync';
import reqValidator from '@/lib/utils/server/reqValidator';
import apiResponse from '@/lib/utils/server/apiResponse';
import { changePasswordSchema } from '@/schemas/auth.schema';

export const POST = catchAsync(async (req) => {
  const userId = await apiAuthValidator(req);
  const validation = await reqValidator(req, changePasswordSchema);
  const { currentPassword, newPassword } = validation;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await matchedPassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(403, 'Incorrect current password');
  }
  const newHashedPassword = await hashedPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: newHashedPassword },
  });

  return apiResponse({
    statusCode: 200,
    message: 'Password updated successfully',
  });
});
