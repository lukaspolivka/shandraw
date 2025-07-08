import prisma from '@/lib/prisma';
import apiAuthValidator from '@/lib/utils/server/apiAuthValidator';
import apiResponse from '@/lib/utils/server/apiResponse';
import catchAsync from '@/lib/utils/server/catchAsync';
import { getNewProjectName } from '@/store/utils';

export const POST = catchAsync(async (request) => {
  const userId = await apiAuthValidator(request);
  const newProject = await prisma.project.create({
    data: {
      userId: userId,
      projectName: getNewProjectName(),
    },
  });

  return apiResponse({
    statusCode: 201,
    message: 'New project created successfully',
    data: newProject,
  });
});
