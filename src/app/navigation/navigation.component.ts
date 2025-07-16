import { Component, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { onSideNavChange, animateText, animateContenListItem, animateLogo } from '../animations/animations';
import { MobileCheckService } from '../services/mobile-check.service';
import { LoginService } from '../services/login.service';
import { ApiService } from '../services/api.service';

interface Page {
  link: string;
  name: string;
  icon: string;
  active: boolean;
  nameInfo: string;
  subPage?: Page[];
}

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  animations: [
    onSideNavChange,
    animateText,
    animateContenListItem,
    animateLogo,
  ],
})
export class NavigationComponent {
  isConf: boolean = false;
  isTransf: boolean = false;
  user: any;
  isMobile: boolean = false;
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  userName: string = '';
  permissionUser: string = '';

  public pages: Page[] = []

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    ngOnInit() {
      // Obtenha o item armazenado no sessionStorage
      const currentUser = sessionStorage.getItem('currentUser');
    
      if (currentUser) {
        // Analise a string JSON para um objeto
        const userObject = JSON.parse(currentUser);
    
        // Acesse a propriedade "permission"
        const userPermission = userObject.permission;
        console.log(userPermission); // Deve exibir "admin"
    
        // Passe a permissão para a função claimsUser
        this.claimsUser(userPermission);
      } else {
        console.log('Usuário não encontrado no sessionStorage');
        this.claimsUser(null); // Ou algum valor padrão
      }
    }
    


  constructor(

  ) {

  }

  claimsUser(userPermission: any) {
    this.pages = [{ name: '', nameInfo: 'Início', link: '/app/home', icon: 'home', active: true },
      { name: '', nameInfo: 'PDV', link: '/app/pdv', icon: 'point_of_sale', active: true },
    ];
  
    const subPages = [
      { name: '', nameInfo: 'Produtos', link: '/app/produtos', icon: 'local_grocery_store', active: true },
      { name: '', nameInfo: 'Clientes', link: '/app/clientes', icon: 'person', active: true },
      { name: '', nameInfo: 'Usuários', link: '/app/usuarios', icon: 'persons', active: true },
      { name: '', nameInfo: 'Vendas', link: '/app/vendas', icon: 'attach_money', active: true },
    ];
  
    interface MenuItem {
      name: string;
      nameInfo: string;
      link: string;
      icon: string;
      active: boolean;
      subPage?: MenuItem[];
    }
  
    const userPermissions: {
      [key: string]: MenuItem[]; // Define que as chaves são strings e os valores são arrays de MenuItem
    } = {
      'admin': [ // Acesso a tudo
        {
          name: '',
          nameInfo: 'Cadastros',
          icon: 'view_list',
          link: '',
          active: true,
          subPage: subPages,
        },
      ],
      'atendente': [ // Home e Atendimentos suporte
      {
        name: '',
        nameInfo: 'Suporte',
        icon: 'support_agent',
        link: '',
        active: true,
        subPage: subPages,
      },
      ]
    };
  
    const routesToAdd: MenuItem[] = userPermissions[userPermission] || [];
    this.pages = [...this.pages, ...routesToAdd];
  }
  

  goToHome() {
    this.router.navigate(['/app/home'])
  }

  validateRuleForShowModule(pages: Page[]): Page[] {
    return pages;
  }

  buscarDadosDoUsuario() {
    const currentUserJson = sessionStorage.getItem('currentUser')
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      this.userName = currentUser.username;
      this.permissionUser = currentUser.permission;
      console.log(this.permissionUser)
    }
  }

  isActive(link: string) {

      return this.router.url.includes(link);
    
  }

}
