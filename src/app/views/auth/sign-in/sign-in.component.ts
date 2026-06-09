import { credits, currentYear } from '@/app/constants';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import Swal from 'sweetalert2';
import { AuthService } from '@core/services/auth.service';

@Component({
    selector: 'app-sign-in',
    host: { 'data-component-id': 'auth2-sign-in' },
    imports: [RouterLink,NgIcon],
    templateUrl: './sign-in.component.html',
    styles: ``,
})
export class SignInComponent {
    currentYear = currentYear
    credits = credits

    private authService = inject(AuthService);
    private router = inject(Router);

    signIn(email: string, password: string){
        if (!email || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: 'Please enter email and password.'
            });
            return;
        }

        this.authService.login({ email, password }).subscribe({
            next: (response) => {
                if (response.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Successfully logged in',
                        text: `Welcome, ${response.data.fullName}!`,
                        showConfirmButton: false,
                        timer: 1400
                    }).then(() => this.router.navigate(['/dashboard']));
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login failed',
                        text: response.errorMessage || 'Invalid email or password.'
                    });
                }
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Login failed',
                    text: error.error?.errorMessage || 'An error occurred. Please try again.'
                });
            }
        });
    }
}
