import {
    ApplicationConfig,
    ErrorHandler,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { ErrorService } from './Services/error.service';
import { DecimalPipe } from '@angular/common';

export const appConfig: ApplicationConfig = {
    providers: [
        { 
            provide: ErrorHandler, 
            useClass: ErrorService,
        },
        DecimalPipe,
        provideBrowserGlobalErrorListeners(),
         provideToastr({
            timeOut: 3000,
            preventDuplicates: true,
        }),
        provideRouter(
            routes,
            withInMemoryScrolling({
                scrollPositionRestoration: 'enabled',
                anchorScrolling: 'enabled',
            }),
        ),
        provideAppInitializer(async () => {
            // on peut injecter un service et appeller une méthode de celle ci au lancement de l'application
        }),
    ],
};
provideRouter(routes);
