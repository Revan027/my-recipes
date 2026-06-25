import { Injectable, signal } from '@angular/core';
import { tableName } from '../constants/table-names';
import { StorageService } from './storage.services.common/storage-service';
import { Recipe } from '../Models/Entities/Recipe';
import { RecipeResult } from '../Models/RecipeResult';
import { MOCK_RECIPES } from '../constants/mock-recipes';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {    
    recipeResult = signal<RecipeResult>(new RecipeResult());

    constructor(private storageService: StorageService) {}

    async getAll(): Promise<Recipe[]>{
        let result = await this.storageService.getDb().query(`
            SELECT id, typeID, picture, title, typeName as type.name
            FROM ${tableName.recipe} INNER JOIN ${tableName.type} AS type ON ${tableName.type}.id = typeID`);

        return result.values as Recipe[];
    }

    getPictureClass(): { key: number; class: string }[]{
        const recipesPictureEmpty = this.recipeResult().recipes.filter((item) => item.picture === undefined);
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

    async loadRecipeResult(isNativePlateform: boolean): Promise<RecipeResult>
    {
        let recipes: Recipe[]  = [];

        if(isNativePlateform){
            recipes = await this.getAll();
        }
        else{
            recipes = MOCK_RECIPES
        }

        const recipeResult = new RecipeResult();
        recipeResult.recipes = recipes;

        this.recipeResult.set(recipeResult);

        return recipeResult;
    }
}
