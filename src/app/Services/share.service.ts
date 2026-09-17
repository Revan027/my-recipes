import { Injectable } from '@angular/core';
import { Share } from '@capacitor/share';

@Injectable({
    providedIn: 'root',
})
export class ShareService {

    constructor() {}

    async share(uri: string[]){
        await Share.share({
            title: '',
            text: '',
            files: uri,
        });
    }
}
