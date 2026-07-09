import { Injectable, signal } from '@angular/core';
import { RecipeService } from './recipe-service';

@Injectable({
    providedIn: 'root',
})
export class RecipeListService {    
    currentBookPage = signal<number>(1);
    isLoading = signal<boolean>(false);
    hasMore = signal<boolean>(true);

    constructor(private recipeService: RecipeService) {}   

    loadSearch(searchText: string){
        if(searchText != "" && searchText.length < 3)
            return;

        this.hasMore.set(true); 

        let recipeSearch = this.recipeService.recipeSearch();
        recipeSearch.searchText = searchText;
        recipeSearch.page = 0;

        this.recipeService.recipeSearch.set(recipeSearch);
    }

    async loadNextPage(): Promise<void>{
        if(!this.hasMore()){
            return;
        }

        this.isLoading.set(true);
        
        let recipeSearch = this.recipeService.recipeSearch();
        recipeSearch.page++; 

        this.recipeService.recipeSearch.set(recipeSearch);
    
        const recipes = await this.recipeService.fetchPage();
        const recipeResult = this.recipeService.recipeResult();

        if(recipes.length == 0){
            this.hasMore.set(false); 
        }

        if(recipeSearch.page > 1){
            recipeResult.recipes = recipeResult.recipes.concat(recipes);
        }
        else{
            recipeResult.recipes = recipes;

            // premiere page on va chercher le total de resultat de la requete
            recipeResult.countTotal = await this.recipeService.countQueryResult();
        }

        this.recipeService.recipeResult.set(recipeResult);
        this.isLoading.set(false); 
    }

    getPictureClass(): { key: number; class: string }[]{
        const recipesPictureEmpty = this.recipeService.recipeResult().recipes.filter((item) => !item.picture);
        let count = 1;
        let pictureClass: { key: number; class: string }[] = [];

        recipesPictureEmpty.forEach((item, index) => {
            if(count > 6){
                count = 1;
            }
        
            pictureClass.push({key: item.id, class: `placeholder-${count}`});
            count++;
        });

        return pictureClass;
    }

    findPictureClass(pictureClass: { key: number; class: string }[], id: number){
        return pictureClass.find((item) => item.key == id)?.class ?? "";
    }
}
