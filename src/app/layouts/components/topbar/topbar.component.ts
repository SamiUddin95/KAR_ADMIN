import {Component, OnInit, inject} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {NgIcon} from '@ng-icons/core';
import {LayoutStoreService} from '@core/services/layout-store.service';
import {LucideAngularModule, Search} from 'lucide-angular';
import {ThemeTogglerComponent} from '@layouts/components/topbar/components/theme-toggler/theme-toggler.component';
import {UserProfileComponent} from '@layouts/components/topbar/components/user-profile/user-profile.component';
import Swal from 'sweetalert2';
 

@Component({
    selector: 'app-topbar',
    imports: [
        NgIcon,
        RouterLink,
        LucideAngularModule,
        ThemeTogglerComponent,
        UserProfileComponent,
    ],
    templateUrl: './topbar.component.html'
})
export class TopbarComponent implements OnInit {
    userFullName: string = '';
    private router = inject(Router);

    constructor(public layout: LayoutStoreService) {
    }

    ngOnInit() {
        this.loadUserData();
    }

    loadUserData() {
        const userData = sessionStorage.getItem('user_data');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                this.userFullName = user.fullName || 'User';
            } catch (error) {
                this.userFullName = 'User';
            }
        }
    }

    toggleSidebar() {

        const html = document.documentElement;
        const currentSize = html.getAttribute('data-sidenav-size');
        const savedSize = this.layout.sidenavSize;

        if (currentSize === 'offcanvas') {
            html.classList.toggle('sidebar-enable')
            this.layout.showBackdrop()
        } else if (savedSize === 'compact') {
            this.layout.setSidenavSize(currentSize === 'compact' ? 'condensed' : 'compact', false);
        } else {
            this.layout.setSidenavSize(currentSize === 'condensed' ? 'default' : 'condensed');
        }
    }

    logout() {
        Swal.fire({
            title: 'Logout',
            text: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            background: '#1a1a1a',
            color: '#ffffff',
            confirmButtonColor: '#FFD700',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, Logout',
            cancelButtonText: 'Cancel',
            customClass: {
                popup: 'swal-dark-theme',
                confirmButton: 'swal-gold-button',
                cancelButton: 'swal-cancel-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear();
                localStorage.clear();
                this.router.navigate(['/auth-2/sign-in']);
            }
        });
    }

    Search = Search;
}
