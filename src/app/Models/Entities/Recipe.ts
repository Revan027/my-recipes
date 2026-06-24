import { Type } from "./Type";

export class Recipe {
  constructor() {}

  id: number = 0;
  typeID!: number;
  type: Type = new Type();
  picture!: string;
  title!: string;
}
