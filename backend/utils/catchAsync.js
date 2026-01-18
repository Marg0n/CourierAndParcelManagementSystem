//* Global Async Error Wrapper (to avoid try/catch everywhere)

const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

export default catchAsync;