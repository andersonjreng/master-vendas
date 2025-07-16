import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from '@angular/core';


platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

  if (environment.production) {
    enableProdMode();
    window.console.error = function () {
        // Você pode adicionar um código personalizado aqui, ou apenas deixar a função vazia
        // Exemplo: Adicionando um log personalizado para erros
      };
    // Sobrescreve a função console.log para não fazer nada no modo de produção
    window.console.log = function () {};
  }
