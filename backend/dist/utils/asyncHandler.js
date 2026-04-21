export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(err => next(err)); //error caught goes from next to the global error handler
};
//# sourceMappingURL=asyncHandler.js.map