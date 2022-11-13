// Modified from:
// https://blog.angularindepth.com/expecting-the-unexpected-best-practices-for-error-handling-in-angular-21c3662ef9e4
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { LoggingService } from './services/logging.service';
import { ErrorService } from './services/error.service';
import { NotificationService } from './services/notification.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    // Error handling is important and needs to be loaded first.
    // Because of this we should manually inject the services with Injector.
    constructor(private injector: Injector) { }

    handleError(error: Error | HttpErrorResponse) {
        const notifier = this.injector.get(NotificationService);

        let notificationMessage = `AN UNKNOWN ERROR OCCURRED`;

        if (error instanceof HttpErrorResponse) {
            // Server Error
            notificationMessage = this.handleServerError(error);
        } else {
            // Client Error
            notificationMessage = this.handleClientError(error);
        }

        notificationMessage +=  '\n\nIf this continues to happen, please contact us';
        notifier.showError(notificationMessage);

        if (!environment.production) {
            console.error('ERROR: ', error);
        }
    }

    handleServerError(error: HttpErrorResponse): string {
 //       const errorService = this.injector.get(ErrorService);

 //       const message = errorService.getServerMessage(error);
 //       const stackTrace = errorService.getServerStack(error);

        return 'Something went wrong, sorry.';
    }

    handleClientError(error: Error): string {
        const errorService = this.injector.get(ErrorService);
        const router = this.injector.get(Router);
        const logger = this.injector.get(LoggingService);

        const message = errorService.getClientMessage(error);
        // stackTrace = errorService.getClientStack(error);
        const stackTrace = `URL: ${router.url}, ${errorService.getClientStack(error)}`;

        // Only log client errors - server errors are logged by the API
        const isLoggingSuccessful = logger.logError(message, stackTrace);

        let notificationMessage = `ERROR: ${message}`;

        if (isLoggingSuccessful) {
            notificationMessage +=  '\n\nThe error has been reported and will be investigated';
        }

        return notificationMessage;
    }
}
