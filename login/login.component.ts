import { Owner } from './../../domain/interfaces/owner';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MobileCheckService } from '../../services/mobile-check.service';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  isMobile: boolean = false;
  isLoading: boolean = false;
  visibility : boolean = false;
  forms! :FormGroup;

  imagePaths: string[] = [
    'assets/login_betoneira.png',
    'assets/betoneira-desenho.png',
    'assets/betoneira-real.png'
  ];
  randomImage: string = '';


  constructor(
    private mobileCheckService: MobileCheckService,
    private route: Router,
    private authService: AuthService,
    private toastr: ToastrService,

  ) {

  }

  ngOnInit() {
    this.isMobile = this.mobileCheckService.getIsMobile();
    this.forms = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        
      ], ),
      senha: new FormControl('', [
        Validators.required,
      ]),
    });
    this.setRandomImage();
  }


  setRandomImage(): void {
    const randomIndex = Math.floor(Math.random() * this.imagePaths.length);
    this.randomImage = this.imagePaths[randomIndex];
  }

  visibilitysenha(){
    this.visibility = !this.visibility;
    if(this.visibility) {
      document.getElementById("senha")!.setAttribute("type", "text");
    }else{
      document.getElementById("senha")!.setAttribute("type", "password");
    }
  }

  get email(){
    return this.forms.get('email')!;
  }
  get senha(){
    return this.forms.get('senha')!;
  }


  login(): void {
    if (this.forms.valid) {
        const email = this.forms.get('email')!.value;
        const senha = this.forms.get('senha')!.value;
        this.isLoading = true; // Define isLoading como true ao iniciar a solicitação

        this.authService.login(email, senha).subscribe(
            (response) => {
                // Armazenar o token no armazenamento local (localStorage ou sessionStorage)
                // if (response.token) {
                //     sessionStorage.setItem('authToken', response.token); // ou sessionStorage
                // }

                timer(2000).subscribe(() => {
                    this.toastr.success('Login feito com sucesso!');
                    this.route.navigateByUrl('/app/home');
                });
            },
            (error) => {
                timer(1000).subscribe(() => {
                    this.isLoading = false;
                    this.toastr.error(error?.error?.metadata?.response ?? 'Erro ao efetuar o login');
                });
            },
            () => {
                timer(2000).subscribe(() => {
                    this.isLoading = false;
                });
            }
        );
    }
}

}
