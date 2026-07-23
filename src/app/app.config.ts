import {
    ApplicationConfig,
    ErrorHandler,
    inject,
    provideAppInitializer,
    provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { AppInitService } from './Services/app-init.service';
import { ErrorService } from './Services/error.service';

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: ErrorHandler, useClass: ErrorService },
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
            const appInitService = inject(AppInitService);

            await appInitService.init();
        }),
    ],
};
provideRouter(routes);
