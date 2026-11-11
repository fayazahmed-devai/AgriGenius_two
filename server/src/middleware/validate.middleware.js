/**
 * Reusable Zod validation middleware for request body, query, or params
 * @param {import('zod').ZodSchema} schema 
 * @param {'body' | 'query' | 'params'} source 
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const dataToValidate = req[source];
    const result = schema.safeParse(dataToValidate);

    if (!result.success) {
      const formattedErrors = result.error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Request validation failed. Please check your submitted inputs.',
        data: null,
        error: {
          code: 'VALIDATION_ERROR',
          details: formattedErrors,
        },
      });
    }

    // Assign sanitized and parsed data back to req
    req[source] = result.data;
    next();
  };
}

