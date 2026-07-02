import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Capacitor } from '@capacitor/core';


@Injectable({
    providedIn: 'root',
})
export class ErrorService implements ErrorHandler {
    constructor() {}

    async handleError(error: any) {
        let message = '';
    
        if (error instanceof HttpErrorResponse) {
            //erreur http
        } 
        else {
            // On ne prend une erreur venant de la fermeture de la caméra
            if(error?.message?.includes('cancel') && error?.message?.includes('photos app')) return;

            message = error.message!
                ? error.message
                : error;
        }

        if (Capacitor.isNativePlatform()) {
            alert(message)

        }
        else{
            console.error(message);
        }
    }
}
