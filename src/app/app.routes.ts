import { Routes } from '@angular/router';
import { RecipesList } from './pages/recipes/recipes-list/recipes-list';
import { Loading } from './pages/loading/loading';

export const routes: Routes = [
    { path: '', component: RecipesList }, // route par default
    { path: 'loading', component: Loading },
    {
        path: 'recipes',
        loadChildren: () => import('./pages/recipes/recipes.routes').then((m) => m.routes),
    },
];
