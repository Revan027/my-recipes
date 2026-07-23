import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RecipeBookService {
    currentBookPage = signal<number>(1);
    currentIDPage = signal<number>(0);

    constructor() {}
}
