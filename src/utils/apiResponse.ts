export const sendSuccess = (res: any, data: any, message = 'Success', status = 200, meta?: any) => {
  res.status(status).json({
    success: true,
    message,
    data,
    meta
  });
};

export const sendError = (res: any, status: number, message: string, errors: any[] = []) => {
  res.status(status).json({
    success: false,
    message,
    errors
  });
};
