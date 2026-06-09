import {Routes} from '@angular/router';
import {MainLayoutComponent} from '@layouts/main-layout/main-layout.component';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full',
    },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        loadChildren: () => import('./views/views.route').then((mod) => mod.VIEWS_ROUTES)
    },
    {
        path: '',
        loadChildren: () => import('./views/auth/auth.route').then((mod) => mod.AUTH_ROUTES)
    },
];
