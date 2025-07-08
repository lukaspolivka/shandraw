import prisma from '@/lib/prisma';
import apiAuthValidator from '@/lib/utils/server/apiAuthValidator';
import ApiError from '@/lib/utils/server/ApiError';
import apiResponse from '@/lib/utils/server/apiResponse';
import catchAsync from '@/lib/utils/server/catchAsync';
import reqValidator from '@/lib/utils/server/reqValidator';
import { nanoid } from 'nanoid';
import z from 'zod';

const shareSchema = z.object({
  projectId: z.string(),
  isPublic: z.boolean(),
});

export const POST = catchAsync(async (request) => {
  const userId = await apiAuthValidator(request);
  const validation = await reqValidator(request, shareSchema);
  const { projectId, isPublic } = validation;
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
  });
  if (!project) {
    throw new ApiError(404, 'Project not found or you are not authorized.');
  }

  let shareId = project.shareId;
  if (isPublic && !shareId) {
    shareId = nanoid(10);
  }

  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      isPublic,
      shareId,
    },
  });

  return apiResponse({
    statusCode: 200,
    message: `Project sharing status updated.`,
    data: updatedProject,
  });
});
