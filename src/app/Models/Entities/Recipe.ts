import { Ingredient } from './Ingredient';
import { Step } from './Step';
import { Type } from './Type';

export class Recipe {
    constructor() {}

    id: number = 0;
    typeID!: number;
    picture?: string;
    title!: string;
    type: Type = new Type();
    steps: Step[] = [];
    ingredients: Ingredient[] = [];

    static createRecipe(data: any): Recipe {
        const recipe = new Recipe();
        recipe.id = data.id;
        recipe.typeID = data.typeID;
        recipe.picture = data.picture;
        recipe.title = data.title;
        recipe.type = { id: data.typeID, name: data.typeName };
        recipe.steps = [];
        recipe.ingredients = [];

        return recipe;
    }

    static setSteps(datas: any[], recipes: Recipe[]): void {
        datas.map((data) => {
            let recipe = recipes.find((recipe) => recipe.id == data.recipeID);
            let step = new Step();
            step.id = data.stepID;
            step.content = data.stepContent;
            step.position = data.stepPosition;
            step.title = data.stepTitle;

            recipe?.steps.push(step);
        });
    }

    static setIngredients(datas: any[], recipes: Recipe[]): void {
        datas.map((data) => {
            let recipe = recipes.find((recipe) => recipe.id == data.recipeID);
            let ingredient = new Ingredient();
            ingredient.id = data.ingredientID;
            ingredient.name = data.ingredientName;

            recipe?.ingredients.push(ingredient);
        });
    }
}
