import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const currentUserJson = sessionStorage.getItem('currentUser');

    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      const authToken = currentUser.token;

      if (authToken) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        });
        return next.handle(authReq);
      }
    }

    // Se não houver token, segue a requisição sem alterações
    return next.handle(req);
  }
}
