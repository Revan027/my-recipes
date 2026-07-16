import { Recipe } from './Entities/Recipe';

export class RecipeResult {
    constructor() {}

    recipes: Recipe[] = [];
    countTotal: number = 0;
}
