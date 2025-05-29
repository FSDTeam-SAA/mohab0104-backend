const config = require("../config");
const handleCastError = require("../error/handleCastError");
const handleDuplicateError = require("../error/handleDuplicateError");
const handleValidationError = require("../error/handleValidationError");

const globalErrorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Something went wrong";

  let errorSource = [
    {
      path: "",
      message: error?.message,
    },
  ];

  if (error?.name === "ValidationError") {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
  } else if (error.name === "CastError") {
    const simplifiedError = handleCastError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSource = simplifiedError?.errorSource;
//   } else if (error?.code === 11000) {
//     const simplifiedError = handleDuplicateError(error);
//     statusCode = simplifiedError?.statusCode;
//     message = simplifiedError?.message;
//     errorSource = simplifiedError?.errorSource;
//   } else if (error instanceof Error) {
    message = error?.message;
    errorSource = [
      {
        path: "",
        message: error?.message,
      },
    ];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    error,
    stack: config.NODE_ENV === "development" ? error.stack : null,
  });
};

module.exports = globalErrorHandler;
