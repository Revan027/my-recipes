import { Ingredient } from "./Ingredient";
import { Step } from "./Step";
import { Type } from "./Type";

export class Recipe {
  constructor() {}

  id: number = 0;
  typeID!: number;
  picture?: string;
  title!: string;
  type: Type = new Type();
  steps: Step[] = [];
  ingredients: Ingredient[] = [];

  static fromSQL(data: any): Recipe {
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
}
