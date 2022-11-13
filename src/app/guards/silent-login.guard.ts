import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PersistenceService } from '../services/persistence.service';

@Injectable({ providedIn: 'root' })
export class SilentLoginGuard implements CanActivate {
    constructor(
        private auth: AuthService,
        private persistenceService: PersistenceService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const isValid = !(this.auth.isLoggingIn && (this.persistenceService.lastUrl && this.persistenceService.lastUrl.length > 0));
        return isValid;
    }
}
