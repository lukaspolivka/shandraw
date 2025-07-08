import prisma from '@/lib/prisma';
import apiAuthValidator from '@/lib/utils/server/apiAuthValidator';
import ApiError from '@/lib/utils/server/ApiError';
import apiResponse from '@/lib/utils/server/apiResponse';
import catchAsync from '@/lib/utils/server/catchAsync';
import z from 'zod';

export const GET = catchAsync(async (request) => {
  const userId = await apiAuthValidator(request);
  const projectId = request.nextUrl.searchParams.get('id');

  if (projectId) {
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId: userId },
    });
    if (!project) {
      throw new ApiError(404, 'Project not found');
    }
    return apiResponse({
      statusCode: 200,
      message: 'Project fetched successfully',
      data: project,
    });
  } else {
    const projects = await prisma.project.findMany({
      where: { userId: userId },
      orderBy: { updatedAt: 'desc' },
    });
    return apiResponse({
      statusCode: 200,
      message: 'Projects fetched successfully',
      data: projects,
    });
  }
});

const projectSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  schemaCode: z.string().optional(),
  nodes: z.any().optional(),
  edges: z.any().optional(),
  id: z.string(), // ID is now required for updates
});

export const POST = catchAsync(async (request) => {
  const userId = await apiAuthValidator(request);
  const body = await request.json();
  const validation = projectSchema.safeParse(body);

  if (!validation.success) {
    throw new ApiError(400, validation.error.errors[0].message);
  }

  const { id, projectName, schemaCode, nodes, edges } = validation.data;

  const existingProject = await prisma.project.findFirst({
    where: { id: id, userId: userId },
  });

  if (!existingProject) {
    throw new ApiError(404, 'Project not found or you do not have permission to edit it.');
  }

  const savedProject = await prisma.project.update({
    where: { id: id },
    data: {
      projectName,
      schemaCode: schemaCode || '',
      nodes: nodes || [],
      edges: edges || [],
    },
  });

  return apiResponse({
    statusCode: 200,
    message: 'Project saved successfully',
    data: savedProject,
  });
});

export const DELETE = catchAsync(async (request) => {
  const userId = await apiAuthValidator(request);
  const projectId = request.nextUrl.searchParams.get('id');
  if (!projectId) {
    throw new ApiError(400, 'Project ID is required');
  }

  const deleteResult = await prisma.project.deleteMany({
    where: { id: projectId, userId: userId },
  });

  if (deleteResult.count === 0) {
    throw new ApiError(404, 'Project not found or not authorized');
  }

  return apiResponse({
    statusCode: 200,
    message: 'Project deleted successfully',
  });
});
