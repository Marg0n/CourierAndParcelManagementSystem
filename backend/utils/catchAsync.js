//* Global Async Error Wrapper (to avoid try/catch everywhere)

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;

/*
//*Example usage:
export const getUser = catchAsync(async (req, res, next) => {
  //? throw new AppError("User not found", 404);
  //? next(new AppError("User not found", 404));
});
*/