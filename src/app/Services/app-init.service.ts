import { Injectable, signal } from '@angular/core';
import { StorageService } from '@common/storage/storage-service';
import { Capacitor } from '@capacitor/core';
import { RecipeService } from './recipe.service';
import { Recipe } from '../Models/Entities/Recipe';
import { RecipeResult } from '../Models/RecipeResult';
import { MOCK_RECIPES, MOCK_TYPES } from '../constants/mock-recipes';
import { RecipeListService } from './recipe-list.service';
import { App } from '@capacitor/app';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AppInitService {
    isAppReady = signal<boolean>(false);
    isNativePlateform = signal<boolean>(false);
    appVersion = signal<string>("");

    constructor(
        private storageService: StorageService,
        private recipeService: RecipeService,
        private recipeListService: RecipeListService,
        private location: Location,
        private router: Router
    ) {}

    async init(): Promise<void> {
        this.isNativePlateform.set(Capacitor.isNativePlatform());

        if (Capacitor.isNativePlatform()) {
            await this.storageService.initPlugin();

            await this.loadAppVersion();
        }

        this.intBackListener();   

        await this.loadDatas(Capacitor.isNativePlatform());

        this.isAppReady.set(true);
    }

    intBackListener(){
        App.addListener('backButton', (event: any) => {
            const regex = /recipes\/(\d)*\/edit/;

            if (event.canGoBack) {
                if(regex.test(this.location.path())){
                    this.router.navigate([this.location.path().replace("/edit", "")]);
                }else{
                    this.location.back();
                }
            } else {
                App.exitApp();
            }
        });
    }

    async loadAppVersion(){
        const info = await App.getInfo();
        this.appVersion.set(info.version);
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
