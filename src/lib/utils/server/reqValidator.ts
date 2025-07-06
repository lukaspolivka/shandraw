import { AnyZodObject, ZodError, type infer as ZodInfer } from 'zod';
import ApiError from './ApiError';

const reqValidator = async <T extends AnyZodObject>(
  req: Request,
  schema: T
): Promise<ZodInfer<T>> => {
  try {
    const body = await req.json();
    const data = await schema.parseAsync(body);
    return data;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ApiError(400, 'Validation error');
    }
    throw new ApiError(500, 'Internal server error');
  }
};

export default reqValidator;
