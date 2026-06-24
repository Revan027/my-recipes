import { Routes } from '@angular/router';

import { Search } from './pages/search/search';

export const routes: Routes = [
  { path: 'search', component: Search },
  {
    path: 'recipes',
    loadChildren: () => import('./pages/recipes/recipes.routes').then((m) => m.routes)
  }
];
