import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AuthService } from './services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { AppMaterialModule } from './pages/shared/modules/app-material.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { JwtInterceptor } from './auth/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';

import 'hammerjs';
import { CallbackComponent } from './callback/callback.component';
import { HomeModule } from './home/home.module';
// import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { JwtHelperService } from './auth/jwthelper.service';
import { GlobalErrorHandler } from './global-error-handler';
import { PersistenceService } from './services/persistence.service';

@NgModule({
  declarations: [
    AppComponent,
    CallbackComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PagesModule,
    AppMaterialModule,
    MatSnackBarModule,
    HomeModule,
  ],
  providers: [
    AuthService,
    PersistenceService,
    JwtHelperService,
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
    constructor() {}
}
