import { NextRequest, NextResponse } from 'next/server';
import ApiError from './ApiError';

type AsyncHandler<T> = (req: NextRequest, context: T) => Promise<NextResponse>;

const catchAsync = <T>(fn: AsyncHandler<T>) => {
  return async (req: NextRequest, context: T) => {
    try {
      return await fn(req, context);
    } catch (error) {
      console.error('API Error:', error);
      if (error instanceof ApiError) {
        return NextResponse.json(
          { success: false, message: error.message },
          { status: error.statusCode }
        );
      }
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      return NextResponse.json(
        {
          success: false,
          message: 'Internal Server Error',
          error: errorMessage,
        },
        { status: 500 }
      );
    }
  };
};

export default catchAsync;
