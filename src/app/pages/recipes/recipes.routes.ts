import { Routes } from '@angular/router';
import { RecipesList } from './recipes-list/recipes-list';
import { EditRecipe } from './edit-recipe/edit-recipe';
import { RecipeBook } from './recipe-book/recipe-book';

export const routes: Routes = [
    { path: '', component: RecipesList },
    { path: 'create', component: EditRecipe },
    { path: ':id', component: RecipeBook },
    { path: ':id/edit', component: EditRecipe },
];
