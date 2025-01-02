import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { firstValueFrom, of } from 'rxjs';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    firstValueFrom(
      of({
        domain: 'abc.com',
        realm: 'keycloak-angular-sandbox',
        clientId: 'keycloak-angular',
      })
    ).then((config) => {
      return keycloak.init({
        config: {
          realm: config.realm,
          url: 'http://localhost:8080',
          clientId: config.clientId,
        },
        initOptions: {
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri:
            window.location.origin + '/assets/silent-check-sso.html',
        },
      });
    });
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, KeycloakAngularModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
