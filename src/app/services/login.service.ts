import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from '../domain/interfaces/user';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isAdminSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private httpClient: HttpClient,
    private apiService: ApiService
  ) { }

//   postUserLogin(data: { email: string, password: string }): Observable<any> {
//     return this.apiService.postUserLogin(data).pipe(
//       tap((response: any) => {
//         // Lógica de sucesso após o login
//         const token = response.token; // Acessando o token a partir de response.metadata.token
//         console.log(response);
//         sessionStorage.setItem('token', token);
//         const permission = response.permission;
//         const permissionCode = response.permission_code;
//         sessionStorage.setItem('permission', permission);
//         sessionStorage.setItem('permission_code', permissionCode);
//         console.log('Token armazenado:', response.token);
//         // Adicione a lógica adicional aqui, como verificar se o usuário é admin, etc.
//         this.isAuthenticatedSubject.next(true);
//       }),
//       catchError((error: HttpErrorResponse) => {
//         // Lógica de tratamento de erros durante o login
//         console.error('Erro ao fazer login:', error);
//         return throwError(error);
//       })
//     );
// }


  logout(): void {
    // Implemente o código necessário para fazer logout
    // Por exemplo, limpar tokens, remover cookies, etc.
    //localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    this.isAuthenticatedSubject.next(false); // Emitir evento de logout
  }

  isTokenValid(token: string): boolean {
    try {
      const tokenData = token.split('.')[1];
      const decodedToken = JSON.parse(atob(tokenData));

      // Verificar se o token expirou
      const currentTimestamp = Math.floor(Date.now() / 1000);
      return decodedToken.exp > currentTimestamp;
    } catch (error) {
      console.error('isTokenValid: Error', error);
      // Tratar erros ao decodificar o token, se necessário
      return false;
    }
  }

  isAdmin(userId: number): Observable<boolean> {
    return this.apiService.getUserComId(userId).pipe(
      map((response: any) => {
        if (response && response.metadata && response.metadata.response) {
          return response.metadata.response.admin;
        } else {
          // Se não houver resposta ou campo admin, retornar false por padrão
          return false;
        }
      }),
      catchError((error: any) => {
        // Tratar erros, por exemplo, retornar false em caso de erro na requisição
        console.error('Erro ao verificar se o usuário é admin:', error);
        return of(false);
      })
    );
  }

  getCurrentUserId(): number | null {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const tokenData = token.split('.')[1];
        const decodedToken = JSON.parse(atob(tokenData));
        const userId = decodedToken.UserId ?? null;
        return decodedToken.UserId ?? null; // Se o userId não estiver presente, retorna null
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
      }
    } else {
      console.error('Token de autenticação não encontrado.');
      return null;
    }
  }
}
