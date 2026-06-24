import { Routes } from '@angular/router';
import { Recipes } from './recipes/recipes';
import { EditRecipe } from './edit-recipe/edit-recipe';
import { Recipe } from './recipe/recipe';

export const routes: Routes = [
  { path: '', component: Recipes },
  { path: 'create', component: EditRecipe },
  { path: ':id', component: Recipe },
  { path: ':id/edit', component: EditRecipe }
];
