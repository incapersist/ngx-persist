import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.authService.isAuthenticated()) {
            if (route.data.roles && !this.authService.hasRole(route.data.roles)) {
                // role not authorised so redirect to home page
                this.router.navigate(['/pages/dashboard']);
                return false;
            }

            // authorised so return true
            return true;
        }

        console.log('AuthGuard: NOT LOGGED IN');
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/home'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
