const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`
  });
};

const globalErrorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]', err);

  if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.errno === 1452) {
    return res.status(400).json({
      success: false,
      message: 'Foreign Key Constraint Violation: Referenced simulation does not exist.'
    });
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.errno === 1451) {
    return res.status(409).json({
      success: false,
      message: 'Foreign Key Constraint Violation: Cannot modify or delete record referenced by dependent child entries.'
    });
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = {
  notFoundHandler,
  globalErrorHandler
};