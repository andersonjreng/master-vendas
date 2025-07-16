import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import { User } from "@angular/fire/auth";
import { LoginService } from "../services/login.service";


@Injectable({
  providedIn: 'root',
})
export class AuthLoginGuard implements CanActivate {
  user!: User;
  constructor(private authService: LoginService,
              private router: Router,
              ) {
  }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const token = sessionStorage.getItem('token');
        console.log(`Token recuperado no canActivate: ${token}`);

        if (token && this.authService.isTokenValid(token)) {
            console.log('Token válido, redirecionando para /app.');
            this.router.navigate(['/app']);
            return false;
        } else {
            console.log('Token inválido, autorizando rota.');
            return true;
        }
    }

}

