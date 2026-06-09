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
    styles: [`
        .auth-box {
            min-height: 100vh;
            background: #1a1f1a;
            padding: 2rem 1rem;
        }
        .auth-card {
            max-width: 400px;
            margin: 0 auto;
        }
        .auth-logo {
            width: 140px;
            height: auto;
            margin-bottom: 1rem;
        }
        .auth-title {
            color: #ffffff;
            font-size: 1.75rem;
            font-weight: 600;
            margin-bottom: 2rem;
        }
        .auth-input-group {
            position: relative;
            margin-bottom: 1rem;
        }
        .input-icon {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            pointer-events: none;
        }
        .input-icon-end {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            cursor: pointer;
        }
        .icon-gold {
            color: #FFD700;
            font-size: 1.25rem;
        }
        .auth-input {
            background-color: #2a2f2a;
            border: 1px solid #3a3f3a;
            border-radius: 12px;
            color: #ffffff;
            padding: 0.875rem 1rem 0.875rem 3rem;
            font-size: 0.95rem;
            height: 52px;
        }
        .auth-input::placeholder {
            color: #6c757d;
        }
        .auth-input:focus {
            background-color: #2a2f2a;
            border-color: #FFD700;
            box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
            color: #ffffff;
        }
        .forgot-link {
            color: #FFD700;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .forgot-link:hover {
            color: #FFE44D;
        }
        .btn-gold {
            background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%);
            border: none;
            border-radius: 25px;
            color: #000000;
            font-weight: 600;
            font-size: 1rem;
            padding: 0.875rem 2rem;
            height: 52px;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
            transition: all 0.3s ease;
        }
        .btn-gold:hover {
            background: linear-gradient(135deg, #FFE44D 0%, #FFD700 100%);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.4);
            color: #000000;
        }
        .social-login {
            margin: 2rem 0;
        }
        .btn-social {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background-color: transparent;
            border: 2px solid #3a3f3a;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        .btn-social:hover {
            border-color: #FFD700;
            background-color: rgba(255, 215, 0, 0.1);
        }
        .signup-text {
            color: #6c757d;
            font-size: 0.9rem;
        }
        .signup-link {
            color: #FFD700;
            text-decoration: none;
            font-weight: 600;
            margin-left: 0.25rem;
        }
        .signup-link:hover {
            color: #FFE44D;
            text-decoration: underline;
        }
        @media (max-width: 576px) {
            .auth-logo {
                width: 120px;
            }
            .auth-title {
                font-size: 1.5rem;
            }
        }
        
        /* SweetAlert Dark Theme */
        :host ::ng-deep .swal-dark-theme {
            border: 1px solid rgba(255, 215, 0, 0.2) !important;
            box-shadow: 0 10px 40px rgba(255, 215, 0, 0.1) !important;
        }
        :host ::ng-deep .swal-gold-button {
            background: linear-gradient(135deg, #FFD700 0%, #FFC107 100%) !important;
            color: #000000 !important;
            font-weight: 600 !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 0.5rem 2rem !important;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3) !important;
        }
        :host ::ng-deep .swal-gold-button:hover {
            background: linear-gradient(135deg, #FFE44D 0%, #FFD700 100%) !important;
            transform: translateY(-2px);
        }
    `],
})
export class SignInComponent {
    currentYear = currentYear
    credits = credits
    showPassword = false;

    private authService = inject(AuthService);
    private router = inject(Router);

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    signIn(email: string, password: string){
        if (!email || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: 'Please enter email and password.',
                background: '#1a1a1a',
                color: '#ffffff',
                confirmButtonColor: '#FFD700',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'swal-dark-theme',
                    confirmButton: 'swal-gold-button'
                }
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
                        timer: 1400,
                        background: '#1a1a1a',
                        color: '#ffffff',
                        customClass: {
                            popup: 'swal-dark-theme'
                        }
                    }).then(() => this.router.navigate(['/dashboard']));
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login failed',
                        text: response.errorMessage || 'Invalid email or password.',
                        background: '#1a1a1a',
                        color: '#ffffff',
                        confirmButtonColor: '#FFD700',
                        confirmButtonText: 'Try Again',
                        customClass: {
                            popup: 'swal-dark-theme',
                            confirmButton: 'swal-gold-button'
                        }
                    });
                }
            },
            error: (error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Login failed',
                    text: error.error?.errorMessage || 'An error occurred. Please try again.',
                    background: '#1a1a1a',
                    color: '#ffffff',
                    confirmButtonColor: '#FFD700',
                    confirmButtonText: 'Try Again',
                    customClass: {
                        popup: 'swal-dark-theme',
                        confirmButton: 'swal-gold-button'
                    }
                });
            }
        });
    }
}
