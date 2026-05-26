import { HttpInterceptorFn } from '@angular/common/http';

export const logoutInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
