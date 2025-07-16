import {
  Component,
  HostListener,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {
  private inactivityTimeout: any;
  private readonly MAX_INACTIVITY_TIME = 1000 * 60 * 5;

  @ViewChild(MatDrawer) drawer!: MatDrawer;
  title = 'dam-express-angular';


  constructor(
    private loginService: LoginService
  ) {
    this.resetInactivityTimeout();
  }

  @HostListener('window:mousemove')
  @HostListener('window:keydown')
  @HostListener('window:focus')

  onUserActivity() {
    this.resetInactivityTimeout();
  }


  ngOnInit(): void {
    console.log('Method not implemented. ngOnInit');
  }

  resetInactivityTimeout() {
    clearTimeout(this.inactivityTimeout);
    const token = sessionStorage.getItem('token');
    if (token) {
      this.inactivityTimeout = setTimeout(() => {
        // Chamada para a função de logout ou a lógica que você deseja executar quando o usuário estiver inativo por muito tempo
        this.openModal();
        this.logoutUser();
      }, this.MAX_INACTIVITY_TIME);
    }
  }

  openModal() {
    const modal = document.getElementById('logout-modal');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  logoutUser() {
    this.loginService.logout();
  }

  refreshPage() {
    window.location.reload();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Method not implemented. ngOnChanges');
    console.log(JSON.stringify(changes));
  }

  ngOnDestroy(): void {
    console.log('Method not implemented. ngOnDestroy');
  }

  openDrawer() {
    this.drawer.open();
  }
}
