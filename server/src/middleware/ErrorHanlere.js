import { AppError } from "../utils/AppError.js";

// DEV
const devErrors = (res, error) => {
  res.status(error.statusCode || 500).json({
    status: error.status || "error",
    message: error.message,
    stackTrace: error.stack,
    error,
  });
};

// HANDLERS
const castErrorHandler = (err) =>
  new AppError(`Invalid value for ${err.path}: ${err.value}`, 400);

const duplicateKeyErrorHandler = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  return new AppError(
    `Duplicate value for ${field}: ${value}. Please use another ${field}.`,
    409
  );
};

const validationErrorHandler = (err) => {
  const errors = Object.values(err.errors).map(v => v.message).join(". ");
  return new AppError(`Invalid input data: ${errors}`, 400);
};

const zodErrorHandler = (err) => {
  const errors = err.errors.map(e => e.message).join(", ");
  return new AppError(errors, 400);
};

// PROD
const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

// MAIN
export const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else {
    if (error.name === "CastError") error = castErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyErrorHandler(error);
    if (error.name === "ValidationError") error = validationErrorHandler(error);
    if (error.name === "ZodError") error = zodErrorHandler(error);

    prodErrors(res, error);
  }
};
