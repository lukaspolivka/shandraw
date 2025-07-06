import catchAsync from '@/lib/utils/server/catchAsync';
import prisma from '@/lib/prisma';
import apiAuthValidator from '@/lib/utils/server/apiAuthValidator';
import ApiError from '@/lib/utils/server/ApiError';
import sendResponse from '@/lib/utils/server/sendResponse';
import reqValidator from '@/lib/utils/server/reqValidator';
import { updateProfileSchema } from '@/schemas/auth.schema';

export const GET = catchAsync(async (request) => {
  const userId = await apiAuthValidator(request);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatar: true,
    },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return sendResponse({
    statusCode: 200,
    message: 'User profile fetched successfully',
    data: user,
  });
});

export const POST = catchAsync(async (req) => {
  const userId = await apiAuthValidator(req);
  const validation = await reqValidator(req, updateProfileSchema);

  const { name, avatar } = validation;
  const dataToUpdate: { name?: string; avatar?: string | null } = {};
  if (name) dataToUpdate.name = name;
  if (avatar !== undefined) dataToUpdate.avatar = avatar || null;

  if (Object.keys(dataToUpdate).length === 0) {
    throw new ApiError(400, 'No fields to update');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      avatar: true,
    },
  });

  return sendResponse({
    statusCode: 200,
    message: 'Profile updated successfully',
    data: updatedUser,
  });
});
