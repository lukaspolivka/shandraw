import prisma from '@/lib/prisma';
import ApiError from '@/lib/utils/server/ApiError';
import apiResponse from '@/lib/utils/server/apiResponse';
import catchAsync from '@/lib/utils/server/catchAsync';

export const GET = catchAsync(async (req) => {
  const shareId = req.nextUrl.searchParams.get('shareId');

  if (!shareId) {
    throw new ApiError(400, 'Share ID is not provided.');
  }

  const project = await prisma.project.findFirst({
    where: {
      shareId: shareId,
      isPublic: true,
    },
  });

  if (!project) {
    throw new ApiError(404, 'Public project not found or access is disabled.');
  }

  return apiResponse({
    statusCode: 200,
    message: 'Public project fetched successfully.',
    data: project,
  });
});
