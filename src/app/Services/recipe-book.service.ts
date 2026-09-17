import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RecipeBookService {
    private _currentBookPage = signal<number>(1);
    private _currentIDPage = signal<number>(0);

    currentBookPage = this._currentBookPage.asReadonly();
    currentIDPage = this._currentIDPage.asReadonly();

    constructor() {}

    loadCurrentBookPage(page: number){
        this._currentBookPage.set(page);
    }

    loadCurrentIDPage(id: number){
        this._currentIDPage.set(id);
    }
}
