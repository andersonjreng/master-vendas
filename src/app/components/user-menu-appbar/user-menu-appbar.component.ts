import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, HostListener, inject } from '@angular/core';
import { Observable, map, shareReplay } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { MobileCheckService } from '../../services/mobile-check.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-menu-appbar',
  templateUrl: './user-menu-appbar.component.html',
  styleUrls: ['./user-menu-appbar.component.scss']
})
export class UserMenuAppbarComponent {
  private breakpointObserver = inject(BreakpointObserver);
  user: any = {
    useName: "Loading",
    email: "Loading...",
  };
  userName: any = 'Loading';
  permission: any = 'Loading';
  isMobile: boolean = false;
  formState!: FormGroup;
  errorMessage: string | null = null;
  hideSenha: boolean = true;
  hideNovaSenha: boolean = true;
  hideConfirmNovaSenha: boolean = true;

  changePasswordForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  currentUser: any;
  loading = false;


  constructor(
    private loginService: LoginService,
    private route: Router,
    private toastr: ToastrService,
    private apiService: ApiService,
    private userService: UserService,
    private mobileCheckService: MobileCheckService,
    private fb: FormBuilder,
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.initForm()
    this.mobileCheckService.isMobileChanged.subscribe((isMobile: boolean) => {
      this.isMobile = isMobile;
    });

    // Inicializa a variável isMobile com o valor do serviço
    this.isMobile = this.mobileCheckService.getIsMobile();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const userName = currentUser.username
    const permission = currentUser.permission
    this.userName = userName
    this.permission = permission
    const userId = this.loginService.getCurrentUserId();
    if (userId) {
      // Chamar o método para buscar dados do usuário com o ID atual
      this.apiService.getUserMe().subscribe(
        (response) => {
          // Atribuir os dados do usuário à variável user
          this.user = response.metadata.response;
        },
        (error) => {
          console.error('Erro ao buscar dados do usuário:', error);
          // Tratar o erro, se necessário
        }
      );
    }


  }

  @HostListener('window:resize')
  onResize() {
    // Atualiza a variável isMobile ao redimensionar a janela
    this.mobileCheckService.checkMobile();
  }

  toggleSenhaVisibility(): void {
    this.hideSenha = !this.hideSenha;
  }

  toggleNovaSenhaVisibility(): void {
    this.hideNovaSenha = !this.hideNovaSenha;
  }

  toggleConfirmNovaSenhaVisibility(): void {
    this.hideConfirmNovaSenha = !this.hideConfirmNovaSenha;
  }


  initForm(): void {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    const userName = currentUser.username
    this.formState = this.fb.group({
      username: [userName, Validators.required],
      novaSenha: ['', Validators.required],
      confirmacaoNovaSenha: ['', Validators.required]
    });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
  .pipe(
    map(result => result.matches),
    shareReplay()
  );

  isMobileTemplate() {

  }

  logoutUser() {
    this.authService.logout();
    this.route.navigateByUrl('/login');
    this.toastr.success('Usuário deslogado')
  }

  openModalPassword() {
    const modal = document.getElementById('change-password-modal');
       if (modal) {
         modal.style.display = 'block';
       }
  }


  closeModal() {
    const modal = document.getElementById('change-password-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  changePassword() {
    if (this.formState.value.novaSenha === this.formState.value.confirmacaoNovaSenha) {
      const dados = {
        username: this.formState.value.username,
        password: this.formState.value.novaSenha,
      };

      this.loading = true;
      console.log(this.loading)
      this.toastr.warning('Trabalhando na sua solicitação')

      this.authService.getIdUser().subscribe(
        (id) => {
          if (id) {
            this.dataService.updateUser(id, dados).subscribe(
              (response) => {
                console.log(id)
                this.toastr.success('Senha alterada com sucesso!');
                this.closeModal();
                this.formState.reset();
                this.errorMessage = '';
                this.loading = false;
                console.log(this.loading)
              },
              (error: any) => {
                let errorMessage = 'Erro desconhecido'; // Mensagem padrão de erro
                // Exibir a mensagem de erro no HTML
                this.errorMessage = errorMessage;
                this.loading = false;
              }
            );
          } else {
            this.toastr.error('Usuário não encontrado');
            this.loading = false;
          }
        },
        (error) => {
          this.toastr.error('Erro ao obter o ID do usuário');
          this.loading = false;
        }
      );
    } else {
      this.toastr.error('Senhas não são iguais');
    }
  }

}
