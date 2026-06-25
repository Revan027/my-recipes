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
}
