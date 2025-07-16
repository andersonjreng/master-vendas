import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelefoniaComponent } from './modules/telefonia/telefonia.component';

import { LoginComponent } from './modules/login/login.component';
import { AdminComponent } from './modules/admin/admin.component';
import { HomeComponent } from './modules/home/home.component';
import { AuthLoginGuard } from './auth/auth.login.guard';
import { AuthGuard } from './auth/auth.guard';

import { ProdutosComponent } from './modules/produtos/produtos.component';

import { SettingsComponent } from './modules/settings/settings/settings.component';
import { FaqComponent } from './modules/faq/faq.component';
import { ClientesComponent } from './modules/clientes/clientes.component';
import { MonitoramentoComponent } from './modules/monitoramento/monitoramento.component';
import { TutorialComponent } from './modules/cursos/tutorial/tutorial.component';
import { CursosComponent } from './modules/cursos/cursos/cursos.component';
import { RhComponent } from './modules/rh/rh_dash/rh.component';
import { RhRegisterComponent } from './modules/rh/rh-register/rh-register.component';
import { UsuariosComponent } from './modules/anydesk/usuarios.component';
import { PdvComponent } from './modules/pdv/pdv.component';
import { VendasComponent } from './modules/vendas/vendas.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'app',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home',
      },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'produtos',
        component: ProdutosComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'pdv',
        component: PdvComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'vendas',
        component: VendasComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'cursos/:id',
        component: TutorialComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        component: SettingsComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'faq',
        component: FaqComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'clientes',
        component: ClientesComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'rh',
        component: RhComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'rh/addVagas',
        component: RhRegisterComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'monitoramento',
        component: MonitoramentoComponent,
        // canActivate: [AuthGuard],
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
