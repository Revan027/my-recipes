import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.services.common/storage-service';
import { Capacitor } from '@capacitor/core';
import { RecipeService } from './recipe-service';

@Injectable({
    providedIn: 'root',
})
export class AppInitService {    

    isAppReady = signal<boolean>(false);
    isNativePlateform = signal<boolean>(false);

    constructor(private storageService: StorageService, private recipeService: RecipeService) {}

    async init(): Promise<void>
    {
       this.isNativePlateform.set(Capacitor.isNativePlatform());

        if(Capacitor.isNativePlatform()){
            await this.storageService.initPlugin();
        }

        await this.recipeService.loadRecipeResult(Capacitor.isNativePlatform());

        this.isAppReady.set(true);
    }
}
