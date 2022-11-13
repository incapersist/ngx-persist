// Modified from:
// https://github.com/auth0/angular2-jwt
import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { JwtHelperService } from './jwthelper.service';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { parse } from 'url';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  tokenGetter: () => string | null | Promise<string | null>;
  headerName: string;
  authScheme: string;
  whitelistedDomains: Array<string | RegExp>;
  blacklistedRoutes: Array<string | RegExp>;
  throwNoTokenError: boolean;
  skipWhenExpired: boolean;

  constructor(
    public jwtHelper: JwtHelperService,
    private authService: AuthService
  ) {
    this.tokenGetter = () => this.authService.idToken;
    this.headerName = 'Authorization';
    this.authScheme = 'Bearer ';
    this.whitelistedDomains = [environment.api.domain];
    this.blacklistedRoutes = [];
    this.throwNoTokenError = false;
    this.skipWhenExpired = true;
  }

  isWhitelistedDomain(request: HttpRequest<any>): boolean {
    const requestUrl: any = parse(request.url, false, true);

    return (
      requestUrl.host === null ||
      this.whitelistedDomains.findIndex(
        domain =>
          typeof domain === 'string'
            ? domain === requestUrl.host
            : domain instanceof RegExp
              ? domain.test(requestUrl.host)
              : false
      ) > -1
    );
  }

  isBlacklistedRoute(request: HttpRequest<any>): boolean {
    const url = request.url;

    return (
      this.blacklistedRoutes.findIndex(
        route =>
          typeof route === 'string'
            ? route === url
            : route instanceof RegExp
              ? route.test(url)
              : false
      ) > -1
    );
  }

  handleInterception(
    token: string | null,
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    let tokenIsExpired = false;

    if (!token && this.throwNoTokenError) {
      throw new Error('Could not get token from tokenGetter function.');
    }

    if (this.skipWhenExpired) {
      tokenIsExpired = token ? this.jwtHelper.isTokenExpired(token) : true;
    }

    if (token && tokenIsExpired && this.skipWhenExpired) {
      request = request.clone();
    } else if (token) {
      request = request.clone({
        setHeaders: {
          [this.headerName]: `${this.authScheme}${token}`
        }
      });
    }
    return next.handle(request);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      !this.isWhitelistedDomain(request) ||
      this.isBlacklistedRoute(request)
    ) {
      return next.handle(request);
    }
    const token = this.tokenGetter();

    if (token instanceof Promise) {
      return from(token).pipe(mergeMap(
        (asyncToken: string | null) => {
          return this.handleInterception(asyncToken, request, next);
        }
      ));
    } else {
      return this.handleInterception(token, request, next);
    }
  }
}
