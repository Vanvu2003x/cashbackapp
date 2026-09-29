export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message: `Tuyến đường ${req.originalUrl} không tồn tại`
    }
  });
}
