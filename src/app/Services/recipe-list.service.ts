import { Injectable, signal } from '@angular/core';
import { RecipeService } from './recipe.service';
import { RecipeResult } from '../Models/RecipeResult';
import { Capacitor } from '@capacitor/core';
import { MOCK_RECIPES } from '../constants/mock-recipes';

@Injectable({
    providedIn: 'root',
})
export class RecipeListService {
    private _currentBookPage = signal<number>(1);
    private _isLoading = signal<boolean>(false);
    private _hasMore = signal<boolean>(true);

    currentBookPage = this._currentBookPage.asReadonly();
    isLoading = this._isLoading.asReadonly();
    hasMore = this._hasMore.asReadonly();

    constructor(private recipeService: RecipeService) {}

    loadSearch(searchText: string) {
        if (searchText != '' && searchText.length < 3) return;

       this.reloadPage(searchText);
    }

    async reloadPage(searchText: string = ""){
        this._hasMore.set(true);

        let recipeSearch = this.recipeService.recipeSearch();
        recipeSearch.searchText = searchText;
        recipeSearch.page = 0; 

        this.recipeService.loadRecipeSearch(recipeSearch);
        this.recipeService.loadRecipeResult(new RecipeResult());
    }

    async refreshResult(){ 
        this._isLoading.set(true);

        let recipeResult = this.recipeService.recipeResult();
        let recipeSearch = this.recipeService.recipeSearch();
        recipeSearch.page = 1; 

        this.recipeService.loadRecipeSearch(recipeSearch);

        const recipes = await this.recipeService.fetchPage(this.recipeService.recipeResult().countTotal);
        recipeResult.recipes = recipes;

        this.recipeService.loadRecipeResult(recipeResult);

        this._isLoading.set(false);
    }

    async loadNextPage(): Promise<void> {
        if (!this.hasMore()) {
            return;
        }

        this._isLoading.set(true);

        const recipeResult = this.recipeService.recipeResult();

        if (Capacitor.isNativePlatform()) {
            let recipeSearch = this.recipeService.recipeSearch();
            recipeSearch.page++;

            this.recipeService.loadRecipeSearch(recipeSearch);

            const recipes = await this.recipeService.fetchPage();
           
            if (recipes.length == 0) {
                this._hasMore.set(false);
            }

            if (recipeSearch.page > 1) {
                recipeResult.recipes = recipeResult.recipes.concat(recipes);
            } 
            else {
                recipeResult.recipes = recipes;

                // premiere page on va chercher le total de resultat de la requete
                recipeResult.countTotal = await this.recipeService.countQueryResult();
            }
        }else{
            recipeResult.recipes = MOCK_RECIPES;
        }

        this.recipeService.loadRecipeResult(recipeResult);
        this._isLoading.set(false);
    }

    getPictureClass(): { key: number; class: string }[] {
        const recipesPictureEmpty = this.recipeService
            .recipeResult()
            .recipes.filter((item) => !item.picture);
        let count = 1;
        let pictureClass: { key: number; class: string }[] = [];

        recipesPictureEmpty.forEach((item, index) => {
            if (count > 6) {
                count = 1;
            }

            pictureClass.push({ key: item.id, class: `placeholder-${count}` });
            count++;
        });

        return pictureClass;
    }

    findPictureClass(pictureClass: { key: number; class: string }[], id: number) {
        return pictureClass.find((item) => item.key == id)?.class ?? '';
    }
}
