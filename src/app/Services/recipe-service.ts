import { Injectable, signal } from '@angular/core';
import { tableName } from '../constants/table-names';
import { StorageService } from './storage.services.common/storage-service';
import { Recipe } from '../Models/Entities/Recipe';
import { RecipeResult } from '../Models/RecipeResult';
import { MOCK_RECIPES } from '../constants/mock-recipes';
import { RecipeSearch } from '../Models/RecipeSearch';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {    
    recipeResult = signal<RecipeResult>(new RecipeResult());
    recipeSearch = signal<RecipeSearch>(new RecipeSearch());

    readonly take: number = 4;

    constructor(private storageService: StorageService) {}     

    async fetchPage(): Promise<Recipe[]>{
        const searchText = this.recipeSearch().searchText ?? "";

        let result = await this.storageService.getDb().query(`
            SELECT recipe.id, recipe.typeID, recipe.picture, recipe.title, type.name as typeName 
            FROM ${tableName.recipe} as recipe INNER JOIN ${tableName.type} AS type ON ${tableName.type}.id = typeID
            WHERE ${searchText.length > 0 ? 'FALSE' : 'TRUE'} OR lower(recipe.title) LIKE '%${searchText.toLowerCase()}%'
            LIMIT ${this.take} OFFSET ${(this.recipeSearch().page - 1) * this.take}`);

        const recipes = result.values as Recipe[]   

        return recipes.map((item) => Recipe.fromSQL(item));
    }

    async countAllRecipe(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) FROM ${tableName.recipe}`);

        return result.values != undefined ? result.values[0] as number : 0;                 
    }

    async loadRecipeResult(isNativePlateform: boolean): Promise<RecipeResult>
    {
        let recipes: Recipe[]  = [];

        if(isNativePlateform){
            recipes = await this.fetchPage();
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
