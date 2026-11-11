/**
 * Global Centralized Error Handling Middleware
 */
export function errorHandler(err, req, res, next) {
  console.error('Unhandled Server Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.originalUrl,
    method: req.method,
  });

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Uploaded file exceeds the maximum allowed size of 5MB.',
        data: null,
        error: { code: 'FILE_TOO_LARGE', details: [err.message] },
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
      data: null,
      error: { code: 'UPLOAD_ERROR', details: [err.message] },
    });
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: {
      code: err.code || 'INTERNAL_SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' && err.stack ? [err.stack] : [],
    },
  });
}

