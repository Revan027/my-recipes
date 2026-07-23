import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.services.common/storage-service';
import { Capacitor } from '@capacitor/core';
import { RecipeService } from './recipe-service';
import { Recipe } from '../Models/Entities/Recipe';
import { RecipeResult } from '../Models/RecipeResult';
import { MOCK_RECIPES, MOCK_TYPES } from '../constants/mock-recipes';
import { RecipeListService } from './recipe-list.service';

@Injectable({
    providedIn: 'root',
})
export class AppInitService {
    isAppReady = signal<boolean>(false);
    isNativePlateform = signal<boolean>(false);

    constructor(
        private storageService: StorageService,
        private recipeService: RecipeService,
        private recipeListService: RecipeListService,
    ) {}

    async init(): Promise<void> {
        this.isNativePlateform.set(Capacitor.isNativePlatform());

        if (Capacitor.isNativePlatform()) {
            await this.storageService.initPlugin();
        }

        await this.loadDatas(Capacitor.isNativePlatform());

        this.isAppReady.set(true);
    }

    private async loadDatas(isNativePlateform: boolean): Promise<void> {
        let recipes: Recipe[] = [];

        if (isNativePlateform) {
            await this.recipeListService.loadNextPage();
            this.recipeService.recipeTypes.set(await this.recipeService.getTypes());
        } else {
            recipes = MOCK_RECIPES;

            const recipeResult = new RecipeResult();
            recipeResult.recipes = recipes;

             this.recipeService.recipeTypes.set(MOCK_TYPES);
            this.recipeService.recipeResult.set(recipeResult);
        }
    }
}
