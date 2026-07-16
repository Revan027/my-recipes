import { Injectable, signal } from '@angular/core';
import { tableName } from '../constants/table-names';
import { StorageService } from './storage.services.common/storage-service';
import { Recipe } from '../Models/Entities/Recipe';
import { RecipeResult } from '../Models/RecipeResult';
import { RecipeSearch } from '../Models/RecipeSearch';
import { Type } from '../Models/Entities/Type';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {    
    recipeResult = signal<RecipeResult>(new RecipeResult());
    recipeSearch = signal<RecipeSearch>(new RecipeSearch());
    recipeTypes = signal<Type[]>([]);

    readonly take: number = 4;

    constructor(private storageService: StorageService) {}     

    async fetchPage(): Promise<Recipe[]>{
        let recipesResult = await this.storageService.getDb().query(`
            SELECT 
                recipe.id, recipe.typeID, recipe.picture, recipe.title,
                type.name as typeName
            FROM ${tableName.recipe} as recipe 
            INNER JOIN ${tableName.type} AS type ON ${tableName.type}.id = typeID
            ${this.getQuerySearch()}
            LIMIT ${this.take} OFFSET ${(this.recipeSearch().page - 1) * this.take}`);

        //todo en promise all
        let recipes = recipesResult.values?.map((item) => Recipe.createRecipe(item));

        const recipeIDs = recipes?.map((item) => item.id);

        // on récupère les étapes de chaque recette
        let stepsResult = await this.storageService.getDb().query(`
            SELECT
                step.id as stepID, step.content as stepContent, step.position as stepPosition, step.title as stepTitle, step.recipeID
            FROM ${tableName.step} as step
            WHERE step.recipeID IN (${recipeIDs})`);

        let ingredientsResult = await this.storageService.getDb().query(`
            SELECT
                ingredient.id as ingredientID, ingredient.name as ingredientName, ingredient.recipeID
            FROM ${tableName.ingredient} as ingredient
            WHERE ingredient.recipeID IN (${recipeIDs})`);
        
        Recipe.setSteps(stepsResult.values ?? [], recipes ?? []);
        Recipe.setIngredients(ingredientsResult.values ?? [], recipes ?? []);

        ///alert(JSON.stringify(recipes, null, 2));
        return recipes ?? [];
    }

    private getQuerySearch(){
        const searchText = this.recipeSearch().searchText ?? "";

        return `WHERE ${searchText.length > 0 ? 'FALSE' : 'TRUE'} OR lower(recipe.title) LIKE '%${searchText.toLowerCase()}%'`
    }

    async countQueryResult(): Promise<number>{
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as countTotal
            FROM ${tableName.recipe}
            ${this.getQuerySearch()}`);

        return result.values != undefined ? result.values[0].countTotal as number : 0;                 
    }
}
