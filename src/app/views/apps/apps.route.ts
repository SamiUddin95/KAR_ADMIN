import {Routes} from '@angular/router';  
import {UserListComponent} from './pages/user-list/user-list.component';
import {CaseListComponent} from './pages/caseinfo/case-list/case-list.component';
import {CaseDetailComponent} from './pages/caseinfo/case-detail/case-detail.component';

export const APPS_ROUTES: Routes = [
    
    {
        path: 'apps/users/users',
        component: UserListComponent,
        data: {title: "User List"},
    },
    {
        path: 'apps/caseinfo/case-list',
        component: CaseListComponent,
        data: {title: "Case List"},
    },
    {
        path: 'apps/caseinfo/case-detail/:id',
        component: CaseDetailComponent,
        data: {title: "Case Detail"},
    },
]
