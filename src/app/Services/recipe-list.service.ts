import { Injectable, signal } from '@angular/core';
import { RecipeService } from './recipe-service';

@Injectable({
    providedIn: 'root',
})
export class RecipeListService {    
    currentBookPage = signal<number>(1);
    isLoaded = signal<boolean>(true);
    isFinished = signal<boolean>(false);

    constructor(private recipeService: RecipeService) {}   
    
    async loadNextPage(): Promise<void>{
        if(this.isFinished()){
            return;
        }

        this.isLoaded.set(false);
        
        let recipeSearch = this.recipeService.recipeSearch();
        recipeSearch.page++; 

        this.recipeService.recipeSearch.set(recipeSearch);
    
        const recipes = await this.recipeService.fetchPage();

        if(recipes.length == 0){
            this.isLoaded.set(true); 
            this.isFinished.set(true); 
            return;
        }

        const recipeResult = this.recipeService.recipeResult();
        recipeResult.recipes = recipeResult.recipes.concat(recipes);

        this.recipeService.recipeResult.set(recipeResult);
        this.isLoaded.set(true); 
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
