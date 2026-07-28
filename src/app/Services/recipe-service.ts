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

    async create(recipe: Recipe): Promise<boolean> {
        let isSuccess = true;

        try {
            await this.storageService.getDb().beginTransaction();

            let sql = `
                INSERT INTO ${tableName.recipe} (title, picture, typeID) 
                VALUES (?, ?, ?)`;

            let result = await this.storageService.getDb().run(sql, [recipe.title, recipe.picture, recipe.typeID], false);

            // on créee les ingrédients
           await this.createIngredients(result.changes?.lastId ?? 0, recipe);

            // on créée les étapes
            await this.createSteps(result.changes?.lastId ?? 0, recipe);

            // tout est validé d'un coup
            await this.storageService.getDb().commitTransaction(); 
        } catch (err) {
            isSuccess = false;

            if ((await this.storageService.getDb()?.isTransactionActive()).result) {
                await this.storageService.getDb()?.rollbackTransaction();   // tout est annulé si une erreur survient
            }

            return isSuccess;
        }

        return isSuccess;
    }

    private async createIngredients(lastId: number, recipe: Recipe): Promise<void>{
        for (const ingredient of recipe.ingredients) {
            const sql = `
                INSERT INTO ${tableName.ingredient} (name, recipeID) 
                VALUES (?, ?)`;

            await this.storageService.getDb().run(sql, [ingredient.name, lastId], false);
        }
    }

    private async createSteps(lastId: number, recipe: Recipe): Promise<void>{
        for (const step of recipe.steps) {
            const sql = `
                INSERT INTO ${tableName.step} (title, content, position, recipeID) 
                VALUES (?, ?, ?, ?)`;

            await this.storageService.getDb().run(sql, [step.title, step.content, step.position, lastId], false);
        }
    }

    async update(recipe: Recipe): Promise<boolean> {
         let isSuccess = true;

        try {
            await this.storageService.getDb().beginTransaction();

            let sql = `
                UPDATE ${tableName.recipe}
                SET title = ?, picture = ?, typeID = ?
                WHERE id = ?`;

            await this.storageService.getDb().run(sql, [recipe.title, recipe.picture, recipe.typeID, recipe.id], false);

            await this.deleteIngredients(recipe);

            await this.deleteSteps(recipe)

            await this.createIngredients(recipe.id, recipe);

            await this.createSteps(recipe.id, recipe);

            // tout est validé d'un coup
            await this.storageService.getDb().commitTransaction(); 
        } catch (err) {
            isSuccess = false;

            if ((await this.storageService.getDb()?.isTransactionActive()).result) {
                await this.storageService.getDb()?.rollbackTransaction();   // tout est annulé si une erreur survient
            }

            return isSuccess;
        }

        return isSuccess;
    }

    private async deleteIngredients(recipe: Recipe): Promise<void>{
       const sql = `
                DELETE FROM ${tableName.ingredient}
                WHERE recipeID = ?`;

            await this.storageService.getDb().run(sql, [recipe.id], false);
    }

    private async deleteSteps(recipe: Recipe): Promise<void>{
        const sql = `
                DELETE FROM ${tableName.step}
                WHERE recipeID = ?`;

            await this.storageService.getDb().run(sql, [recipe.id], false);
    }


    async getTypes(): Promise<Type[]> {
        const result = await this.storageService.getDb().query(`
            SELECT 
                type.id as id, type.name as name
            FROM ${tableName.type} as type`);
            
        return result.values != undefined ? (result.values as Type[]) : [];
    }

    async fetchPage(): Promise<Recipe[]> {
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

    private getQuerySearch() {
        const searchText = this.recipeSearch().searchText ?? '';

        return `WHERE ${searchText.length > 0 ? 'FALSE' : 'TRUE'} OR lower(recipe.title) LIKE '%${searchText.toLowerCase()}%'`;
    }

    async countQueryResult(): Promise<number> {
        let result = await this.storageService.getDb().query(`
            SELECT COUNT(*) as countTotal
            FROM ${tableName.recipe}
            ${this.getQuerySearch()}`);

        return result.values != undefined ? (result.values[0].countTotal as number) : 0;
    }

    getSrcPicture(recipe: Recipe){
        const picture = recipe.picture;

        if (!picture) {
            return '';
        }

        // chemin d'asset ou URL (mocks) → on retourne tel quel
        if (picture.startsWith('assets/') || picture.startsWith('http') || picture.startsWith('data:')) {
            return picture;
        }

        // sinon c'est du base64 (photo prise par l'utilisateur)
        return `data:image/jpeg;base64,${picture}`;
    }
}
