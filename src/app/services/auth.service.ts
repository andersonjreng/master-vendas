import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(
    private http: HttpClient,
    private dataService: DataService
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('currentUser') || '{}'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

//   login(email: string, senha: string): Observable<any> {
//   return this.http.post<any>('http://localhost/master-api/login.php', { email, senha })
//     .pipe(
//       tap(response => {
//         if (response && response.token) {
//           // Armazena apenas o token
//           sessionStorage.setItem('token', response.token);
//           this.currentUserSubject.next({ token: response.token });
//         }
//       })
//     );
// }

login(email: string, senha: string): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  return this.http.post<any>(
    'http://localhost/master-api/login.php',
    { email, senha },
    { headers }
  ).pipe(
    tap(response => {
      console.log('Resposta da API:', response);

      if (response && response.token) {
        alert('Login realizado com sucesso!');

        // ✅ Salva tudo em um único objeto no sessionStorage
        const currentUser = {
          token: response.token,
          username: response.username,       // ou response.username, conforme a API
          permission: response.permission, // ou response.permission
          empresa_id: response.empresa_id // ou response.empresa_id
        };

        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        this.currentUserSubject.next(currentUser);
      }
    })
  );
}


  
  

  logout(): void {
    // Remover o token do sessionStorage
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getIdUser(): Observable<string | null> {
    const storedUser = this.currentUserValue?.username;
    if (!storedUser) {
      return new Observable(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    return this.dataService.getUsers().pipe(
      map(users => {
        const user = users.find((u: any) => u.username === storedUser);
        return user ? user.id : null;
      })
    );
  }
}
