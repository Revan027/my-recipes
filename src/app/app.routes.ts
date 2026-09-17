import { Routes } from '@angular/router';
import { LoadingPage } from './pages/loading/loading.page';
import { InitAppGuard } from './guards/init-app.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'loading', pathMatch: 'full' }, // route par default
    { 
        path: 'loading', 
        component: LoadingPage,
        canActivate: [InitAppGuard],
    },
    {
        path: 'recipes',
        loadChildren: () => import('./pages/recipes/recipes.routes').then((m) => m.routes),
    },
];
