import { Routes } from '@angular/router';

import { Search } from './pages/search/search';
import { Recipes } from './pages/recipes/recipes/recipes';

export const routes: Routes = [
  { path: '', component: Recipes }, // route par default
  { path: 'search', component: Search },
  {
    path: 'recipes',
    loadChildren: () => import('./pages/recipes/recipes.routes').then((m) => m.routes)
  }
];
