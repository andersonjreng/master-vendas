import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, NgModule, signal } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StyledPrimeNgModule } from './styled/prime-ng/prime-ng.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { ToastrModule } from 'ngx-toastr';
import { ToastNoAnimationModule } from "ngx-toastr";
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AsyncPipe, CommonModule, DatePipe, JsonPipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationComponent } from './navigation/navigation.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TelefoniaComponent } from './modules/telefonia/telefonia.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { UserMenuAppbarComponent } from './components/user-menu-appbar/user-menu-appbar.component';
import { LoginComponent } from './modules/login/login.component';
import { AdminComponent } from './modules/admin/admin.component';
import { MatTableModule } from '@angular/material/table';
import { HomeComponent } from './modules/home/home.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Endpoints } from './endpoints';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTabsModule } from '@angular/material/tabs';
import {
  MatSlideToggleModule,
  _MatSlideToggleRequiredValidatorModule,
} from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDividerModule } from '@angular/material/divider';

import { LoadComponent } from './components/load/load.component';
import player from 'lottie-web';
import { LottieModule } from 'ngx-lottie';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { environment } from '../environments/environment.development';
// import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
// import { AngularFireModule } from '@angular/fire/compat';
import { ProdutosComponent } from './modules/produtos/produtos.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { SettingsComponent } from './modules/settings/settings/settings.component';
import { FaqComponent } from './modules/faq/faq.component';
import { PreserveNewLinesPipe } from './preserve-new-lines.pipe';
import { ClientesComponent } from './modules/clientes/clientes.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MonitoramentoComponent } from './modules/monitoramento/monitoramento.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { TutorialComponent } from './modules/cursos/tutorial/tutorial.component';
import { CursosComponent } from './modules/cursos/cursos/cursos.component';
import { RhComponent } from './modules/rh/rh_dash/rh.component';
import { RhRegisterComponent } from './modules/rh/rh-register/rh-register.component';
import pt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { UsuariosComponent } from './modules/usuarios/usuarios.component';
import { PdvComponent } from './modules/pdv/pdv.component';
import localePt from '@angular/common/locales/pt';
import { VendasComponent } from './modules/vendas/vendas.component';

registerLocaleData(localePt);



export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    TelefoniaComponent,
    UserMenuAppbarComponent,
    LoginComponent,
    AdminComponent,
    HomeComponent,
    LoadComponent,
    ConfirmationDialogComponent,
    ProdutosComponent,
    SettingsComponent,
    FaqComponent,
    PreserveNewLinesPipe,
    ClientesComponent,
    UsuariosComponent,
    MonitoramentoComponent,
    TutorialComponent,
    CursosComponent,
    RhComponent,
    RhRegisterComponent,
    PdvComponent,
    VendasComponent,
  ],
  imports: [
    BrowserModule,
    RouterOutlet,
    CommonModule,
    AppRoutingModule,
    LottieModule.forRoot({ player: playerFactory }),
    StyledPrimeNgModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatRadioModule,
    MatDialogModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ToastrModule.forRoot(),
    ToastNoAnimationModule.forRoot(),
    NgxImageZoomModule,
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatTableModule,
    HttpClientModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    _MatSlideToggleRequiredValidatorModule,
    MatTabsModule,
    AsyncPipe,
    MatStepperModule,
    MatPaginatorModule,
    MatAutocompleteModule,
    MatDividerModule,
    // AngularFirestoreModule,
    // AngularFireModule.initializeApp(environment.firebaseConfig),
    MatTabsModule,
    MatExpansionModule,
    MatSortModule,
    JsonPipe,
    ClipboardModule,
    MatButtonModule,
    MatTooltipModule,
    MatNativeDateModule
    
    
    


  ],
  providers: [
    // firebaseProviders,
    LoadComponent,
    Endpoints,
    DatePipe,
    MatNativeDateModule,
    MatDatepickerModule,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: MatPaginatorIntl, useClass: Endpoints },
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Define o locale padrão para português do Brasil
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'pt-BR'
    }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  
})

export class AppModule {
}
