import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { GroqApiError } from '../Models/Entities/GroqApiError';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root',
})
export class ErrorService implements ErrorHandler {
    constructor(private toastrService: ToastrService) {}

    async handleError(error: any) {
        let message = '';

        if (error instanceof HttpErrorResponse) {

        } 
        else if(error instanceof GroqApiError){
            this.toastrService.error(error.message);

            return;
        }else {
            // On ne prend une erreur venant de la fermeture de la caméra
            if (error?.message?.includes('cancel') && error?.message?.includes('photos app'))
                return;

            message = error.message! ? error.message : error;
        }

        this.toastrService.error(message);
    }
}
