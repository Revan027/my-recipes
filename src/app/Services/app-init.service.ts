import { Injectable, signal } from '@angular/core';
import { StorageService } from './storage.services.common/storage-service';
import { Capacitor } from '@capacitor/core';
import { RecipeService } from './recipe-service';
import { Recipe } from '../Models/Entities/Recipe';
import { RecipeResult } from '../Models/RecipeResult';
import { MOCK_RECIPES } from '../constants/mock-recipes';
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
        private recipeListService: RecipeListService) 
    {       
    }

    async init(): Promise<void>
    {
       this.isNativePlateform.set(Capacitor.isNativePlatform());

        if(Capacitor.isNativePlatform()){
            await this.storageService.initPlugin();
        }

        await this.loadRecipeResult(Capacitor.isNativePlatform());

        this.isAppReady.set(true);
    }

    private async loadRecipeResult(isNativePlateform: boolean): Promise<void>
    {
        let recipes: Recipe[]  = [];

        if(isNativePlateform){
            await this.recipeListService.loadNextPage();
        }
        else{
            recipes = MOCK_RECIPES;

            const recipeResult = new RecipeResult();
            recipeResult.recipes = recipes;

            this.recipeService.recipeResult.set(recipeResult);
        }
    }
}
